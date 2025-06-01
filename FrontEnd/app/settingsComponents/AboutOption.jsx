import React, { useLayoutEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function AboutScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const background = Colors[colorScheme ?? 'light'].background;
  const brown = '#92400E';

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'About',
      headerBackTitleVisible: false,
      headerTitleAlign: 'left',
      headerLeftSpacing: 0,
      headerTitleSpacing: 0,
    });
  }, [navigation]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.paragraph, { color: brown }]}>SignLingo is an interactive mobile application designed to help users learn American Sign Language (ASL) through structured lessons, real-time gesture recognition, and engaging quizzes.</Text>
      <Text style={[styles.paragraph, { color: brown }]}>With SignLingo, learners can progress at their own pace, track their scores, and receive AI-powered feedback on their signing accuracy. Gamification features such as badges and streaks keep motivation high.</Text>
      <Text style={[styles.paragraph, { color: brown }]}>Our community section allows users to connect, share tips, and support each other on their ASL journey, making learning both social and fun.</Text>
      <Text style={[styles.paragraph, { color: brown }]}>Built with accessibility and usability in mind, SignLingo offers an intuitive interface suitable for all learners.</Text>
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
  title: {
    fontWeight: '600',
    marginBottom: 12,
  },
  paragraph: {
    lineHeight: 22,
    fontSize:18,
    marginBottom: 12,
  },
});
