import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  Pressable, 
  StyleSheet, 
  Dimensions, 
  Animated,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const { width, height } = Dimensions.get('window');
const brown = '#92400E';
const lightBrown = '#D97706';

export default function OpeningScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const background = Colors[colorScheme ?? 'light'].background;
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered animation sequence
    Animated.sequence([
      // Logo fade in and scale
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Title slide up
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      // Button fade in
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    // Add haptic feedback if available
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Animate out before navigation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.push('/login');
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar 
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      <LinearGradient
        colors={colorScheme === 'dark' 
          ? ['#1F2937', '#111827', '#000000'] 
          : ['#FEF3C7', '#FDE68A', background]
        }
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Logo Section with Animation */}
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Image
            source={require('../assets/images/startup1.png')}
            style={styles.logo}
            resizeMode="cover"
          />
          {/* Optional overlay for better text contrast */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
            style={styles.logoOverlay}
          />
        </Animated.View>

        {/* Content Section */}
        <Animated.View 
          style={[
            styles.content,
            {
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* App Title with Enhanced Styling */}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: brown }]}>
              SignLingo
            </Text>
            <Text style={[styles.subtitle, { 
              color: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280' 
            }]}>
              Learn Sign Language with AI
            </Text>
          </View>

          {/* Feature Highlights */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <View style={[styles.featureDot, { backgroundColor: brown }]} />
              <Text style={[styles.featureText, { 
                color: colorScheme === 'dark' ? '#E5E7EB' : '#374151' 
              }]}>
                Interactive Lessons
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureDot, { backgroundColor: lightBrown }]} />
              <Text style={[styles.featureText, { 
                color: colorScheme === 'dark' ? '#E5E7EB' : '#374151' 
              }]}>
                Real-time Recognition
              </Text>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureDot, { backgroundColor: brown }]} />
              <Text style={[styles.featureText, { 
                color: colorScheme === 'dark' ? '#E5E7EB' : '#374151' 
              }]}>
                Progress Tracking
              </Text>
            </View>
          </View>

          {/* Enhanced Button with Animation */}
          <Animated.View 
            style={[
              styles.buttonContainer,
              { opacity: buttonAnim }
            ]}
          >
            <Pressable
              style={({ pressed }) => [
                styles.button,
                {
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                }
              ]}
              onPress={handleContinue}
            >
              <LinearGradient
                colors={[brown, lightBrown]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Get Started</Text>
                <Text style={styles.buttonSubtext}>Start your journey</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Optional Skip Button */}
          <Pressable 
            style={styles.skipButton}
            onPress={() => router.push('/login')}
          >
            <Text style={[styles.skipText, { 
              color: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280' 
            }]}>
              Skip Introduction
            </Text>
          </Pressable>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logoContainer: {
    width: width,
    height: height * 0.55,
    position: 'relative',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  logoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.8,
  },
  featuresContainer: {
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: brown,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  buttonSubtext: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.9,
    textAlign: 'center',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});