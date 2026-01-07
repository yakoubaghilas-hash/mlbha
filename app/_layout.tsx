import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { CigaretteProvider } from '@/src/context/CigaretteContext';
import { LanguageProvider } from '@/src/context/LanguageContext';
import { SubscriptionProvider } from '@/src/context/SubscriptionContext';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';

// Import reanimated at the end to avoid early initialization
try {
  require('react-native-reanimated');
} catch (e) {
  // Ignore reanimated errors
}

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ErrorBoundary>
      <SubscriptionProvider>
        <LanguageProvider>
          <CigaretteProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </CigaretteProvider>
        </LanguageProvider>
      </SubscriptionProvider>
    </ErrorBoundary>
  );
}
