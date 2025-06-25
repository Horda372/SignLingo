// app/auth/AuthPages.jsx
import React, { useMemo, useState } from 'react';
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
import { useCustomTheme } from '../utils/utils';
import { darkModeColors, lightModeColors } from '../constants/themeColors';
import { signIn, signUp } from './services/apiService';

const { width } = Dimensions.get('window');
 const LoginForm = ({ 
  formData, 
  handleInputChange, 
  handleSubmit, 
  switchPage, 
  currentPage,
  socialLogin, 
  showPassword, 
  setShowPassword, 
  styles, 
  theme 
}) => {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <LinearGradient
              colors={theme.chapterHeaderGradient}
              style={styles.header}
            >
              {currentPage === 'login' ? (
                <>
                  <Text style={styles.headerTitle}>
                    Welcome Back!
                  </Text>
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Ionicons name="star" size={16} color={theme.statsIcons.star} />
                      <Text style={styles.statText}>Learn ASL</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="diamond" size={16} color={theme.statsIcons.diamond} />
                      <Text style={styles.statText}>Master Signs</Text>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <Pressable onPress={() => switchPage('login')} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={20} color={theme.textSecondary} />
                    <Text style={styles.backButtonText}>Back</Text>
                  </Pressable>
                  <Text style={styles.headerTitle}>Create Account</Text>
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Ionicons name="star" size={16} color={theme.statsIcons.star} />
                      <Text style={styles.statText}>Start Learning</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="diamond" size={16} color={theme.statsIcons.diamond} />
                      <Text style={styles.statText}>Earn Rewards</Text>
                    </View>
                  </View>
                </>
              )}
            </LinearGradient>

            <LinearGradient colors={theme.cardGradient} style={styles.formContainer}>
              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail" size={20} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={formData.email}
                    onChangeText={v => handleInputChange('email', v)}
                    placeholder="Enter your email"
                    keyboardShouldPersistTaps="always"
keyboardDismissMode="none"

                    placeholderTextColor={theme.auth.placeholder} // swapped
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed" size={20} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.textInput, styles.passwordInput]}
                    value={formData.password}
                    onChangeText={v => handleInputChange('password', v)}
                    placeholder="Enter your password"
                    placeholderTextColor={theme.auth.placeholder} // swapped
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable onPress={() => setShowPassword(p => !p)} style={styles.eyeIcon}>
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color={theme.textSecondary}
                    />
                  </Pressable>
                </View>
              </View>

              <View style={styles.forgotPasswordContainer}>
                <Pressable onPress={() => console.log('Forgot password')}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </Pressable>
              </View>

              <Pressable onPress={handleSubmit} style={styles.buttonContainer}>
                <LinearGradient
                  colors={theme.lessonCircle.current}
                  style={styles.primaryButton}
                >
                  <Text style={styles.primaryButtonText}>Sign In</Text>
                </LinearGradient>
              </Pressable>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialContainer}>
                <Pressable onPress={() => socialLogin('Google')} style={styles.socialButton}>
                  <Ionicons name="logo-google" size={24} color="#EA4335" />
                </Pressable>
                <Pressable onPress={() => socialLogin('Facebook')} style={styles.socialButton}>
                  <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                </Pressable>
                <Pressable onPress={() => socialLogin('Apple')} style={styles.socialButton}>
                  <Ionicons name="logo-apple" size={24} color={theme.text} />
                </Pressable>
              </View>

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
 const RegisterForm = ({ 
  formData, 
  handleInputChange, 
  handleSubmit, 
  switchPage, 
  showPassword, 
  currentPage,
  setShowPassword, 
  showConfirmPassword, 
  setShowConfirmPassword, 
  styles, 
  theme 
}) => {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <LinearGradient
              colors={theme.chapterHeaderGradient}
              style={styles.header}
            >
              <Text style={styles.headerTitle}>Create Account</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Ionicons name="star" size={16} color={theme.statsIcons.star} />
                  <Text style={styles.statText}>Start Learning</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="diamond" size={16} color={theme.statsIcons.diamond} />
                  <Text style={styles.statText}>Earn Rewards</Text>
                </View>
              </View>
            </LinearGradient>

            <LinearGradient colors={theme.cardGradient} style={styles.formContainer}>
              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person" size={20} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={formData.name}
                    onChangeText={v => handleInputChange('name', v)}
                    placeholder="Enter your full name"
                    placeholderTextColor={theme.auth.placeholder} // swapped
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail" size={20} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={formData.email}
                    onChangeText={v => handleInputChange('email', v)}
                    placeholder="Enter your email"
                    placeholderTextColor={theme.auth.placeholder} // swapped
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed" size={20} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.textInput, styles.passwordInput]}
                    value={formData.password}
                    onChangeText={v => handleInputChange('password', v)}
         
                  />
                  <Pressable onPress={() => setShowPassword(p => !p)} style={styles.eyeIcon}>
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color={theme.textSecondary}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Confirm */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed" size={20} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.textInput, styles.passwordInput]}
                    value={formData.confirmPassword}
                    onChangeText={v => handleInputChange('confirmPassword', v)}
                    placeholder="Confirm your password"
                    placeholderTextColor={theme.auth.placeholder} // swapped
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable onPress={() => setShowConfirmPassword(p => !p)} style={styles.eyeIcon}>
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color={theme.textSecondary}
                    />
                  </Pressable>
                </View>
              </View>

              <Pressable onPress={handleSubmit} style={styles.buttonContainer}>
                <LinearGradient
                  colors={theme.lessonCircle.current}
                  style={styles.primaryButton}
                >
                  <Text style={styles.primaryButtonText}>Sign Up</Text>
                </LinearGradient>
              </Pressable>

              <View style={styles.switchContainer}>
                <Text style={styles.switchText}>Already have an account? </Text>
                <Pressable onPress={() => switchPage('login')}>
                  <Text style={styles.switchLink}>Sign In</Text>
                </Pressable>
              </View>
            </LinearGradient>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
export default function AuthPages() {
  const { isDark } = useCustomTheme();
  const theme = isDark ? darkModeColors : lightModeColors;
  const router = useRouter();
  const styles = useMemo(() => getStyles(theme), [theme])


  const [currentPage, setCurrentPage] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

 const handleSubmit = async () => {
  // Client-side check for login
  if (currentPage === 'login') {
    if (!formData.email || !formData.password) {
      alert('Please enter both email and password');
      return;
    }
  }

  try {
    if (currentPage === 'login') {
      const user = await signIn(formData.email, formData.password);
      if (user) {
        router.push('/browse');
      }
    } else {
      // registration branch
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      const newUser = await signUp(
        formData.name,
        formData.password,
        formData.email
      );
      if (newUser) {
        // Auto-login on successful signup
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        router.push('/browse');
      }
    }
  } catch (err) {
    // show error to user
    alert(err.message || 'Something went wrong');
  }
};



  const switchPage = page => {
    setCurrentPage(page);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const socialLogin = provider => console.log(`${provider} login attempt`);







  return currentPage === 'login' ? (
    <LoginForm 
      formData={formData}
      currentPage={currentPage}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      switchPage={switchPage}
      socialLogin={socialLogin}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      styles={styles}
      theme={theme}
    />
  ) : (
    <RegisterForm 
      formData={formData}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
            currentPage={currentPage}

      switchPage={switchPage}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      showConfirmPassword={showConfirmPassword}
      setShowConfirmPassword={setShowConfirmPassword}
      styles={styles}
      theme={theme}
    />
  );}
 const getStyles = theme =>
StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    flex: { flex: 1 },
    scrollContent: { paddingVertical: 20, paddingHorizontal: 16 },

    header: {
      marginTop: '15%',
      padding: 20,
      alignItems: 'center',
      borderRadius: 16,
      marginBottom: 20,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.textSecondary,      // swapped
    },
    statsRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    statText: { color: theme.textLight, fontSize: 14, fontWeight: '600' },

    formContainer: {
      padding: 24,
      borderRadius: 16,
      borderLeftWidth: 4,
      borderLeftColor: theme.cardBorder,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
    },
    inputGroup: { marginBottom: 20 },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textSecondary,      // swapped
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.buttonBg,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    inputIcon: { marginRight: 12, color: theme.textSecondary },
    textInput: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
      fontWeight: '500',
    },
    passwordInput: { paddingRight: 40 },
    eyeIcon: { position: 'absolute', right: 16, padding: 4 },

    forgotPasswordContainer: { alignItems: 'flex-end', marginBottom: 16 },
    forgotPasswordText: {
      color: theme.textSecondary,
      fontSize: 14,
      fontWeight: '500',
    },

    buttonContainer: { marginVertical: 8 },
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
      color: theme.textLight,
      fontSize: 18,
      fontWeight: 'bold',
    },

    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 20,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.textSecondary,
      opacity: 0.3,
    },
    dividerText: {
      color: theme.textSecondary,
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
      backgroundColor: theme.background,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.buttonBg,
    },

    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    switchText: { color: theme.textSecondary, fontSize: 14 },
    switchLink: {
      color: theme.textSecondary,
      fontSize: 14,
      fontWeight: '600',
    },
    
    backButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    backButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textSecondary,      // swapped
    },
  });