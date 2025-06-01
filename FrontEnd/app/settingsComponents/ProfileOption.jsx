// app/settings/profile.js
import React, { useState, useLayoutEffect } from 'react';
import {
  ScrollView, View, Text, TextInput,
  Pressable, StyleSheet, Alert
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function ProfileOption() {
  const router = useRouter();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const background = Colors[colorScheme ?? 'light'].background;
  const brown = '#92400E';

  // form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // override header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Profile',
      headerBackTitleVisible: false,
      headerTitleAlign: 'left',
      headerLeftSpacing: 0,
      headerTitleSpacing: 0,
    });
  }, [navigation]);

  const handleSave = () => {
    if (password !== confirm) {
      return Alert.alert('Error', 'Passwords do not match');
    }
    // TODO: your API call here…
    Alert.alert('Success', 'Profile updated');
    router.back();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: background }]}>
      {/** Name **/}
      <View style={styles.field}>
        <Text style={[styles.label, { color: brown }]}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your full name"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/** Email **/}
      <View style={styles.field}>
        <Text style={[styles.label, { color: brown }]}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/** Phone **/}
      <View style={styles.field}>
        <Text style={[styles.label, { color: brown }]}>Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="+48 123 456 789"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      {/** Password **/}
      <View style={styles.field}>
        <Text style={[styles.label, { color: brown }]}>New Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.field}>
        <Text style={[styles.label, { color: brown }]}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />
      </View>

      {/** Save button **/}
      <Pressable
        style={({ pressed }) => [
          styles.saveButton,
          { backgroundColor: pressed ? '#FDE68A' : brown }
        ]}
        onPress={handleSave}
      >
        <Ionicons name="save-outline" size={20} color="#FFF" style={styles.saveIcon}/>
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
    borderWidth: 1, borderColor: '#DDD',
    borderRadius: 6, paddingHorizontal: 12,
    paddingVertical: 8, fontSize: 16, backgroundColor: '#FFF'
  },
  saveButton: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 14,
    borderRadius: 8, marginTop: 24
  },
  saveIcon: { marginRight: 8 },
  saveText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
