import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useSettingsStore } from '../stores/settingsStore';

export default function SettingsScreen() {
  const { modelType, openaiKey, huggingfaceKey, setModelType, setOpenAIKey, setHuggingFaceKey } = useSettingsStore();
  const [tempOpenAIKey, setTempOpenAIKey] = useState(openaiKey);
  const [tempHuggingFaceKey, setTempHuggingFaceKey] = useState(huggingfaceKey);

  const handleSave = () => {
    setOpenAIKey(tempOpenAIKey);
    setHuggingFaceKey(tempHuggingFaceKey);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Model Settings</Text>
          
          <View style={styles.modelSelector}>
            <TouchableOpacity
              style={[
                styles.modelOption,
                modelType === 'huggingface' && styles.modelOptionActive,
              ]}
              onPress={() => setModelType('huggingface')}
            >
              <Text style={[
                styles.modelOptionText,
                modelType === 'huggingface' && styles.modelOptionTextActive,
              ]}>
                Use Hugging Face
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.modelOption,
                modelType === 'openai' && styles.modelOptionActive,
              ]}
              onPress={() => setModelType('openai')}
            >
              <Text style={[
                styles.modelOptionText,
                modelType === 'openai' && styles.modelOptionTextActive,
              ]}>
                Use OpenAI
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.apiKeySection}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Hugging Face API Token</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Hugging Face API token"
                value={tempHuggingFaceKey}
                onChangeText={setTempHuggingFaceKey}
                secureTextEntry
              />
              <Text style={styles.helperText}>
                Get a free token at huggingface.co/settings/tokens
              </Text>
            </View>

            {modelType === 'openai' && (
              <View style={[styles.inputContainer, styles.marginTop]}>
                <Text style={styles.label}>OpenAI API Key</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your OpenAI API key"
                  value={tempOpenAIKey}
                  onChangeText={setTempOpenAIKey}
                  secureTextEntry
                />
              </View>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  modelSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  modelOption: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  modelOptionActive: {
    backgroundColor: '#007AFF',
  },
  modelOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#666666',
  },
  modelOptionTextActive: {
    color: '#ffffff',
  },
  apiKeySection: {
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
    paddingTop: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  marginTop: {
    marginTop: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});