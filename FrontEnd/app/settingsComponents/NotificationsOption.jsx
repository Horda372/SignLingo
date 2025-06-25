// NotificationsScreen.js
import React, { useLayoutEffect, useState } from 'react';
import { View, Text, Switch, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useCustomTheme } from '../../utils/utils';
import { lightModeColors, darkModeColors } from '../../constants/themeColors';

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const { isDark } = useCustomTheme();
  const theme = isDark ? darkModeColors : lightModeColors;

  const [messageNotif, setMessageNotif] = useState(true);
  const [appUpdateNotif, setAppUpdateNotif] = useState(true);
  const [promotionNotif, setPromotionNotif] = useState(false);
  const [communityNotif, setCommunityNotif] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Notifications',
      headerBackTitleVisible: false,
      headerTitleAlign: 'left',
      headerLeftSpacing: 0,
      headerTitleSpacing: 0,
      headerTintColor: theme.numberBadge,
      headerStyle: { backgroundColor: theme.background },
      headerTitleStyle: { color: theme.numberBadge },
    });
  }, [navigation, theme]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.header, { color: theme.numberBadge }]}>
        Notification Settings
      </Text>

      {/* New Message Notifications */}
      <View style={[styles.optionRow, { backgroundColor: theme.buttonBg }]}>
        <Ionicons name="chatbubble-outline" size={24} color={theme.numberBadge} style={styles.icon} />
        <Text style={[styles.optionText, { color: theme.numberBadge }]}>
          New Messages
        </Text>
        <Switch
          value={messageNotif}
          onValueChange={setMessageNotif}
          thumbColor="#FFF"
          trackColor={{ false: '#ccc', true: theme.numberBadge }}
        />
      </View>

      {/* App Update Notifications */}
      <View style={[styles.optionRow, { backgroundColor: theme.buttonBg }]}>
        <Ionicons name="download-outline" size={24} color={theme.numberBadge} style={styles.icon} />
        <Text style={[styles.optionText, { color: theme.numberBadge }]}>
          App Updates
        </Text>
        <Switch
          value={appUpdateNotif}
          onValueChange={setAppUpdateNotif}
          thumbColor="#FFF"
          trackColor={{ false: '#ccc', true: theme.numberBadge }}
        />
      </View>

      {/* Promotions Notifications */}
      <View style={[styles.optionRow, { backgroundColor: theme.buttonBg }]}>
        <Ionicons name="pricetag-outline" size={24} color={theme.numberBadge} style={styles.icon} />
        <Text style={[styles.optionText, { color: theme.numberBadge }]}>
          Promotions
        </Text>
        <Switch
          value={promotionNotif}
          onValueChange={setPromotionNotif}
          thumbColor="#FFF"
          trackColor={{ false: '#ccc', true: theme.numberBadge }}
        />
      </View>

      {/* Community Updates Notifications */}
      <View style={[styles.optionRow, { backgroundColor: theme.buttonBg }]}>
        <Ionicons name="people-outline" size={24} color={theme.numberBadge} style={styles.icon} />
        <Text style={[styles.optionText, { color: theme.numberBadge }]}>
          Community Updates
        </Text>
        <Switch
          value={communityNotif}
          onValueChange={setCommunityNotif}
          thumbColor="#FFF"
          trackColor={{ false: '#ccc', true: theme.numberBadge }}
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
