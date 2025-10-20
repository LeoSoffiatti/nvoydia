# Biotech Dashboard

A modern, responsive dashboard for tracking biotech companies, venture capital firms, and industry news.

## Features

- 🏥 **Company Tracking** - Monitor 10+ biotech companies with detailed profiles
- 💰 **VC Scoring** - Track venture capital firms with investment data
- 📰 **News Aggregation** - Latest industry news and funding announcements
- 🔍 **Smart Search** - Search across companies, VCs, and news
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🌙 **Dark/Light Theme** - Toggle between themes
- ⚡ **Fast Performance** - Optimized for speed

## Live Demo

Visit the live dashboard: [https://nvoydia.vercel.app](https://nvoydia.vercel.app)

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)
- **Deployment**: Vercel

## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/LeoSoffiatti/nvoydia.git
cd nvoydia/biotech-dashboard
```

2. Start a local server:
```bash
python -m http.server 8080
```

3. Open your browser and visit: `http://localhost:8080`

### Deployment

This project is automatically deployed to Vercel. Any changes pushed to the main branch will trigger a new deployment.

## Project Structure

```
biotech-dashboard/
├── index.html              # Main HTML file
├── styles.css              # Base styles
├── simplified-styles.css   # Enhanced responsive styles
├── data-service.js         # Data management and API
├── enhanced-script.js      # Main JavaScript functionality
├── package.json            # Project configuration
├── vercel.json             # Vercel deployment config
└── README.md               # This file
```

## Data Sources

The dashboard uses sample data from Piloterr API integration tests, including:

- **Companies**: 10 biotech companies across various sectors
- **VCs**: 6 venture capital firms with scoring data
- **News**: 10 recent industry articles and announcements

## Features Overview

### Dashboard
- Overview statistics
- Top companies by valuation
- Recent news feed
- Top VCs by score

### Companies Page
- Grid view of all companies
- Search and filter functionality
- Detailed company profiles
- Funding and growth data

### Investments Page
- Investment overview
- Funding rounds by company
- VC investment tracking

### Search Functionality
- Real-time search across all data
- Categorized results
- Clickable search results

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

## Contact

For questions or support, please contact the NVoydia team.