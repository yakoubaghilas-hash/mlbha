import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Share, Alert, Image } from 'react-native';
import { useLanguage } from '@/src/context/LanguageContext';
import i18n from '@/src/i18n';
import { useCigarette } from '@/src/context/CigaretteContext';
import { useSubscription } from '@/src/context/SubscriptionContext';

export default function TabLayout() {
  const { language, changeLanguage } = useLanguage();
  const [renderVersion, setRenderVersion] = useState(0);
  const { totalToday } = useCigarette();
  const { subscriptionStatus } = useSubscription();

  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
    setRenderVersion(v => v + 1);
  };

  const shareApp = async () => {
    try {
      await Share.share({
        message: 'Check out CigOff - A smoking cessation tracking app! Rejoignez-moi pour arrêter de fumer!',
        title: 'CigOff',
      });
    } catch (error) {
      Alert.alert('Error sharing app');
    }
  };

  const sharePerformance = async () => {
    try {
      await Share.share({
        message: `I've tracked ${totalToday} cigarettes today with Make Lost Boys Healthy Again! J'ai enregistré ${totalToday} cigarettes aujourd'hui!`,
        title: 'My Daily Performance',
      });
    } catch (error) {
      Alert.alert('Error sharing performance');
    }
  };

  return (
    <Tabs
      key={`tabs-${renderVersion}`}
      screenOptions={{
        headerShown: true,
        header: () => (
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Image
                source={require('../../logo.png')}
                style={styles.logo}
              />
              <View>
                <Text style={styles.headerTitle}>CigOff</Text>
                <Text style={styles.tagline}>One less. Every day</Text>
              </View>
            </View>
            <View style={styles.languageButtons}>
              <TouchableOpacity
                style={[
                  styles.langButton,
                  language === 'en' && styles.langButtonActive,
                ]}
                onPress={() => handleLanguageChange('en')}>
                <Text
                  style={[
                    styles.langButtonText,
                    language === 'en' && styles.langButtonTextActive,
                  ]}>
                  EN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.langButton,
                  language === 'fr' && styles.langButtonActive,
                ]}
                onPress={() => handleLanguageChange('fr')}>
                <Text
                  style={[
                    styles.langButtonText,
                    language === 'fr' && styles.langButtonTextActive,
                  ]}>
                  FR
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.langButton,
                  language === 'es' && styles.langButtonActive,
                ]}
                onPress={() => handleLanguageChange('es')}>
                <Text
                  style={[
                    styles.langButtonText,
                    language === 'es' && styles.langButtonTextActive,
                  ]}>
                  ES
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton} onPress={shareApp}>
                <Text style={styles.shareButtonText}>📱</Text>
              </TouchableOpacity>
            </View>
          </View>
        ),
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#0078D4',
        tabBarInactiveTintColor: '#cbd5e1',
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        key={`home-${language}`}
        name="index"
        options={{
          title: 'Home',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0078D4',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
    borderRadius: 4,
  },
  headerTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tagline: {
    fontSize: 11,
    color: '#e0e0e0',
    marginTop: 2,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  langButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  langButtonActive: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  langButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0078D4',
  },
  langButtonTextActive: {
    color: '#0078D4',
  },
  shareButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 16,
  },
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopColor: '#e2e8f0',
    borderTopWidth: 1,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
});
