// App.tsx (or entry file)
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { CustomThemeProvider } from '@/utils/utils';
import { setJSExceptionHandler } from 'react-native-exception-handler';

SplashScreen.preventAutoHideAsync();
export async function registerForPushNotificationsAsync() {

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return null;
    }
    const tokenData = await Notifications.getExpoPushTokenAsync();
    console.log('Expo Push Token:', tokenData.data);
    return tokenData.data;
 
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

setJSExceptionHandler((error, isFatal) => {
  // Do nothing (or log silently)
}, true);
  useEffect(() => { if (error) throw error; }, [error]);
  useEffect(() => { if (loaded) SplashScreen.hideAsync(); }, [loaded]);
  if (!loaded) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {

  return (
    <CustomThemeProvider>
        <Stack>
          <Stack.Screen name="startup" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)"   options={{ headerShown: false }} />
          <Stack.Screen name="modal"    options={{ presentation: 'modal' }} />
          <Stack.Screen name="login"    options={{ headerShown: false }} />
        </Stack>
    </CustomThemeProvider>
  );
}
