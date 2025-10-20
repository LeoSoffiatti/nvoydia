# NVoydia Intelligence Dashboard

A modern, comprehensive intelligence platform for tracking NVIDIA Partner Program (NCP) progress, managing outreach campaigns, and monitoring AI/Digital Native companies in the biotech and healthtech sectors.

## Quick Start

### Live Demo
The dashboard is live at: [https://nvoydia.vercel.app](https://nvoydia.vercel.app)

### Local Development
```bash
# Navigate to the dashboard directory
cd nvoydia-2

# Start a local server
python -m http.server 8080

# Open your browser to http://localhost:8080
```

## Features

- **NCP Progress Tracking** - Monitor partner status, tiers, and completion metrics
- **AI/Digital Native Focus** - Track AI-native and digital-native companies with specialized badges
- **Advanced Filtering** - Filter by industry, funding amount, date range, and VC tier
- **Outreach Management** - Track contact status and last message dates
- **News Summarization** - AI-powered news summaries for company updates
- **VC Portfolio Analysis** - View companies by venture capital firm portfolios
- **CSV Export** - Download non-partner companies for outreach campaigns
- **Gamification** - Progress bars and completion metrics for engagement
- **Responsive Design** - Works perfectly on desktop and mobile
- **Dark/Light Theme** - Toggle between themes
- **Email Templates** - Pre-built templates for partnership outreach
- **LinkedIn Integration** - Direct links to company executives

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)
- **Charts**: Chart.js
- **Deployment**: Vercel

## Project Structure

```
nvoydia-2/
├── index.html                    # Main dashboard HTML file
├── modern-styles.css             # Enhanced responsive styles with CSS variables
├── modern-script.js              # Main JavaScript functionality and interactions
├── data-service.js               # Data management and API integration
├── chart.min.js                  # Chart.js library for data visualization
├── vercel.json                   # Vercel deployment configuration
├── package.json                  # Project configuration and dependencies
├── README.md                     # This documentation file
└── [test files]                  # Various test and development HTML files
```

### Key Files Explained

- **`index.html`**: Main dashboard interface with navigation, data tables, and interactive elements
- **`modern-styles.css`**: Comprehensive styling with CSS custom properties for theming
- **`modern-script.js`**: Core JavaScript functionality including data loading, filtering, and UI interactions
- **`data-service.js`**: Data management layer handling API calls and data processing
- **`chart.min.js`**: Chart.js library for creating interactive charts and visualizations

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/LeoSoffiatti/nvoydia.git
cd nvoydia/nvoydia-2
```

2. Start a local server:
```bash
python -m http.server 9000
# or
npx serve .
```

3. Open your browser and visit: `http://localhost:9000`

## Deployment

This project is automatically deployed to Vercel. Any changes pushed to the main branch will trigger a new deployment.

### Manual Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

## Dashboard Sections

### Dashboard Overview
- **NCP Progress Metrics**: Real-time tracking of partner program completion
- **Gamification Elements**: Progress bars, completion badges, and achievement tracking
- **Recent News Feed**: AI-powered news summaries with company relevance scoring
- **Performance Analytics**: Funding trends, growth metrics, and market insights
- **Quick Actions**: One-click access to common tasks and reports

### Companies Management
- **Advanced Filtering**: Multi-criteria filtering by industry, funding amount, date range, and VC tier
- **AI/Digital Native Badges**: Visual indicators for AI-native and digital-native companies
- **Outreach Status Tracking**: Contact management with last interaction dates
- **CSV Export**: Download filtered company lists for external outreach campaigns
- **Interactive Modals**: Detailed company profiles with funding history and news
- **Search Functionality**: Real-time search across company names, industries, and descriptions

### Investments & VC Analysis
- **VC Portfolio Highlights**: Top-performing venture capital firms and their investments
- **Investment Trends**: Sector-wise funding analysis with interactive charts
- **Portfolio Company Analysis**: Detailed breakdown of VC investment patterns
- **Funding Timeline Visualization**: Historical funding data with trend analysis
- **Performance Metrics**: ROI tracking and success rate analysis

### News & Intelligence
- **AI-Powered Summaries**: Automated news summarization for company updates
- **Industry Monitoring**: Sector-specific news aggregation and analysis
- **Trend Detection**: Identification of emerging trends and market shifts
- **Custom Alerts**: Configurable notifications for specific companies or sectors

## Customization

The dashboard uses CSS custom properties for easy theming. Key variables in `modern-styles.css`:

```css
:root {
    --primary-color: #1a1a1a;
    --secondary-color: #ffffff;
    --accent-color: #0066cc;
    --success-color: #00a86b;
    /* ... more variables */
}
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## API Integration

The dashboard integrates with multiple data sources and APIs:

### Data Sources
- **Piloterr Crunchbase API**: Company information, funding data, and industry classifications
- **News APIs**: Real-time news aggregation and summarization
- **VC Databases**: Venture capital firm information and portfolio data
- **NVIDIA Partner Data**: NCP program status and partner information

### API Endpoints
The dashboard can connect to the FastAPI backend (see `../dashboard/backend/`) for:
- Company data management
- News aggregation
- Investment tracking
- VC scoring algorithms

## Data Management

### Sample Data
The dashboard includes comprehensive sample data for demonstration:
- **Companies**: 50+ biotech and healthtech companies with detailed profiles
- **VCs**: Top venture capital firms with scoring and portfolio data
- **News**: Recent industry news with AI-generated summaries
- **Investments**: Funding rounds and investment history

### Data Updates
- **Real-time**: News and market data updates automatically
- **Scheduled**: Company and VC data refreshed daily
- **Manual**: Admin interface for data corrections and additions

## Development & Testing

### Test Files
The project includes various test files for development:
- `test-*.html`: Individual component testing
- `debug-*.html`: Debugging and troubleshooting
- `chart-test.html`: Chart.js functionality testing
- `modal-test.html`: UI component testing

### Browser Compatibility
- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile**: Responsive design for all screen sizes

## Troubleshooting

### Common Issues

**Dashboard not loading:**
- Ensure you're running a local server (not opening HTML files directly)
- Check browser console for JavaScript errors
- Verify all CSS and JS files are loading correctly

**Charts not displaying:**
- Check if Chart.js is loading properly
- Verify data format in browser console
- Ensure data-service.js is functioning

**Data not updating:**
- Check API connectivity
- Verify data service configuration
- Check browser network tab for failed requests

**Styling issues:**
- Clear browser cache
- Check CSS file loading
- Verify CSS custom properties support

### Debug Mode
Enable debug mode by adding `?debug=true` to the URL for additional console logging.

## Performance

### Optimization Features
- **Lazy Loading**: Data loaded on demand
- **Caching**: Browser caching for static assets
- **Compression**: Minified CSS and JavaScript
- **CDN**: External libraries served from CDN

### Performance Metrics
- **Load Time**: < 2 seconds on average connection
- **Responsiveness**: < 100ms for user interactions
- **Memory Usage**: Optimized for long-running sessions

## Security

### Data Protection
- **No Sensitive Data**: All data is publicly available business information
- **HTTPS**: Secure connections for all external API calls
- **CORS**: Properly configured cross-origin resource sharing

### Privacy
- **No Tracking**: No user tracking or analytics
- **Local Storage**: Minimal use of browser storage
- **Data Retention**: No personal data stored

## Support & Contact

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub issues
- **Feature Requests**: Submit enhancement requests

### Team Contact
For questions or support, please contact the NVoydia development team.

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **Chart.js**: For excellent charting capabilities
- **Font Awesome**: For comprehensive icon library
- **Google Fonts**: For Inter font family
- **Vercel**: For seamless deployment platform