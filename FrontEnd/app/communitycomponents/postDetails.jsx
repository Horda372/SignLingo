import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

// Mock data for the post and comments
const mockPostData = {
  id: 1,
  title: "Tips for practicing fingerspelling speed",
  author: "Sarah_ASL",
  authorAvatar: "https://i.pravatar.cc/150?img=1",
  content: "I've been struggling with fingerspelling speed and found these techniques really helpful. After months of practice, I went from 20 WPM to 60 WPM using these methods:\n\n1. Start with common words - Practice everyday words first\n2. Use a metronome - Keep steady rhythm\n3. Mirror practice - Watch yourself sign\n4. Record yourself - Review your form\n5. Practice with friends - Make it social\n\nThe key is consistency. Even 10 minutes daily makes a huge difference. What techniques have worked for you?",
  replies: 23,
  likes: 156,
  timeAgo: "2h ago",
  category: "Practice Tips",
  isLiked: false,
  isBookmarked: false,
};

const mockComments = [
  {
    id: 1,
    author: "DeafLearner99",
    authorAvatar: "https://i.pravatar.cc/150?img=4",
    content: "This is exactly what I needed! I've been stuck at 25 WPM for months. Going to try the metronome method today.",
    timeAgo: "1h ago",
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: 11,
        author: "Sarah_ASL",
        authorAvatar: "https://i.pravatar.cc/150?img=1",
        content: "The metronome really helps! Start slow and gradually increase the tempo. Good luck! 🤟",
        timeAgo: "45m ago",
        likes: 5,
        isLiked: false,
      }
    ]
  },
  {
    id: 2,
    author: "SignMaster",
    authorAvatar: "https://i.pravatar.cc/150?img=5",
    content: "Great tips! I'd also add practicing with flashcards. Making it visual helps with muscle memory.",
    timeAgo: "1h ago",
    likes: 8,
    isLiked: true,
    replies: []
  },
  {
    id: 3,
    author: "NewToASL",
    authorAvatar: "https://i.pravatar.cc/150?img=6",
    content: "Question: How long did it take you to see improvement? I'm getting discouraged after 2 weeks 😔",
    timeAgo: "45m ago",
    likes: 3,
    isLiked: false,
    replies: [
      {
        id: 31,
        author: "Sarah_ASL",
        authorAvatar: "https://i.pravatar.cc/150?img=1",
        content: "Don't give up! It took me about 6 weeks to see real improvement. The first month is the hardest but then it clicks.",
        timeAgo: "30m ago",
        likes: 7,
        isLiked: false,
      },
      {
        id: 32,
        author: "EncouragingFriend",
        authorAvatar: "https://i.pravatar.cc/150?img=7",
        content: "You've got this! 💪 Progress isn't always linear. Keep practicing and celebrate small wins!",
        timeAgo: "25m ago",
        likes: 4,
        isLiked: false,
      }
    ]
  },
  {
    id: 4,
    author: "TeacherMike",
    authorAvatar: "https://i.pravatar.cc/150?img=8",
    content: "As an ASL instructor, I can confirm these are solid techniques. I especially recommend the mirror practice - it helps students catch their own mistakes.",
    timeAgo: "30m ago",
    likes: 15,
    isLiked: false,
    replies: []
  }
];

export default function PostDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const scrollViewRef = useRef(null);
  
  // State management
  const [post, setPost] = useState(mockPostData);
  const [comments, setComments] = useState(mockComments);
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // null for main post, comment id for replies
  const [showReplyInput, setShowReplyInput] = useState(false);

  useEffect(() => {
    const brown = '#92400E';
    navigation.setOptions({
      headerTintColor: brown,
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, }}
        >
          <FontAwesome name="arrow-left" size={20} color={brown} style={{ marginRight: 8 }} />
        </Pressable>
      ),
      headerTitle: () => (
        <Text style={{ color: brown, fontSize: 16, fontWeight: '600', }}>
          Discussion
        </Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 16, marginRight: 16 }}>
          <Pressable onPress={handleBookmark}>
            <Ionicons 
              name={post.isBookmarked ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={brown} 
            />
          </Pressable>
          <Pressable onPress={() => Alert.alert('Share', 'Share functionality')}>
            <Ionicons name="share-outline" size={24} color={brown} />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, post.isBookmarked]);

  const handleLike = (type, id = null) => {
    if (type === 'post') {
      setPost(prev => ({
        ...prev,
        isLiked: !prev.isLiked,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
      }));
    } else if (type === 'comment') {
      setComments(prev => prev.map(comment => {
        if (comment.id === id) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          };
        }
        // Handle nested replies
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === id) {
                return {
                  ...reply,
                  isLiked: !reply.isLiked,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
                };
              }
              return reply;
            })
          };
        }
        return comment;
      }));
    }
  };

  const handleBookmark = () => {
    setPost(prev => ({
      ...prev,
      isBookmarked: !prev.isBookmarked
    }));
  };

  const handleReply = (commentId = null) => {
    setReplyingTo(commentId);
    setShowReplyInput(true);
    // Scroll to bottom where reply input will be
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const submitReply = () => {
    if (!replyText.trim()) return;

    const newReply = {
      id: Date.now(),
      author: "You",
      authorAvatar: "https://i.pravatar.cc/150?img=9",
      content: replyText.trim(),
      timeAgo: "just now",
      likes: 0,
      isLiked: false,
    };

    if (replyingTo === null) {
      // Reply to main post
      setComments(prev => [newReply, ...prev]);
      setPost(prev => ({ ...prev, replies: prev.replies + 1 }));
    } else {
      // Reply to a comment
      setComments(prev => prev.map(comment => {
        if (comment.id === replyingTo) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        return comment;
      }));
    }

    setReplyText('');
    setReplyingTo(null);
    setShowReplyInput(false);
  };

  const cancelReply = () => {
    setReplyText('');
    setReplyingTo(null);
    setShowReplyInput(false);
  };

  const renderPost = () => (
    <View style={styles.postContainer}>
      <LinearGradient
        colors={['#FEF3C7', '#FDE68A']}
        style={styles.postGradient}
      >
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.authorInfo}>
            <Image source={{ uri: post.authorAvatar }} style={styles.authorAvatar} />
            <View>
              <Text style={styles.authorName}>{post.author}</Text>
              <Text style={styles.timeAgo}>{post.timeAgo}</Text>
            </View>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{post.category}</Text>
          </View>
        </View>

        {/* Post Title */}
        <Text style={styles.postTitle}>{post.title}</Text>

        {/* Post Content */}
        <Text style={styles.postContent}>{post.content}</Text>

        {/* Post Actions */}
        <View style={styles.postActions}>
          <View style={styles.actionGroup}>
            <Pressable 
              style={styles.actionButton}
              onPress={() => handleLike('post')}
            >
              <Ionicons 
                name={post.isLiked ? "heart" : "heart-outline"} 
                size={20} 
                color={post.isLiked ? "#DC2626" : "#D97706"} 
              />
              <Text style={[styles.actionText, post.isLiked && styles.likedText]}>
                {post.likes}
              </Text>
            </Pressable>
            
            <Pressable 
              style={styles.actionButton}
              onPress={() => handleReply(null)}
            >
              <Ionicons name="chatbubble-outline" size={20} color="#D97706" />
              <Text style={styles.actionText}>{post.replies}</Text>
            </Pressable>
          </View>

          <Pressable 
            style={styles.replyButton}
            onPress={() => handleReply(null)}
          >
            <Text style={styles.replyButtonText}>Reply</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );

  const renderComment = (comment, isNested = false) => (
    <View key={comment.id} style={[styles.commentContainer, isNested && styles.nestedComment]}>
      <LinearGradient
        colors={isNested ? ['#F3F4F6', '#E5E7EB'] : ['#FEF3C7', '#FDE68A']}
        style={styles.commentGradient}
      >
        <View style={styles.commentHeader}>
          <View style={styles.authorInfo}>
            <Image source={{ uri: comment.authorAvatar }} style={styles.commentAvatar} />
            <View>
              <Text style={styles.commentAuthor}>{comment.author}</Text>
              <Text style={styles.commentTime}>{comment.timeAgo}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.commentContent}>{comment.content}</Text>

        <View style={styles.commentActions}>
          <Pressable 
            style={styles.actionButton}
            onPress={() => handleLike('comment', comment.id)}
          >
            <Ionicons 
              name={comment.isLiked ? "heart" : "heart-outline"} 
              size={16} 
              color={comment.isLiked ? "#DC2626" : "#D97706"} 
            />
            <Text style={[styles.commentActionText, comment.isLiked && styles.likedText]}>
              {comment.likes}
            </Text>
          </Pressable>

          {!isNested && (
            <Pressable 
              style={styles.actionButton}
              onPress={() => handleReply(comment.id)}
            >
              <Ionicons name="return-down-forward-outline" size={16} color="#D97706" />
              <Text style={styles.commentActionText}>Reply</Text>
            </Pressable>
          )}
        </View>
      </LinearGradient>

      {/* Render nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {comment.replies.map(reply => renderComment(reply, true))}
        </View>
      )}
    </View>
  );

  const renderReplyInput = () => {
    if (!showReplyInput) return null;

    const replyingToComment = replyingTo ? comments.find(c => c.id === replyingTo) : null;

    return (
      <View style={styles.replyInputContainer}>
        <LinearGradient
          colors={['#EA580C', '#C2410C']}
          style={styles.replyInputGradient}
        >
          {replyingToComment && (
            <Text style={styles.replyingToText}>
              Replying to @{replyingToComment.author}
            </Text>
          )}
          
          <View style={styles.inputRow}>
            <TextInput
              style={styles.replyInput}
              placeholder={replyingTo ? "Write a reply..." : "Share your thoughts..."}
              placeholderTextColor="#B45309"
              value={replyText}
              onChangeText={setReplyText}
              multiline
              maxLength={500}
            />
          </View>

          <View style={styles.replyActions}>
            <Text style={styles.charCount}>{replyText.length}/500</Text>
            <View style={styles.replyButtons}>
              <Pressable style={styles.cancelButton} onPress={cancelReply}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable 
                style={[styles.submitButton, !replyText.trim() && styles.disabledButton]} 
                onPress={submitReply}
                disabled={!replyText.trim()}
              >
                <Text style={styles.submitButtonText}>
                  {replyingTo ? 'Reply' : 'Comment'}
                </Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderPost()}

          {/* Comments Section Header */}
          <View style={styles.commentsHeader}>
            <Text style={styles.commentsTitle}>
              Comments ({comments.length})
            </Text>
          </View>

          {/* Comments List */}
          {comments.map(comment => renderComment(comment))}

          {/* Empty state if no comments */}
          {comments.length === 0 && (
            <View style={styles.emptyComments}>
              <LinearGradient
                colors={['#F3F4F6', '#E5E7EB']}
                style={styles.emptyGradient}
              >
                <Ionicons name="chatbubbles-outline" size={48} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>No comments yet</Text>
                <Text style={styles.emptyText}>Be the first to share your thoughts!</Text>
              </LinearGradient>
            </View>
          )}
        </ScrollView>

        {renderReplyInput()}
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
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 20,
  },

  // Post Styles
  postContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  postGradient: {
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#D97706',
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
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
  },
  timeAgo: {
    fontSize: 12,
    color: '#D97706',
    marginTop: 2,
  },
  categoryBadge: {
    backgroundColor: '#92400E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 12,
    lineHeight: 24,
  },
  postContent: {
    fontSize: 15,
    color: '#D97706',
    lineHeight: 22,
    marginBottom: 20,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#FDE68A',
  },
  actionGroup: {
    flexDirection: 'row',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#D97706',
    fontWeight: '600',
  },
  likedText: {
    color: '#DC2626',
  },
  replyButton: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  replyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Comments Section
  commentsHeader: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#FDE68A',
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
  },

  // Comment Styles
  commentContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  nestedComment: {
    marginLeft: 32,
    marginTop: 8,
  },
  commentGradient: {
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#D97706',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
  },
  commentHeader: {
    marginBottom: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  commentTime: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 1,
  },
  commentContent: {
    fontSize: 14,
    color: '#D97706',
    lineHeight: 20,
    marginBottom: 12,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 16,
  },
  commentActionText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '500',
  },
  repliesContainer: {
    marginTop: 8,
  },

  // Reply Input Styles
  replyInputContainer: {
    margin: 16,
    marginTop: 0,
  },
  replyInputGradient: {
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  replyingToText: {
    fontSize: 12,
    color: '#FED7AA',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  inputRow: {
    marginBottom: 12,
  },
  replyInput: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#92400E',
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  replyActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    fontSize: 12,
    color: '#FED7AA',
  },
  replyButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  cancelButtonText: {
    color: '#FED7AA',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#92400E',
    fontSize: 14,
    fontWeight: '600',
  },

  // Empty State
  emptyComments: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  emptyGradient: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});