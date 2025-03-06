import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { useRecipeStore } from '../stores/recipeStore';
import { useSettingsStore } from '../stores/settingsStore';
import { Mic, Loader as Loader2 } from 'lucide-react';
import { getHuggingFaceResponse } from '../services/huggingface';
import { getOpenAIResponse } from '../services/openai';
import { isAIError, DebugInfo } from '../services/types';
import { useSpeech } from '../hooks/useSpeech';
import { RecipePreview } from '../components/RecipePreview';
import { DebugPanel } from '../components/DebugPanel';
import { Answer } from '../components/Answer';

export default function CookScreen() {
  const { recipes } = useRecipeStore();
  const { modelType, openaiKey, huggingfaceKey } = useSettingsStore();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isRecipeExpanded, setIsRecipeExpanded] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isDebugExpanded, setIsDebugExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { speak, stop } = useSpeech();

  useEffect(() => {
    if (Platform.OS === 'web') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = async (event: SpeechRecognitionEvent) => {
          const last = event.results.length - 1;
          const text = event.results[last][0].transcript;
          setTranscript(text);
          setIsListening(false);
          
          if (recipes.length > 0) {
            await getAnswer(text);
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          setError('Failed to recognize speech. Please try again.');
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognition);
      } else {
        setError('Speech recognition is not supported in this browser.');
      }
    }
  }, [recipes]);

  const getAnswer = async (question: string) => {
    if (recipes.length === 0) {
      setError('Please add a recipe first in the Recipes tab.');
      return;
    }

    setIsLoading(true);
    setError('');
    setDebugInfo(null);
    stop();

    try {
      const result = modelType === 'huggingface'
        ? await getHuggingFaceResponse(recipes[0].content, question, huggingfaceKey)
        : await getOpenAIResponse(recipes[0].content, question, openaiKey);

      if (isAIError(result)) {
        setError(result.message);
        if (result.debug) setDebugInfo(result.debug);
      } else {
        setAnswer(result.answer);
        if (result.debug) setDebugInfo(result.debug);
        speak(result.answer);
        setIsSpeaking(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (!recognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    if (recipes.length === 0) {
      setError('Please add a recipe first in the Recipes tab.');
      return;
    }

    if (modelType === 'huggingface' && !huggingfaceKey) {
      setError('Please set your Hugging Face API token in the Settings tab.');
      return;
    }

    if (modelType === 'openai' && !openaiKey) {
      setError('Please set your OpenAI API key in the Settings tab.');
      return;
    }

    setError('');
    if (!isListening) {
      recognition.start();
      setIsListening(true);
      setAnswer('');
      setDebugInfo(null);
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      stop();
      setIsSpeaking(false);
    } else {
      speak(answer);
      setIsSpeaking(true);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.micContainer}>
          <TouchableOpacity
            style={[styles.micButton, isListening && styles.micButtonActive]}
            onPress={toggleListening}
          >
            <Mic size={32} color={isListening ? '#ffffff' : '#007AFF'} />
          </TouchableOpacity>
          <Text style={styles.micText}>
            {isListening ? 'Listening...' : 'Tap to Ask'}
          </Text>
        </View>

        {recipes.length > 0 && (
          <RecipePreview
            content={recipes[0].content}
            isExpanded={isRecipeExpanded}
            onToggle={() => setIsRecipeExpanded(!isRecipeExpanded)}
          />
        )}

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {transcript ? (
          <View style={styles.transcriptContainer}>
            <Text style={styles.transcriptLabel}>Your Question:</Text>
            <Text style={styles.transcriptText}>{transcript}</Text>
          </View>
        ) : null}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Loader2 size={24} color="#007AFF" />
            <Text style={styles.loadingText}>Getting answer...</Text>
          </View>
        ) : null}

        {answer && (
          <Answer
            text={answer}
            isSpeaking={isSpeaking}
            onToggleSpeech={toggleSpeech}
          />
        )}

        {debugInfo && (
          <DebugPanel
            info={debugInfo}
            isExpanded={isDebugExpanded}
            onToggle={() => setIsDebugExpanded(!isDebugExpanded)}
          />
        )}
      </ScrollView>
    </View>
  );
}

interface Styles {
  container: ViewStyle;
  content: ViewStyle;
  micContainer: ViewStyle;
  micButton: ViewStyle;
  micButtonActive: ViewStyle;
  micText: TextStyle;
  errorContainer: ViewStyle;
  errorText: TextStyle;
  transcriptContainer: ViewStyle;
  transcriptLabel: TextStyle;
  transcriptText: TextStyle;
  loadingContainer: ViewStyle;
  loadingText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  micContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  micButtonActive: {
    backgroundColor: '#007AFF',
  },
  micText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  transcriptContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  transcriptLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8E8E93',
    marginBottom: 8,
  },
  transcriptText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
  },
});