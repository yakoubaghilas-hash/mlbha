import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import i18n from '../i18n';
import { feedbackService } from '../services/feedbackService';

interface ErrorFeedbackModalProps {
  visible: boolean;
  error: Error;
  errorInfo: string | null;
  onClose: () => void;
}

export const ErrorFeedbackModal: React.FC<ErrorFeedbackModalProps> = ({
  visible,
  error,
  errorInfo,
  onClose,
}) => {
  const { language } = useLanguage();
  const [userEmail, setUserEmail] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const translations = useMemo(() => ({
    title: i18n.t('error_feedback_title'),
    description: i18n.t('error_feedback_description'),
    errorDetails: i18n.t('error_feedback_details'),
    emailLabel: i18n.t('error_feedback_email'),
    emailPlaceholder: i18n.t('error_feedback_email_placeholder'),
    messageLabel: i18n.t('error_feedback_message'),
    messagePlaceholder: i18n.t('error_feedback_message_placeholder'),
    sendButton: i18n.t('error_feedback_send'),
    cancelButton: i18n.t('error_feedback_cancel'),
    successTitle: i18n.t('error_feedback_success_title'),
    successMessage: i18n.t('error_feedback_success_message'),
    errorTitle: i18n.t('error_feedback_error_title'),
    validationError: i18n.t('error_feedback_validation_error'),
  }), [language]);

  const handleSendFeedback = async () => {
    if (!userEmail.trim()) {
      Alert.alert(translations.errorTitle, translations.validationError);
      return;
    }

    if (!userEmail.includes('@')) {
      Alert.alert(translations.errorTitle, 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await feedbackService.sendErrorFeedback({
        email: userEmail,
        message: userMessage,
        error: error.toString(),
        errorStack: errorInfo || 'No stack trace available',
      });

      Alert.alert(translations.successTitle, translations.successMessage, [
        {
          text: 'OK',
          onPress: () => {
            setUserEmail('');
            setUserMessage('');
            onClose();
          },
        },
      ]);
    } catch (err) {
      Alert.alert(
        translations.errorTitle,
        `${translations.errorTitle}: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {/* Header */}
            <Text style={styles.title}>{translations.title}</Text>
            <Text style={styles.description}>{translations.description}</Text>

            {/* Error Details */}
            <View style={styles.errorSection}>
              <Text style={styles.sectionTitle}>{translations.errorDetails}</Text>
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error.toString()}</Text>
                {errorInfo && (
                  <Text style={styles.stackTrace}>{errorInfo.substring(0, 300)}...</Text>
                )}
              </View>
            </View>

            {/* User Email */}
            <View style={styles.formSection}>
              <Text style={styles.label}>{translations.emailLabel}</Text>
              <TextInput
                style={styles.input}
                placeholder={translations.emailPlaceholder}
                value={userEmail}
                onChangeText={setUserEmail}
                editable={!isLoading}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* User Message */}
            <View style={styles.formSection}>
              <Text style={styles.label}>{translations.messageLabel}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={translations.messagePlaceholder}
                value={userMessage}
                onChangeText={setUserMessage}
                multiline
                numberOfLines={4}
                editable={!isLoading}
              />
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>{translations.cancelButton}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.sendButton]}
                onPress={handleSendFeedback}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.sendButtonText}>{translations.sendButton}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    maxWidth: 600,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
    lineHeight: 20,
  },
  errorSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  errorBox: {
    backgroundColor: '#fff3e0',
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#d32f2f',
    fontWeight: '500',
    marginBottom: 8,
  },
  stackTrace: {
    fontSize: 10,
    color: '#999999',
    fontFamily: 'Courier New',
  },
  formSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333333',
  },
  textArea: {
    textAlignVertical: 'top',
    paddingVertical: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '600',
  },
  sendButton: {
    backgroundColor: '#0078D4',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
