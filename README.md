# NVoydia Intelligence Platform

A comprehensive intelligence platform for tracking NVIDIA Partner Program (NCP) progress, managing outreach campaigns, and monitoring AI/Digital Native companies in the biotech and healthtech sectors.

## 🚀 Quick Start

### Live Dashboard
Visit the live dashboard: [https://nvoydia.vercel.app](https://nvoydia.vercel.app)

### Local Development
```bash
# Run the main dashboard
cd nvoydia-2
python -m http.server 8080
# Open http://localhost:8080

# Run the API backend (optional)
cd dashboard/backend
python main.py
# API docs at http://localhost:8000/docs
```

## 📋 Project Overview

NVoydia is a modern intelligence platform that combines:
- **NVIDIA Partner Program Tracking** - Monitor NCP progress and partner status
- **AI/Digital Native Company Intelligence** - Track emerging companies in biotech/healthtech
- **Venture Capital Analysis** - VC scoring and portfolio analysis
- **News & Market Intelligence** - AI-powered news aggregation and summarization
- **Outreach Management** - Contact tracking and campaign management

## 📁 Project Structure

```
nvoydia/
├── nvoydia-2/                     # 🎯 Main Dashboard Application
│   ├── index.html                 # Main dashboard interface
│   ├── modern-styles.css          # Responsive styling with CSS variables
│   ├── modern-script.js           # Core JavaScript functionality
│   ├── data-service.js            # Data management and API integration
│   ├── chart.min.js               # Chart.js library for visualizations
│   └── README.md                  # Comprehensive dashboard documentation
├── dashboard/                     # 🔧 FastAPI Backend
│   └── backend/                   # API server and database
│       ├── main.py                # FastAPI application with endpoints
│       ├── requirements.txt       # Python dependencies
│       └── README.md              # API documentation
├── nvoydia-1/                     # 📦 Legacy Components (OLD SCOPE - Archived)
│   ├── api_integration_tests/     # Legacy API testing and integration work
│   ├── ass/                       # Legacy assignment files and documentation
│   ├── biotech-dashboard/         # Legacy alternative dashboard implementation
│   ├── data/                      # Legacy raw and processed data files
│   ├── news/                      # Legacy news aggregation tools
│   ├── newsdata/                  # Legacy news data storage
│   ├── scraping/                  # Legacy web scraping tools and scripts
│   ├── nvoydia-updated/           # Legacy updated project files
│   ├── pitchbook_*                # Legacy PitchBook scraped data
│   └── README.md                  # Legacy components documentation
└── README.md                      # This file - Project overview
```

### 🎯 Active Development
- **`nvoydia-2/`** - Main dashboard application (HTML/CSS/JS)
- **`dashboard/backend/`** - FastAPI backend with database

### 📦 Archived Components (OLD SCOPE)
- **`nvoydia-1/`** - **LEGACY** components and experimental features from old scope

## 🎯 Key Features

### Dashboard Capabilities
- **🎯 NCP Progress Tracking** - Monitor NVIDIA Partner Program status and completion
- **🤖 AI/Digital Native Focus** - Track AI-native and digital-native companies
- **📊 Advanced Filtering** - Filter by industry, funding, date range, and VC tier
- **📈 Outreach Management** - Track contact status and campaign progress
- **📰 News Intelligence** - AI-powered news summaries and trend analysis
- **💼 VC Portfolio Analysis** - Venture capital firm scoring and portfolio insights
- **📥 Data Export** - CSV export for outreach campaigns and analysis
- **📱 Responsive Design** - Works on desktop and mobile devices
- **🌙 Theme Support** - Dark and light mode options

### Data Sources
- **Piloterr Crunchbase API** - Company information and funding data
- **News APIs** - Real-time news aggregation and summarization
- **VC Databases** - Venture capital firm information and portfolios
- **NVIDIA Partner Data** - NCP program status and partner information

## 🚀 Getting Started

### Prerequisites
- Python 3.8+ (for local development)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for external APIs and CDN resources)

### Quick Start
1. **Run the Dashboard**:
   ```bash
   cd nvoydia-2
   python -m http.server 8080
   # Open http://localhost:8080
   ```

2. **Run the API Backend** (optional):
   ```bash
   cd dashboard/backend
   pip install -r requirements.txt
   python main.py
   # API docs at http://localhost:8000/docs
   ```

3. **View Legacy API Tests** (if needed):
   ```bash
   cd nvoydia-1/api_integration_tests
   python piloterr_crunchbase_test.py
   ```

## 📊 Data Structure

### Current Dashboard Data (nvoydia-2/)
**All current dashboard data is contained within `nvoydia-2/`:**
- **`data-service.js`** (3,744 lines) - Main data source with 50+ companies
- **Sample Data Categories**:
  - Frontier Model Builders (OpenAI, Anthropic, etc.)
  - Agentic Generative AI companies
  - Customer Experience tools
  - Medical Imaging & Digital Health
  - Biotech companies
- **Data Fields**: Company info, funding, NCP status, AI classification, outreach tracking

### Legacy Data (nvoydia-1/ - OLD SCOPE)
**⚠️ Legacy data from old scope - not used by current dashboard:**
- API integration test data
- Scraped PitchBook data
- Legacy biotech dashboard data
- Old news aggregation tools
- Historical scraping results

### Company Information (Current)
- Company name and description
- Industry segment and category
- Total funding and last funding date
- Geographic location and year founded
- AI/Digital Native classification
- NCP partner status

### Investment Data (Current)
- Funding rounds and amounts
- Investor information
- Investment stages and types
- Portfolio company relationships

### News & Intelligence (Current)
- Company news and updates
- AI-generated summaries
- Industry trend analysis
- Market intelligence insights

## 🛠 Technology Stack

### Frontend
- **HTML5/CSS3/JavaScript** - Modern web standards
- **Chart.js** - Interactive data visualizations
- **Font Awesome** - Icon library
- **Google Fonts** - Typography (Inter font family)

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Database ORM
- **SQLite** - Local database storage
- **Pydantic** - Data validation

### Deployment
- **Vercel** - Frontend hosting and deployment
- **Python HTTP Server** - Local development server

## 📚 Documentation

- **[Dashboard Documentation](nvoydia-2/README.md)** - Comprehensive dashboard guide
- **[API Documentation](dashboard/backend/README.md)** - Backend API reference
- **[Legacy Components](nvoydia-1/README.md)** - Archived components documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

