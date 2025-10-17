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
                sector: "Software",
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
                sector: "Software",
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
                sector: "Software",
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
                sector: "Software",
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
                sector: "Software",
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
            },

            // Additional companies across different sectors
            {
                id: 6,
                name: "Tesla",
                description: "Electric vehicle and clean energy company",
                industry: "automotive",
                sector: "Auto",
                founded_year: 2003,
                employees: 140000,
                location: "Austin, TX",
                website: "https://tesla.com",
                funding_raised: 20000000000,
                last_funding_round: "IPO",
                ceo: "Elon Musk",
                investors: ["Elon Musk", "Google Ventures", "Daimler"],
                valuation: 800000000000,
                logo: "https://logo.clearbit.com/tesla.com",
                status: "active",
                growth_rate: 25,
                technical_employees_pct: 60,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "IPO",
                    amount: 20000000000,
                    date: "2010-06-29"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 7,
                name: "Stripe",
                description: "Online payment processing platform",
                industry: "fintech",
                sector: "FinTech",
                founded_year: 2010,
                employees: 8000,
                location: "San Francisco, CA",
                website: "https://stripe.com",
                funding_raised: 2000000000,
                last_funding_round: "Series H",
                ceo: "Patrick Collison",
                investors: ["Sequoia Capital", "Andreessen Horowitz", "General Catalyst"],
                valuation: 95000000000,
                logo: "https://logo.clearbit.com/stripe.com",
                status: "active",
                growth_rate: 40,
                technical_employees_pct: 80,
                ncp_status: "Partner",
                partner_tier: "Gold",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "Series H",
                    amount: 2000000000,
                    date: "2023-03-15"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-08-20"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 8,
                name: "Veracyte",
                description: "Genomic diagnostics company for cancer detection",
                industry: "healthcare",
                sector: "HCLS",
                founded_year: 2008,
                employees: 600,
                location: "South San Francisco, CA",
                website: "https://veracyte.com",
                funding_raised: 300000000,
                last_funding_round: "Series E",
                ceo: "Marc Stapley",
                investors: ["Kleiner Perkins", "T. Rowe Price", "Roche"],
                valuation: 1200000000,
                logo: "https://logo.clearbit.com/veracyte.com",
                status: "active",
                growth_rate: 35,
                technical_employees_pct: 70,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: false,
                digital_native: false,
                funding: {
                    round: "Series E",
                    amount: 300000000,
                    date: "2022-11-10"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 9,
                name: "Netflix",
                description: "Streaming entertainment service",
                industry: "media",
                sector: "Media",
                founded_year: 1997,
                employees: 15000,
                location: "Los Gatos, CA",
                website: "https://netflix.com",
                funding_raised: 100000000,
                last_funding_round: "IPO",
                ceo: "Ted Sarandos",
                investors: ["Reed Hastings", "Marc Randolph"],
                valuation: 200000000000,
                logo: "https://logo.clearbit.com/netflix.com",
                status: "active",
                growth_rate: 15,
                technical_employees_pct: 50,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "IPO",
                    amount: 100000000,
                    date: "2002-05-23"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 10,
                name: "Cisco",
                description: "Networking and cybersecurity solutions",
                industry: "networking",
                sector: "Networking",
                founded_year: 1984,
                employees: 80000,
                location: "San Jose, CA",
                website: "https://cisco.com",
                funding_raised: 5000000,
                last_funding_round: "IPO",
                ceo: "Chuck Robbins",
                investors: ["Don Valentine", "Sequoia Capital"],
                valuation: 200000000000,
                logo: "https://logo.clearbit.com/cisco.com",
                status: "active",
                growth_rate: 8,
                technical_employees_pct: 75,
                ncp_status: "Partner",
                partner_tier: "Silver",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: false,
                funding: {
                    round: "IPO",
                    amount: 5000000,
                    date: "1990-02-16"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-07-15"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 11,
                name: "Boston Dynamics",
                description: "Robotics company specializing in mobile robots",
                industry: "robotics",
                sector: "Robotics",
                founded_year: 1992,
                employees: 1200,
                location: "Waltham, MA",
                website: "https://bostondynamics.com",
                funding_raised: 1000000000,
                last_funding_round: "Acquisition",
                ceo: "Robert Playter",
                investors: ["Hyundai", "SoftBank", "Google"],
                valuation: 1100000000,
                logo: "https://logo.clearbit.com/bostondynamics.com",
                status: "active",
                growth_rate: 30,
                technical_employees_pct: 85,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: false,
                funding: {
                    round: "Acquisition",
                    amount: 1000000000,
                    date: "2021-06-21"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 12,
                name: "Microsoft",
                description: "Technology corporation developing software and cloud services",
                industry: "software",
                sector: "Software",
                founded_year: 1975,
                employees: 220000,
                location: "Redmond, WA",
                website: "https://microsoft.com",
                funding_raised: 1000000,
                last_funding_round: "IPO",
                ceo: "Satya Nadella",
                investors: ["Bill Gates", "Paul Allen"],
                valuation: 3000000000000,
                logo: "https://logo.clearbit.com/microsoft.com",
                status: "active",
                growth_rate: 12,
                technical_employees_pct: 70,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "IPO",
                    amount: 1000000,
                    date: "1986-03-13"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-09-01"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 13,
                name: "Rivian",
                description: "Electric vehicle manufacturer specializing in trucks and SUVs",
                industry: "automotive",
                sector: "Auto",
                founded_year: 2009,
                employees: 14000,
                location: "Irvine, CA",
                website: "https://rivian.com",
                funding_raised: 13000000000,
                last_funding_round: "IPO",
                ceo: "RJ Scaringe",
                investors: ["Amazon", "Ford", "Cox Automotive"],
                valuation: 15000000000,
                logo: "https://logo.clearbit.com/rivian.com",
                status: "active",
                growth_rate: 200,
                technical_employees_pct: 65,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "IPO",
                    amount: 13000000000,
                    date: "2021-11-10"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 14,
                name: "Palantir",
                description: "Data analytics and software company",
                industry: "software",
                sector: "Software",
                founded_year: 2003,
                employees: 4000,
                location: "Denver, CO",
                website: "https://palantir.com",
                funding_raised: 3000000000,
                last_funding_round: "IPO",
                ceo: "Alex Karp",
                investors: ["Peter Thiel", "Founders Fund", "In-Q-Tel"],
                valuation: 20000000000,
                logo: "https://logo.clearbit.com/palantir.com",
                status: "active",
                growth_rate: 45,
                technical_employees_pct: 80,
                ncp_status: "Partner",
                partner_tier: "Gold",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "IPO",
                    amount: 3000000000,
                    date: "2020-09-30"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-08-05"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 15,
                name: "Bloom Energy",
                description: "Clean energy company producing fuel cell systems",
                industry: "energy",
                sector: "Energy/Climate",
                founded_year: 2001,
                employees: 2000,
                location: "San Jose, CA",
                website: "https://bloomenergy.com",
                funding_raised: 2000000000,
                last_funding_round: "IPO",
                ceo: "KR Sridhar",
                investors: ["Kleiner Perkins", "New Enterprise Associates"],
                valuation: 3000000000,
                logo: "https://logo.clearbit.com/bloomenergy.com",
                status: "active",
                growth_rate: 20,
                technical_employees_pct: 60,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: false,
                digital_native: false,
                funding: {
                    round: "IPO",
                    amount: 2000000000,
                    date: "2018-07-25"
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
            },
            {
                id: 4,
                name: "Kleiner Perkins",
                description: "Venture capital firm investing in technology and life sciences",
                founded_year: 1972,
                location: "Menlo Park, CA",
                website: "https://kleinerperkins.com",
                aum: 6000000000,
                portfolio_size: 250,
                focus_areas: ["AI", "Healthcare", "Enterprise", "Consumer"],
                tier: "Tier 1",
                status: "active",
                logo: "💡"
            },
            {
                id: 5,
                name: "Index Ventures",
                description: "International venture capital firm focused on technology",
                founded_year: 1996,
                location: "San Francisco, CA",
                website: "https://indexventures.com",
                aum: 5000000000,
                portfolio_size: 200,
                focus_areas: ["AI", "SaaS", "Fintech", "Gaming"],
                tier: "Tier 1",
                status: "active",
                logo: "📈"
            },
            {
                id: 6,
                name: "Benchmark",
                description: "Venture capital firm focused on early-stage technology companies",
                founded_year: 1995,
                location: "San Francisco, CA",
                website: "https://benchmark.com",
                aum: 4000000000,
                portfolio_size: 150,
                focus_areas: ["AI", "Enterprise", "Consumer", "Marketplace"],
                tier: "Tier 1",
                status: "active",
                logo: "🎯"
            },
            {
                id: 7,
                name: "Accel",
                description: "Venture capital firm investing in technology companies",
                founded_year: 1983,
                location: "Palo Alto, CA",
                website: "https://accel.com",
                aum: 7000000000,
                portfolio_size: 350,
                focus_areas: ["AI", "SaaS", "Enterprise", "Consumer"],
                tier: "Tier 1",
                status: "active",
                logo: "🚀"
            },
            {
                id: 8,
                name: "GV (Google Ventures)",
                description: "Venture capital arm of Alphabet Inc.",
                founded_year: 2009,
                location: "Mountain View, CA",
                website: "https://gv.com",
                aum: 3000000000,
                portfolio_size: 180,
                focus_areas: ["AI", "Healthcare", "Enterprise", "Consumer"],
                tier: "Tier 1",
                status: "active",
                logo: "🔍"
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

    getCompaniesBySector(sector) {
        return this.companies.filter(company => company.sector === sector);
    }

    getTopVCsByScore(limit = 6) {
        // Return VCs with a calculated score based on AUM and portfolio size
        return this.vcs.map(vc => ({
            ...vc,
            final_score: Math.round((vc.aum / 1000000000) + (vc.portfolio_size / 10))
        })).sort((a, b) => b.final_score - a.final_score).slice(0, limit);
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

    getNCPProgress() {
        const totalCompanies = this.companies.length;
        const partnerCompanies = this.companies.filter(company => company.ncp_status === 'Partner').length;
        const aiNatives = this.companies.filter(company => company.ai_native).length;

        return {
            partnerPercentage: totalCompanies > 0 ? Math.round((partnerCompanies / totalCompanies) * 100) : 0,
            aiNatives: aiNatives
        };
    }

    loadSampleData() {
        console.log('Loading sample data...');
        
        // Load sample companies
        this.companies = [
            // Frontier Model Builders
            {
                id: 1,
                name: "OpenAI",
                description: "AI research and deployment company focused on creating safe artificial general intelligence",
                industry: "frontier-model-builders",
                sector: "Software",
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
                description: "AI safety company focused on building reliable, interpretable, and steerable AI systems",
                industry: "frontier-model-builders",
                sector: "Software",
                founded_year: 2021,
                employees: 800,
                location: "San Francisco, CA",
                website: "https://anthropic.com",
                funding_raised: 7500000000,
                last_funding_round: "Series E",
                ceo: "Dario Amodei",
                investors: ["Google", "Salesforce Ventures", "Zoom"],
                valuation: 18000000000,
                logo: "https://logo.clearbit.com/anthropic.com",
                status: "active",
                growth_rate: 120,
                technical_employees_pct: 95,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series E",
                    amount: 7500000000,
                    date: "2024-08-15"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-08-10"
                },
                executives: [
                    {
                        name: "Dario Amodei",
                        title: "CEO & Co-Founder",
                        email: "dario@anthropic.com",
                        linkedin: "https://linkedin.com/in/dario-amodei",
                        department: "Leadership"
                    }
                ],
                news: [],
                vcPortfolio: []
            },
            {
                id: 3,
                name: "Hugging Face",
                description: "Open-source AI platform and community for machine learning models and datasets",
                industry: "ai-infrastructure",
                sector: "Software",
                founded_year: 2016,
                employees: 200,
                location: "New York, NY",
                website: "https://huggingface.co",
                funding_raised: 235000000,
                last_funding_round: "Series D",
                ceo: "Clem Delangue",
                investors: ["Coatue", "Sequoia Capital", "Addition"],
                valuation: 4000000000,
                logo: "https://logo.clearbit.com/huggingface.co",
                status: "active",
                growth_rate: 150,
                technical_employees_pct: 85,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: true,
                funding: {
                    round: "Series D",
                    amount: 235000000,
                    date: "2024-07-20"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-07-15"
                },
                executives: [
                    {
                        name: "Clem Delangue",
                        title: "CEO & Co-Founder",
                        email: "clem@huggingface.co",
                        linkedin: "https://linkedin.com/in/clemdelangue",
                        department: "Leadership"
                    }
                ],
                news: [],
                vcPortfolio: []
            },
            {
                id: 4,
                name: "Cohere",
                description: "Enterprise AI platform providing large language models and AI tools for businesses",
                industry: "frontier-model-builders",
                sector: "Software",
                founded_year: 2019,
                employees: 300,
                location: "Toronto, Canada",
                website: "https://cohere.ai",
                funding_raised: 270000000,
                last_funding_round: "Series C",
                ceo: "Aidan Gomez",
                investors: ["Index Ventures", "Tiger Global", "Radical Ventures"],
                valuation: 2200000000,
                logo: "https://logo.clearbit.com/cohere.ai",
                status: "active",
                growth_rate: 200,
                technical_employees_pct: 90,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series C",
                    amount: 270000000,
                    date: "2024-06-10"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-06-05"
                },
                executives: [
                    {
                        name: "Aidan Gomez",
                        title: "CEO & Co-Founder",
                        email: "aidan@cohere.ai",
                        linkedin: "https://linkedin.com/in/aidan-gomez",
                        department: "Leadership"
                    }
                ],
                news: [],
                vcPortfolio: []
            },
            {
                id: 5,
                name: "Stability AI",
                description: "Open-source AI company focused on image generation and multimodal AI models",
                industry: "frontier-model-builders",
                sector: "Software",
                founded_year: 2020,
                employees: 150,
                location: "London, UK",
                website: "https://stability.ai",
                funding_raised: 101000000,
                last_funding_round: "Series A",
                ceo: "Emad Mostaque",
                investors: ["Coatue", "Lightspeed Venture Partners"],
                valuation: 1000000000,
                logo: "https://logo.clearbit.com/stability.ai",
                status: "active",
                growth_rate: 300,
                technical_employees_pct: 95,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series A",
                    amount: 101000000,
                    date: "2024-05-15"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-05-10"
                },
                executives: [
                    {
                        name: "Emad Mostaque",
                        title: "CEO & Co-Founder",
                        email: "emad@stability.ai",
                        linkedin: "https://linkedin.com/in/emad-mostaque",
                        department: "Leadership"
                    }
                ],
                news: [],
                vcPortfolio: []
            },
            {
                id: 6,
                name: "Tesla",
                description: "Electric vehicle and clean energy company",
                industry: "automotive",
                sector: "Auto",
                founded_year: 2003,
                employees: 140000,
                location: "Austin, TX",
                website: "https://tesla.com",
                funding_raised: 0,
                last_funding_round: "Public",
                ceo: "Elon Musk",
                investors: ["Public"],
                valuation: 800000000000,
                logo: "https://logo.clearbit.com/tesla.com",
                status: "active",
                growth_rate: 25,
                technical_employees_pct: 60,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "Public",
                    amount: 0,
                    date: "2010-06-29"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-09-01"
                },
                executives: [
                    {
                        name: "Elon Musk",
                        title: "CEO",
                        email: "elon@tesla.com",
                        linkedin: "https://linkedin.com/in/elonmusk",
                        department: "Leadership"
                    }
                ],
                news: [],
                vcPortfolio: []
            },
            {
                id: 7,
                name: "Stripe",
                description: "Online payment processing platform",
                industry: "fintech",
                sector: "FinTech",
                founded_year: 2010,
                employees: 8000,
                location: "San Francisco, CA",
                website: "https://stripe.com",
                funding_raised: 2400000000,
                last_funding_round: "Series H",
                ceo: "Patrick Collison",
                investors: ["Sequoia Capital", "Andreessen Horowitz", "General Catalyst"],
                valuation: 95000000000,
                logo: "https://logo.clearbit.com/stripe.com",
                status: "active",
                growth_rate: 40,
                technical_employees_pct: 80,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "Series H",
                    amount: 2400000000,
                    date: "2024-01-15"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-08-20"
                },
                executives: [
                    {
                        name: "Patrick Collison",
                        title: "CEO & Co-Founder",
                        email: "patrick@stripe.com",
                        linkedin: "https://linkedin.com/in/patrickcollison",
                        department: "Leadership"
                    }
                ],
                news: [],
                vcPortfolio: []
            },
            {
                id: 8,
                name: "Palantir",
                description: "Data analytics and AI platform for government and enterprise",
                industry: "enterprise-software",
                sector: "Software",
                founded_year: 2003,
                employees: 4000,
                location: "Denver, CO",
                website: "https://palantir.com",
                funding_raised: 0,
                last_funding_round: "Public",
                ceo: "Alex Karp",
                investors: ["Public"],
                valuation: 50000000000,
                logo: "https://logo.clearbit.com/palantir.com",
                status: "active",
                growth_rate: 35,
                technical_employees_pct: 85,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Public",
                    amount: 0,
                    date: "2020-09-30"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-07-15"
                },
                executives: [
                    {
                        name: "Alex Karp",
                        title: "CEO",
                        email: "alex@palantir.com",
                        linkedin: "https://linkedin.com/in/alexkarp",
                        department: "Leadership"
                    }
                ],
                news: [],
                vcPortfolio: []
            },
            {
                id: 9,
                name: "Waymo",
                description: "Autonomous vehicle technology company",
                industry: "automotive",
                sector: "Auto",
                founded_year: 2009,
                employees: 2500,
                location: "Mountain View, CA",
                website: "https://waymo.com",
                funding_raised: 5500000000,
                last_funding_round: "Series A",
                ceo: "Tekedra Mawakana",
                investors: ["Alphabet", "Silver Lake", "Andreessen Horowitz"],
                valuation: 30000000000,
                logo: "https://logo.clearbit.com/waymo.com",
                status: "active",
                growth_rate: 50,
                technical_employees_pct: 90,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series A",
                    amount: 5500000000,
                    date: "2024-03-15"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-06-10"
                },
                executives: [
                    {
                        name: "Tekedra Mawakana",
                        title: "CEO",
                        email: "tekedra@waymo.com",
                        linkedin: "https://linkedin.com/in/tekedra-mawakana",
                        department: "Leadership"
                    }
                ],
                news: [],
                vcPortfolio: []
            },
            {
                id: 10,
                name: "Cruise",
                description: "Autonomous vehicle technology and ride-sharing service",
                industry: "automotive",
                sector: "Auto",
                founded_year: 2013,
                employees: 2000,
                location: "San Francisco, CA",
                website: "https://getcruise.com",
                funding_raised: 8000000000,
                last_funding_round: "Series B",
                ceo: "Kyle Vogt",
                investors: ["General Motors", "SoftBank", "Honda"],
                valuation: 30000000000,
                logo: "https://logo.clearbit.com/getcruise.com",
                status: "active",
                growth_rate: 60,
                technical_employees_pct: 85,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series B",
                    amount: 8000000000,
                    date: "2024-02-20"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-05-25"
                },
                executives: [
                    {
                        name: "Kyle Vogt",
                        title: "CEO & Co-Founder",
                        email: "kyle@getcruise.com",
                        linkedin: "https://linkedin.com/in/kylevogt",
                        department: "Leadership"
                    }
                ],
                news: [],
                vcPortfolio: []
            },
            {
                id: 11,
                name: "Rivian",
                description: "Electric vehicle manufacturer specializing in trucks and SUVs",
                industry: "automotive",
                sector: "Auto",
                founded_year: 2009,
                employees: 14000,
                location: "Irvine, CA",
                website: "https://rivian.com",
                funding_raised: 0,
                last_funding_round: "Public",
                ceo: "RJ Scaringe",
                investors: ["Public"],
                valuation: 15000000000,
                logo: "https://logo.clearbit.com/rivian.com",
                status: "active",
                growth_rate: 30,
                technical_employees_pct: 70,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "Public",
                    amount: 0,
                    date: "2021-11-10"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-04-15"
                },
                executives: [
                    {
                        name: "RJ Scaringe",
                        title: "CEO & Founder",
                        email: "rj@rivian.com",
                        linkedin: "https://linkedin.com/in/rjscaringe",
                        department: "Leadership"
                    }
                ],
                news: [],
                vcPortfolio: []
            },
            {
                id: 12,
                name: "Robinhood",
                description: "Commission-free trading platform",
                industry: "fintech",
                sector: "FinTech",
                founded_year: 2013,
                employees: 3000,
                location: "Menlo Park, CA",
                website: "https://robinhood.com",
                funding_raised: 0,
                last_funding_round: "Public",
                ceo: "Vlad Tenev",
                investors: ["Public"],
                valuation: 10000000000,
                logo: "https://logo.clearbit.com/robinhood.com",
                status: "active",
                growth_rate: 20,
                technical_employees_pct: 75,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "Public",
                    amount: 0,
                    date: "2021-07-29"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-03-20"
                },
                executives: [
                    {
                        name: "Vlad Tenev",
                        title: "CEO & Co-Founder",
                        email: "vlad@robinhood.com",
                        linkedin: "https://linkedin.com/in/vladtenev",
                        department: "Leadership"
                    }
                ],
                news: [],
                vcPortfolio: []
            },
            {
                id: 13,
                name: "Spotify",
                description: "Music streaming and audio platform",
                industry: "media",
                sector: "Media",
                founded_year: 2006,
                employees: 9000,
                location: "Stockholm, Sweden",
                website: "https://spotify.com",
                funding_raised: 0,
                last_funding_round: "Public",
                ceo: "Daniel Ek",
                investors: ["Public"],
                valuation: 25000000000,
                logo: "https://logo.clearbit.com/spotify.com",
                status: "active",
                growth_rate: 15,
                technical_employees_pct: 65,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "Public",
                    amount: 0,
                    date: "2018-04-03"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-02-10"
                },
                executives: [
                    {
                        name: "Daniel Ek",
                        title: "CEO & Co-Founder",
                        email: "daniel@spotify.com",
                        linkedin: "https://linkedin.com/in/danielek",
                        department: "Leadership"
                    }
                ],
                news: [],
                vcPortfolio: []
            },
            {
                id: 14,
                name: "Netflix",
                description: "Streaming entertainment service",
                industry: "media",
                sector: "Media",
                founded_year: 1997,
                employees: 15000,
                location: "Los Gatos, CA",
                website: "https://netflix.com",
                funding_raised: 0,
                last_funding_round: "Public",
                ceo: "Ted Sarandos",
                investors: ["Public"],
                valuation: 200000000000,
                logo: "https://logo.clearbit.com/netflix.com",
                status: "active",
                growth_rate: 10,
                technical_employees_pct: 60,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "Public",
                    amount: 0,
                    date: "2002-05-23"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-01-15"
                },
                executives: [
                    {
                        name: "Ted Sarandos",
                        title: "Co-CEO",
                        email: "ted@netflix.com",
                        linkedin: "https://linkedin.com/in/tedsarandos",
                        department: "Leadership"
                    }
                ],
                news: [],
                vcPortfolio: []
            },
            {
                id: 15,
                name: "Boston Dynamics",
                description: "Robotics company specializing in mobile manipulation robots",
                industry: "robotics",
                sector: "Robotics",
                founded_year: 1992,
                employees: 500,
                location: "Waltham, MA",
                website: "https://bostondynamics.com",
                funding_raised: 0,
                last_funding_round: "Acquired",
                ceo: "Robert Playter",
                investors: ["Hyundai"],
                valuation: 1100000000,
                logo: "https://logo.clearbit.com/bostondynamics.com",
                status: "active",
                growth_rate: 40,
                technical_employees_pct: 95,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Acquired",
                    amount: 0,
                    date: "2021-06-21"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-06-30"
                },
                executives: [
                    {
                        name: "Robert Playter",
                        title: "CEO",
                        email: "robert@bostondynamics.com",
                        linkedin: "https://linkedin.com/in/robert-playter",
                        department: "Leadership"
                    }
                ],
                news: [],
                vcPortfolio: []
            }
        ];
        
        // Load sample VCs
        this.vcs = [
            {
                id: 1,
                name: "Andreessen Horowitz",
                description: "Venture capital firm focused on technology startups",
                location: "Menlo Park, CA",
                website: "https://a16z.com",
                aum: 35000000000,
                portfolio_size: 1200,
                founded_year: 2009,
                logo: "https://logo.clearbit.com/a16z.com",
                status: "active",
                focus_areas: ["AI", "Enterprise Software", "Fintech"],
                tier: "Tier 1"
            },
            {
                id: 2,
                name: "Sequoia Capital",
                description: "Venture capital firm investing in technology companies",
                location: "Menlo Park, CA",
                website: "https://sequoiacap.com",
                aum: 28000000000,
                portfolio_size: 1000,
                founded_year: 1972,
                logo: "https://logo.clearbit.com/sequoiacap.com",
                status: "active",
                focus_areas: ["AI", "Enterprise Software", "Consumer"],
                tier: "Tier 1"
            },
            {
                id: 3,
                name: "Khosla Ventures",
                description: "Venture capital firm focused on breakthrough technology",
                location: "Menlo Park, CA",
                website: "https://khoslaventures.com",
                aum: 15000000000,
                portfolio_size: 800,
                founded_year: 2004,
                logo: "https://logo.clearbit.com/khoslaventures.com",
                status: "active",
                focus_areas: ["AI", "Clean Tech", "Healthcare"],
                tier: "Tier 1"
            },
            {
                id: 4,
                name: "General Catalyst",
                description: "Venture capital firm investing in transformative companies",
                location: "Cambridge, MA",
                website: "https://generalcatalyst.com",
                aum: 12000000000,
                portfolio_size: 600,
                founded_year: 2000,
                logo: "https://logo.clearbit.com/generalcatalyst.com",
                status: "active",
                focus_areas: ["AI", "Fintech", "Healthcare"],
                tier: "Tier 1"
            },
            {
                id: 5,
                name: "Index Ventures",
                description: "Venture capital firm focused on technology and life sciences",
                location: "San Francisco, CA",
                website: "https://indexventures.com",
                aum: 10000000000,
                portfolio_size: 500,
                founded_year: 1996,
                logo: "https://logo.clearbit.com/indexventures.com",
                status: "active",
                focus_areas: ["AI", "Enterprise Software", "Biotech"],
                tier: "Tier 1"
            },
            {
                id: 6,
                name: "Accel",
                description: "Venture capital firm investing in early and growth-stage companies",
                location: "Palo Alto, CA",
                website: "https://accel.com",
                aum: 8000000000,
                portfolio_size: 400,
                founded_year: 1983,
                logo: "https://logo.clearbit.com/accel.com",
                status: "active",
                focus_areas: ["AI", "Consumer", "Enterprise"],
                tier: "Tier 1"
            },
            {
                id: 7,
                name: "Benchmark",
                description: "Venture capital firm focused on early-stage technology companies",
                location: "San Francisco, CA",
                website: "https://benchmark.com",
                aum: 6000000000,
                portfolio_size: 300,
                founded_year: 1995,
                logo: "https://logo.clearbit.com/benchmark.com",
                status: "active",
                focus_areas: ["AI", "Consumer", "Enterprise"],
                tier: "Tier 1"
            },
            {
                id: 8,
                name: "Greylock Partners",
                description: "Venture capital firm investing in consumer and enterprise companies",
                location: "Menlo Park, CA",
                website: "https://greylock.com",
                aum: 5000000000,
                portfolio_size: 250,
                founded_year: 1965,
                logo: "https://logo.clearbit.com/greylock.com",
                status: "active",
                focus_areas: ["AI", "Enterprise", "Consumer"],
                tier: "Tier 1"
            }
        ];
        
        console.log(`Sample data loaded: ${this.companies.length} companies, ${this.vcs.length} VCs`);
    }

    // Utility methods
    formatCurrency(amount) {
        if (amount >= 1000000000) {
            return `$${(amount / 1000000000).toFixed(1)}B`;
        } else if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(1)}K`;
        } else {
            return `$${amount}`;
        }
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString();
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
