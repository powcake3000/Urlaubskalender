# Team Urlaubskalender 2026

A vacation calendar application for managing team vacation schedules for 2026.

## Features

- **Team Management**: Pre-configured with 5 team members, each with a unique color
- **Add/Edit Vacations**: Easy interface to add and edit vacation periods
- **Visual Calendar**: Month-by-month calendar view showing all team vacations
- **Filter by Team Member**: View specific team member's vacations
- **Vacation List**: Detailed list of all planned vacations with duration
- **Local Storage**: All data is saved locally in the browser
- **Responsive Design**: Works on desktop and mobile devices

## Team Members

The app comes pre-configured with 5 team members:

1. Alex Schmidt (Red)
2. Maria Müller (Teal)
3. Thomas Weber (Blue)
4. Sarah Fischer (Orange)
5. Michael Becker (Green)

## How to Use

### Starting the App

1. Open `index.html` in your web browser
2. The calendar will display January 2026 by default

### Adding a Vacation

1. Click the "Urlaub hinzufügen" (Add Vacation) button
2. Select a team member from the dropdown
3. Choose start and end dates
4. Click "Speichern" (Save)

### Editing a Vacation

- Click on a vacation marker in the calendar, or
- Click the "Bearbeiten" (Edit) button in the vacation list

### Deleting a Vacation

- Click the "Löschen" (Delete) button in the vacation list
- Confirm the deletion

### Filtering by Team Member

- Use the dropdown at the top to filter vacations by specific team member
- Select "Alle Teammitglieder" (All Team Members) to see everyone's vacations

### Navigating Months

- Use the < and > buttons to navigate between months
- The calendar shows the entire year of 2026

## Technical Details

- **HTML5**: Structure and layout
- **CSS3**: Modern styling with animations and responsive design
- **Vanilla JavaScript**: No frameworks required
- **LocalStorage**: Data persistence in the browser

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Data Storage

All vacation data is stored locally in your browser using LocalStorage. The data persists between sessions but is tied to the specific browser and device you're using.

## Customization

To modify team members, edit the `TEAM_MEMBERS` array in `app.js`:

```javascript
const TEAM_MEMBERS = [
    { id: 1, name: 'Your Name', color: '#FF6B6B' },
    // Add more members...
];
```

## Future Enhancements

Potential features for future versions:
- Export to calendar formats (ICS)
- Conflict detection (overlapping vacations)
- Vacation day quotas
- Multi-year support
- Cloud synchronization
- Email notifications

## License

MIT License - Feel free to use and modify as needed.
