// app/communitycomponents/createPost.js
import  { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCustomTheme } from '../../utils/utils';
import { lightModeColors, darkModeColors } from '../../constants/themeColors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const categories = [
  { name: 'Practice Tips', icon: 'star' },
  { name: 'Q&A', icon: 'help-circle' },
  { name: 'Events', icon: 'calendar' },
  { name: 'Stories', icon: 'book' },
  { name: 'Resources', icon: 'library' },
  { name: 'General', icon: 'chatbubbles' },
];

export default function CreatePost() {
  const navigation = useNavigation();
  const router = useRouter();
  const { isDark } = useCustomTheme();
  const theme = isDark ? darkModeColors : lightModeColors;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTintColor: theme.numberBadge,
      headerStyle: { backgroundColor: theme.background },
      headerTitle: () => (
        <Text style={[styles.headerTitle, { color: theme.numberBadge }]}>
          Create Post
        </Text>
      ),
      headerLeft: () => (
        <Pressable onPress={() => router.back()} style={{ marginLeft: 16 }}>
          <Ionicons name="close" size={24} color={theme.numberBadge} />
        </Pressable>
      ),
    });
  }, [navigation, theme]);
  
const handlePost = async () => {
  const raw = await AsyncStorage.getItem('user');
  const user = JSON.parse(raw);
  const userId = user.id;

  if (!title.trim() || !content.trim() || !selectedCategory) {
    Alert.alert('Error', 'Title, content and category are all required');
    return;
  }
  setIsPosting(true);
  try {
    const res = await fetch('http://192.168.170.235:8000/api/community/posts/create/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Description: content,
        User: userId,
        Tag: selectedCategory,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('POST error:', res.status, text);
      throw new Error(text || `Error ${res.status}`);
    }
    Alert.alert('Success!', 'Your post has been created.', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  } catch (error) {
    console.error(error);
    Alert.alert('Error', error.message || 'Failed to create post');
  } finally {
    setIsPosting(false);
  }
};

  const renderCategorySelector = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.numberBadge }]}>
        Category
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
      >
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category.name;
          const categoryColors = theme.categories[category.name];
          
          return (
            <Pressable
              key={index}
              onPress={() => setSelectedCategory(category.name)}
              style={[styles.categoryChip, { marginRight: 12 }]}
            >
              <LinearGradient
                colors={isSelected ? categoryColors : ['transparent', 'transparent']}
                style={[
                  styles.categoryChipGradient,
                  !isSelected && { 
                    borderWidth: 1, 
                    borderColor: theme.statsIcons.star 
                  }
                ]}
              >
                <Ionicons 
                  name={category.icon} 
                  size={16} 
                  color={isSelected ? theme.categoryText : theme.statsIcons.star} 
                />
                <Text style={[
                  styles.categoryChipText,
                  { color: isSelected ? theme.categoryText : theme.statsIcons.star }
                ]}>
                  {category.name}
                </Text>
              </LinearGradient>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderTitleInput = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.numberBadge }]}>
        Title
      </Text>
      <LinearGradient
        colors={theme.cardGradient}
        style={styles.inputContainer}
      >
        <TextInput
          style={[styles.titleInput, { color: theme.numberBadge }]}
          placeholder="What's your post about?"
          placeholderTextColor={theme.statsIcons.star}
          value={title}
          onChangeText={setTitle}
          maxLength={100}
          multiline={false}
        />
      </LinearGradient>
      <Text style={[styles.characterCount, { color: theme.statsIcons.diamond }]}>
        {title.length}/100
      </Text>
    </View>
  );

  const renderContentInput = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.numberBadge }]}>
        Content
      </Text>
      <LinearGradient
        colors={theme.cardGradient}
        style={styles.inputContainer}
      >
        <TextInput
          style={[styles.contentInput, { color: theme.numberBadge }]}
          placeholder="Share your thoughts, questions, or experiences..."
          placeholderTextColor={theme.statsIcons.star}
          value={content}
          onChangeText={setContent}
          maxLength={2000}
          multiline={true}
          textAlignVertical="top"
        />
      </LinearGradient>
      <Text style={[styles.characterCount, { color: theme.statsIcons.diamond }]}>
        {content.length}/2000
      </Text>
    </View>
  );

  const renderPostButton = () => (
    <View style={styles.postButtonContainer}>
      <LinearGradient
        colors={theme.lessonCircle.current}
        style={styles.postButton}
      >
        <Pressable
          style={styles.postButtonPressable}
          onPress={handlePost}
          disabled={isPosting || !title.trim() || !content.trim() || !selectedCategory}
        >
          {isPosting ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.postButtonText}>Posting...</Text>
            </View>
          ) : (
            <>
              <Ionicons name="send" size={20} color="#FFFFFF" />
              <Text style={styles.postButtonText}>Post to Community</Text>
            </>
          )}
        </Pressable>
      </LinearGradient>
    </View>
  );

  const renderPreview = () => {
    if (!title.trim() && !content.trim()) return null;

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.numberBadge }]}>
          Preview
        </Text>
        <LinearGradient
          colors={theme.cardGradient}
          style={styles.previewCard}
        >
          <View style={styles.previewHeader}>
            <View style={styles.previewAuthor}>
              <View style={[styles.previewAvatar, { backgroundColor: theme.lessonCircle.current[0] }]}>
                <Ionicons name="person" size={16} color="#FFFFFF" />
              </View>
              <View>
                <Text style={[styles.previewAuthorName, { color: theme.numberBadge }]}>
                  You
                </Text>
                <Text style={[styles.previewTime, { color: theme.statsIcons.star }]}>
                  Now
                </Text>
              </View>
            </View>
            {selectedCategory && (
              <View style={[styles.previewCategoryBadge, { backgroundColor: theme.numberBadge }]}>
                <Text style={styles.previewCategoryText}>{selectedCategory}</Text>
              </View>
            )}
          </View>

          {title.trim() && (
            <Text style={[styles.previewTitle, { color: theme.numberBadge }]}>
              {title}
            </Text>
          )}
          
          {content.trim() && (
            <Text style={[styles.previewContent, { color: theme.statsIcons.star }]}>
              {content.length > 150 ? content.substring(0, 150) + '...' : content}
            </Text>
          )}

          <View style={styles.previewFooter}>
            <View style={styles.previewStats}>
              <View style={styles.previewStatGroup}>
                <Ionicons name="heart-outline" size={16} color={theme.statsIcons.star} />
                <Text style={[styles.previewStatText, { color: theme.statsIcons.star }]}>0</Text>
              </View>
              <View style={styles.previewStatGroup}>
                <Ionicons name="chatbubble-outline" size={16} color={theme.statsIcons.star} />
                <Text style={[styles.previewStatText, { color: theme.statsIcons.star }]}>0</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderCategorySelector()}
          {renderTitleInput()}
          {renderContentInput()}
          {renderPreview()}
        </ScrollView>
        {renderPostButton()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingBottom: 100,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  // Category Selector
  categoriesScroll: {
    marginBottom: 8,
  },
  categoryChip: {
    minWidth: 80,
  },
  categoryChipGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Input Containers
  inputContainer: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  titleInput: {
    fontSize: 16,
    fontWeight: '600',
    minHeight: 24,
  },
  contentInput: {
    fontSize: 14,
    lineHeight: 20,
    minHeight: 120,
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },

  // Preview Card
  previewCard: {
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewAuthorName: {
    fontSize: 14,
    fontWeight: '600',
  },
  previewTime: {
    fontSize: 12,
    marginTop: 2,
  },
  previewCategoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  previewCategoryText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 20,
  },
  previewContent: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 12,
  },
  previewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewStats: {
    flexDirection: 'row',
    gap: 16,
  },
  previewStatGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  previewStatText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Post Button
  postButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  postButton: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  postButtonPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});