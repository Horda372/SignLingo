// app/lesson/[id].jsx
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet, Dimensions, View, TouchableOpacity, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { lessons } from '../Lessons';

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = (width - 40) * 9 / 16; // 16:9 aspect ratio

export default function LessonDetails() {
  const { lessonsId } = useLocalSearchParams();
  const router = useRouter();
  const lessonIndex = Number(lessonsId);
  const [isCompleted, setIsCompleted] = useState(false);
  
  console.log(lessonIndex)
  const lesson = lessons[lessonIndex];

  const videoId = lesson.PhotoLink.split('v=')[1];
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  const [mainContent, takeawaysText] = lesson.Text.split('Key takeaways:');
  const keyTakeaways = takeawaysText
    ? takeawaysText
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-/, '').trim())
    : [];

  const handleFinishLesson = () => {
    // Mark lesson as completed
    setIsCompleted(true);
    
    // Here you would typically update your global state
    // For now, we'll show a success message
    Alert.alert(
      "Lesson Complete! 🎉",
      "Great job! You've successfully completed this lesson. The next lesson is now unlocked.",
      [
        {
          text: "Continue Learning",
          onPress: () => router.back(), // Go back to lessons list
        },
        {
          text: "Take Quiz",
          onPress: () => router.push(`/lessons/quiz/${lessonsId}/`),
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{lesson.LevelId}</Text>
          <View style={styles.lessonBadge}>
            <Text style={styles.badgeText}>Lesson {lessonsId}</Text>
          </View>
        </View>

        {/* Video */}
        <View style={styles.videoSection}>
          <View style={styles.videoWrapper}>
            <WebView
              source={{ uri: embedUrl }}
              style={styles.video}
              allowsFullscreenVideo
            />
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>About This Lesson</Text>
          <Text style={styles.description}>{mainContent.trim()}</Text>

          {keyTakeaways.length > 0 && (
            <View style={styles.takeawaysSection}>
              <Text style={styles.sectionTitle}>Key Takeaways</Text>
              {keyTakeaways.map((item, idx) => (
                <View key={idx} style={styles.takeawayItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.takeawayText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
       

            <TouchableOpacity
              style={styles.quizButton}
              onPress={() => router.push(`/lessons/quiz/${lessonsId}/`)}
            >
              <Text style={styles.quizButtonText}>Start Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBEB' },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#92400E', flex: 1, lineHeight: 34, letterSpacing: -0.5 },
  lessonBadge: { backgroundColor: '#FDE68A', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#F59E0B' },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#92400E', textTransform: 'uppercase', letterSpacing: 0.5 },
  videoSection: { marginBottom: 24 },
  videoWrapper: { width: '100%', height: VIDEO_HEIGHT, backgroundColor: '#FDE68A', borderRadius: 16, overflow: 'hidden', shadowColor: '#92400E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 6, borderWidth: 1, borderColor: '#F59E0B' },
  video: { width: '100%', height: '100%' },
  contentSection: {},
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#92400E', marginBottom: 12 },
  description: { fontSize: 16, lineHeight: 24, color: '#654321', marginBottom: 28, fontWeight: '400' },
  takeawaysSection: { backgroundColor: '#FEF3C7', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#FDE68A', marginBottom: 32 },
  takeawayItem: { flexDirection: 'row', alignItems: 'flex-start', paddingRight: 8, marginBottom: 12 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F59E0B', marginTop: 9, marginRight: 12 },
  takeawayText: { fontSize: 15, lineHeight: 22, color: '#654321', fontWeight: '500', flex: 1 },
  
  // Button Container
  buttonContainer: { gap: 12 },
  
  // Finish Lesson Button
  finishButton: { 
    backgroundColor: '#10B981', 
    borderRadius: 16, 
    padding: 20, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#059669', 
    shadowColor: '#047857', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 4 
  },
  completedButton: {
    backgroundColor: '#6B7280',
    borderColor: '#4B5563',
    shadowColor: '#374151',
  },
  finishButtonText: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#FFFFFF' 
  },
  completedButtonText: {
    color: '#E5E7EB'
  },
  
  // Quiz Button
  quizButton: { 
    backgroundColor: '#F59E0B', 
    borderRadius: 16, 
    padding: 20, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#D97706', 
    shadowColor: '#92400E', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 4 
  },
  quizButtonText: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#FFFBEB' 
  },
});