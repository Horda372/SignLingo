import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import DeafCultureLesson from '../lessons/fundamentalsOfAsl';
import HistoryOfAsl from '../lessons/HistoryOfAsl';

const { width } = Dimensions.get('window');

const signLanguageChapters = [
  {
    title: 'Fundamentals of ASL',
    lessons: [
      'Deaf Culture Basics',
      'History of ASL',
      'The Role of Facial Expression',
      'Handshape Types',
      'Palm Orientation',
      'Movement & Location',
      'Non-manual Markers',
      'Fingerspelling Overview',
      'Numbers Overview',
      'Practice Exercises',
    ],
  },
  {
    title: 'Fingerspelling Deep Dive',
    lessons: [
      'Letters A–C',
      'Letters D–F',
      'Letters G–I',
      'Letters J–L',
      'Letters M–O',
      'Letters P–R',
      'Letters S–T',
      'Letters U–V',
      'Letters W–Z',
      'Spelling Common Words',
    ],
  },
  {
    title: 'Numbers & Time',
    lessons: [
      'Numbers 1–5',
      'Numbers 6–10',
      'Numbers 11–20',
      'Numbers 21–50',
      'Numbers 51–100',
      'Ordinal Numbers',
      'Telling Time (Hours)',
      'Days of the Week',
      'Months of the Year',
      'Scheduling Phrases',
    ],
  },
  {
    title: 'Core Vocabulary & Phrases',
    lessons: [
      'Greetings',
      'Farewells',
      'Introductions',
      'Please / Thank You',
      'Yes / No / Maybe',
      'Excuse Me / Sorry',
      'WH-Questions: Who/What/Where',
      'WH-Questions: When/Why/How',
      'Simple Sentences',
      'Practice Dialogues',
    ],
  },
  {
    title: 'Family & Relationships',
    lessons: [
      'Family (General)',
      'Parents & Siblings',
      'Grandparents',
      'Aunts, Uncles & Cousins',
      'Spouse & Partner',
      'Friends & Acquaintances',
      'Describing People',
      'Possession',
      'Relationship Verbs',
      'Role-play Conversations',
    ],
  },
  {
    title: 'Food & Dining',
    lessons: [
      'Food Basic Signs',
      'Drink Basic Signs',
      'Fruits',
      'Vegetables',
      'Meals & Meal Times',
      'Ordering at a Restaurant',
      'Cooking Actions',
      'Taste Descriptors',
      'Dietary Preferences',
      'Restaurant Role-play',
    ],
  },
  {
    title: 'Daily Life & Activities',
    lessons: [
      'Wake Up & Morning Routine',
      'Getting Dressed',
      'Going to Work/School',
      'Studying & Reading',
      'Working & Tasks',
      'Exercise & Sports',
      'Household Chores',
      'Leisure Activities',
      'Relaxation & Hobbies',
      'Evening / Bedtime',
    ],
  },
  {
    title: 'Emotions & Descriptions',
    lessons: [
      'Happy & Joyful',
      'Sad & Depressed',
      'Angry & Frustrated',
      'Excited & Surprised',
      'Bored & Tired',
      'Scared & Nervous',
      'Describing Size (Big/Small)',
      'Describing Shape',
      'Describing Texture',
      'Comparative Descriptions',
    ],
  },
  {
    title: 'Directions & Travel',
    lessons: [
      'Left/Right/Forward/Back',
      'Up/Down/Near/Far',
      'Go/Come/Stop/Wait',
      'Asking "Where Is…?"',
      'Transportation Modes',
      'Maps & Locations',
      '"How Do I Get To…?"',
      'Booking Travel',
      'Airport/Station Signs',
      'Travel Role-play',
    ],
  },
  {
    title: 'Grammar & Conversation',
    lessons: [
      'Topic-Comment Structure',
      'Yes–No Questions',
      'Wh-Questions Grammar',
      'Negation',
      'Classifiers',
      'Role Shift & Characters',
      'Spatial Agreement',
      'Non-manual Grammar Markers',
      'Storytelling Techniques',
      'Putting It All Together',
    ],
  },
];

const lessonComponents = [
  // Chapter 1 - Fundamentals of ASL
  DeafCultureLesson,
  HistoryOfAsl,
  // Add the remaining lesson components...
];

export default function Browse() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  
  // Changed from single number to object tracking each lesson
  const [lessonProgress, setLessonProgress] = useState({});
  const [activeLessonIndex, setActiveLessonIndex] = useState(null);

  // Calculate which chapter and lesson within that chapter
  const getCurrentChapterAndLesson = (globalLessonIndex) => {
    const chapterIndex = Math.floor(globalLessonIndex / 10);
    const lessonIndex = globalLessonIndex % 10;
    return { chapterIndex, lessonIndex };
  };

  // Helper function to get total completed lessons count
  const getTotalCompletedLessons = () => {
    return Object.values(lessonProgress).filter(completed => completed).length;
  };

  // Helper function to check if a lesson is completed
  const isLessonCompleted = (globalIndex) => {
    return lessonProgress[globalIndex] === true;
  };

  // Helper function to get the current lesson (next uncompleted lesson)
  const getCurrentLessonIndex = () => {
    const totalLessons = signLanguageChapters.length * 10;
    for (let i = 0; i < totalLessons; i++) {
      if (!isLessonCompleted(i)) {
        return i;
      }
    }
    return totalLessons; // All lessons completed
  };

  useEffect(() => {
    (async () => {
      try {
        const storedProgress = await AsyncStorage.getItem('lessonProgress');
        if (storedProgress !== null) {
          setLessonProgress(JSON.parse(storedProgress));
        }
      } catch (err) {
        console.log('Unable to load progress', err);
      }
    })();
  }, []);

  // Update navigation header when lesson state changes
  useEffect(() => {
    const isInLesson = activeLessonIndex !== null;
    const brown = '#92400E';

    navigation.setOptions({
      headerTintColor: brown,
      headerLeft: () => null,

      headerTitle: isInLesson
        ? () => {
            const { chapterIndex, lessonIndex } = getCurrentChapterAndLesson(activeLessonIndex);
            const lessonTitle = signLanguageChapters[chapterIndex].lessons[lessonIndex];
            
            return (
              <Pressable
                onPress={() => setActiveLessonIndex(null)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 8,
                }}
              >
                <FontAwesome
                  name="arrow-left"
                  size={20}
                  color={brown}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    color: brown,
                    fontSize: 18,
                    fontWeight: '600',
                  }}
                >
                  {lessonTitle}
                </Text>
              </Pressable>
            );
          }
        : () => (
            <Text
              style={{
                color: brown,
                fontSize: 18,
                fontWeight: '600',
              }}
            >
              All ASL Lessons
            </Text>
          ),

      headerTitleStyle: { color: brown },
      headerTitleAlign: 'left',
    });
  }, [activeLessonIndex, navigation]);

  const persistProgress = async (newProgress) => {
    try {
      await AsyncStorage.setItem('lessonProgress', JSON.stringify(newProgress));
    } catch (err) {
      console.log('Unable to save progress', err);
    }
  };

  const markLessonCompleted = () => {
    if (activeLessonIndex === null) return;
    
    const newProgress = {
      ...lessonProgress,
      [activeLessonIndex]: true
    };
    
    setLessonProgress(newProgress);
    setActiveLessonIndex(null);
    persistProgress(newProgress);
  };

  const goBackToLessons = () => {
    setActiveLessonIndex(null);
  };

  const getLessonStatus = (globalIndex) => {
    if (isLessonCompleted(globalIndex)) return 'completed';
    if (globalIndex === getCurrentLessonIndex()) return 'current';
    if (globalIndex < getCurrentLessonIndex()) return 'current'; // Allow replay of previous lessons
    return 'locked';
  };

  const handleLessonPress = (chapterIndex, lessonIndex) => {
    const globalIndex = chapterIndex * 10 + lessonIndex;
    const status = getLessonStatus(globalIndex);
    if (status === 'locked') return;
    setActiveLessonIndex(globalIndex);
  };

  // Reset function for development
  const resetProgress = async () => {
    try {
      await AsyncStorage.removeItem('lessonProgress');
      setLessonProgress({});
      setActiveLessonIndex(null);
      console.log('Progress reset successfully');
    } catch (err) {
      console.log('Unable to reset progress', err);
    }
  };

  // When a lesson is active, render that lesson component
  if (activeLessonIndex !== null && lessonComponents[activeLessonIndex]) {
    const ActiveLessonComponent = lessonComponents[activeLessonIndex];
    return (
      <SafeAreaView style={styles.container}>
        <ActiveLessonComponent 
          onComplete={markLessonCompleted} 
          onBack={goBackToLessons}
        />
      </SafeAreaView>
    );
  }

  const getIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'checkmark';
      case 'current':
        return 'play';
      default:
        return 'lock-closed';
    }
  };

  const getCircleColors = (status) => {
    switch (status) {
      case 'completed':
        return ['#D97706', '#92400E'];
      case 'current':
        return ['#EA580C', '#C2410C'];
      default:
        return ['#9CA3AF', '#6B7280'];
    }
  };

  const getLabelColors = (status) => {
    switch (status) {
      case 'completed':
        return ['#FEF3C7', '#FDE68A'];
      case 'current':
        return ['#FED7AA', '#FDBA74'];
      default:
        return ['#F3F4F6', '#E5E7EB'];
    }
  };

  const renderLesson = (lesson, lessonIndex, chapterIndex, isLastLesson) => {
    const globalIndex = chapterIndex * 10 + lessonIndex;
    const status = getLessonStatus(globalIndex);
    const isLeft = lessonIndex % 2 === 0;

    return (
      <View key={lessonIndex} style={styles.lessonContainer}>
        {!isLastLesson && (
          <View style={[styles.connectingLine, { left: width / 2 - 1 }]} />
        )}

        <View style={[styles.lessonRow, isLeft ? styles.leftAlign : styles.rightAlign]}>
          <View style={isLeft ? styles.leftCircleContainer : styles.rightCircleContainer}>
            <LinearGradient
              colors={getCircleColors(status)}
              style={[styles.lessonCircle, status === 'current' && styles.currentGlow]}
            >
              <Pressable
                style={styles.circleButton}
                disabled={status === 'locked'}
                onPress={() => handleLessonPress(chapterIndex, lessonIndex)}
              >
                <Ionicons
                  name={getIcon(status)}
                  size={status === 'locked' ? 16 : 20}
                  color="#FFFFFF"
                />
              </Pressable>
            </LinearGradient>

            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>{lessonIndex + 1}</Text>
            </View>
          </View>

          <View style={[styles.labelContainer, { maxWidth: width * 0.5 }]}> 
            <LinearGradient
              colors={getLabelColors(status)}
              style={[
                styles.lessonLabel,
                status === 'completed' && styles.completedBorder,
                status === 'current' && styles.currentBorder,
                status === 'locked' && styles.lockedBorder,
              ]}
            >
              <Text style={[
                styles.lessonText,
                status === 'completed' && styles.completedText,
                status === 'current' && styles.currentText,
                status === 'locked' && styles.lockedText,
              ]}>
                {lesson}
              </Text>

              {status === 'completed' && (
                <View style={styles.statusRow}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.completedStatus}>Completed</Text>
                </View>
              )}

              {status === 'current' && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={styles.progressFill} />
                  </View>
                  <Text style={styles.progressText}>Ready to Start</Text>
                </View>
              )}
            </LinearGradient>
          </View>
        </View>
      </View>
    );
  };

  const renderChapter = (chapter, chapterIndex) => {
    const { title, lessons } = chapter;
    
    // Calculate chapter progress using the new system
    const chapterStartIndex = chapterIndex * 10;
    const lessonsCompletedInChapter = lessons.filter((_, lessonIndex) => 
      isLessonCompleted(chapterStartIndex + lessonIndex)
    ).length;
    
    return (
      <View key={chapterIndex} style={styles.chapterContainer}>
        {/* Chapter Header */}
        <LinearGradient colors={['#92400E', '#EA580C']} style={styles.chapterHeader}>
          <Text style={styles.chapterTitle}>{title}</Text>
          <Text style={styles.chapterSubtitle}>
            Chapter {chapterIndex + 1} of {signLanguageChapters.length}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color="#FDE047" />
              <Text style={styles.statText}>{lessonsCompletedInChapter * 50} XP</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="diamond" size={16} color="#60A5FA" />
              <Text style={styles.statText}>3</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trophy" size={16} color="#F59E0B" />
              <Text style={styles.statText}>{lessonsCompletedInChapter}/10</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Chapter Lessons */}
        <View style={styles.pathContainer}>
          {lessons.map((lesson, lessonIndex) => 
            renderLesson(lesson, lessonIndex, chapterIndex, lessonIndex === lessons.length - 1)
          )}
        </View>

        {/* Chapter Completion Card */}
        {lessonsCompletedInChapter === 10 && (
          <LinearGradient
            colors={['#FEF3C7', '#FDE68A']}
            style={styles.completionCard}
          >
            <Text style={styles.completionTitle}>Chapter Complete! 🎊</Text>
            <Text style={styles.completionText}>
              Great job completing {title}! 
              {chapterIndex < signLanguageChapters.length - 1 
                ? ` Get ready for the next chapter: ${signLanguageChapters[chapterIndex + 1]?.title}.`
                : ' You\'ve completed all ASL lessons!'}
            </Text>
          </LinearGradient>
        )}
      </View>
    );
  };

  const totalCompletedLessons = getTotalCompletedLessons();
  const totalLessons = signLanguageChapters.length * 10;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {signLanguageChapters.map((chapter, chapterIndex) => 
          renderChapter(chapter, chapterIndex)
        )}

        {/* Final Encouragement Card */}
        <LinearGradient
          colors={['#FEF3C7', '#FDE68A']}
          style={styles.encouragementCard}
        >
          <Text style={styles.encouragementTitle}>
            {totalCompletedLessons >= totalLessons
              ? 'Congratulations! 🎉'
              : 'Keep Going!'}
          </Text>
          <Text style={styles.encouragementText}>
            {totalCompletedLessons >= totalLessons
              ? 'You\'ve completed all ASL lessons! You\'re now ready to have conversations in American Sign Language.'
              : 'You\'re making great progress. Complete your daily goal to earn more XP!'}
          </Text>
          
          {/* Reset button for development */}
          <Pressable
            onPress={resetProgress}
            style={styles.resetButton}
          >
            <Text style={styles.resetButtonText}>Reset Progress (Dev)</Text>
          </Pressable>
          
          <View style={styles.dailyProgressContainer}>
            <View style={styles.dailyProgressBar}>
              <View style={[styles.dailyProgressFill, { width: `${(Math.min(totalCompletedLessons, 5) / 5) * 100}%` }]} />
            </View>
            <Text style={styles.dailyProgressText}>
              {Math.min(totalCompletedLessons, 5)}/5 lessons completed today
            </Text>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: '#FFFBEB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
  },

  // Chapter Styles
  chapterContainer: {
    marginBottom: 40,
  },
  chapterHeader: {
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 16,
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  chapterSubtitle: {
    fontSize: 14,
    color: '#FED7AA',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  pathContainer: {
    paddingHorizontal: 16,
  },

  // Lesson Layout Styles
  lessonContainer: {
    marginBottom: 32,
    position: 'relative',
  },
  connectingLine: {
    position: 'absolute',
    top: 80,
    width: 2,
    height: 32,
    backgroundColor: '#D97706',
    zIndex: 0,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  leftAlign: {
    justifyContent: 'flex-start',
  },
  rightAlign: {
    justifyContent: 'flex-end',
  },

  // Circle Styles
  leftCircleContainer: {
    position: 'relative',
    marginRight: 16,
  },
  rightCircleContainer: {
    position: 'relative',
    marginLeft: 16,
  },
  lessonCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  currentGlow: {
    elevation: 8,
    shadowOpacity: 0.4,
  },
  circleButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#92400E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Label Styles
  labelContainer: {
    flex: 1,
  },
  lessonLabel: {
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  completedBorder: {
    borderLeftColor: '#D97706',
  },
  currentBorder: {
    borderLeftColor: '#EA580C',
  },
  lockedBorder: {
    borderLeftColor: '#9CA3AF',
  },
  lessonText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  completedText: {
    color: '#92400E',
  },
  currentText: {
    color: '#C2410C',
  },
  lockedText: {
    color: '#6B7280',
  },

  // Status Styles
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  completedStatus: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#FED7AA',
    borderRadius: 4,
  },
  progressFill: {
    width: '33%',
    height: '100%',
    backgroundColor: '#EA580C',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#C2410C',
    marginTop: 4,
    fontWeight: '500',
  },

  // Completion Card Styles
  completionCard: {
    margin: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  completionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  completionText: {
    fontSize: 14,
    color: '#D97706',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Encouragement Card Styles
  encouragementCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  encouragementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  encouragementText: {
    fontSize: 14,
    color: '#D97706',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  dailyProgressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  dailyProgressBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#FDE68A',
    borderRadius: 6,
  },
  dailyProgressFill: {
    height: '100%',
    backgroundColor: '#D97706',
    borderRadius: 6,
  },
  dailyProgressText: {
    fontSize: 12,
    color: '#92400E',
    marginTop: 8,
    fontWeight: '500',
  },
  
  // Reset button styles
  resetButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginVertical: 12,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});