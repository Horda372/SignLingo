import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Switch, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function SettingsScreen() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const colorScheme = useColorScheme();
  const background = Colors[colorScheme ?? 'light'].background;
  const brown = '#92400E';

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const handleLogout = () => {
    // TODO: implement logout logic
    console.log('Logout pressed');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: background }]}
      contentContainerStyle={styles.content}
    >
      {/* Profile */}
      <Pressable
        style={styles.optionRow}
        onPress={() => router.push('/settingsComponents/ProfileOption')}
      >
        <Ionicons name="person" size={24} color={brown} style={styles.icon} />
        <Text style={[styles.optionText, { color: brown }]}>Profile</Text>
        <Ionicons name="chevron-forward" size={20} color={brown} />
      </Pressable>

      {/* Notifications */}
      <Pressable
        style={styles.optionRow}
        onPress={() => router.push('/settingsComponents/NotificationsOption')}
      >
        <Ionicons name="notifications" size={24} color={brown} style={styles.icon} />
        <Text style={[styles.optionText, { color: brown }]}>Notifications</Text>
        <Ionicons name="chevron-forward" size={20} color={brown} />
      </Pressable>

      {/* Dark Mode Toggle */}
      <View style={styles.optionRow}>
        <Ionicons name="moon" size={24} color={brown} style={styles.icon} />
        <Text style={[styles.optionText, { color: brown }]}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          thumbColor="#FFF"
          trackColor={{ false: '#ccc', true: brown }}
        />
      </View>

      {/* About */}
      <Pressable
        style={styles.optionRow}
        onPress={() => router.push('/settingsComponents/AboutOption')}
      >
        <Ionicons name="information-circle" size={24} color={brown} style={styles.icon} />
        <Text style={[styles.optionText, { color: brown }]}>About</Text>
        <Ionicons name="chevron-forward" size={20} color={brown} />
      </Pressable>

      {/* Logout Button */}
      <Pressable
        style={({ pressed }) => [
          styles.optionRow,
          { backgroundColor: pressed ? '#FDE68A' : '#FEF3C7' }
        ]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out" size={24} color={brown} style={styles.icon} />
        <Text style={[styles.optionText, { color: brown }]}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FEF3C7',
    marginBottom: 8,
  },
  icon: {
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});
