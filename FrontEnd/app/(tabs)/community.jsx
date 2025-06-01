import React, { useState, useEffect } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const communityData = {
  stats: {
    totalMembers: 12847,
    onlineNow: 234,
    postsToday: 89,
    helpfulAnswers: 1456
  },
  featuredPosts: [
    {
      id: 1,
      title: "Tips for practicing fingerspelling speed",
      author: "Sarah_ASL",
      authorAvatar: "https://i.pravatar.cc/150?img=1",
      replies: 23,
      likes: 156,
      timeAgo: "2h ago",
      category: "Practice Tips",
      preview: "I've been struggling with fingerspelling speed and found these techniques really helpful..."
    },
    {
      id: 2,
      title: "ASL poetry night - Join us this Friday!",
      author: "DeafPoetry",
      authorAvatar: "https://i.pravatar.cc/150?img=2",
      replies: 45,
      likes: 289,
      timeAgo: "4h ago",
      category: "Events",
      preview: "Our monthly ASL poetry night is coming up. All skill levels welcome..."
    },
    {
      id: 3,
      title: "Question about regional sign variations",
      author: "NewLearner22",
      authorAvatar: "https://i.pravatar.cc/150?img=3",
      replies: 12,
      likes: 67,
      timeAgo: "6h ago",
      category: "Q&A",
      preview: "I noticed some signs are different between regions. Is this common?"
    }
  ],
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

export default function Community() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('feed');

  useEffect(() => {
    const brown = '#92400E';
    navigation.setOptions({
      headerTintColor: brown,
      headerTitle: () => (
        <Text
          style={{
            color: brown,
            fontSize: 18,
            fontWeight: '600',
          }}
        >
          ASL Community
        </Text>
      ),
      headerTitleStyle: { color: brown },
      headerTitleAlign: 'left',
      headerRight: () => (
        <Pressable
          onPress={() => {/* Handle search */}}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="search" size={24} color={brown} />
        </Pressable>
      ),
    });
  }, [navigation]);

  const renderStatsCard = () => (
    <LinearGradient colors={['#92400E', '#EA580C']} style={styles.statsCard}>
      <Text style={styles.statsTitle}>Community Stats</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Ionicons name="people" size={20} color="#FDE047" />
          <Text style={styles.statNumber}>{communityData.stats.totalMembers.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="radio-button-on" size={20} color="#34D399" />
          <Text style={styles.statNumber}>{communityData.stats.onlineNow}</Text>
          <Text style={styles.statLabel}>Online Now</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="chatbubble" size={20} color="#60A5FA" />
          <Text style={styles.statNumber}>{communityData.stats.postsToday}</Text>
          <Text style={styles.statLabel}>Posts Today</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="heart" size={20} color="#F87171" />
          <Text style={styles.statNumber}>{communityData.stats.helpfulAnswers}</Text>
          <Text style={styles.statLabel}>Helpful Answers</Text>
        </View>
      </View>
    </LinearGradient>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {['feed', 'categories', 'activity'].map((tab) => (
        <Pressable
          key={tab}
          onPress={() => setActiveTab(tab)}
          style={[
            styles.tabButton,
            activeTab === tab && styles.activeTabButton
          ]}
        >
          <LinearGradient
            colors={activeTab === tab ? ['#EA580C', '#C2410C'] : ['transparent', 'transparent']}
            style={styles.tabGradient}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </LinearGradient>
        </Pressable>
      ))}
    </View>
  );
  const router = useRouter();

  const renderPostCard = (post) => (
    <Pressable 
      key={post.id} 
      style={styles.postCard}
      onPress={() =>  router.push('/communitycomponents/postDetails')}
    >
      <LinearGradient
        colors={['#FEF3C7', '#FDE68A']}
        style={styles.postGradient}
      >
        <View style={styles.postHeader}>
          <View style={styles.authorInfo}>
            <Image source={{ uri: post.authorAvatar }} style={styles.avatar} />
            <View>
              <Text style={styles.authorName}>{post.author}</Text>
              <Text style={styles.timeAgo}>{post.timeAgo}</Text>
            </View>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{post.category}</Text>
          </View>
        </View>
        
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postPreview}>{post.preview}</Text>
        
        <View style={styles.postFooter}>
          <View style={styles.postStats}>
            <View style={styles.statGroup}>
              <Ionicons name="heart-outline" size={16} color="#D97706" />
              <Text style={styles.statText}>{post.likes}</Text>
            </View>
            <View style={styles.statGroup}>
              <Ionicons name="chatbubble-outline" size={16} color="#D97706" />
              <Text style={styles.statText}>{post.replies}</Text>
            </View>
          </View>
          <Pressable style={styles.replyButton}>
            <Text style={styles.replyButtonText}>Reply</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </Pressable>
  );

  const renderCategoryCard = (category, index) => (
    <Pressable key={index} style={styles.categoryCard}>
      <LinearGradient
        colors={category.color}
        style={styles.categoryGradient}
      >
        <View style={styles.categoryContent}>
          <Ionicons name={category.icon} size={24} color="#FFFFFF" />
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.categoryCount}>{category.count} posts</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );

  const renderActivityItem = (activity, index) => (
    <View key={index} style={styles.activityItem}>
      <LinearGradient
        colors={['#FEF3C7', '#FDE68A']}
        style={styles.activityGradient}
      >
        <View style={styles.activityContent}>
          <View style={styles.activityDot} />
          <View style={styles.activityText}>
            <Text style={styles.activityUser}>{activity.user}</Text>
            <Text style={styles.activityAction}>{activity.action}</Text>
            <Text style={styles.activityTime}>{activity.time}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Posts</Text>
              <Pressable>
                <Text style={styles.seeAllText}>See All</Text>
              </Pressable>
            </View>
            {communityData.featuredPosts.map(renderPostCard)}
          </View>
        );
      
      case 'categories':
        return (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Discussion Categories</Text>
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
              <Text style={styles.sectionTitle}>Recent Activity</Text>
            </View>
            {communityData.recentActivity.map(renderActivityItem)}
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStatsCard()}
        {renderTabBar()}
        {renderContent()}
        
        {/* Floating Action Button */}
        <LinearGradient
          colors={['#EA580C', '#C2410C']}
          style={styles.fab}
        >
          <Pressable
            style={styles.fabButton}
            onPress={() => {/* Handle new post */}}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </Pressable>
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
    paddingBottom: 100,
  },

  // Stats Card Styles
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
    color: '#FED7AA',
    marginTop: 2,
  },

  // Tab Bar Styles
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#FEF3C7',
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
  activeTabButton: {},
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  activeTabText: {
    color: '#FFFFFF',
  },

  // Section Header Styles
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
    color: '#92400E',
  },
  seeAllText: {
    fontSize: 14,
    color: '#D97706',
    fontWeight: '600',
  },

  // Post Card Styles
  postCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  postGradient: {
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#D97706',
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
    color: '#92400E',
  },
  timeAgo: {
    fontSize: 12,
    color: '#D97706',
  },
  categoryBadge: {
    backgroundColor: '#92400E',
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
    color: '#92400E',
    marginBottom: 8,
    lineHeight: 20,
  },
  postPreview: {
    fontSize: 14,
    color: '#D97706',
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
    color: '#D97706',
    fontWeight: '600',
  },
  replyButton: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  replyButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // Categories Grid Styles
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
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#FED7AA',
  },

  // Activity Styles
  activityItem: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  activityGradient: {
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#EA580C',
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EA580C',
    marginRight: 12,
  },
  activityText: {
    flex: 1,
  },
  activityUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  activityAction: {
    fontSize: 13,
    color: '#D97706',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#B45309',
    marginTop: 2,
  },

  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  fabButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});