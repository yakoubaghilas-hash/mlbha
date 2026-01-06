import emailjs from '@emailjs/browser';

interface ErrorFeedbackData {
  email: string;
  message: string;
  error: string;
  errorStack: string;
}

// Initialize EmailJS with your public key
const EMAILJS_PUBLIC_KEY = 'yrB9JnqQnKp1cEVCd';
const EMAILJS_SERVICE_ID = 'service_4msyl02';
const EMAILJS_TEMPLATE_ID = 'template_221srbg';
const ADMIN_EMAIL = 'yohan.yakoub@netcourrier.com';

// Initialize EmailJS on app start
export const initEmailJS = () => {
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  } catch (error) {
    console.log('EmailJS init skipped (expected in development)');
  }
};

export const feedbackService = {
  /**
   * Send error feedback to admin email
   * @param data Error feedback data including user email, message, and error details
   */
  sendErrorFeedback: async (data: ErrorFeedbackData): Promise<void> => {
    try {
      // Check if EmailJS is properly configured
      const publicKey: any = EMAILJS_PUBLIC_KEY;
      const serviceId: any = EMAILJS_SERVICE_ID;
      
      if (
        publicKey === 'YOUR_EMAILJS_PUBLIC_KEY' ||
        serviceId === 'YOUR_EMAILJS_SERVICE_ID'
      ) {
        // In development/test mode, just log and resolve
        console.log('Error feedback (development mode):', data);
        return Promise.resolve();
      }

      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: ADMIN_EMAIL,
          from_email: data.email,
          user_message: data.message,
          error_message: data.error,
          error_stack: data.errorStack,
          timestamp: new Date().toISOString(),
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to send feedback');
      }

      console.log('Error feedback sent successfully');
    } catch (error) {
      console.error('Error sending feedback:', error);
      throw new Error('Failed to send error report. Please try again later.');
    }
  },

  /**
   * Alternative: Send feedback to a custom backend endpoint
   * Replace the above implementation with this if you have a backend server
   */
  sendErrorFeedbackToBackend: async (data: ErrorFeedbackData): Promise<void> => {
    try {
      const response = await fetch('YOUR_BACKEND_URL/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          appVersion: '1.0.1',
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send feedback');
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      throw new Error('Failed to send error report. Please try again later.');
    }
  },
};
