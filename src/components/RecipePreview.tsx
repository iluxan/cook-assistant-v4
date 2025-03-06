import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface RecipePreviewProps {
  content: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export function RecipePreview({ content, isExpanded, onToggle }: RecipePreviewProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onToggle}>
      <View style={styles.header}>
        <Text style={styles.title}>Current Recipe:</Text>
        {isExpanded ? (
          <ChevronUp size={20} color="#666666" />
        ) : (
          <ChevronDown size={20} color="#666666" />
        )}
      </View>
      <Text style={styles.text} numberOfLines={isExpanded ? undefined : 2}>
        {content}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
  },
  text: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
});