import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRecipeStore } from '@/stores/recipeStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { Mic, Loader as Loader2 } from 'lucide-react-native';

export default function CookScreen() {
  const { recipes } = useRecipeStore();
  const { apiKey } = useSettingsStore();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (Platform.OS === 'web') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = async (event) => {
          const last = event.results.length - 1;
          const text = event.results[last][0].transcript;
          setTranscript(text);
          setIsListening(false);
          
          if (apiKey && recipes.length > 0) {
            await getAnswer(text);
          }
        };

        recognition.onerror = (event) => {
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
  }, [apiKey, recipes]);

  const getAnswer = async (question: string) => {
    if (!apiKey) {
      setError('Please set your OpenAI API key in the Settings tab.');
      return;
    }

    if (recipes.length === 0) {
      setError('Please add a recipe first in the Recipes tab.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a helpful cooking assistant. Here is the recipe: ${recipes[0].content}`
            },
            {
              role: 'user',
              content: question
            }
          ],
          temperature: 0.7,
          max_tokens: 150
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to get answer');
      }

      setAnswer(data.choices[0].message.content);
    } catch (err) {
      setError(err.message || 'Failed to get answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (!recognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    if (!apiKey) {
      setError('Please set your OpenAI API key in the Settings tab.');
      return;
    }

    if (recipes.length === 0) {
      setError('Please add a recipe first in the Recipes tab.');
      return;
    }

    setError('');
    if (!isListening) {
      recognition.start();
      setIsListening(true);
      setAnswer('');
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cooking Assistant</Text>
      </View>

      <View style={styles.content}>
        {recipes.length > 0 ? (
          <View style={styles.recipePreview}>
            <Text style={styles.recipeTitle}>Current Recipe:</Text>
            <Text style={styles.recipeText} numberOfLines={2}>
              {recipes[0].content}
            </Text>
          </View>
        ) : null}

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

        {answer ? (
          <View style={styles.answerContainer}>
            <Text style={styles.answerLabel}>Answer:</Text>
            <Text style={styles.answerText}>{answer}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  recipePreview: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  recipeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  recipeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
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
  answerContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  answerLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0369A1',
    marginBottom: 8,
  },
  answerText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
    lineHeight: 24,
  },
});