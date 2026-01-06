# Error Feedback System Setup Guide

## Overview
The app now has a complete error feedback system that allows users to report errors and send them to your email. When an error occurs, a modal appears with:
- Error details
- User email input
- Optional message field
- Send button

## How It Works

1. **Error Detection**: The `ErrorBoundary` component catches all errors in the app
2. **User Feedback Modal**: Shows error details and prompts user for feedback
3. **Email Delivery**: Error report is sent via EmailJS to your email

## Setup Instructions

### Option 1: Using EmailJS (Recommended - Free & Simple)

#### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email

#### Step 2: Create Email Service
1. Go to Dashboard → Email Services
2. Click "Add Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the instructions to connect your email
5. Copy the **Service ID** (e.g., `service_xxxxx`)

#### Step 3: Create Email Template
1. Go to Dashboard → Email Templates
2. Click "Create New Template"
3. Use this template content:

```
Subject: CigOff - Error Report from {{from_email}}

Error Report:
{{error_message}}

User Message:
{{user_message}}

Stack Trace:
{{error_stack}}

Timestamp: {{timestamp}}
```

4. Copy the **Template ID** (e.g., `template_xxxxx`)

#### Step 4: Get Public Key
1. Go to Account → API Keys
2. Copy your **Public Key** (e.g., `abcd1234efgh5678...`)

#### Step 5: Update Configuration
Update the file `src/services/feedbackService.ts`:

```typescript
// Replace these values:
const EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY';      // Your EmailJS public key
const EMAILJS_SERVICE_ID = 'YOUR_EMAILJS_SERVICE_ID';      // Your EmailJS service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_EMAILJS_TEMPLATE_ID';    // Your EmailJS template ID
const ADMIN_EMAIL = 'your-email@example.com';               // Your email address
```

### Option 2: Using Custom Backend

If you prefer to send errors to your own backend server instead of EmailJS:

1. Uncomment the `sendErrorFeedbackToBackend` function in `feedbackService.ts`
2. Replace `YOUR_BACKEND_URL` with your actual server endpoint
3. Your backend should accept POST requests at `/api/feedback` with this body:

```json
{
  "email": "user@example.com",
  "message": "User's optional message",
  "error": "Error message",
  "errorStack": "Full error stack trace",
  "appVersion": "1.0.1",
  "timestamp": "2026-01-06T10:30:00Z"
}
```

## Testing

### Test Error Boundary
You can test the error system by creating an intentional error:

```typescript
// In any component, add this test button:
<TouchableOpacity onPress={() => {
  throw new Error('Test error for feedback system');
}}>
  <Text>Test Error</Text>
</TouchableOpacity>
```

### Steps to Test:
1. Press the test button to trigger an error
2. The ErrorBoundary modal should appear
3. Enter your email and optional message
4. Click "Send Error Report"
5. Check your email for the error report

## Features

✅ **Automatic Error Catching**: All unhandled errors are caught by ErrorBoundary
✅ **User Feedback**: Users can add context to errors
✅ **Multilingual Support**: Error messages in EN, FR, ES
✅ **Email Notifications**: You receive immediate email alerts
✅ **Error Details**: Full error message and stack trace included
✅ **Development Mode**: Works without EmailJS setup (logs to console)

## Translation Keys

All error feedback text is translatable. The keys are:

- `error_feedback_title`
- `error_feedback_description`
- `error_feedback_details`
- `error_feedback_email`
- `error_feedback_email_placeholder`
- `error_feedback_message`
- `error_feedback_message_placeholder`
- `error_feedback_send`
- `error_feedback_cancel`
- `error_feedback_success_title`
- `error_feedback_success_message`
- `error_feedback_error_title`
- `error_feedback_validation_error`

## Environment Variables (Optional)

For security in production, consider using environment variables:

```typescript
const EMAILJS_PUBLIC_KEY = process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_EMAILJS_PUBLIC_KEY';
```

## Troubleshooting

### Errors not being caught
- Make sure ErrorBoundary wraps your entire app (it does by default in `app/_layout.tsx`)

### Email not sending
- Check that EMAILJS credentials are correct
- Check spam folder for error emails
- In development mode without EmailJS configured, errors are logged to console

### Modal not showing
- Clear app cache and restart
- Check browser console for any JavaScript errors

## Next Steps

1. ✅ Setup EmailJS or your backend
2. ✅ Update the credentials in `feedbackService.ts`
3. ✅ Test with a sample error
4. ✅ Deploy to TestFlight
5. ✅ Monitor error reports in your email

For more help, visit [EmailJS Documentation](https://www.emailjs.com/docs/).
