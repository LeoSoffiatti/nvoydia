# NCP Intelligence Dashboard

A modern, action-first dashboard for tracking NVIDIA Partner Program (NCP) progress, managing outreach, and monitoring AI/Digital Native companies.

## Features

- 🎯 **NCP Progress Tracking** - Monitor partner status, tiers, and completion metrics
- 🤖 **AI/Digital Native Focus** - Track AI-native and digital-native companies with specialized badges
- 📊 **Advanced Filtering** - Filter by industry, funding amount, date range, and VC tier
- 📈 **Outreach Management** - Track contact status and last message dates
- 📰 **News Summarization** - AI-powered news summaries for company updates
- 💼 **VC Portfolio Analysis** - View companies by venture capital firm portfolios
- 📥 **CSV Export** - Download non-partner companies for outreach campaigns
- 🎮 **Gamification** - Progress bars and completion metrics for engagement
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🌙 **Dark/Light Theme** - Toggle between themes
- 📧 **Email Templates** - Pre-built templates for partnership outreach
- 🔗 **LinkedIn Integration** - Direct links to company executives

## Live Demo

Visit the live dashboard: [https://nvoydia.vercel.app](https://nvoydia.vercel.app)

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: FastAPI with SQLite database
- **Styling**: Custom CSS with CSS Variables
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)
- **Deployment**: Vercel

## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/LeoSoffiatti/nvoydia.git
cd nvoydia/nvoydia-2
```

2. Start the backend server:
```bash
cd ../dashboard/backend
pip install -r requirements.txt
python main.py
```

3. Start the frontend server:
```bash
cd ../../nvoydia-2
python -m http.server 9000
```

4. Open your browser and visit: `http://localhost:9000`

### Deployment

This project is automatically deployed to Vercel. Any changes pushed to the main branch will trigger a new deployment.

## Project Structure

```
nvoydia-2/
├── index.html              # Main HTML file with reordered sections
├── modern-styles.css       # Enhanced responsive styles with NCP badges
├── modern-script.js        # Main JavaScript functionality with filters
├── data-service.js         # Data management with NCP fields
├── package.json            # Project configuration
├── vercel.json             # Vercel deployment config
└── README.md               # This file
```

## Data Fields

The dashboard now includes comprehensive company data:

- **NCP Status**: Partner/Not Partner with tier information
- **Partner Tier**: Gold, Silver, Bronze classification
- **VC Tier**: Tier 1, Tier 2, Tier 3 classification
- **AI/Digital Native**: Boolean flags for company type
- **Funding Details**: Round type, amount, and date
- **Outreach Tracking**: Contacted status and last message date
- **News Articles**: Company-specific news with summaries
- **VC Portfolio**: List of associated venture capital firms

## Features Overview

### Dashboard
- NCP progress metrics and completion tracking
- Partner status overview with gamification elements
- Recent company news with AI summarization
- Funding and performance analytics

### Companies Page
- Advanced filtering by industry, funding, date, and VC tier
- AI/Digital Native badges for quick identification
- Outreach status tracking
- Download non-partners for CSV export
- Clickable company names with detailed modals

### Investments Page
- VC portfolio highlights and filtering
- Investment trends by sector
- Portfolio company analysis
- Funding timeline visualization

### Company Modals
- NCP status prominently displayed at the top
- Recent news with AI-powered summaries
- Contact actions (LinkedIn/Email templates)
- Detailed company information and stats

### News Modals
- Full article content with related company info
- AI summarization capabilities
- Direct links to company details
- Source and publication date tracking

### VC Modals
- Comprehensive VC information and stats
- Portfolio company listings
- Contact information and website links
- Executive and email template access

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