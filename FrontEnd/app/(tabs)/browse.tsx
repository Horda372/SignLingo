import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import DeafCultureLesson from '../lessons/fundamentalsOfAsl'
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCustomTheme } from '../../utils/utils';
import { lightModeColors, darkModeColors } from '../../constants/themeColors';
import {lessons,quesitons} from '../Lessons'
const { width } = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';

const lessonCategories = [
  {
    title: 'Practice Tips',
    lessons: [
      'ABCs in ASL: Learn how to Fingerspell!',
      'American Sign Language (ASL)',
      'Common Mistakes to Avoid',
      'Speed Building Exercises',
      'Finger Independence Drills',
      'Mirror Practice Benefits',
      'Video Recording Yourself',
      'Practice Schedule Ideas',
      'Motivation Strategies',
      'Progress Tracking Methods',
    ],
  },
  {
    title: 'Q&A',
    lessons: [
      'How long to master fingerspelling?',
      'Best apps for practice?',
      'Grammar structure questions',
      'Regional sign variations',
      'Facial expression importance',
      'Learning as a hearing person',
      'Teaching children ASL',
      'Professional interpreter path',
      'Online vs in-person classes',
      'Cultural etiquette questions',
    ],
  },
  {
    title: 'Events',
    lessons: [
      'Weekly Practice Meetup',
      'ASL Coffee Chat',
      'Silent Dinner Event',
      'Storytelling Night',
      'Deaf Community Workshop',
      'Interpreter Training Session',
      'Cultural Awareness Seminar',
      'Student Showcase',
      'Holiday Sign Celebration',
      'Monthly Progress Challenge',
    ],
  },
  {
    title: 'Stories',
    lessons: [
      'My First Conversation',
      'Learning Journey Update',
      'Breakthrough Moment',
      'Cultural Exchange Experience',
      'Overcoming Challenges',
      'Meeting Deaf Friends',
      'Family Learning Together',
      'Workplace Communication',
      'Travel Experience',
      'Inspiring Teacher Story',
    ],
  },
  {
    title: 'Resources',
    lessons: [
      'Free Online Dictionaries',
      'YouTube Channel Recommendations',
      'Book Suggestions',
      'Mobile App Reviews',
      'Local Class Listings',
      'Interpreter Services',
      'Cultural Organizations',
      'Research Papers',
      'Documentary Recommendations',
      'Helpful Websites',
    ],
  },
  {
    title: 'General',
    lessons: [
      'Welcome New Members!',
      'Community Guidelines',
      'Success Stories',
      'Weekly Challenges',
      'Sign of the Day',
      'Cultural Awareness',
      'News and Updates',
      'Member Introductions',
      'Feedback and Suggestions',
      'Random Discussions',
    ],
  },
];

export default function Lessons() {
  const navigation = useNavigation();
  const router = useRouter();
  const { isDark } = useCustomTheme();
  const theme = isDark ? darkModeColors : lightModeColors;
  const [activeTab, setActiveTab] = useState('feed');
  const [userEngagement, setUserEngagement] = useState({});
  const [activeLessonIndex, setActiveLessonIndex] = useState(null);
  // Calculate which category and lesson within that category
  const getCurrentCategoryAndLesson = (globalLessonIndex) => {
    const categoryIndex = Math.floor(globalLessonIndex / 10);
    const lessonIndex = globalLessonIndex % 10;
    return { categoryIndex, lessonIndex };
  };

  // Helper function to get total engaged lessons count
  const getTotalEngagedLessons = () => {
    return Object.values(userEngagement).filter(engaged => engaged).length;
  };
  useFocusEffect(
  React.useCallback(() => {
    (async () => {
      const json = await AsyncStorage.getItem('userEngagement');
      if (json) setUserEngagement(JSON.parse(json));
    })();
  }, [])
);
useEffect(() => {
  (async () => {
    const json = await AsyncStorage.getItem('userEngagement');
    if (json) setUserEngagement(JSON.parse(json));
  })();
}, []);
  // Helper function to check if a lesson is engaged with
  const isLessonEngaged = (globalIndex) => {
    return userEngagement[globalIndex] === true;
  };

  // Helper function to get the current lesson (next unengaged lesson)
  const getCurrentLessonIndex = () => {
    const totalLessons = lessonCategories.length * 10;
    for (let i = 0; i < totalLessons; i++) {
      if (!isLessonEngaged(i)) {
        return i;
      }
    }
    return totalLessons; // All lessons engaged
  };

  useEffect(() => {
    const brown = theme.numberBadge;

    navigation.setOptions({
      headerTintColor: brown,
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerLeft: () => null,

      headerTitle: activeLessonIndex !== null
        ? () => {
            const { categoryIndex, lessonIndex } = getCurrentCategoryAndLesson(activeLessonIndex);
            const lessonTitle = lessonCategories[categoryIndex].lessons[lessonIndex];
            
            return (
              <Pressable
                onPress={() => setActiveLessonIndex(null)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 8,
                }}
              >
                <Ionicons
                  name="arrow-back"
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
              Lessons
            </Text>
          ),

      headerTitleStyle: { color: brown },
      headerTitleAlign: 'left',
    });
  }, [activeLessonIndex, navigation, theme]);

 const markLessonEngaged = () => {
  if (activeLessonIndex === null) return;
  const newEngagement = { ...userEngagement, [activeLessonIndex]: true };
  setUserEngagement(newEngagement);
  AsyncStorage.setItem('userEngagement', JSON.stringify(newEngagement));
  setActiveLessonIndex(null);
};

  const goBackToLessons = () => {
    setActiveLessonIndex(null);
  };

  const getLessonStatus = (globalIndex) => {
    if (isLessonEngaged(globalIndex)) return 'completed';
    if (globalIndex === getCurrentLessonIndex()) return 'current';
    if (globalIndex < getCurrentLessonIndex()) return 'current'; // Allow revisiting previous lessons
    return 'locked';
  };

const handleLessonPress = (categoryIndex, lessonIndex) => {
    const globalIndex = categoryIndex * 10 + lessonIndex;
    if (getLessonStatus(globalIndex) === 'locked') return;
    
    router.push({
        pathname: `/lessons/${globalIndex}`,
        params: { 
            onComplete: JSON.stringify({ globalIndex }) // Pass completion data
        }
    });
}

const markLessonComplete = (globalIndex) => {
    setUserEngagement(prev => ({
        ...prev,
        [globalIndex]: true
    }));
};

  // When a lesson is active, render that lesson content
  if (activeLessonIndex !== null) {
    const { categoryIndex, lessonIndex } = getCurrentCategoryAndLesson(activeLessonIndex);
    const category = lessonCategories[categoryIndex];
    const lesson = category.lessons[lessonIndex];
    
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <LinearGradient
            colors={theme.categories[category.title]}
            style={styles.lessonHeader}
          >
            <Text style={[styles.lessonTitle, { color: theme.textSecondary }]}>{}</Text>
            <Text style={[styles.lessonSubtitle, { color: theme.textLight }]}>
              {category.title} • Lesson {lessonIndex + 1} of {category.lessons.length}
            </Text>
          </LinearGradient>
          
          <View style={styles.lessonContent}>
            <Text style={[styles.lessonText, { color: theme.text }]}>
 </Text>
            
            <Pressable
              onPress={markLessonEngaged}
              style={[styles.engageButton, { backgroundColor: theme.buttonBg }]}
            >
              <Text style={[styles.engageButtonText, { color: theme.text }]}>Mark as Read</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const getIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'checkmark';
      case 'current':
        return 'chatbubble';
      default:
        return 'lock-closed';
    }
  };

  const getCircleColors = (status) => {
    switch (status) {
      case 'completed':
        return theme.lessonCircle.completed;
      case 'current':
        return theme.lessonCircle.current;
      default:
        return theme.lessonCircle.locked;
    }
  };

  const getLabelColors = (status) => {
    switch (status) {
      case 'completed':
        return theme.lessonLabel.completed;
      case 'current':
        return theme.lessonLabel.current;
      default:
        return theme.lessonLabel.locked;
    }
  };

  const renderLesson = (lesson, lessonIndex, categoryIndex, isLastLesson) => {
    const globalIndex = categoryIndex * 10 + lessonIndex;
    const status = getLessonStatus(globalIndex);
    const isLeft = lessonIndex % 2 === 0;

    return (
      <View key={lessonIndex} style={styles.lessonContainer}>
        {!isLastLesson && (
          <View style={[styles.connectingLine, { left: width / 2 - 1, backgroundColor: theme.connectingLine }]} />
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
                onPress={() => handleLessonPress(categoryIndex, lessonIndex)}
              >
                <Ionicons
                  name={getIcon(status)}
                  size={status === 'locked' ? 16 : 20}
                  color={theme.textLight}
                />
              </Pressable>
            </LinearGradient>

            <View style={[styles.numberBadge, { backgroundColor: theme.numberBadge }]}>
              <Text style={[styles.numberText, { color: theme.textLight }]}>{lessonIndex + 1}</Text>
            </View>
          </View>

          <View style={[styles.labelContainer, { maxWidth: width * 0.5 }]}> 
            <LinearGradient
              colors={getLabelColors(status)}
              style={[
                styles.lessonLabel,
                status === 'completed' && [styles.completedBorder,],
                status === 'current' && [styles.currentBorder, ],
                status === 'locked' && [styles.lockedBorder, ],
              ]}
            >
              <Text style={[
                styles.lessonText,
                status === 'completed' && [styles.completedText, { color: theme.textSecondary }],
                status === 'current' && [styles.currentText, { color: theme.textSecondary }],
                status === 'locked' && [styles.lockedText, { color: theme.textSecondary }],
              ]}>
                {lesson}
              </Text>

              {status === 'completed' && (
                <View style={styles.statusRow}>
                  <Ionicons name="heart" size={12} color={theme.statsIcons.star} />
                  <Text style={[styles.completedStatus, { color: theme.textSecondary }]}>Finished</Text>
                </View>
              )}

              {status === 'current' && (
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { backgroundColor: theme.dailyProgress.track }]}>
                    <View style={[styles.progressFill, { backgroundColor: theme.dailyProgress.fill }]} />
                  </View>
                  <Text style={[styles.progressText, { color: theme.textSecondary }]}>Ready to Read</Text>
                </View>
              )}
            </LinearGradient>
          </View>
        </View>
      </View>
    );
  };

  const renderCategory = (category, categoryIndex) => {
    const { title, lessons } = category;
    
    // Calculate category engagement using the new system
    const categoryStartIndex = categoryIndex * 10;
    const lessonsEngagedInCategory = lessons.filter((_, lessonIndex) => 
      isLessonEngaged(categoryStartIndex + lessonIndex)
    ).length;
    
    return (
      <View key={categoryIndex} style={styles.chapterContainer}>
        {/* Category Header */}
        <LinearGradient colors={theme.categories[title]} style={styles.chapterHeader}>
          <Text style={[styles.chapterTitle, { color: theme.textLight }]}>{title}</Text>
          <Text style={[styles.chapterSubtitle, { color: theme.textLight }]}>
            Category {categoryIndex + 1} of {lessonCategories.length}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={16} color={theme.statsIcons.star} />
              <Text style={[styles.statText, { color: theme.textLight }]}>{lessonsEngagedInCategory * 25} Points</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="chatbubbles" size={16} color={theme.statsIcons.diamond} />
              <Text style={[styles.statText, { color: theme.textLight }]}>5</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people" size={16} color={theme.statsIcons.trophy} />
              <Text style={[styles.statText, { color: theme.textLight }]}>{lessonsEngagedInCategory}/10</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Category Lessons */}
        <View style={styles.pathContainer}>
          {lessons.map((lesson, lessonIndex) => 
            renderLesson(lesson, lessonIndex, categoryIndex, lessonIndex === lessons.length - 1)
          )}
        </View>

        {/* Category Completion Card */}
        {lessonsEngagedInCategory === 10 && (
          <LinearGradient
            colors={theme.cardGradient}
            style={styles.completionCard}
          >
            <Text style={[styles.completionTitle, { color: theme.text }]}>Category Complete! 🎊</Text>
            <Text style={[styles.completionText, { color: theme.textSecondary }]}>
              Great job engaging with {title}! 
              {categoryIndex < lessonCategories.length - 1 
                ? ` Get ready for the next category: ${lessonCategories[categoryIndex + 1]?.title}.`
                : ' You\'ve engaged with all lesson categories!'}
            </Text>
          </LinearGradient>
        )}
      </View>
    );
  };

  const totalEngagedLessons = getTotalEngagedLessons();
  const totalLessons = lessonCategories.length * 10;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {lessonCategories.map((category, categoryIndex) => 
          renderCategory(category, categoryIndex)
        )}

        {/* Final Encouragement Card */}
        <LinearGradient
          colors={theme.cardGradient}
          style={styles.encouragementCard}
        >
          <Text style={[styles.encouragementTitle, { color: theme.text }]}>
            {totalEngagedLessons >= totalLessons
              ? 'Lesson Champion! 🎉'
              : 'Keep Learning!'}
          </Text>
          <Text style={[styles.encouragementText, { color: theme.textSecondary }]}>
            {totalEngagedLessons >= totalLessons
              ? 'You\'ve completed all lessons! You\'re now a master of ASL learning.'
              : 'You\'re making great progress. Keep engaging with the lessons to earn more points!'}
          </Text>
          
          <View style={styles.dailyProgressContainer}>
            <View style={[styles.dailyProgressBar, { backgroundColor: theme.dailyProgress.track }]}>
              <View style={[styles.dailyProgressFill, { 
                width: `${(Math.min(totalEngagedLessons, 5) / 5) * 100}%`,
                backgroundColor: theme.dailyProgress.fill 
              }]} />
            </View>
            <Text style={[styles.dailyProgressText, { color: theme.text }]}>
              {Math.min(totalEngagedLessons, 5)}/5 lessons completed today
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
    marginBottom: 2,
  },
  chapterSubtitle: {
    fontSize: 14,
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
    marginRight: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
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
    borderLeftWidth: 0,
  },
  currentBorder: {
    borderLeftWidth: 0,
  },
  lockedBorder: {
    borderLeftWidth: 0,
  },
  
  completedText: {},
  currentText: {fontSize:16},
  lockedText: {},

  // Status Styles
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  completedStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
  },
  progressFill: {
    width: '33%',
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
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
    marginBottom: 8,
  },
  completionText: {
    fontSize: 14,
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
    marginBottom: 8,
  },
  encouragementText: {
    fontSize: 14,
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
    borderRadius: 6,
  },
  dailyProgressFill: {
    height: '100%',
    borderRadius: 6,
  },
  dailyProgressText: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },

  // Lesson Content Styles
  lessonHeader: {
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 16,
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  lessonSubtitle: {
    fontSize: 14,
    opacity: 0.9,
  },
  lessonContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  lessonText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 2,
  },
  engageButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  engageButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});