import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';

import { CigaretteProvider } from '@/src/context/CigaretteContext';
import { LanguageProvider } from '@/src/context/LanguageContext';
import { SubscriptionProvider } from '@/src/context/SubscriptionContext';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ErrorBoundary>
      <CigaretteProvider>
        <LanguageProvider>
          <SubscriptionProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </SubscriptionProvider>
        </LanguageProvider>
      </CigaretteProvider>
    </ErrorBoundary>
  );
}
