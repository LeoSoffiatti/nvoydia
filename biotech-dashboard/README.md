# Biotech Startup Dashboard

A live-updating, interactive dashboard for tracking biotech startups, investments, and market trends. Built with modern web technologies and featuring both light and dark modes.

## Features

### 📊 Dashboard Overview
- **Investment Trends Chart**: Interactive line chart showing investment trends over time
- **Recent Funding Rounds**: Live feed of recent startup funding announcements
- **Latest News**: Real-time news updates from the biotech industry

### 🏢 Companies Portfolio
- **Categorized View**: Companies organized by Digital Bio, Digital Health, and Digital Devices
- **Detailed Company Cards**: Comprehensive information including valuation, funding stage, and employee count
- **Summary Statistics**: Total valuations and average employee counts per category

### 💰 Investments Tracking
- **Major Corporate Investors**: Overview of top corporate venture capital firms
- **Sector-Specific Investments**: Filterable view of investments by biotech sector
- **Top Investors by Sector**: Leading investors in each biotech category

### 🔔 Notifications Center
- **Priority Alerts**: High-priority notifications for important updates
- **Real-time Updates**: Live notifications for funding rounds, company updates, and market trends
- **Categorized Alerts**: Different types of notifications with visual indicators

### 🌙 Dark Mode Support
- **Theme Toggle**: Switch between light and dark modes
- **Consistent Design**: All components adapt seamlessly to the selected theme
- **Smooth Transitions**: Animated theme switching for better user experience

### 🔄 Live Updates
- **Real-time Data**: Dashboard updates automatically every 30 seconds
- **Simulated Live Data**: Demonstrates how real-time updates would work
- **Interactive Elements**: All charts, lists, and data are fully interactive

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. The dashboard will load automatically with sample data

### Usage

#### Navigation
- Use the sidebar to navigate between different sections
- Click on any navigation item to switch pages
- The active page is highlighted in blue

#### Theme Switching
- Click the moon/sun icon in the header to toggle between light and dark modes
- Your theme preference will be maintained during the session

#### Interactive Features
- **Charts**: Hover over data points to see detailed information
- **Filters**: Use year filters on the investment chart to see different time periods
- **Tabs**: Switch between different sectors in the investments section
- **Search**: Use the search bar to find specific companies or information

#### Live Updates
- The dashboard automatically updates every 30 seconds
- New funding rounds and notifications appear at the top of their respective lists
- Chart data updates smoothly to reflect market changes

## Data Structure

The dashboard uses realistic sample data representing:

### Companies
- **Digital Bio**: Gene editing, synthetic biology, and biotechnology companies
- **Digital Health**: Healthcare technology, medical devices, and health analytics
- **Digital Devices**: Medical devices, diagnostic tools, and health monitoring equipment

### Investors
- Major corporate venture capital arms
- Focus areas and investment statistics
- Recent investment activity

### Notifications
- Investment alerts
- Company updates
- Market trends
- Portfolio alerts
- Meeting reminders

## Customization

### Adding New Companies
To add new companies, modify the `companiesData` object in `script.js`:

```javascript
const companiesData = {
    'digitalBio': [
        {
            name: 'Your Company Name',
            initials: 'YC',
            color: '#your-color',
            location: 'City, State',
            valuation: '$X.XB',
            funding: 'Series X',
            employees: 123,
            description: 'Company description...'
        }
    ]
};
```

### Modifying Chart Data
Update the chart data in the `initializeChart()` method:

```javascript
data: {
    labels: ['Your', 'Custom', 'Labels'],
    datasets: [{
        data: [your, data, values]
    }]
}
```

### Adding New Notifications
Extend the `notificationsData` array in `loadNotificationsData()`:

```javascript
{
    icon: 'fas fa-your-icon',
    iconColor: '#your-color',
    title: 'Your Notification Title',
    hasDot: true,
    priority: 'High Priority', // or null
    description: 'Your notification description',
    time: 'Time ago'
}
```

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript ES6+**: Modern JavaScript with classes and modules
- **Chart.js**: Interactive charts and data visualization
- **Font Awesome**: Icons and visual elements

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance
- Optimized for smooth animations and transitions
- Efficient DOM manipulation for live updates
- Responsive design for all screen sizes

## Future Enhancements

### Planned Features
- **Real API Integration**: Connect to actual biotech data sources
- **User Authentication**: Login system for personalized dashboards
- **Data Export**: Export charts and data to various formats
- **Advanced Filtering**: More sophisticated filtering and search options
- **Mobile App**: Native mobile application version

### API Integration
The dashboard is designed to easily integrate with real APIs:

```javascript
// Example API integration
async function fetchRealData() {
    const response = await fetch('/api/companies');
    const data = await response.json();
    return data;
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For questions or support, please open an issue in the repository or contact the development team.

---

**Built with ❤️ for the biotech community**
