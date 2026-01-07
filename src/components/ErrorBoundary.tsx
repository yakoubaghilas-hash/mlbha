import React, { ReactNode } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ErrorFeedbackModal } from './ErrorFeedbackModal';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };

    // Set up global error handler that captures unhandled errors
    if (!global.ErrorUtils) {
      global.ErrorUtils = {};
    }

    const originalHandler = global.ErrorUtils.setErrorHandler;
    const self = this;

    global.ErrorUtils.setErrorHandler = (fn: any) => {
      return originalHandler?.((...args: any[]) => {
        try {
          fn(...args);
        } catch (error) {
          self.setState({
            hasError: true,
            error: error as Error,
            errorInfo: 'Unhandled global error',
          });
        }
      });
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo: errorInfo.componentStack || null,
    });
  }

  handleCloseFeedback = () => {
    // Try to recover by clearing the error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <View style={styles.fallbackContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Application Error</Text>
            <Text style={styles.errorMessage}>
              An unexpected error occurred. The app will continue working.
            </Text>
            <Text style={styles.details}>
              {this.state.error?.toString() || 'Unknown error'}
            </Text>
          </ScrollView>
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleCloseFeedback}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 16,
    marginTop: 20,
  },
  errorMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    lineHeight: 24,
  },
  details: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontFamily: 'Courier New',
    lineHeight: 18,
  },
  button: {
    backgroundColor: '#0078D4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
