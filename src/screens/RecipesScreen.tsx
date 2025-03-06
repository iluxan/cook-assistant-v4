import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRecipeStore } from '../stores/recipeStore';
import { Book } from 'lucide-react';

export default function RecipesScreen() {
  const { recipes, addRecipe, removeRecipe } = useRecipeStore();
  const [recipeText, setRecipeText] = useState('');

  const handleAddRecipe = () => {
    if (recipeText.trim()) {
      addRecipe(recipeText);
      setRecipeText('');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Add New Recipe</Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Paste your recipe here..."
            value={recipeText}
            onChangeText={setRecipeText}
            textAlignVertical="top"
          />
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddRecipe}
          >
            <Text style={styles.buttonText}>Add Recipe</Text>
          </TouchableOpacity>
        </View>

        {recipes.length > 0 && (
          <View style={styles.recipesContainer}>
            <Text style={styles.recipesTitle}>Your Recipes</Text>
            {recipes.map((recipe) => (
              <View key={recipe.id} style={styles.recipeCard}>
                <View style={styles.recipeHeader}>
                  <Book size={20} color="#666666" />
                  <Text style={styles.recipeDate}>
                    {new Date(recipe.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.recipeContent}>{recipe.content}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeRecipe(recipe.id)}
                >
                  <Text style={styles.removeButtonText}>Remove Recipe</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
  inputContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  input: {
    height: 150,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
  },
  addButton: {
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
  recipesContainer: {
    marginBottom: 24,
  },
  recipesTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  recipeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recipeDate: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  recipeContent: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
    lineHeight: 24,
    marginBottom: 16,
  },
  removeButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#DC2626',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});