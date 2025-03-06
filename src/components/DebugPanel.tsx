import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { DebugInfo } from '../services/types';

interface DebugPanelProps {
  info: DebugInfo;
  isExpanded: boolean;
  onToggle: () => void;
}

export function DebugPanel({ info, isExpanded, onToggle }: DebugPanelProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={onToggle}>
        <Text style={styles.title}>Debug Info</Text>
        {isExpanded ? (
          <ChevronUp size={16} color="#666666" />
        ) : (
          <ChevronDown size={16} color="#666666" />
        )}
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.content}>
          <Text style={styles.text}>
            {JSON.stringify(info, null, 2)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F1F1F1',
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#666666',
  },
  content: {
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333333',
  },
});