// TabLayout.tsx
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import { useCustomTheme } from '@/utils/utils';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { colors } = useCustomTheme();

  return (
    <Tabs
      screenOptions={{
        // TabBar styling
        tabBarActiveTintColor: colors.auth.switchLink,
        tabBarInactiveTintColor: colors.auth.placeholder,
        tabBarStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="browse"
        options={{
          title: 'Browse',                // tab label
          headerShown: true,              // show header
          headerTitle: 'Browse Lessons',  // header title
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          headerShown: true,
          headerTitle: 'Community Feed',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          tabBarIcon: ({ color }) => <TabBarIcon name="comments" color={color} />,
        }}
      />

      <Tabs.Screen
        name="videoPractice"
        options={{
          title: 'Practice',
          headerShown: true,
          headerTitle: 'Video Practice',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textSecondary,
          tabBarIcon: ({ color }) => <TabBarIcon name="trophy" color={color} />,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: true,
          headerTitle: 'Settings',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textSecondary,
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
          headerRight: () => (
            <Link href="/settings" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="cog"
                    size={25}
                    color={colors.auth.switchLink}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
    </Tabs>
  );
}
