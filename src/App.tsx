import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Book, ChefHat, Settings, UtensilsCrossed } from 'lucide-react';
import RecipesScreen from './screens/RecipesScreen';
import CookScreen from './screens/CookScreen';
import SettingsScreen from './screens/SettingsScreen';

function TopNav() {
  const location = useLocation();

  const tabs = [
    { path: '/', label: 'Recipes', icon: Book },
    { path: '/cook', label: 'Cook', icon: ChefHat },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <UtensilsCrossed size={28} color="#FF6B6B" />
        <Text style={styles.title}>Cooking Assistant</Text>
      </View>
      <View style={styles.nav}>
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          
          return (
            <Link 
              key={tab.path} 
              to={tab.path}
              style={{ textDecoration: 'none' }}
            >
              <View style={[styles.tab, isActive && styles.tabActive]}>
                <Icon size={20} color={isActive ? '#FF6B6B' : '#666666'} />
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </View>
            </Link>
          );
        })}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <Router>
      <View style={styles.container}>
        <TopNav />
        <View style={styles.content}>
          <Routes>
            <Route path="/" element={<RecipesScreen />} />
            <Route path="/cook" element={<CookScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
          </Routes>
        </View>
      </View>
    </Router>
  );
}

interface Styles {
  container: ViewStyle;
  header: ViewStyle;
  titleContainer: ViewStyle;
  title: TextStyle;
  nav: ViewStyle;
  tab: ViewStyle;
  tabActive: ViewStyle;
  tabLabel: TextStyle;
  tabLabelActive: TextStyle;
  content: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
  },
  nav: {
    flexDirection: 'row',
    gap: 32,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#FF6B6B',
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#666666',
  },
  tabLabelActive: {
    color: '#FF6B6B',
  },
  content: {
    flex: 1,
  },
});