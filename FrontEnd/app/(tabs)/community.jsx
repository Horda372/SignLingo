// app/community/index.js
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCustomTheme } from '../../utils/utils';
import { lightModeColors, darkModeColors } from '../../constants/themeColors';

const API_BASE = 'http://192.168.170.235:8000/api';

export default function Community() {
  const navigation = useNavigation();
  const router = useRouter();
  const { isDark } = useCustomTheme();
  const theme = isDark ? darkModeColors : lightModeColors;

  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerTintColor: theme.numberBadge,
      headerStyle: { backgroundColor: theme.background },
      headerTitle: () => (
        <Text style={{ fontSize: 18, fontWeight: '600', color: theme.numberBadge }}>
          ASL Community
        </Text>
      ),
      headerRight: () => (
        <LinearGradient
          colors={theme.lessonCircle.current}
          style={{ width: 40, height: 40, borderRadius: 28, elevation: 8, marginRight: 25 }}
        >
          <Pressable
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => router.push('/communitycomponents/createPost')}
          >
            <Ionicons name="create-outline" size={20} color="#FFFFFF" />
          </Pressable>
        </LinearGradient>
      ),
    });
  }, [navigation, theme]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`${API_BASE}/community/posts/`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setPosts(data);
      } catch (e) {
        console.error('Failed to fetch posts', e);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const renderStatsCard = () => (
    <LinearGradient colors={theme.chapterHeaderGradient} style={styles.statsCard}>
      <Text style={styles.statsTitle}>Community Stats</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Ionicons name="people" size={20} color={theme.statsIcons.star} />
          <Text style={styles.statNumber}>{communityData.stats.totalMembers.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="radio-button-on" size={20} color={theme.statsIcons.diamond} />
          <Text style={styles.statNumber}>{communityData.stats.onlineNow}</Text>
          <Text style={styles.statLabel}>Online Now</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="chatbubble" size={20} color={theme.statsIcons.trophy} />
          <Text style={styles.statNumber}>{communityData.stats.postsToday}</Text>
          <Text style={styles.statLabel}>Posts Today</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="heart" size={20} color={theme.statsIcons.star} />
          <Text style={styles.statNumber}>{communityData.stats.helpfulAnswers}</Text>
          <Text style={styles.statLabel}>Helpful Answers</Text>
        </View>
      </View>
    </LinearGradient>
  );

  const renderTabBar = () => (
    <View style={[styles.tabBar, { backgroundColor: theme.buttonBg }]}>
      {['feed', 'categories', 'activity'].map(tab => (
        <Pressable key={tab} onPress={() => setActiveTab(tab)} style={styles.tabButton}>
          <LinearGradient
            colors={activeTab === tab ? theme.lessonCircle.current : ['transparent', 'transparent']}
            style={styles.tabGradient}
          >
            <Text style={[styles.tabText, activeTab === tab ? { color: '#FFFFFF' } : { color: theme.numberBadge }]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </LinearGradient>
        </Pressable>
      ))}
    </View>
  );

 const renderPostCard = (post) => {
  // derive title and preview text
  const title = post.Description.split('\n')[0].slice(0, 50);
  const preview =
    post.Description.length > 150
      ? post.Description.slice(0, 150) + '...'
      : post.Description;

  // guard against undefined Likes/comments
  const likeCount = post.Likes?.length ?? 0;
  const commentCount = post.comments?.length ?? 0;

  return (
 // …
<Pressable
  key={post.id}
  onPress={() =>
    router.push(`/communitycomponents/postDetails/${post.id}`)
  }
  style={styles.postCard}
>
      <LinearGradient colors={theme.cardGradient} style={styles.postGradient}>
        {/* Header: author + category */}
        <View style={styles.postHeader}>
          <View style={styles.authorInfo}>
            <Image
              source={{ uri: post.authorAvatar }}
              style={styles.avatar}
            />
            <View>
              <Text style={[styles.authorName, { color: theme.numberBadge }]}>
                {post.author}
              </Text>
              <Text style={[styles.timeAgo, { color: theme.statsIcons.star }]}>
                {new Date(post.Timestamp).toLocaleString()}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: theme.numberBadge },
            ]}
          >
            <Text style={styles.categoryText}>{post.Tag}</Text>
          </View>
        </View>

        {/* Title and preview */}
        <Text style={[styles.postTitle, { color: theme.numberBadge }]}>
          {title}
        </Text>
        <Text style={[styles.postPreview, { color: theme.statsIcons.star }]}>
          {preview}
        </Text>

        {/* Footer: likes, comments, reply */}
        <View style={styles.postFooter}>
          <View style={styles.postStats}>
            <View style={styles.statGroup}>
              <Ionicons
                name="heart-outline"
                size={16}
                color={theme.statsIcons.star}
              />
              <Text
                style={[styles.statText, { color: theme.statsIcons.star }]}
              >
                {likeCount}
              </Text>
            </View>
            <View style={styles.statGroup}>
              <Ionicons
                name="chatbubble-outline"
                size={16}
                color={theme.statsIcons.star}
              />
              <Text
                style={[styles.statText, { color: theme.statsIcons.star }]}
              >
                {commentCount}
              </Text>
            </View>
          </View>
          <Pressable
            style={[
              styles.replyButton,
              { backgroundColor: theme.lessonCircle.current[0] },
            ]}
          >
            <Text style={styles.replyButtonText}>Reply</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </Pressable>
  );
};



  const renderCategoryCard = (category, idx) => (
    <Pressable key={idx} style={styles.categoryCard}>
      <LinearGradient colors={theme.categories[category.name]} style={styles.categoryGradient}>
        <View style={styles.categoryContent}>
          <Ionicons name={category.icon} size={24} color={theme.categoryText} />
          <Text style={[styles.categoryName, { color: theme.categoryText }]}>{category.name}</Text>
          <Text style={[styles.categoryCount, { color: theme.categoryText }]}>{category.count} posts</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );

  const renderActivityItem = (activity, idx) => (
    <View key={idx} style={styles.activityItem}>
      <LinearGradient colors={theme.cardGradient} style={styles.activityGradient}>
        <View style={styles.activityContent}>
          <View style={[styles.activityDot, { backgroundColor: theme.lessonCircle.current[0] }]} />
          <View style={styles.activityText}>
            <Text style={[styles.activityUser, { color: theme.numberBadge }]}>{activity.user}</Text>
            <Text style={[styles.activityAction, { color: theme.statsIcons.star }]}>{activity.action}</Text>
            <Text style={[styles.activityTime, { color: theme.statsIcons.diamond }]}>{activity.time}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return loading
          ? <ActivityIndicator size="large" color={theme.numberBadge} style={{ marginTop: 20 }} />
          : posts.map(renderPostCard);
      case 'categories':
        return (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.numberBadge }]}>Discussion Categories</Text>
            </View>
            <View style={styles.categoriesGrid}>
              {communityData.categories.map(renderCategoryCard)}
            </View>
          </View>
        );
      case 'activity':
        return (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.numberBadge }]}>Recent Activity</Text>
            </View>
            {communityData.recentActivity.map(renderActivityItem)}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {renderStatsCard()}
      {renderTabBar()}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}
// static data
const communityData = {
  stats: {
    totalMembers: 12,
    onlineNow: 1,
    postsToday: 5,
    helpfulAnswers: 1
  },
  
  categories: [
    { name: "Practice Tips", icon: "star", count: 234, color: ['#D97706', '#92400E'] },
    { name: "Q&A", icon: "help-circle", count: 189, color: ['#EA580C', '#C2410C'] },
    { name: "Events", icon: "calendar", count: 56, color: ['#F59E0B', '#D97706'] },
    { name: "Stories", icon: "book", count: 123, color: ['#92400E', '#78350F'] },
    { name: "Resources", icon: "library", count: 91, color: ['#C2410C', '#92400E'] },
    { name: "General", icon: "chatbubbles", count: 345, color: ['#EA580C', '#D97706'] }
  ],
  recentActivity: [
    { user: "Alex_Signs", action: "answered a question in Q&A", time: "5m ago" },
    { user: "DeafCulture101", action: "shared a practice video", time: "12m ago" },
    { user: "SignMaster", action: "started a new discussion", time: "18m ago" },
    { user: "HandsUp_ASL", action: "liked your post", time: "25m ago" }
  ]
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 10,
    paddingBottom: 100,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  statsCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    minWidth: '22%',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },

  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
  },
  tabGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },

  postCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  postGradient: {
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
  },
  timeAgo: {
    fontSize: 12,
    marginTop: 2,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 20,
  },
  postPreview: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
  },
  replyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  replyButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },

  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  categoryCard: {
    width: '48%',
    marginBottom: 12,
  },
  categoryGradient: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  categoryContent: {
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
  },

  activityItem: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  activityGradient: {
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  activityText: {
    flex: 1,
  },
  activityUser: {
    fontSize: 14,
    fontWeight: '600',
  },
  activityAction: {
    fontSize: 13,
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    marginTop: 2,
  },

  fab: {
    position: 'flex',
   marginRight:25,
    width: 40,
    height: 40,
    borderRadius: 28,
    elevation: 8, // Higher elevation for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    zIndex: 999, // Ensure it stays on top
  },
  fabButton: {
    width: '100%',
    height: '100%',
    
    justifyContent: 'center',
    alignItems: 'center',
  },
});
