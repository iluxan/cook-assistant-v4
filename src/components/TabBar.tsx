import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useNavigate, useLocation } from 'react-router-dom';
import { Book, ChefHat, Settings } from 'lucide-react';

export default function TabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/', label: 'Recipes', icon: Book },
    { path: '/cook', label: 'Cook', icon: ChefHat },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        const Icon = tab.icon;
        
        return (
          <TouchableOpacity
            key={tab.path}
            style={styles.tab}
            onPress={() => navigate(tab.path)}
          >
            <Icon
              size={24}
              color={isActive ? '#007AFF' : '#8E8E93'}
            />
            <Text style={[
              styles.tabLabel,
              isActive && styles.tabLabelActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

interface Styles {
  tabBar: ViewStyle;
  tab: ViewStyle;
  tabLabel: TextStyle;
  tabLabelActive: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
    paddingBottom: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#8E8E93',
  },
  tabLabelActive: {
    color: '#007AFF',
  },
});