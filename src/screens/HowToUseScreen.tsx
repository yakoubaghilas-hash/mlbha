import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import i18n from '../i18n';

export const HowToUseScreen: React.FC = () => {
  const { language } = useLanguage();

  const translations = useMemo(() => ({
    title: i18n.t('how_to_use_title'),
    welcome: i18n.t('how_to_use_welcome'),
    
    section1_title: i18n.t('how_to_use_section1_title'),
    section1_desc: i18n.t('how_to_use_section1_desc'),
    section1_step1: i18n.t('how_to_use_section1_step1'),
    section1_step2: i18n.t('how_to_use_section1_step2'),
    section1_step3: i18n.t('how_to_use_section1_step3'),
    
    section2_title: i18n.t('how_to_use_section2_title'),
    section2_desc: i18n.t('how_to_use_section2_desc'),
    section2_step1: i18n.t('how_to_use_section2_step1'),
    section2_step2: i18n.t('how_to_use_section2_step2'),
    section2_step3: i18n.t('how_to_use_section2_step3'),
    
    section3_title: i18n.t('how_to_use_section3_title'),
    section3_desc: i18n.t('how_to_use_section3_desc'),
    section3_step1: i18n.t('how_to_use_section3_step1'),
    section3_step2: i18n.t('how_to_use_section3_step2'),
    section3_step3: i18n.t('how_to_use_section3_step3'),
    
    section4_title: i18n.t('how_to_use_section4_title'),
    section4_desc: i18n.t('how_to_use_section4_desc'),
    section4_step1: i18n.t('how_to_use_section4_step1'),
    section4_step2: i18n.t('how_to_use_section4_step2'),
    section4_step3: i18n.t('how_to_use_section4_step3'),
    
    section5_title: i18n.t('how_to_use_section5_title'),
    section5_desc: i18n.t('how_to_use_section5_desc'),
    section5_tip1: i18n.t('how_to_use_section5_tip1'),
    section5_tip2: i18n.t('how_to_use_section5_tip2'),
    section5_tip3: i18n.t('how_to_use_section5_tip3'),

    upcoming_title: i18n.t('how_to_use_upcoming_title'),
    upcoming_desc: i18n.t('how_to_use_upcoming_desc'),
    upcoming_feature1: i18n.t('how_to_use_upcoming_feature1'),
    upcoming_feature2: i18n.t('how_to_use_upcoming_feature2'),
    upcoming_feature3: i18n.t('how_to_use_upcoming_feature3'),
    upcoming_feature4: i18n.t('how_to_use_upcoming_feature4'),
    upcoming_feature5: i18n.t('how_to_use_upcoming_feature5'),
    upcoming_feature6: i18n.t('how_to_use_upcoming_feature6'),
    
    faq_title: i18n.t('how_to_use_faq_title'),
    faq_q1: i18n.t('how_to_use_faq_q1'),
    faq_a1: i18n.t('how_to_use_faq_a1'),
    faq_q2: i18n.t('how_to_use_faq_q2'),
    faq_a2: i18n.t('how_to_use_faq_a2'),
  }), [language]);

  const Section = ({ title, description, items }: { title: string; description: string; items: string[] }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionDescription}>{description}</Text>
      <View style={styles.itemsList}>
        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemNumber}>{index + 1}</Text>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const FAQ = ({ question, answer }: { question: string; answer: string }) => (
    <View style={styles.faqItem}>
      <Text style={styles.faqQuestion}>❓ {question}</Text>
      <Text style={styles.faqAnswer}>{answer}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{translations.title}</Text>
        <Text style={styles.welcome}>{translations.welcome}</Text>
      </View>

      {/* Track Daily Cigarettes */}
      <Section
        title={translations.section1_title}
        description={translations.section1_desc}
        items={[
          translations.section1_step1,
          translations.section1_step2,
          translations.section1_step3,
        ]}
      />

      {/* Track Reasons */}
      <Section
        title={translations.section2_title}
        description={translations.section2_desc}
        items={[
          translations.section2_step1,
          translations.section2_step2,
          translations.section2_step3,
        ]}
      />

      {/* Add Strategies */}
      <Section
        title={translations.section3_title}
        description={translations.section3_desc}
        items={[
          translations.section3_step1,
          translations.section3_step2,
          translations.section3_step3,
        ]}
      />

      {/* Reduction Plan */}
      <Section
        title={translations.section4_title}
        description={translations.section4_desc}
        items={[
          translations.section4_step1,
          translations.section4_step2,
          translations.section4_step3,
        ]}
      />

      {/* Tips Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 {translations.section5_title}</Text>
        <Text style={styles.sectionDescription}>{translations.section5_desc}</Text>
        <View style={styles.tipsContainer}>
          <View style={styles.tipBox}>
            <Text style={styles.tipTitle}>✨ {translations.section5_tip1}</Text>
          </View>
          <View style={styles.tipBox}>
            <Text style={styles.tipTitle}>📊 {translations.section5_tip2}</Text>
          </View>
          <View style={styles.tipBox}>
            <Text style={styles.tipTitle}>🎯 {translations.section5_tip3}</Text>
          </View>
        </View>
      </View>

      {/* Upcoming Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 {translations.upcoming_title}</Text>
        <Text style={styles.sectionDescription}>{translations.upcoming_desc}</Text>
        <View style={styles.tipsContainer}>
          <View style={styles.featureBox}>
            <Text style={styles.featureTitle}>🧠 {translations.upcoming_feature1}</Text>
          </View>
          <View style={styles.featureBox}>
            <Text style={styles.featureTitle}>⌚ {translations.upcoming_feature2}</Text>
          </View>
          <View style={styles.featureBox}>
            <Text style={styles.featureTitle}>🤝 {translations.upcoming_feature3}</Text>
          </View>
          <View style={styles.featureBox}>
            <Text style={styles.featureTitle}>🎭 {translations.upcoming_feature4}</Text>
          </View>
          <View style={styles.featureBox}>
            <Text style={styles.featureTitle}>🏆 {translations.upcoming_feature5}</Text>
          </View>
          <View style={styles.featureBox}>
            <Text style={styles.featureTitle}>🔒 {translations.upcoming_feature6}</Text>
          </View>
        </View>
      </View>

      {/* FAQ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{translations.faq_title}</Text>
        <FAQ
          question={translations.faq_q1}
          answer={translations.faq_a1}
        />
        <FAQ
          question={translations.faq_q2}
          answer={translations.faq_a2}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💪 Remember: Every small step counts. You got this!
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#0078D4',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  welcome: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0078D4',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 18,
  },
  itemsList: {
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  itemNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e8f4ff',
    color: '#0078D4',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 12,
    flexShrink: 0,
  },
  itemText: {
    flex: 1,
    fontSize: 13,
    color: '#333333',
    lineHeight: 18,
  },
  tipsContainer: {
    gap: 8,
  },
  tipBox: {
    backgroundColor: '#f0f8ff',
    borderLeftWidth: 3,
    borderLeftColor: '#0078D4',
    padding: 12,
    borderRadius: 8,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0078D4',
  },
  featureBox: {
    backgroundColor: '#f5f0ff',
    borderLeftWidth: 3,
    borderLeftColor: '#8b5cf6',
    padding: 12,
    borderRadius: 8,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7c3aed',
  },
  faqItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
  },
  footer: {
    backgroundColor: '#e8f4ff',
    marginHorizontal: 12,
    marginVertical: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0078D4',
    textAlign: 'center',
  },
});
