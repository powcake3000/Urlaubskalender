# Team Urlaubskalender 2026

A vacation calendar application for managing team vacation schedules for 2026 with real-time synchronization.

## Features

- **Password Protection**: Secure access with password authentication
- **Team Management**: Pre-configured with 5 team members, each with a unique color
- **Yearly Overview**: All 12 months of 2026 displayed at once
- **30-Day Vacation Limit**: Each team member has 30 working days maximum
- **Smart Day Calculation**: Only counts working days (excludes weekends, holidays, and special days)
- **Real-Time Synchronization**: Optional Firebase integration for instant updates across all team members
- **Export/Import**: Manual data sharing option if Firebase is not configured
- **Visual Calendar**: Color-coded vacation markers for easy viewing
- **Filter by Team Member**: View specific team member's vacations
- **Vacation Dashboard**: Shows used and remaining vacation days per person
- **Responsive Design**: Works on desktop and mobile devices

## Team Members

The app is configured with 5 team members:

1. **Casey** (Red)
2. **Felix** (Teal)
3. **Ihtisham** (Blue)
4. **Kathrin** (Orange)
5. **Peter** (Green)

## Password

Access the app using the password: **`dienstplanung`**

## How to Use

### First Time Setup

1. Open `index.html` in your web browser (or visit the GitHub Pages URL)
2. Enter the password: `dienstplanung`
3. You'll see the vacation calendar with all 12 months of 2026

### Adding a Vacation

1. Click the **"Urlaub hinzufügen"** button
2. Select a team member from the dropdown
3. Choose start and end dates
4. The app will show:
   - How many **working days** this vacation uses
   - How many vacation days the person will have left
   - A warning if approaching the 30-day limit
5. Click **"Speichern"** to save

**Note**: The app automatically excludes:
- Weekends (Saturday and Sunday)
- Public holidays in Hessen for 2026
- Special days (December 24 and 31)

### Editing or Deleting a Vacation

- Click on a vacation marker in the calendar, **or**
- Click the **"Bearbeiten"** button in the vacation list to edit
- Click the **"Löschen"** button to delete

### Viewing Vacation Days

At the top of the page, cards show each team member's:
- Vacation days used (red)
- Vacation days remaining (green)
- Progress bar visualization

### Filtering by Team Member

Use the dropdown to filter vacations by specific team member or view all.

## Real-Time Synchronization (Recommended)

For automatic synchronization across all team members' browsers:

1. Follow the instructions in **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** to set up Firebase
2. Once configured, all changes are instantly synced
3. No need to manually export/import data

**Without Firebase**, the app works locally and you can share data using:
- **📥 Daten exportieren**: Download vacation data as JSON
- **📤 Daten importieren**: Upload vacation data from JSON

## Public Holidays in Hessen 2026

The app automatically excludes these holidays from vacation day counts:

- Neujahr (January 1)
- Karfreitag (April 3)
- Ostermontag (April 6)
- Tag der Arbeit (May 1)
- Christi Himmelfahrt (May 14)
- Pfingstmontag (May 25)
- Fronleichnam (June 4)
- Tag der Deutschen Einheit (October 3)
- 1. Weihnachtsfeiertag (December 25)
- 2. Weihnachtsfeiertag (December 26)

**Special days** (also excluded):
- December 24
- December 31

## Visual Indicators in Calendar

- **Gray background**: Weekends (don't count as vacation days)
- **Pink background**: Public holidays (don't count)
- **Orange background**: Special days (don't count)
- **Colored names**: Team member on vacation

## Technical Details

- **HTML5**: Structure and layout
- **CSS3**: Modern styling with animations and responsive design
- **Vanilla JavaScript**: No frameworks required
- **Firebase Realtime Database**: Optional real-time sync
- **LocalStorage**: Fallback data persistence

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Data Storage Options

1. **Firebase (Recommended)**: Real-time sync across all devices
2. **LocalStorage (Fallback)**: Data stored locally in browser
3. **Export/Import**: Manual sharing via JSON files

## Deployment to GitHub Pages

1. Go to your repository settings on GitHub
2. Navigate to **Pages** section
3. Select your branch (e.g., `main` or `claude/urlaubs-calendar-app-...`)
4. Click **Save**
5. Your app will be available at: `https://YOUR_USERNAME.github.io/Urlaubskalender/`

## Customization

### Change Team Members

Edit the `TEAM_MEMBERS` array in `app.js`:

```javascript
const TEAM_MEMBERS = [
    { id: 1, name: 'Name1', color: '#FF6B6B' },
    { id: 2, name: 'Name2', color: '#4ECDC4' },
    // ...
];
```

### Change Password

Edit line 2 in `app.js`:

```javascript
const CORRECT_PASSWORD = 'your-new-password';
```

### Change Vacation Day Limit

Edit line 31 in `app.js`:

```javascript
const MAX_VACATION_DAYS = 30; // Change to your desired limit
```

## License

MIT License - Feel free to use and modify as needed.

## Support

For Firebase setup issues, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

For general questions, check the code comments or create an issue on GitHub.
