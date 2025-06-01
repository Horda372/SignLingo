import React, { useLayoutEffect, useState } from 'react';
import { View, Text, Switch, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useNavigation } from 'expo-router';

export default function NotificationsScreen() {
  const [messageNotif, setMessageNotif] = useState(true);
  const [appUpdateNotif, setAppUpdateNotif] = useState(true);
  const [promotionNotif, setPromotionNotif] = useState(false);
  const [communityNotif, setCommunityNotif] = useState(false);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Notifications',
      headerBackTitleVisible: false,
      headerTitleAlign: 'left',
      headerLeftSpacing: 0,
      headerTitleSpacing: 0,
    });
  }, [navigation]);

  const colorScheme = useColorScheme();
  const background = Colors[colorScheme ?? 'light'].background;
  const brown = '#92400E';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.header, { color: brown }]}>Notification Settings</Text>

      {/* New Message Notifications */}
      <View style={styles.optionRow}>
        <Ionicons name="chatbubble-outline" size={24} color={brown} style={styles.icon} />
        <Text style={[styles.optionText, { color: brown }]}>New Messages</Text>
        <Switch
          value={messageNotif}
          onValueChange={setMessageNotif}
          thumbColor="#FFF"
          trackColor={{ false: '#ccc', true: brown }}
        />
      </View>

      {/* App Update Notifications */}
      <View style={styles.optionRow}>
        <Ionicons name="download-outline" size={24} color={brown} style={styles.icon} />
        <Text style={[styles.optionText, { color: brown }]}>App Updates</Text>
        <Switch
          value={appUpdateNotif}
          onValueChange={setAppUpdateNotif}
          thumbColor="#FFF"
          trackColor={{ false: '#ccc', true: brown }}
        />
      </View>

      {/* Promotions Notifications */}
      <View style={styles.optionRow}>
        <Ionicons name="pricetag-outline" size={24} color={brown} style={styles.icon} />
        <Text style={[styles.optionText, { color: brown }]}>Promotions</Text>
        <Switch
          value={promotionNotif}
          onValueChange={setPromotionNotif}
          thumbColor="#FFF"
          trackColor={{ false: '#ccc', true: brown }}
        />
      </View>

      {/* Community Updates Notifications */}
      <View style={styles.optionRow}>
        <Ionicons name="people-outline" size={24} color={brown} style={styles.icon} />
        <Text style={[styles.optionText, { color: brown }]}>Community Updates</Text>
        <Switch
          value={communityNotif}
          onValueChange={setCommunityNotif}
          thumbColor="#FFF"
          trackColor={{ false: '#ccc', true: brown }}
        />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FEF3C7',
    marginBottom: 8,
  },
  icon: {
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});
