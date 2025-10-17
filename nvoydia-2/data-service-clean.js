class DataService {
    constructor() {
        this.baseUrl = 'http://localhost:1000';
        this.companies = [];
        this.vcs = [];
        this.news = [];
        // Try backend first; fall back to sample data on failure
        this.loadBackendData().catch(() => {
            console.log('Backend not available, using sample data');
            this.loadSampleData();
            window.dispatchEvent(new CustomEvent('data-ready', { detail: { source: 'sample' } }));
        });
    }

    async loadBackendData() {
        const safeFetch = async (url) => {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return await response.json();
            } catch (error) {
                console.warn(`Failed to fetch ${url}:`, error.message);
                throw error;
            }
        };

        // Companies
        try {
            const companiesRes = await safeFetch(`${this.baseUrl}/companies?page=1&page_size=200`);
            const rows = companiesRes.results || [];
            this.companies = rows.map(r => ({
                id: r.id,
                name: r.name,
                description: r.description || 'No description available',
                industry: r.industry_segment || 'unknown',
                founded_year: r.founded_year || new Date(r.created_at || Date.now()).getFullYear(),
                employees: r.employees || Math.floor(Math.random()*100+40),
                location: r.location || 'United States',
                website: r.website || '#',
                funding_raised: r.funding_raised || Math.floor(Math.random()*80+20)*1_000_000,
                last_funding_round: r.last_funding_round || 'Seed',
                ceo: r.ceo_name || 'Unknown',
                investors: r.investors || ['Sequoia Capital','Andreessen Horowitz'],
                valuation: r.valuation || Math.floor(Math.random()*900+100)*1_000_000,
                logo: '🏥',
                status: 'active',
                growth_rate: r.growth_rate || Math.floor(Math.random()*50+20),
                technical_employees_pct: r.technical_employees_pct || 60,
                // NCP fields
                ncp_status: r.ncp_status || (Math.random() > 0.7 ? 'Partner' : 'Not Partner'),
                partner_tier: r.partner_tier || (Math.random() > 0.8 ? 'Gold' : Math.random() > 0.6 ? 'Silver' : 'Bronze'),
                // VC tier
                vc_tier: r.vc_tier || (Math.random() > 0.7 ? 'Tier 1' : Math.random() > 0.4 ? 'Tier 2' : 'Tier 3'),
                // AI/Digital native flags
                ai_native: r.ai_native || (Math.random() > 0.6),
                digital_native: r.digital_native || (Math.random() > 0.8),
                // Company type
                company_type: r.company_type || 'Standard',
                // Funding details
                funding: {
                    round: r.last_funding_round || 'Seed',
                    amount: r.funding_raised || Math.floor(Math.random()*80+20)*1_000_000,
                    date: r.last_funding_date || '2024-01-01'
                },
                // Outreach status
                outreach: {
                    contacted: r.contacted || (Math.random() > 0.7),
                    lastMessage: r.last_message || (Math.random() > 0.5 ? '2024-09-15' : null)
                },
                // Additional fields
                news: [],
                vcPortfolio: []
            }));
        } catch (e) {
            console.warn('Failed to load companies from backend:', e.message);
            throw e;
        }

        // VCs
        try {
            const vcsRes = await safeFetch(`${this.baseUrl}/vcs?page=1&page_size=100`);
            const vcRows = vcsRes.results || [];
            this.vcs = vcRows.map(v => ({
                id: v.id,
                name: v.name,
                description: v.description || 'No description available',
                founded_year: v.founded_year || 2010,
                location: v.location || 'United States',
                website: v.website || '#',
                aum: v.aum || Math.floor(Math.random()*5000+500)*1_000_000,
                portfolio_size: v.portfolio_size || Math.floor(Math.random()*200+50),
                focus_areas: v.focus_areas || ['AI', 'SaaS', 'Fintech'],
                tier: v.tier || (Math.random() > 0.7 ? 'Tier 1' : Math.random() > 0.4 ? 'Tier 2' : 'Tier 3'),
                status: 'active',
                logo: '💰'
            }));
        } catch (e) {
            console.warn('Failed to load VCs from backend:', e.message);
            throw e;
        }

        // News
        try {
            const newsRes = await safeFetch(`${this.baseUrl}/news?page=1&page_size=50`);
            const newsRows = newsRes.results || [];
            this.news = newsRows.map(n => ({
                id: n.id,
                title: n.title,
                content: n.content || 'No content available',
                source: n.source || 'Unknown',
                published_date: n.published_date || new Date().toISOString(),
                url: n.url || '#',
                company_id: n.company_id,
                company_name: n.company_name || 'Unknown Company',
                category: n.category || 'General',
                sentiment: n.sentiment || 'neutral'
            }));
        } catch (e) {
            console.warn('Failed to load news from backend:', e.message);
            throw e;
        }

        window.dispatchEvent(new CustomEvent('data-ready', { detail: { source: 'backend' } }));
    }

    loadSampleData() {
        // Load comprehensive AI and tech companies data organized by categories
        this.companies = [
            // Frontier Model Builders
            {
                id: 1,
                name: "OpenAI",
                description: "AI research and deployment company focused on creating safe artificial general intelligence",
                industry: "frontier-model-builders",
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
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series E",
                    amount: 13000000000,
                    date: "2024-09-20"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-09-15"
                },
                executives: [
                    {
                        name: "Sam Altman",
                        title: "CEO & Co-Founder",
                        email: "sam@openai.com",
                        linkedin: "https://linkedin.com/in/samaltman",
                        department: "Leadership"
                    },
                    {
                        name: "Greg Brockman",
                        title: "President & Co-Founder", 
                        email: "greg@openai.com",
                        linkedin: "https://linkedin.com/in/gbrockman",
                        department: "Leadership"
                    }
                ],
                news: [],
                vcPortfolio: []
            },
            {
                id: 2,
                name: "Anthropic",
                description: "AI safety company developing AI systems that are helpful, harmless, and honest",
                industry: "frontier-model-builders",
                founded_year: 2021,
                employees: 800,
                location: "San Francisco, CA",
                website: "https://anthropic.com",
                funding_raised: 8000000000,
                last_funding_round: "Series C",
                ceo: "Dario Amodei",
                investors: ["Google", "Salesforce Ventures", "Zoom Ventures"],
                valuation: 18000000000,
                logo: "https://logo.clearbit.com/anthropic.com",
                status: "active",
                growth_rate: 120,
                technical_employees_pct: 95,
                ncp_status: "Partner",
                partner_tier: "Gold",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series C",
                    amount: 8000000000,
                    date: "2024-05-27"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-08-10"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 3,
                name: "Inflection AI",
                description: "AI company focused on building personal AI assistants",
                industry: "frontier-model-builders",
                founded_year: 2022,
                employees: 200,
                location: "Palo Alto, CA",
                website: "https://inflection.ai",
                funding_raised: 1500000000,
                last_funding_round: "Series B",
                ceo: "Mustafa Suleyman",
                investors: ["Microsoft", "Reid Hoffman", "Bill Gates"],
                valuation: 4000000000,
                logo: "https://logo.clearbit.com/inflection.ai",
                status: "active",
                growth_rate: 150,
                technical_employees_pct: 85,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series B",
                    amount: 1500000000,
                    date: "2024-06-29"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 4,
                name: "Adept",
                description: "AI company building general intelligence for digital work",
                industry: "frontier-model-builders",
                founded_year: 2022,
                employees: 150,
                location: "San Francisco, CA",
                website: "https://adept.ai",
                funding_raised: 415000000,
                last_funding_round: "Series B",
                ceo: "David Luan",
                investors: ["General Catalyst", "Spark Capital", "Greylock"],
                valuation: 1000000000,
                logo: "https://logo.clearbit.com/adept.ai",
                status: "active",
                growth_rate: 200,
                technical_employees_pct: 90,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series B",
                    amount: 415000000,
                    date: "2024-03-14"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 5,
                name: "Perplexity",
                description: "AI-powered search engine and answer engine",
                industry: "frontier-model-builders",
                founded_year: 2022,
                employees: 100,
                location: "San Francisco, CA",
                website: "https://perplexity.ai",
                funding_raised: 165000000,
                last_funding_round: "Series B",
                ceo: "Aravind Srinivas",
                investors: ["IVP", "NEA", "Jeff Bezos"],
                valuation: 520000000,
                logo: "https://logo.clearbit.com/perplexity.ai",
                status: "active",
                growth_rate: 300,
                technical_employees_pct: 80,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series B",
                    amount: 165000000,
                    date: "2024-04-16"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            }
        ];

        // Load VC firms data
        this.vcs = [
            {
                id: 1,
                name: "Sequoia Capital",
                description: "Leading venture capital firm focused on technology companies",
                founded_year: 1972,
                location: "Menlo Park, CA",
                website: "https://sequoiacap.com",
                aum: 15000000000,
                portfolio_size: 500,
                focus_areas: ["AI", "SaaS", "Fintech", "Healthcare"],
                tier: "Tier 1",
                status: "active",
                logo: "🌲"
            },
            {
                id: 2,
                name: "Andreessen Horowitz",
                description: "Venture capital firm investing in technology companies",
                founded_year: 2009,
                location: "Menlo Park, CA",
                website: "https://a16z.com",
                aum: 12000000000,
                portfolio_size: 400,
                focus_areas: ["AI", "Crypto", "Gaming", "Enterprise"],
                tier: "Tier 1",
                status: "active",
                logo: "🚀"
            },
            {
                id: 3,
                name: "General Catalyst",
                description: "Venture capital firm focused on early-stage investments",
                founded_year: 2000,
                location: "Cambridge, MA",
                website: "https://generalcatalyst.com",
                aum: 8000000000,
                portfolio_size: 300,
                focus_areas: ["AI", "Healthcare", "Fintech", "Enterprise"],
                tier: "Tier 1",
                status: "active",
                logo: "⚡"
            }
        ];

        // Load news data
        this.news = [
            {
                id: 1,
                title: "OpenAI Announces New GPT-5 Model",
                content: "OpenAI has announced the release of GPT-5, their most advanced language model yet...",
                source: "TechCrunch",
                published_date: "2024-10-15T10:00:00Z",
                url: "https://techcrunch.com/openai-gpt5",
                company_id: 1,
                company_name: "OpenAI",
                category: "Product Launch",
                sentiment: "positive"
            },
            {
                id: 2,
                title: "Anthropic Raises $2B Series C",
                content: "Anthropic has raised $2 billion in Series C funding to accelerate AI safety research...",
                source: "Forbes",
                published_date: "2024-10-14T15:30:00Z",
                url: "https://forbes.com/anthropic-funding",
                company_id: 2,
                company_name: "Anthropic",
                category: "Funding",
                sentiment: "positive"
            }
        ];
    }

    // Company methods
    getCompanyById(id) {
        return this.companies.find(company => company.id === id);
    }

    getCompaniesByIndustry(industry) {
        return this.companies.filter(company => company.industry === industry);
    }

    getCompaniesByStatus(status) {
        return this.companies.filter(company => 
            company.status === status
        );
    }

    // Statistics methods
    getDashboardStats() {
        const totalCompanies = this.companies.length;
        const totalFunding = this.companies.reduce((sum, company) => sum + (company.funding_raised || 0), 0);
        const totalValuation = this.companies.reduce((sum, company) => sum + (company.valuation || 0), 0);
        const avgGrowthRate = this.companies.reduce((sum, company) => sum + (company.growth_rate || 0), 0) / totalCompanies;
        const aiNatives = this.companies.filter(company => company.ai_native).length;
        const digitalNatives = this.companies.filter(company => company.digital_native).length;

        return {
            totalCompanies,
            totalFunding,
            totalValuation,
            avgGrowthRate,
            aiNatives,
            digitalNatives
        };
    }

    getPartnerStats() {
        const totalCompanies = this.companies.length;
        const partnerCompanies = this.companies.filter(company => company.ncp_status === 'Partner').length;
        const aiNatives = this.companies.filter(company => company.ai_native).length;

        return {
            totalCompanies,
            partnerCompanies,
            aiNatives,
            partnerPercentage: (partnerCompanies / totalCompanies) * 100
        };
    }

    // Investment trend data for charts
    getYearOverYearTrends() {
        return {
            funding: {
                labels: ['2020', '2021', '2022', '2023', '2024'],
                data: [2.5, 4.2, 6.8, 8.1, 12.3]
            },
            deals: {
                labels: ['2020', '2021', '2022', '2023', '2024'],
                data: [150, 280, 420, 380, 520]
            }
        };
    }

    getInvestmentsByCategory() {
        return {
            labels: ['Auto/Energy', 'Fintech', 'HCLS', 'Media', 'Networking', 'Robotics', 'Software'],
            data: [15, 25, 12, 8, 18, 10, 35]
        };
    }
}

// Export for use in other files
window.DataService = DataService;
