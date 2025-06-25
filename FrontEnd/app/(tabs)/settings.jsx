// SettingsScreen.js
import React from 'react';
import { ScrollView, View, Text, Pressable, Switch, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { darkModeColors, lightModeColors } from '../../constants/themeColors';
import { useCustomTheme } from '../../utils/utils';

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark, toggle } = useCustomTheme();
  const theme = isDark ? darkModeColors : lightModeColors;

  const handleLogout = () => {
    // TODO: implement logout logic
    console.log('Logout pressed');
  };

  const iconColor = theme.numberBadge;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Profile */}
      <Pressable
        style={({ pressed }) => [
          styles.optionRow,
          { backgroundColor: pressed ? theme.buttonBgPressed : theme.buttonBg },
        ]}
        onPress={() => router.push('/settingsComponents/ProfileOption')}
      >
        <Ionicons name="person" size={24} color={iconColor} style={styles.icon} />
        <Text style={[styles.optionText, { color: iconColor }]}>Profile</Text>
        <Ionicons name="chevron-forward" size={20} color={iconColor} />
      </Pressable>

      {/* Notifications */}
      <Pressable
        style={({ pressed }) => [
          styles.optionRow,
          { backgroundColor: pressed ? theme.buttonBgPressed : theme.buttonBg },
        ]}
        onPress={() => router.push('/settingsComponents/NotificationsOption')}
      >
        <Ionicons name="notifications" size={24} color={iconColor} style={styles.icon} />
        <Text style={[styles.optionText, { color: iconColor }]}>Notifications</Text>
        <Ionicons name="chevron-forward" size={20} color={iconColor} />
      </Pressable>

      {/* Dark Mode Toggle */}
      <View style={[styles.optionRow, { backgroundColor: theme.buttonBg }]}>
        <Ionicons name="moon" size={24} color={iconColor} style={styles.icon} />
        <Text style={[styles.optionText, { color: iconColor }]}>Dark Mode</Text>
        <Switch
          value={isDark}
          onValueChange={toggle}
          thumbColor="#FFF"
          trackColor={{ false: '#ccc', true: iconColor }}
        />
      </View>

      {/* About */}
      <Pressable
        style={({ pressed }) => [
          styles.optionRow,
          { backgroundColor: pressed ? theme.buttonBgPressed : theme.buttonBg },
        ]}
        onPress={() => router.push('/settingsComponents/AboutOption')}
      >
        <Ionicons
          name="information-circle"
          size={24}
          color={iconColor}
          style={styles.icon}
        />
        <Text style={[styles.optionText, { color: iconColor }]}>About</Text>
        <Ionicons name="chevron-forward" size={20} color={iconColor} />
      </Pressable>

      {/* Logout */}
      <Pressable
        style={({ pressed }) => [
          styles.optionRow,
          { backgroundColor: pressed ? theme.buttonBgPressed : theme.buttonBg },
        ]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out" size={24} color={iconColor} style={styles.icon} />
        <Text style={[styles.optionText, { color: iconColor }]}>Logout</Text>
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
