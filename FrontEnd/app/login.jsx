import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function AuthPages() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const router = useRouter();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

const handleSubmit = async () => {
    if (currentPage === 'login') {
      console.log('Login attempt:', { email: formData.email, password: formData.password });
      // For frontend testing - navigate directly to tabs
      try {
        await AsyncStorage.setItem('userEmail', formData.email);
        // Navigate to your tabs screen (replace 'MainTabs' with your actual screen name)
 router.push('/browse');      } catch (error) {
        console.error('Login error:', error);
      }
    } else {
      console.log('Register attempt:', formData);
      // Add your registration logic here
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      try {
        await AsyncStorage.setItem('userEmail', formData.email);
        await AsyncStorage.setItem('userName', formData.name);
        // Navigate to your tabs screen
         router.push('/(tabs)');
      } catch (error) {
        console.error('Registration error:', error);
      }
    }
  };


  const switchPage = (page) => {
    setCurrentPage(page);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const socialLogin = (provider) => {
    console.log(`${provider} login attempt`);
    // Add social login logic here
  };

  if (currentPage === 'login') {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          style={styles.flex} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Card */}
            <LinearGradient 
              colors={['#92400E', '#EA580C']} 
              style={styles.header}
            >
              <Text style={styles.headerTitle}>Welcome Back!</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Ionicons name="star" size={16} color="#FDE047" />
                  <Text style={styles.statText}>Learn ASL</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="diamond" size={16} color="#60A5FA" />
                  <Text style={styles.statText}>Master Signs</Text>
                </View>
              </View>
            </LinearGradient>

            {/* Login Form */}
            <LinearGradient
              colors={['#FEF3C7', '#FDE68A']}
              style={styles.formContainer}
            >
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail" size={20} color="#D97706" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    placeholder="Enter your email"
                    placeholderTextColor="#D97706"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed" size={20} color="#D97706" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.textInput, styles.passwordInput]}
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    placeholder="Enter your password"
                    placeholderTextColor="#D97706"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color="#D97706" 
                    />
                  </Pressable>
                </View>
              </View>

              {/* Forgot Password */}
              <View style={styles.forgotPasswordContainer}>
                <Pressable onPress={() => console.log('Forgot password')}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </Pressable>
              </View>

              {/* Login Button */}
              <Pressable onPress={handleSubmit} style={styles.buttonContainer}>
                <LinearGradient
                  colors={['#EA580C', '#C2410C']}
                  style={styles.primaryButton}
                >
                  <Text style={styles.primaryButtonText}>Sign In</Text>
                </LinearGradient>
              </Pressable>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login */}
              <View style={styles.socialContainer}>
                <Pressable 
                  onPress={() => socialLogin('Google')}
                  style={styles.socialButton}
                >
                  <Ionicons name="logo-google" size={24} color="#EA4335" />
                </Pressable>
                <Pressable 
                  onPress={() => socialLogin('Facebook')}
                  style={styles.socialButton}
                >
                  <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                </Pressable>
                <Pressable 
                  onPress={() => socialLogin('Apple')}
                  style={styles.socialButton}
                >
                  <Ionicons name="logo-apple" size={24} color="#000000" />
                </Pressable>
              </View>

              {/* Switch to Register */}
              <View style={styles.switchContainer}>
                <Text style={styles.switchText}>Don't have an account? </Text>
                <Pressable onPress={() => switchPage('register')}>
                  <Text style={styles.switchLink}>Sign Up</Text>
                </Pressable>
              </View>
            </LinearGradient>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.flex} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.registerContainer}>
          {/* Header with Back Button */}
          <LinearGradient 
            colors={['#92400E', '#EA580C']} 
            style={styles.headerCompact}
          >
            <View style={styles.headerWithBack}>
              <Pressable 
                onPress={() => switchPage('login')}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                <Text style={styles.backButtonText}>Back</Text>
              </Pressable>
              <Text style={styles.headerTitleCompact}>Join Us!</Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="star" size={14} color="#FDE047" />
                <Text style={styles.statTextCompact}>Start Learning</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="diamond" size={14} color="#60A5FA" />
                <Text style={styles.statTextCompact}>Earn Rewards</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Register Form */}
          <LinearGradient
            colors={['#FEF3C7', '#FDE68A']}
            style={styles.formContainerCompact}
          >
            {/* Name Input */}
            <View style={styles.inputGroupCompact}>
              <Text style={styles.inputLabelCompact}>Full Name</Text>
              <View style={styles.inputContainerCompact}>
                <Ionicons name="person" size={18} color="#D97706" style={styles.inputIconCompact} />
                <TextInput
                  style={styles.textInputCompact}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  placeholder="Enter your full name"
                  placeholderTextColor="#D97706"
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroupCompact}>
              <Text style={styles.inputLabelCompact}>Email Address</Text>
              <View style={styles.inputContainerCompact}>
                <Ionicons name="mail" size={18} color="#D97706" style={styles.inputIconCompact} />
                <TextInput
                  style={styles.textInputCompact}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  placeholder="Enter your email"
                  placeholderTextColor="#D97706"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroupCompact}>
              <Text style={styles.inputLabelCompact}>Password</Text>
              <View style={styles.inputContainerCompact}>
                <Ionicons name="lock-closed" size={18} color="#D97706" style={styles.inputIconCompact} />
                <TextInput
                  style={[styles.textInputCompact, styles.passwordInputCompact]}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  placeholder="Create a password"
                  placeholderTextColor="#D97706"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIconCompact}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={18} 
                    color="#D97706" 
                  />
                </Pressable>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroupCompact}>
              <Text style={styles.inputLabelCompact}>Confirm Password</Text>
              <View style={styles.inputContainerCompact}>
                <Ionicons name="lock-closed" size={18} color="#D97706" style={styles.inputIconCompact} />
                <TextInput
                  style={[styles.textInputCompact, styles.passwordInputCompact]}
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  placeholder="Confirm your password"
                  placeholderTextColor="#D97706"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIconCompact}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off" : "eye"} 
                    size={18} 
                    color="#D97706" 
                  />
                </Pressable>
              </View>
            </View>

            {/* Progress Indicator */}
            <LinearGradient
              colors={['#FED7AA', '#FDBA74']}
              style={styles.progressCardCompact}
            >
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitleCompact}>Getting Started</Text>
                <Text style={styles.progressStepCompact}>Step 1 of 2</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View style={styles.progressFill} />
                </View>
              </View>
            </LinearGradient>

            {/* Register Button */}
            <Pressable onPress={handleSubmit} style={styles.buttonContainerCompact}>
              <LinearGradient
                colors={['#EA580C', '#C2410C']}
                style={styles.primaryButtonCompact}
              >
                <Text style={styles.primaryButtonTextCompact}>Create Account</Text>
              </LinearGradient>
            </Pressable>

            {/* Terms */}
            <Text style={styles.termsTextCompact}>
              By signing up, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>

            {/* Switch to Login */}
            <View style={styles.switchContainerCompact}>
              <Text style={styles.switchText}>Already have an account? </Text>
              <Pressable onPress={() => switchPage('login')}>
                <Text style={styles.switchLink}>Sign In</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: '#FFFBEB',
  },
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  registerContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  // Header Styles (Login - Original)
  header: {
    marginTop:'15%',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerWithBack: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Header Styles (Register - Compact)
  headerCompact: {
    marginTop: '10%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTitleCompact: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statTextCompact: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // Form Styles (Login - Original)
  formContainer: {
    padding: 24,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#D97706',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#92400E',
    fontWeight: '500',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },

  // Form Styles (Register - Compact)
  formContainerCompact: {
    flex: 1,
    padding: 18,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#D97706',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  inputGroupCompact: {
    marginBottom: 12,
  },
  inputLabelCompact: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 6,
  },
  inputContainerCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  inputIconCompact: {
    marginRight: 8,
  },
  textInputCompact: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    fontWeight: '500',
  },
  passwordInputCompact: {
    paddingRight: 32,
  },
  eyeIconCompact: {
    position: 'absolute',
    right: 12,
    padding: 2,
  },

  // Button Styles (Login - Original)
  buttonContainer: {
    marginVertical: 8,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Button Styles (Register - Compact)
  buttonContainerCompact: {
    marginVertical: 6,
  },
  primaryButtonCompact: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primaryButtonTextCompact: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Social and Other Elements
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#D97706',
    fontSize: 14,
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D97706',
    opacity: 0.3,
  },
  dividerText: {
    color: '#D97706',
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 16,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 16,
  },
  socialButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  switchContainerCompact: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  switchText: {
    color: '#D97706',
    fontSize: 14,
  },
  switchLink: {
    color: '#EA580C',
    fontSize: 14,
    fontWeight: '600',
  },

  // Progress Styles (Compact)
  progressCardCompact: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitleCompact: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  progressStepCompact: {
    fontSize: 10,
    color: '#D97706',
    fontWeight: '500',
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#FDE68A',
    borderRadius: 3,
  },
  progressFill: {
    width: '50%',
    height: '100%',
    backgroundColor: '#EA580C',
    borderRadius: 3,
  },

  // Terms (Compact)
  termsTextCompact: {
    textAlign: 'center',
    color: '#D97706',
    fontSize: 10,
    lineHeight: 14,
    marginVertical: 8,
  },
  termsLink: {
    color: '#EA580C',
    fontWeight: '500',
  },
});