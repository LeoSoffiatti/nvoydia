# NCP Intelligence Dashboard

A modern, action-first dashboard for tracking NVIDIA Partner Program (NCP) progress, managing outreach, and monitoring AI/Digital Native companies.

## 🚀 Quick Start

The dashboard is live at: [https://nvoydia.vercel.app](https://nvoydia.vercel.app)

## 📋 Features

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

## 🛠 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)
- **Charts**: Chart.js
- **Deployment**: Vercel

## 📁 Project Structure

```
nvoydia-2/
├── index.html              # Main HTML file
├── modern-styles.css       # Enhanced responsive styles
├── modern-script.js        # Main JavaScript functionality
├── data-service.js         # Data management
├── vercel.json            # Vercel deployment config
├── package.json           # Project configuration
└── README.md              # This file
```

## 🔧 Local Development

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

## 🚀 Deployment

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

## 📊 Dashboard Sections

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

## 🎨 Customization

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

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

For questions or support, please contact the NVoydia team.