# Firebase Setup for Real-Time Synchronization

To enable automatic real-time synchronization across all team members' browsers, follow these steps to set up Firebase:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** (or use an existing project)
3. Enter a project name (e.g., "Team Urlaubskalender")
4. Click **Continue**
5. Disable Google Analytics (optional, not needed for this app)
6. Click **Create project**
7. Wait for the project to be created, then click **Continue**

## Step 2: Create a Realtime Database

1. In the Firebase Console, click on **"Realtime Database"** in the left sidebar
2. Click **"Create Database"**
3. Choose a database location (e.g., europe-west1)
4. Select **"Start in test mode"** (for easy testing)
   - Note: This allows anyone with the config to read/write. For production, you should set up security rules.
5. Click **Enable**

## Step 3: Get Your Firebase Configuration

1. In the Firebase Console, click the **Settings gear icon** (⚙️) next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** (`</>`) to add a web app
5. Register your app with a nickname (e.g., "Urlaubskalender Web")
6. **DO NOT** check "Set up Firebase Hosting"
7. Click **"Register app"**
8. You'll see a code snippet with `firebaseConfig`. Copy the values.

## Step 4: Update the App Configuration

1. Open `app.js` in your code editor
2. Find the `firebaseConfig` section (around line 11-18)
3. Replace the placeholder values with your actual Firebase config values:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456"
};
```

4. Save the file
5. Commit and push the changes to GitHub

## Step 5: Deploy to GitHub Pages

Once the Firebase config is updated and pushed to GitHub, the app will automatically use Firebase for real-time synchronization when deployed on GitHub Pages.

## How It Works

- **Automatic Sync**: When anyone adds, edits, or deletes a vacation, the change is instantly saved to Firebase
- **Real-Time Updates**: All team members see the changes immediately without refreshing
- **No Manual Export/Import**: The export/import buttons are kept as a backup option, but you won't need them with Firebase
- **Fallback to localStorage**: If Firebase is not configured or offline, the app automatically falls back to localStorage

## Security (Optional but Recommended)

By default, the database is in "test mode" which allows anyone to read/write. To secure it:

1. Go to **Realtime Database** in Firebase Console
2. Click the **"Rules"** tab
3. Update the rules to require authentication or add other restrictions:

```json
{
  "rules": {
    "vacations": {
      ".read": true,
      ".write": true
    }
  }
}
```

For a password-protected app like this, the current setup is reasonably secure since users need to know the app password (`dienstplanung`) to access the interface.

## Troubleshooting

- **Not syncing?** Check the browser console (F12) for error messages
- **Firebase errors?** Verify your config values are correct
- **Database rules error?** Make sure the database is in test mode or rules allow read/write
- **Still not working?** The app will fall back to localStorage - you can still use export/import to share data

## Cost

Firebase Realtime Database is **FREE** for small teams:
- Free tier: 1 GB storage, 10 GB/month downloads
- More than enough for a 5-person vacation calendar

---

**Questions?** Check the Firebase documentation at https://firebase.google.com/docs/database
