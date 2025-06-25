// app/community/PostDetailScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCustomTheme } from '../../../utils/utils';
import { lightModeColors, darkModeColors } from '../../../constants/themeColors';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useSearchParams } from 'expo-router/build/hooks';

const API_BASE = 'http://192.168.170.235:8000/api';

export default function PostDetailScreen({  route }) {
const { postId } = useLocalSearchParams();
  const scrollViewRef = useRef(null);
  console.log(postId)
  const { isDark } = useCustomTheme();
  const navigation =useNavigation()
  const theme = isDark ? darkModeColors : lightModeColors;

  const [userId, setUserId] = useState(null);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReplyInput, setShowReplyInput] = useState(false);
  // Helper function to format timestamp
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - postTime) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // fetch current user ID
  useEffect(() => {
    AsyncStorage.getItem('user').then(raw => {
      if (raw) {
        const u = JSON.parse(raw);
        setUserId(u.id);
      }
    });
  }, []);

  // configure header
  useEffect(() => {
    navigation.setOptions({
      headerTintColor: theme.numberBadge,
      headerStyle: { backgroundColor: theme.background },
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.numberBadge} />
        </Pressable>
      ),
      headerTitle: () => <Text style={{ fontSize: 18, fontWeight: '600', color: theme.numberBadge }}>Discussion</Text>,
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
          <Pressable onPress={handleBookmark}>
            <Ionicons
              name={post?.isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={theme.numberBadge}
            />
          </Pressable>
          <Pressable onPress={() => Alert.alert('Share', 'Share functionality')}>
            <Ionicons name="share-outline" size={24} color={theme.numberBadge} />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, theme, post?.isBookmarked]);

  // fetch post + comments
  useEffect(() => {
    if (!postId) return;
    async function fetchData() {
      try {
        // try single-endpoint if exists
        const res = await fetch(`${API_BASE}/community/posts/${postId}/`);
        if (res.ok) {
          const data = await res.json();
          
          // Transform the data to match component expectations
          const transformedPost = {
            id: data.id,
            author: data.UserName,
            authorAvatar: `https://i.pravatar.cc/150?img=${data.User}`,
            title: data.Description, // Using Description as title since there's no separate title
            content: data.Description,
            timeAgo: formatTimeAgo(data.Timestamp),
            category: data.Tag,
            likes: data.Likes?.length || 0,
            isLiked: data.Likes?.some(like => like.User === userId) || false,
            replies: data.Comments?.length || 0,
            isBookmarked: false
          };
          
          // Transform comments
          const transformedComments = data.Comments?.map(comment => ({
            id: comment.id,
            author: comment.UserName,
            authorAvatar: `https://i.pravatar.cc/150?img=${comment.User}`,
            content: comment.Text,
            timeAgo: formatTimeAgo(comment.Timestamp),
            likes: comment.Likes?.length || 0,
            isLiked: comment.Likes?.some(like => like.User === userId) || false,
            replies: comment.Replies?.map(reply => ({
              id: reply.id,
              author: reply.UserName || 'User',
              authorAvatar: `https://i.pravatar.cc/150?img=${reply.User || 1}`,
              content: reply.Text,
              timeAgo: formatTimeAgo(reply.Timestamp),
              likes: reply.Likes?.length || 0,
              isLiked: reply.Likes?.some(like => like.User === userId) || false,
            })) || []
          })) || [];
          
          setPost(transformedPost);
          setComments(transformedComments);
        } else {
          // fallback: fetch all and filter
          const list = await fetch(`${API_BASE}/community/posts/`).then(r => r.json());
          const found = list.find(p => p.id === Number(postId));
          if (found) {
            const transformedPost = {
              id: found.id,
              author: found.UserName,
              authorAvatar: `https://i.pravatar.cc/150?img=${found.User}`,
              title: found.Description,
              content: found.Description,
              timeAgo: formatTimeAgo(found.Timestamp),
              category: found.Tag,
              likes: found.Likes?.length || 0,
              isLiked: found.Likes?.some(like => like.User === userId) || false,
              replies: found.Comments?.length || 0,
              isBookmarked: false
            };
            setPost(transformedPost);
            setComments(found.Comments?.map(comment => ({
              id: comment.id,
              author: comment.UserName,
              authorAvatar: `https://i.pravatar.cc/150?img=${comment.User}`,
              content: comment.Text,
              timeAgo: formatTimeAgo(comment.Timestamp),
              likes: comment.Likes?.length || 0,
              isLiked: comment.Likes?.some(like => like.User === userId) || false,
              replies: comment.Replies?.map(reply => ({
                id: reply.id,
                author: reply.UserName || 'User',
                authorAvatar: `https://i.pravatar.cc/150?img=${reply.User || 1}`,
                content: reply.Text,
                timeAgo: formatTimeAgo(reply.Timestamp),
                likes: reply.Likes?.length || 0,
                isLiked: reply.Likes?.some(like => like.User === userId) || false,
              })) || []
            })) || []);
          }
        }
      } catch (e) {
        console.error('Error fetching post', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [postId, userId]);

  // Remove the duplicate useEffect - keeping only one
  // useEffect(() => {
  //   let isMounted = true;
  //   // ... duplicate code removed
  // }, [postId]);

  // toggle post like
  const handleLikePost = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_BASE}/community/posts/${postId}/toggle-like/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      const json = await res.json();
      setPost(p => ({
        ...p,
        isLiked: json.liked,
        likes: json.like_count,
      }));
    } catch (e) {
      console.error('Like post failed', e);
    }
  };

  // toggle comment like
  const handleLikeComment = async (commentId) => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_BASE}/community/comments/${commentId}/toggle-like/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      const json = await res.json();
      // update comments tree
      setComments(cs =>
        cs.map(c => {
          if (c.id === commentId) {
            return { ...c, isLiked: json.liked, likes: json.like_count };
          }
          if (c.replies) {
            return {
              ...c,
              replies: c.replies.map(r =>
                r.id === commentId
                  ? { ...r, isLiked: json.liked, likes: json.like_count }
                  : r
              ),
            };
          }
          return c;
        })
      );
    } catch (e) {
      console.error('Like comment failed', e);
    }
  };

  // bookmark toggle (local only)
  const handleBookmark = () => {
    setPost(p => ({ ...p, isBookmarked: !p.isBookmarked }));
  };

  // prepare reply
  const handleReply = (commentId = null) => {
    setReplyingTo(commentId);
    setShowReplyInput(true);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };
useEffect(() => {
  AsyncStorage.getItem('user').then(raw => {
    if (raw) {
      const u = JSON.parse(raw);
      setUserId(u.id);
    }
  });
}, []);
  // submit new comment or reply
 const submitReply = async () => {
  console.log('submitReply start', { 
    replyText: replyText, 
    userId: userId, 
    postId: postId,
    replyingTo: replyingTo 
  });
  
  // Validation checks
  if (!replyText.trim()) {
    console.warn('Reply text is empty');
    Alert.alert('Error', 'Please enter a comment');
    return;
  }
  
  if (!userId) {
    console.warn('User ID is missing');
    Alert.alert('Error', 'User not found. Please try logging in again.');
    return;
  }
  
  if (!postId) {
    console.warn('Post ID is missing');
    Alert.alert('Error', 'Post not found');
    return;
  }

  try {
    const payload = {
      Post: Number(postId),
      User: Number(userId), // Ensure userId is a number
      Text: replyText.trim(),
      Parent: replyingTo ? Number(replyingTo) : null, // Handle null vs number
    };
    
    console.log('Sending payload:', payload);
    console.log('API URL:', `${API_BASE}/community/comments/create/`);
    
    const res = await fetch(`${API_BASE}/community/comments/create/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json' // Add Accept header
      },
      body: JSON.stringify(payload),
    });
    
    console.log('Response status:', res.status);
    console.log('Response ok:', res.ok);
    
    // Check if response is ok
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Server error response:', errorText);
      throw new Error(`Server error: ${res.status} - ${errorText}`);
    }
    
    const json = await res.json();
    console.log('Response JSON:', json);
    
    // Check if the response has the expected structure
    if (!json.id) {
      console.error('Invalid response structure:', json);
      throw new Error('Invalid response from server');
    }
    
    const newComment = {
      id: json.id,
      author: 'You',
      authorAvatar: 'https://i.pravatar.cc/150?img=9',
      content: json.Text || replyText.trim(), // Fallback to original text
      timeAgo: 'just now',
      likes: 0,
      isLiked: false,
      replies: [],
    };
    
    console.log('Creating new comment:', newComment);
    
    if (replyingTo) {
      // Adding reply to existing comment
      console.log('Adding reply to comment:', replyingTo);
      setComments(cs =>
        cs.map(c =>
          c.id === replyingTo
            ? { ...c, replies: [...(c.replies || []), newComment] }
            : c
        )
      );
    } else {
      // Adding new top-level comment
      console.log('Adding new top-level comment');
      setComments(cs => [newComment, ...cs]);
      setPost(p => ({ ...p, replies: (p.replies || 0) + 1 }));
    }
    
    cancelReply();
    console.log('Reply submitted successfully');
    
  } catch (error) {
    console.error('Error in submitReply:', error);
    console.error('Error stack:', error.stack);
    
    // Show more specific error messages
    if (error.message.includes('Network request failed')) {
      Alert.alert('Network Error', 'Please check your internet connection and try again.');
    } else if (error.message.includes('Server error')) {
      Alert.alert('Server Error', 'There was a problem with the server. Please try again later.');
    } else {
      Alert.alert('Error', `Failed to submit reply: ${error.message}`);
    }
  }
};


  const cancelReply = () => {
    setReplyText('');
    setReplyingTo(null);
    setShowReplyInput(false);
  };

  // render post header/content/actions
 const renderPost = () => {
  if (loading) return <ActivityIndicator size="large" color={theme.numberBadge} />;
  if (!post) return <Text style={{ color: theme.numberBadge }}>Post not found.</Text>;

  return (
    <View style={styles.postContainer}>
      <LinearGradient colors={theme.cardGradient} style={styles.postGradient}>
        {/* header */}
        <View style={styles.postHeader}>
          <View style={styles.authorInfo}>
            <Image
              source={{ uri: post.authorAvatar }}
              style={styles.authorAvatar}
            />
            <View>
              <Text style={[styles.authorName, { color: theme.numberBadge }]}>
                {post.author}
              </Text>
              <Text style={[styles.timeAgo, { color: theme.statsIcons.star }]}>
                {post.timeAgo}
              </Text>
            </View>
          </View>
          <View style={[styles.categoryBadge, { backgroundColor: theme.numberBadge }]}>
            <Text style={styles.categoryText}>{post.category}</Text>
          </View>
        </View>

        {/* title & content */}
        <Text style={[styles.postTitle, { color: theme.numberBadge }]}>
          {post.title}
        </Text>
        <Text style={[styles.postContent, { color: theme.statsIcons.star }]}>
          {post.content}
        </Text>

        {/* actions */}
        <View style={styles.postActions}>
          <View style={styles.actionGroup}>
            <Pressable style={styles.actionButton} onPress={handleLikePost}>
              <Ionicons
                name={post.isLiked ? 'heart' : 'heart-outline'}
                size={20}
                color={post.isLiked ? theme.resetButton : theme.statsIcons.star}
              />
              <Text
                style={[
                  styles.actionText,
                  post.isLiked && styles.likedText,
                  { color: post.isLiked ? theme.resetButton : theme.statsIcons.star },
                ]}>
                {post.likes}
              </Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={() => handleReply(null)}>
              <Ionicons
                name="chatbubble-outline"
                size={20}
                color={theme.statsIcons.star}
              />
              <Text style={[styles.actionText, { color: theme.statsIcons.star }]}>
                {post.replies}
              </Text>
            </Pressable>
          </View>
          <Pressable
            style={[styles.replyButton, { backgroundColor: theme.lessonCircle.current[0] }]}
            onPress={() => handleReply(null)}>
            <Text style={styles.replyButtonText}>Reply</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
};


  // render each comment & nested replies
const renderComment = (comment, nested = false) => (
  <View
    key={comment.id}
    style={[styles.commentContainer, nested && styles.nestedComment]}
  >
    <Pressable onPress={() => handleCommentPress(comment.id)}>
      <LinearGradient
        colors={theme.cardGradient}
        style={[styles.commentGradient, { borderLeftColor: theme.cardBorder }]}
      >
        <View style={styles.commentHeader}>
          <View style={styles.authorInfo}>
            <Image
              source={{ uri: comment.authorAvatar }}
              style={styles.commentAvatar}
            />
            <View>
              <Text style={[styles.commentAuthor, { color: theme.numberBadge }]}>
                {comment.author}
              </Text>
              <Text style={[styles.commentTime, { color: theme.statsIcons.diamond }]}>
                {comment.timeAgo}
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.commentContent, { color: theme.statsIcons.star }]}>
          {comment.content}
        </Text>

        <View style={styles.commentActions}>
          <Pressable
            style={styles.actionButton}
            onPress={() => handleLikeComment(comment.id)}
          >
            <Ionicons
              name={comment.isLiked ? 'heart' : 'heart-outline'}
              size={16}
              color={comment.isLiked ? theme.resetButton : theme.statsIcons.star}
            />
            <Text
              style={[
                styles.commentActionText,
                comment.isLiked && styles.likedText,
                { color: comment.isLiked ? theme.resetButton : theme.statsIcons.star },
              ]}
            >
              {comment.likes}
            </Text>
          </Pressable>

          {!nested && (
            <Pressable
              style={styles.actionButton}
              onPress={() => handleReply(comment.id)}
            >
              <Ionicons
                name="return-down-forward-outline"
                size={16}
                color={theme.statsIcons.star}
              />
              <Text style={[styles.commentActionText, { color: theme.statsIcons.star }]}>
                Reply
              </Text>
            </Pressable>
          )}
        </View>
      </LinearGradient>
    </Pressable>

    {comment.replies?.length > 0 && (
      <View style={styles.repliesContainer}>
        {comment.replies.map(r => renderComment(r, true))}
      </View>
    )}
  </View>
);



  // reply input at bottom
  const renderReplyInput = () => {
  if (!showReplyInput) return null;
  
  console.log('Rendering reply input, replyText:', replyText);
  
  return (
    <View style={{ padding: 16, backgroundColor: theme.background }}>
      <TextInput
        value={replyText}
        onChangeText={(text) => {
          console.log('Text input changed:', text);
          setReplyText(text);
        }}
        placeholder={replyingTo ? 'Write a reply…' : 'Add a comment…'}
        placeholderTextColor={theme.statsIcons.diamond}
        multiline
        style={{ 
          backgroundColor: 'white', // Use white background for visibility
          padding: 12, 
          borderRadius: 12, 
          color: 'black', // Use black text for visibility
          maxHeight: 100,
         marginBottom:30,
          borderWidth: 1,
          borderColor: '#ccc',
          minHeight: 40
        }}
        autoFocus={true}
      />
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginTop: 12,
        alignItems: 'center'
      }}>
        <TouchableOpacity 
          onPress={() => {
            console.log('Cancel pressed');
            cancelReply();
          }}
          style={{
            padding: 8
          }}
        >
          <Text style={{ 
            color: theme.statsIcons.diamond || '#666', 
            fontWeight: '600' 
          }}>
            Cancel
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => {
            console.log('SUBMIT BUTTON PRESSED!');
            console.log('replyText:', replyText);
            console.log('userId:', userId);
            console.log('postId:', postId);
            submitReply();
          }}
          style={{ 
            backgroundColor: '#007AFF', // Use a solid blue color
            paddingHorizontal: 16, 
            paddingVertical: 10, 
            marginBottom:30,
            borderRadius: 8,
            minWidth: 80,
            alignItems: 'center'
          }}
        >
          <Text style={{ 
            color: 'white', 
            fontWeight: '600',
            fontSize: 16
          }}>
            {replyingTo ? 'Reply' : 'Comment'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView ref={scrollViewRef} contentContainerStyle={{ padding: 16 }}>
          {renderPost()}
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.numberBadge, marginTop: 24 }}>
            Comments ({comments.length})
          </Text>
          {comments.map(c => renderComment(c))}
        </ScrollView>
        {renderReplyInput()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardContainer: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingVertical: 16, paddingBottom: 20 },

  headerTitle: { fontSize: 16, fontWeight: '600' },

  postContainer: { marginHorizontal: 16, marginBottom: 20 },
  postGradient: {
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorInfo: { flexDirection: 'row', alignItems: 'center' },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorName: { fontSize: 16, fontWeight: 'bold' },
  timeAgo: { fontSize: 12, marginTop: 2 },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: { fontSize: 12, fontWeight: '600', color: '#FFF' },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 24,
  },
  postContent: { fontSize: 15, lineHeight: 22, marginBottom: 20 },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  actionGroup: { flexDirection: 'row', gap: 20 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontSize: 14, fontWeight: '600' },
  likedText: {},
  replyButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  replyButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },

  commentsHeader: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
  },
  commentsTitle: { fontSize: 18, fontWeight: 'bold' },

  commentContainer: { marginHorizontal: 16, marginBottom: 12 },
  nestedComment: { marginLeft: 32, marginTop: 8 },
  commentGradient: {
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  commentHeader: { marginBottom: 8 },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  commentAuthor: { fontSize: 14, fontWeight: '600' },
  commentTime: { fontSize: 11, marginTop: 1 },
  commentContent: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  commentActions: { flexDirection: 'row', gap: 16 },
  commentActionText: { fontSize: 12, fontWeight: '500' },
  repliesContainer: { marginTop: 8 },

  replyInputContainer: { margin: 16, marginTop: 0 },
  replyInputGradient: {
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  replyingToText: { fontSize: 12, marginBottom: 8, fontStyle: 'italic' },
  replyInput: {
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  replyActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: { fontSize: 12 },
  replyButtons: { flexDirection: 'row', gap: 12 },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelButtonText: { fontSize: 14, fontWeight: '600' },
  submitButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  disabledButton: { opacity: 0.5 },
  submitButtonText: { fontSize: 14, fontWeight: '600' },

  emptyComments: { marginHorizontal: 16, marginTop: 20 },
  emptyGradient: { padding: 40, borderRadius: 16, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 12, marginBottom: 4 },
  emptyText: { fontSize: 14, textAlign: 'center' },
})