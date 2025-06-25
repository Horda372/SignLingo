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
import { useCustomTheme } from '@/utils/utils';
import {registerForPushNotificationsAsync} from "./_layout" 
const { width, height } = Dimensions.get('window');

export default function OpeningScreen() {
  const router = useRouter();
  const { colors, isDark } = useCustomTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.timing(buttonAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleContinue = () => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
      router.push('/login');
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>      
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      <View style={[styles.container, { backgroundColor: colors.background }]}>        
        <Animated.View
          style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
        >
          <Image
            source={require('../assets/images/startup1.png')}
            style={styles.logo}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.5)']}
            style={styles.logoOverlay}
          />
        </Animated.View>

        <Animated.View style={[styles.content, { transform: [{ translateY: slideAnim }] }]}>  
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              SignLingo
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Learn Sign Language with AI</Text>
          </View>

          <View style={styles.featuresContainer}>
            {['Interactive Lessons', 'Real-time Recognition', 'Progress Tracking'].map((label, i) => (
              <View key={i} style={styles.featureItem}>
                <View
                  style={[styles.featureDot, { backgroundColor: colors.lessonCircle.current[0] }]}
                />
                <Text style={[styles.featureText, { color: colors.text }]}>{label}</Text>
              </View>
            ))}
          </View>

          <Animated.View style={[styles.buttonContainer, { opacity: buttonAnim }]}>            
            <Pressable
              style={({ pressed }) => [styles.button, { transform: [{ scale: pressed ? 0.95 : 1 }] }]}
              onPress={handleContinue}
            >
              <LinearGradient
                colors={colors.auth.primaryGradient}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={[styles.buttonText, { color: colors.textLight }]}>Get Started</Text>
                <Text style={[styles.buttonSubtext, { color: colors.textLight }]}>Start your journey</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>

        
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
  logoContainer: { width, height: height * 0.55, position: 'relative' },
  logo: { width: '100%', height: '100%' },
  logoOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%' },
  content: { flex: 1, alignItems: 'center', width: '100%', paddingHorizontal: 24, paddingTop: 20, justifyContent: 'space-between' },
  titleContainer: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 38, fontWeight: '800', marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, fontWeight: '500', textAlign: 'center', opacity: 0.9 },
  featuresContainer: { alignItems: 'flex-start', marginBottom: 40 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  featureDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  featureText: { fontSize: 16, fontWeight: '500' },
  buttonContainer: { width: '100%', marginBottom: 20 },
  button: { borderRadius: 16, overflow: 'hidden', elevation: 8, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  buttonGradient: { paddingVertical: 18, paddingHorizontal: 40, alignItems: 'center' },
  buttonText: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 2 },
  buttonSubtext: { fontSize: 13, fontWeight: '400', opacity: 0.9, textAlign: 'center' },
  skipButton: { paddingVertical: 2, paddingHorizontal: 20 },
  skipText: { fontSize: 14, fontWeight: '500', textAlign: 'center' },
});
