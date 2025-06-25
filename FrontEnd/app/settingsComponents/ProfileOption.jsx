// app/settings/profile.js
import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCustomTheme } from '../../utils/utils';
import { lightModeColors, darkModeColors } from '../../constants/themeColors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileOption() {
  const router = useRouter();
  const navigation = useNavigation();
  const { isDark } = useCustomTheme();
  const theme = isDark ? darkModeColors : lightModeColors;

  // form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
useEffect(() => {
  const loadUser = async () => {
    try {
      const json = await AsyncStorage.getItem('user');
      if (!json) return;
      const user = JSON.parse(json);
      setName(user.username || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    } catch (err) {
      console.error('Failed to load user:', err);
    }
  };

  loadUser();
}, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Profile',
      headerBackTitleVisible: false,
      headerTitleAlign: 'left',
      headerLeftSpacing: 0,
      headerTitleSpacing: 0,
      headerTintColor: theme.numberBadge,
      headerStyle: { backgroundColor: theme.background },
      headerTitleStyle: { color: theme.numberBadge },
    });
  }, [navigation, theme]);

const handleSave = async () => {
  if (password !== confirm) {
    return Alert.alert('Error', 'Passwords do not match');
  }

  try {
    const json = await AsyncStorage.getItem('user');
    const user = JSON.parse(json);
    const userId = user?.id;

    if (!userId) throw new Error('Missing user ID');

    const res = await fetch(`http://192.168.170.235:8000/api/update/${userId}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: name,
        email,
        phone,
        password,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error(error);
      return Alert.alert('Error', 'Failed to update profile');
    }

    const updated = await res.json();
    await AsyncStorage.setItem('user', JSON.stringify(updated));

    Alert.alert('Success', 'Profile updated');
    router.back();
  } catch (err) {
    console.error(err);
    Alert.alert('Error', 'Unexpected issue');
  }
};


  const iconColor = theme.numberBadge;
  const buttonBg = iconColor;
  const buttonBgPressed = theme.buttonBgPressed;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Name */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: iconColor }]}>Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#5A4C6B' : '#FFF' }]}
          placeholder="Your full name"
          placeholderTextColor={isDark ? '#CCC' : '#888'}
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Email */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: iconColor }]}>Email</Text>
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#5A4C6B' : '#FFF' }]}
          placeholder="you@example.com"
          placeholderTextColor={isDark ? '#CCC' : '#888'}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

     

      {/* New Password */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: iconColor }]}>New Password</Text>
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#5A4C6B' : '#FFF' }]}
          placeholder="••••••••"
          placeholderTextColor={isDark ? '#CCC' : '#888'}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Confirm Password */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: iconColor }]}>Confirm Password</Text>
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#5A4C6B' : '#FFF' }]}
          placeholder="••••••••"
          placeholderTextColor={isDark ? '#CCC' : '#888'}
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />
      </View>

      {/* Save Button */}
      <Pressable
        style={({ pressed }) => [
          styles.saveButton,
          {
            backgroundColor: pressed ? buttonBgPressed : buttonBg,
          },
        ]}
        onPress={handleSave}
      >
        <Ionicons name="save-outline" size={20} color="#FFF" style={styles.saveIcon} />
        <Text style={styles.saveText}>Save Changes</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  field: { marginBottom: 16 },
  label: { marginBottom: 6, fontSize: 14, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 24,
  },
  saveIcon: { marginRight: 8 },
  saveText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
