// Data Service - Loads Piloterr sample data
class DataService {
    constructor() {
        this.companies = [];
        this.vcs = [];
        this.news = [];
        this.loadSampleData();
    }

    loadSampleData() {
        // Load Digital Natives companies data
        this.companies = [
            {
                id: 1,
                name: "OpenAI",
                description: "AI research and deployment company focused on creating safe artificial general intelligence",
                industry: "ai-natives",
                founded_year: 2015,
                employees: 1500,
                location: "San Francisco, CA",
                website: "https://openai.com",
                funding_raised: 13000000000,
                last_funding_round: "Series E",
                ceo: "Sam Altman",
                investors: ["Microsoft", "Khosla Ventures", "Reid Hoffman"],
                valuation: 29000000000,
                logo: "https://logo.clearbit.com/openai.com",
                status: "active",
                growth_rate: 85,
                technical_employees_pct: 90,
                ncp_status: "Partner",
                ncp_tier: "Premier"
            },
            {
                id: 2,
                name: "Uber",
                description: "Global ride-sharing and food delivery platform connecting riders with drivers",
                industry: "digital-natives",
                founded_year: 2009,
                employees: 32000,
                location: "San Francisco, CA",
                website: "https://uber.com",
                funding_raised: 25000000000,
                last_funding_round: "IPO",
                ceo: "Dara Khosrowshahi",
                investors: ["Benchmark", "Google Ventures", "Goldman Sachs"],
                valuation: 75000000000,
                logo: "https://logo.clearbit.com/uber.com",
                status: "public",
                growth_rate: 15,
                technical_employees_pct: 60,
                ncp_status: "Partner",
                ncp_tier: "Premier"
            },
            {
                id: 3,
                name: "Airbnb",
                description: "Online marketplace for short-term homestays and experiences",
                industry: "digital-natives",
                founded_year: 2008,
                employees: 15000,
                location: "San Francisco, CA",
                website: "https://airbnb.com",
                funding_raised: 6000000000,
                last_funding_round: "IPO",
                ceo: "Brian Chesky",
                investors: ["Sequoia Capital", "Andreessen Horowitz", "General Atlantic"],
                valuation: 75000000000,
                logo: "https://logo.clearbit.com/airbnb.com",
                status: "public",
                growth_rate: 25,
                technical_employees_pct: 65,
                ncp_status: "Not Partner",
                ncp_tier: null
            },
            {
                id: 4,
                name: "Spotify",
                description: "Digital music streaming service providing access to millions of songs",
                industry: "digital-natives",
                founded_year: 2006,
                employees: 8500,
                location: "Stockholm, Sweden",
                website: "https://spotify.com",
                funding_raised: 1000000000,
                last_funding_round: "IPO",
                ceo: "Daniel Ek",
                investors: ["Technology Crossover Ventures", "Kleiner Perkins", "Accel"],
                valuation: 30000000000,
                logo: "https://logo.clearbit.com/spotify.com",
                status: "public",
                growth_rate: 20,
                technical_employees_pct: 70,
                ncp_status: "Partner",
                ncp_tier: "Standard"
            },
            {
                id: 5,
                name: "Anthropic",
                description: "AI safety company developing Claude, a helpful and harmless AI assistant",
                industry: "ai-natives",
                founded_year: 2021,
                employees: 400,
                location: "San Francisco, CA",
                website: "https://anthropic.com",
                funding_raised: 700000000,
                last_funding_round: "Series C",
                ceo: "Dario Amodei",
                investors: ["Google", "Salesforce Ventures", "Zoom Ventures"],
                valuation: 18000000000,
                logo: "https://logo.clearbit.com/anthropic.com",
                status: "active",
                growth_rate: 95,
                technical_employees_pct: 88,
                ncp_status: "Partner",
                ncp_tier: "Premier"
            },
            {
                id: 6,
                name: "Stripe",
                description: "Online payment processing platform for internet businesses",
                industry: "fintech",
                founded_year: 2010,
                employees: 7000,
                location: "San Francisco, CA",
                website: "https://stripe.com",
                funding_raised: 2000000000,
                last_funding_round: "Series H",
                ceo: "Patrick Collison",
                investors: ["Sequoia Capital", "Andreessen Horowitz", "General Catalyst"],
                valuation: 95000000000,
                logo: "https://logo.clearbit.com/stripe.com",
                status: "private",
                growth_rate: 40,
                technical_employees_pct: 75,
                ncp_status: "Partner",
                ncp_tier: "Premier"
            },
            {
                id: 7,
                name: "Discord",
                description: "Voice, video and text communication platform for communities",
                industry: "social-media",
                founded_year: 2015,
                employees: 600,
                location: "San Francisco, CA",
                website: "https://discord.com",
                funding_raised: 1000000000,
                last_funding_round: "Series H",
                ceo: "Jason Citron",
                investors: ["Index Ventures", "Greylock Partners", "IVP"],
                valuation: 15000000000,
                logo: "https://logo.clearbit.com/discord.com",
                status: "private",
                growth_rate: 60,
                technical_employees_pct: 80,
                ncp_status: "Not Partner",
                ncp_tier: null
            },
            {
                id: 8,
                name: "Canva",
                description: "Online design and publishing platform for creating visual content",
                industry: "digital-natives",
                founded_year: 2013,
                employees: 4000,
                location: "Sydney, Australia",
                website: "https://canva.com",
                funding_raised: 560000000,
                last_funding_round: "Series F",
                ceo: "Melanie Perkins",
                investors: ["Sequoia Capital", "Blackbird Ventures", "General Catalyst"],
                valuation: 40000000000,
                logo: "https://logo.clearbit.com/canva.com",
                status: "private",
                growth_rate: 35,
                technical_employees_pct: 70,
                ncp_status: "Not Partner",
                ncp_tier: null
            },
            {
                id: 9,
                name: "Midjourney",
                description: "AI-powered image generation platform using machine learning",
                industry: "ai-natives",
                founded_year: 2021,
                employees: 50,
                location: "San Francisco, CA",
                website: "https://midjourney.com",
                funding_raised: 0,
                last_funding_round: "Bootstrapped",
                ceo: "David Holz",
                investors: ["Bootstrapped"],
                valuation: 10000000000,
                logo: "https://logo.clearbit.com/midjourney.com",
                status: "active",
                growth_rate: 200,
                technical_employees_pct: 95,
                ncp_status: "Partner",
                ncp_tier: "Standard"
            },
            {
                id: 10,
                name: "Notion",
                description: "All-in-one workspace for notes, docs, wikis, and project management",
                industry: "digital-natives",
                founded_year: 2016,
                employees: 300,
                location: "San Francisco, CA",
                website: "https://notion.so",
                funding_raised: 340000000,
                last_funding_round: "Series C",
                ceo: "Ivan Zhao",
                investors: ["Index Ventures", "Sequoia Capital", "First Round"],
                valuation: 10000000000,
                logo: "https://logo.clearbit.com/notion.so",
                status: "private",
                growth_rate: 80,
                technical_employees_pct: 85,
                ncp_status: "Not Partner",
                ncp_tier: null
            },
            {
                id: 11,
                name: "Cohere",
                description: "Enterprise AI platform providing natural language processing capabilities",
                industry: "ai-natives",
                founded_year: 2019,
                employees: 200,
                location: "Toronto, Canada",
                website: "https://cohere.ai",
                funding_raised: 270000000,
                last_funding_round: "Series C",
                ceo: "Aidan Gomez",
                investors: ["Tiger Global", "Index Ventures", "Radical Ventures"],
                valuation: 2200000000,
                logo: "https://logo.clearbit.com/cohere.ai",
                status: "active",
                growth_rate: 120,
                technical_employees_pct: 90,
                ncp_status: "Partner",
                ncp_tier: "Premier"
            },
            {
                id: 12,
                name: "Figma",
                description: "Collaborative interface design tool for teams",
                industry: "digital-natives",
                founded_year: 2012,
                employees: 800,
                location: "San Francisco, CA",
                website: "https://figma.com",
                funding_raised: 333000000,
                last_funding_round: "Series E",
                ceo: "Dylan Field",
                investors: ["Index Ventures", "Greylock Partners", "Kleiner Perkins"],
                valuation: 20000000000,
                logo: "https://logo.clearbit.com/figma.com",
                status: "acquired",
                growth_rate: 45,
                technical_employees_pct: 75,
                ncp_status: "Partner",
                ncp_tier: "Standard"
            }
        ];

        this.vcs = [
            {
                id: 101,
                name: "Sequoia Capital",
                description: "Leading venture capital firm focused on technology and digital natives investments",
                location: "Menlo Park, CA",
                investment_stage: "multi-stage",
                website: "https://sequoiacap.com",
                portfolio_companies: 500,
                total_aum: 15000000000,
                focus_areas: ["Digital Natives", "AI", "Fintech"],
                final_score: 95.8,
                logo: "",
                investments: 45
            },
            {
                id: 102,
                name: "Andreessen Horowitz",
                description: "Silicon Valley venture capital firm investing in technology companies",
                location: "Menlo Park, CA",
                investment_stage: "multi-stage",
                website: "https://a16z.com",
                portfolio_companies: 400,
                total_aum: 12000000000,
                focus_areas: ["AI Natives", "Digital Natives", "Marketplace"],
                final_score: 92.3,
                logo: "https://logo.clearbit.com/a16z.com",
                investments: 38
            },
            {
                id: 103,
                name: "Index Ventures",
                description: "Venture capital firm focused on early-stage technology companies",
                location: "San Francisco, CA",
                investment_stage: "early-stage",
                website: "https://indexventures.com",
                portfolio_companies: 300,
                total_aum: 5000000000,
                focus_areas: ["Digital Natives", "AI", "Social Media"],
                final_score: 87.6,
                logo: "https://logo.clearbit.com/indexventures.com",
                investments: 32
            },
            {
                id: 104,
                name: "Kleiner Perkins",
                description: "Venture capital firm investing in technology and digital transformation",
                location: "Menlo Park, CA",
                investment_stage: "multi-stage",
                website: "https://kleinerperkins.com",
                portfolio_companies: 350,
                total_aum: 8000000000,
                focus_areas: ["AI Natives", "Digital Natives", "Enterprise"],
                final_score: 89.2,
                logo: "https://logo.clearbit.com/kleinerperkins.com",
                investments: 28
            },
            {
                id: 105,
                name: "General Catalyst",
                description: "Venture capital firm focused on technology and digital innovation",
                location: "Cambridge, MA",
                investment_stage: "multi-stage",
                website: "https://generalcatalyst.com",
                portfolio_companies: 200,
                total_aum: 6000000000,
                focus_areas: ["Digital Natives", "AI", "Fintech"],
                final_score: 91.5,
                logo: "https://logo.clearbit.com/generalcatalyst.com",
                investments: 35
            },
            {
                id: 106,
                name: "Accel",
                description: "Global venture capital firm investing in technology companies",
                location: "Palo Alto, CA",
                investment_stage: "multi-stage",
                website: "https://accel.com",
                portfolio_companies: 150,
                total_aum: 4000000000,
                focus_areas: ["Digital Natives", "AI", "Marketplace"],
                final_score: 88.7,
                logo: "https://logo.clearbit.com/accel.com",
                investments: 25
            }
        ];

        this.news = [
            {
                id: 1,
                headline: "OpenAI Raises $13B Series E Led by Microsoft to Scale AI Infrastructure",
                content: "AI research company secures massive funding round to expand their artificial general intelligence capabilities and infrastructure...",
                published_at: "2024-09-20T10:00:00Z",
                source: "TechCrunch",
                company_id: 1,
                category: "funding",
                read_time: "3 min read"
            },
            {
                id: 2,
                headline: "Uber Launches New AI-Powered Driver Matching Algorithm",
                content: "Ride-sharing platform introduces advanced machine learning system to optimize driver-rider matching and reduce wait times...",
                published_at: "2024-09-18T14:30:00Z",
                source: "The Verge",
                company_id: 2,
                category: "product",
                read_time: "2 min read"
            },
            {
                id: 3,
                headline: "Airbnb Partners with NVIDIA to Enhance AI-Powered Recommendations",
                content: "Home-sharing platform collaborates with NVIDIA to improve their machine learning recommendation engine for better user experiences...",
                published_at: "2024-09-15T09:15:00Z",
                source: "Forbes",
                company_id: 3,
                category: "partnership",
                read_time: "4 min read"
            },
            {
                id: 4,
                headline: "Spotify Announces Major AI Music Discovery Features",
                content: "Music streaming service launches new AI-powered features for personalized music discovery and playlist generation...",
                published_at: "2024-09-12T16:45:00Z",
                source: "Billboard",
                company_id: 4,
                category: "product",
                read_time: "3 min read"
            },
            {
                id: 5,
                headline: "Anthropic Secures $700M Series C to Scale Claude AI Assistant",
                content: "AI safety company raises significant funding to expand their helpful and harmless AI assistant capabilities...",
                published_at: "2024-09-10T11:20:00Z",
                source: "VentureBeat",
                company_id: 5,
                category: "funding",
                read_time: "2 min read"
            },
            {
                id: 6,
                headline: "Stripe's AI Fraud Detection Shows 99.5% Accuracy Rate",
                content: "Payment processing platform's machine learning fraud detection system demonstrates exceptional accuracy in preventing fraudulent transactions...",
                published_at: "2024-09-08T08:30:00Z",
                source: "Fintech News",
                company_id: 6,
                category: "product",
                read_time: "3 min read"
            },
            {
                id: 7,
                headline: "Discord Partners with NVIDIA for Enhanced Gaming Integration",
                content: "Communication platform collaborates with NVIDIA to improve gaming-focused features and performance optimization...",
                published_at: "2024-09-05T13:15:00Z",
                source: "GamesIndustry.biz",
                company_id: 7,
                category: "partnership",
                read_time: "4 min read"
            },
            {
                id: 8,
                headline: "Canva Launches AI-Powered Design Assistant for Content Creation",
                content: "Design platform introduces new AI features to help users create professional designs with intelligent suggestions and automation...",
                published_at: "2024-09-03T15:45:00Z",
                source: "Design Week",
                company_id: 8,
                category: "product",
                read_time: "3 min read"
            },
            {
                id: 9,
                headline: "Midjourney's AI Image Generation Reaches 10 Million Users",
                content: "AI-powered image creation platform achieves major milestone with rapid user growth and expanding creative capabilities...",
                published_at: "2024-09-01T10:00:00Z",
                source: "AI News",
                company_id: 9,
                category: "growth",
                read_time: "5 min read"
            },
            {
                id: 10,
                headline: "Notion Expands AI Writing Assistant to All Users",
                content: "Productivity platform makes AI-powered writing assistance available to all users to enhance content creation workflows...",
                published_at: "2024-08-28T12:30:00Z",
                source: "Product Hunt",
                company_id: 10,
                category: "product",
                read_time: "2 min read"
            }
        ];
    }

    // Search functionality
    searchCompanies(query) {
        if (!query) return this.companies;
        
        const searchTerm = query.toLowerCase();
        return this.companies.filter(company => 
            company.name.toLowerCase().includes(searchTerm) ||
            company.description.toLowerCase().includes(searchTerm) ||
            company.industry.toLowerCase().includes(searchTerm) ||
            company.location.toLowerCase().includes(searchTerm) ||
            company.ceo.toLowerCase().includes(searchTerm)
        );
    }

    searchVCs(query) {
        if (!query) return this.vcs;
        
        const searchTerm = query.toLowerCase();
        return this.vcs.filter(vc => 
            vc.name.toLowerCase().includes(searchTerm) ||
            vc.description.toLowerCase().includes(searchTerm) ||
            vc.location.toLowerCase().includes(searchTerm)
        );
    }

    searchNews(query) {
        if (!query) return this.news;
        
        const searchTerm = query.toLowerCase();
        return this.news.filter(article => 
            article.headline.toLowerCase().includes(searchTerm) ||
            article.content.toLowerCase().includes(searchTerm) ||
            article.source.toLowerCase().includes(searchTerm)
        );
    }

    searchFundingRounds(query) {
        if (!query) return [];
        
        const searchTerm = query.toLowerCase();
        // Create sample funding rounds data for search
        const fundingRounds = [
            {
                id: 1,
                company_name: "MediTech Solutions",
                round_type: "Series B",
                amount: 45000000,
                date: "2024-01-15",
                industry: "ai-natives",
                investors: ["Sequoia Capital", "Andreessen Horowitz"]
            },
            {
                id: 2,
                company_name: "HealthFlow",
                round_type: "Series A",
                amount: 32000000,
                date: "2024-02-20",
                industry: "digital-natives",
                investors: ["First Round Capital", "Khosla Ventures"]
            },
            {
                id: 3,
                company_name: "BioGenetics Corp",
                round_type: "Seed",
                amount: 15000000,
                date: "2024-03-10",
                industry: "fintech",
                investors: ["Y Combinator", "General Catalyst"]
            }
        ];
        
        return fundingRounds.filter(round => 
            round.company_name.toLowerCase().includes(searchTerm) ||
            round.round_type.toLowerCase().includes(searchTerm) ||
            round.industry.toLowerCase().includes(searchTerm) ||
            round.investors.some(investor => investor.toLowerCase().includes(searchTerm))
        );
    }

    searchInvestors(query) {
        if (!query) return [];
        
        const searchTerm = query.toLowerCase();
        // Create sample investors data for search
        const investors = [
            {
                id: 1,
                name: "Sequoia Capital",
                type: "VC",
                location: "Menlo Park, CA",
                investments: 1250,
                focus_areas: ["Technology", "Digital Natives", "AI"],
                logo: ""
            },
            {
                id: 2,
                name: "Andreessen Horowitz",
                type: "VC",
                location: "Menlo Park, CA",
                investments: 980,
                focus_areas: ["Technology", "Digital Natives", "AI"],
                logo: "https://logo.clearbit.com/a16z.com"
            },
            {
                id: 3,
                name: "First Round Capital",
                type: "VC",
                location: "San Francisco, CA",
                investments: 750,
                focus_areas: ["Early Stage", "Technology", "Digital Natives"],
                logo: "🎯"
            }
        ];
        
        return investors.filter(investor => 
            investor.name.toLowerCase().includes(searchTerm) ||
            investor.location.toLowerCase().includes(searchTerm) ||
            investor.focus_areas.some(area => area.toLowerCase().includes(searchTerm))
        );
    }

    formatCurrency(amount) {
        if (amount >= 1000000000) {
            return `$${(amount / 1000000000).toFixed(1)}B`;
        } else if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(1)}K`;
        }
        return `$${amount}`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    // Get company by ID
    getCompanyById(id) {
        return this.companies.find(company => company.id === id);
    }

    // Get VC by ID
    getVCById(id) {
        return this.vcs.find(vc => vc.id === id);
    }

    // Get news by company ID
    getNewsByCompanyId(companyId) {
        return this.news.filter(article => article.company_id === companyId);
    }

    // Get companies by industry
    getCompaniesByIndustry(industry) {
        return this.companies.filter(company => company.industry === industry);
    }

    // Get recent news
    getRecentNews(limit = 5) {
        return this.news
            .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
            .slice(0, limit);
    }

    // Get top companies by valuation
    getTopCompaniesByValuation(limit = 5) {
        return this.companies
            .sort((a, b) => b.valuation - a.valuation)
            .slice(0, limit);
    }

    // Get top VCs by score
    getTopVCsByScore(limit = 3) {
        return this.vcs
            .sort((a, b) => b.final_score - a.final_score)
            .slice(0, limit);
    }

    // Format currency
    formatCurrency(amount) {
        if (amount >= 1000000000) {
            return `$${(amount / 1000000000).toFixed(1)}B`;
        } else if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(1)}K`;
        }
        return `$${amount}`;
    }

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Get dashboard statistics
    getDashboardStats() {
        const totalFunding = this.companies.reduce((sum, company) => sum + company.funding_raised, 0);
        const totalValuation = this.companies.reduce((sum, company) => sum + company.valuation, 0);
        const totalEmployees = this.companies.reduce((sum, company) => sum + company.employees, 0);
        const avgGrowthRate = this.companies.reduce((sum, company) => sum + company.growth_rate, 0) / this.companies.length;

        return {
            totalCompanies: this.companies.length,
            totalVCs: this.vcs.length,
            totalNews: this.news.length,
            totalFunding: totalFunding,
            totalValuation: totalValuation,
            totalEmployees: totalEmployees,
            avgGrowthRate: avgGrowthRate,
            industries: [...new Set(this.companies.map(c => c.industry))].length
        };
    }
}
