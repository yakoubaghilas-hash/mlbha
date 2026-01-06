# CigOff - App Store Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Requirements
- [ ] Apple Developer Account ($99/year) - https://developer.apple.com
- [ ] Expo Account (free) - https://expo.dev
- [ ] App Store Connect access
- [ ] Apple Team ID (from Apple Developer)
- [ ] Signing Certificate and Provisioning Profile

### 2. Configuration Done ✅
- ✅ App name: **CigOff**
- ✅ Bundle ID: **com.yakoubaghilas.cigoff**
- ✅ Version: **1.0.0**
- ✅ Build number: **1**
- ✅ EAS configuration: **eas.json**

---

## 🔐 Step 1: Setup Apple Developer Account & App Store Connect

### 1.1 Create Apple Developer Account
1. Go to https://developer.apple.com
2. Sign in with your Apple ID (create one if needed)
3. Pay $99/year for Apple Developer Program
4. Verify your identity

### 1.2 Create App in App Store Connect
1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - **Platform**: iOS
   - **Name**: CigOff
   - **Bundle ID**: com.yakoubaghilas.cigoff (exact match!)
   - **SKU**: cigoff-app-001
   - **User Access**: Limit to specific user (you)
4. Click "Create"
5. You'll get an **App ID** - save this!

### 1.3 Get Your Apple Team ID
1. In App Store Connect, go to "Users and Access"
2. Look for your team name - click to view details
3. Copy the **Team ID** (looks like: ABC123XYZ)

---

## 🚀 Step 2: Setup EAS Build with Apple Credentials

### 2.1 Login to Expo/EAS
```bash
cd C:\code\mlbha\LostBoysHealthyAgain
eas login
```
- Enter your Expo email and password
- Or create a new account if needed

### 2.2 Configure EAS Project
```bash
eas build:configure
```
- Choose **iOS** when prompted
- Answer the configuration questions:
  - Use managed credentials? → **Yes** (EAS handles certificates)
  - Use local credentials? → **No**

### 2.3 Create Apple App-Specific Password
For security, Apple requires an app-specific password instead of your main Apple ID password:

1. Go to https://appleid.apple.com/account/security
2. Click "App-Specific Passwords"
3. Create a new one: "CigOff Build"
4. Save the generated password (you'll need it)

---

## 🛠️ Step 3: Build for App Store

### 3.1 Build Production iOS App
```bash
eas build --platform ios --profile production
```

When prompted:
- **Keystore/Certificate**: Let EAS generate or manage it automatically
- **Apple Team ID**: Paste your Team ID
- **Apple ID**: Your Apple ID email
- **App-Specific Password**: Paste the password from Step 2.3

The build will:
- Compile your iOS app
- Sign it with Apple certificates
- Generate an IPA file
- Upload to EAS servers

⏱️ **This takes 10-30 minutes**

### 3.2 Wait for Build to Complete
- Watch the build logs
- You'll get a link to download the IPA when done
- Status will show as "Finished" ✅

---

## 📤 Step 4: Submit to App Store

### 4.1 Option A: Automatic Submission (Recommended)
```bash
eas submit --platform ios --profile production
```

This will:
- Use the IPA from your last build
- Submit directly to App Store Connect
- Handle all signing automatically

### 4.2 Option B: Manual Submission (via App Store Connect)
1. Go to App Store Connect
2. Select CigOff app
3. Click "Build" on the left
4. Select your new build
5. Add Release Notes: "Initial release of CigOff smoking cessation app"
6. Fill in:
   - Version Release Date
   - Rating (Editing, Violence, etc.) - all should be "None"
   - Category: **Health & Fitness**

---

## 📝 App Store Information to Fill

Before submission, you need to provide:

### Pricing and Availability
- Price: Free
- Availability: All regions
- Automatic Updates: Enable

### General App Information
- Subtitle: "Quit Smoking, One Less Every Day"
- Privacy Policy URL: https://yourwebsite.com/privacy
- Support URL: https://yourwebsite.com/support
- Developer Name: Your name/company

### Screenshots
Create 5 screenshots for each device (or use auto-generated):
1. Home tracking screen
2. Strategies screen
3. Reduction plan screen
4. Overview/progress screen
5. How-to guide screen

### Description
```
CigOff is a smart smoking cessation app designed to help you quit smoking with science-backed strategies.

Key Features:
✅ Track daily cigarettes with hourly breakdown
✅ Identify smoking triggers and patterns
✅ Build personalized anti-craving strategies
✅ Create a customized reduction plan
✅ Premium features: Progress tracking, challenges, and more
✅ Multilingual support (English, French, Spanish)

Whether you want to quit completely or reduce gradually, CigOff adapts to your journey. Every cigarette you don't smoke is a victory.

Available in English, French, and Spanish.
```

### Keywords
- Quit smoking
- Smoking cessation
- Anti-smoking
- Health app
- Habit tracker
- Quit smoking app
- Reduce cigarettes

### Rating
Fill in the content rating questionnaire (typically all "None" for this app)

---

## ✅ Step 5: App Review

Once submitted:

### Apple Review Process
1. **Typically takes 24-48 hours**
2. Apple reviews for:
   - Privacy compliance
   - Functionality
   - Content appropriateness
   - Crash safety
3. May request changes (bug fixes, permission requests, etc.)

### Common Rejection Reasons
- **Broken functionality**: Ensure all features work
- **Privacy policy missing**: Required for App Store
- **Misleading claims**: Be honest about features
- **Excessive permissions**: Only request what you need

---

## 🎉 Step 6: Release to App Store

Once approved:

### Release to Users
1. Go to App Store Connect
2. Select your build
3. Click "Version Release" or "Release to All Users"
4. Choose release date:
   - Immediate release (recommended for first launch)
   - Automatic release on a future date
5. Click "Release"

Your app is now live! 🚀

---

## 📲 For Subsequent Updates

### Version Updates
1. Increment version in `package.json` and `app.json`
2. Update build number
3. Run: `eas build --platform ios --profile production`
4. Run: `eas submit --platform ios --profile production`
5. Repeat App Store submission process

### Quick Build Command
```bash
eas build --platform ios --profile production --auto-submit
```

---

## 🆘 Troubleshooting

### Build Fails with Certificate Error
- Delete old credentials from EAS
- Run: `eas credentials delete`
- Try build again

### Submission Fails
- Check that app metadata is complete (description, screenshots, etc.)
- Ensure privacy policy URL is valid
- Test app thoroughly before submitting

### App Rejected by Apple
- Read rejection reasons carefully
- Fix issues (usually bugs or permissions)
- Resubmit with explanation

### Long Build Time
- Build queue is long (peak times: mornings/weekends)
- Usually resolves within 30-45 minutes

---

## 📞 Support Resources

- **Expo Docs**: https://docs.expo.dev/build/setup
- **EAS Submit**: https://docs.expo.dev/submit/ios
- **Apple Support**: https://developer.apple.com/support
- **App Store Connect Help**: https://help.apple.com/app-store-connect

---

## 🔄 Next Steps After Launch

1. Monitor crash reports in App Store Connect
2. Read user reviews and ratings
3. Plan future updates based on feedback
4. Consider premium features mentioned in roadmap
5. Update your marketing/social media with App Store link

---

**Good luck launching CigOff! 🚀**
Every download is someone taking a step toward a healthier life.
