class DataService {
    constructor() {
        this.baseUrl = 'http://localhost:1000';
        this.companies = [];
        this.vcs = [];
        this.news = [];
        // Try backend first; fall back to sample data on failure
        this.loadBackendData().catch(() => {
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
                vc_tier: r.vc_tier || (Math.random() > 0.8 ? 'Tier 1' : Math.random() > 0.6 ? 'Tier 2' : 'Tier 3'),
                // AI/Digital native flags
                ai_native: r.ai_native || Math.random() > 0.6,
                digital_native: r.digital_native || Math.random() > 0.4,
                // Funding details
                funding: {
                    round: r.last_funding_round || 'Seed',
                    amount: r.funding_raised || Math.floor(Math.random()*80+20)*1_000_000,
                    date: r.funding_date || new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
                },
                // Outreach tracking
                outreach: {
                    contacted: r.outreach_contacted || Math.random() > 0.5,
                    lastMessage: r.outreach_last_message || (Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null)
                },
                // News array
                news: [],
                // VC portfolio
                vcPortfolio: r.vc_portfolio || []
            }));
        } catch (e) {
            throw e;
        }

        // News
        try {
            const newsRes = await safeFetch(`${this.baseUrl}/news?page=1&page_size=200`);
            const rows = newsRes.results || [];
            this.news = rows.map(n => ({
                id: n.id,
                headline: n.headline || 'News Update',
                content: n.content || 'No content available',
                url: n.url || '#',
                source: n.source || 'Unknown Source',
                published_at: n.published_at || new Date().toISOString(),
                category: n.category || 'General',
                company_id: n.company_id || 1,
                read_time: n.read_time || '5 min read'
            }));
        } catch (e) {
            this.news = [];
        }

        // VCs
        try {
            const vcsRes = await safeFetch(`${this.baseUrl}/vcs?page=1&page_size=50`);
            const rows = vcsRes.results || [];
            this.vcs = rows.map(v => ({
                id: v.id,
                name: v.name,
                description: v.description || '',
                location: v.location || '—',
                investment_stage: v.investment_stage || 'multi-stage',
                website: v.website || '#',
                portfolio_companies: v.portfolio_companies || Math.floor(Math.random()*500+100),
                total_aum: v.total_aum || Math.floor(Math.random()*9+1)*1_000_000_000,
                healthcare_focus: true,
                final_score: v.final_score || Math.round(Math.random()*20+80),
                logo: '',
                investments: v.investments || Math.floor(Math.random()*50+10)
            }));
        } catch (e) {
            this.vcs = [];
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
            },

            // Agentic & Generative AI Applications
            {
                id: 6,
                name: "Sierra",
                description: "AI-powered customer service automation platform",
                industry: "agentic-generative-ai",
                founded_year: 2023,
                employees: 80,
                location: "San Francisco, CA",
                website: "https://sierra.ai",
                funding_raised: 110000000,
                last_funding_round: "Series A",
                ceo: "Brett Adcock",
                investors: ["Sequoia Capital", "Benchmark", "General Catalyst"],
                valuation: 500000000,
                logo: "https://logo.clearbit.com/sierra.ai",
                status: "active",
                growth_rate: 400,
                technical_employees_pct: 85,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series A",
                    amount: 110000000,
                    date: "2024-01-15"
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
                name: "Replit",
                description: "Collaborative browser-based IDE and coding platform",
                industry: "agentic-generative-ai",
                founded_year: 2016,
                employees: 200,
                location: "San Francisco, CA",
                website: "https://replit.com",
                funding_raised: 200000000,
                last_funding_round: "Series B",
                ceo: "Amjad Masad",
                investors: ["Andreessen Horowitz", "Index Ventures", "Y Combinator"],
                valuation: 1000000000,
                logo: "https://logo.clearbit.com/replit.com",
                status: "active",
                growth_rate: 150,
                technical_employees_pct: 90,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "Series B",
                    amount: 200000000,
                    date: "2024-02-20"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 8,
                name: "Typeface",
                description: "AI-powered content creation platform for enterprises",
                industry: "agentic-generative-ai",
                founded_year: 2022,
                employees: 120,
                location: "San Francisco, CA",
                website: "https://typeface.ai",
                funding_raised: 100000000,
                last_funding_round: "Series A",
                ceo: "Abhay Parasnis",
                investors: ["Lightspeed Venture Partners", "GV", "Madrona Venture Group"],
                valuation: 500000000,
                logo: "https://logo.clearbit.com/typeface.ai",
                status: "active",
                growth_rate: 250,
                technical_employees_pct: 80,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series A",
                    amount: 100000000,
                    date: "2024-03-10"
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
                name: "Notion",
                description: "All-in-one workspace for notes, docs, wikis, and project management",
                industry: "agentic-generative-ai",
                founded_year: 2016,
                employees: 500,
                location: "San Francisco, CA",
                website: "https://notion.so",
                funding_raised: 343000000,
                last_funding_round: "Series C",
                ceo: "Ivan Zhao",
                investors: ["Sequoia Capital", "Index Ventures", "First Round"],
                valuation: 10000000000,
                logo: "https://logo.clearbit.com/notion.so",
                status: "active",
                growth_rate: 100,
                technical_employees_pct: 75,
                ncp_status: "Partner",
                partner_tier: "Gold",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "Series C",
                    amount: 343000000,
                    date: "2024-01-25"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-07-20"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 10,
                name: "Runway",
                description: "AI-powered creative tools for video editing and generation",
                industry: "agentic-generative-ai",
                founded_year: 2018,
                employees: 300,
                location: "New York, NY",
                website: "https://runwayml.com",
                funding_raised: 237000000,
                last_funding_round: "Series C",
                ceo: "Cristóbal Valenzuela",
                investors: ["Google Ventures", "Amplify Partners", "Lux Capital"],
                valuation: 1500000000,
                logo: "https://logo.clearbit.com/runwayml.com",
                status: "active",
                growth_rate: 200,
                technical_employees_pct: 85,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series C",
                    amount: 237000000,
                    date: "2024-06-15"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 11,
                name: "ElevenLabs",
                description: "AI voice synthesis and cloning platform",
                industry: "agentic-generative-ai",
                founded_year: 2022,
                employees: 80,
                location: "London, UK",
                website: "https://elevenlabs.io",
                funding_raised: 101000000,
                last_funding_round: "Series B",
                ceo: "Piotr Dąbkowski",
                investors: ["Andreessen Horowitz", "Nat Friedman", "Daniel Gross"],
                valuation: 1000000000,
                logo: "https://logo.clearbit.com/elevenlabs.io",
                status: "active",
                growth_rate: 500,
                technical_employees_pct: 90,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series B",
                    amount: 101000000,
                    date: "2024-04-30"
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
                name: "Tome",
                description: "AI-powered presentation and storytelling platform",
                industry: "agentic-generative-ai",
                founded_year: 2020,
                employees: 150,
                location: "San Francisco, CA",
                website: "https://tome.app",
                funding_raised: 81000000,
                last_funding_round: "Series B",
                ceo: "Henri Liriani",
                investors: ["Greylock Partners", "Benchmark", "Lightspeed Venture Partners"],
                valuation: 500000000,
                logo: "https://logo.clearbit.com/tome.app",
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
                    amount: 81000000,
                    date: "2024-05-20"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 13,
                name: "Glean",
                description: "AI-powered enterprise search and knowledge discovery platform",
                industry: "agentic-generative-ai",
                founded_year: 2019,
                employees: 200,
                location: "Palo Alto, CA",
                website: "https://glean.com",
                funding_raised: 200000000,
                last_funding_round: "Series C",
                ceo: "Arvind Jain",
                investors: ["Kleiner Perkins", "General Catalyst", "Sequoia Capital"],
                valuation: 1000000000,
                logo: "https://logo.clearbit.com/glean.com",
                status: "active",
                growth_rate: 150,
                technical_employees_pct: 85,
                ncp_status: "Partner",
                partner_tier: "Silver",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series C",
                    amount: 200000000,
                    date: "2024-07-10"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-08-15"
                },
                news: [],
                vcPortfolio: []
            },

            // Customer Experience (CX)
            {
                id: 14,
                name: "Intercom",
                description: "Customer messaging platform for support, sales, and marketing",
                industry: "customer-experience",
                founded_year: 2011,
                employees: 800,
                location: "San Francisco, CA",
                website: "https://intercom.com",
                funding_raised: 240000000,
                last_funding_round: "Series D",
                ceo: "Karen Peacock",
                investors: ["Bessemer Venture Partners", "Index Ventures", "Kleiner Perkins"],
                valuation: 1000000000,
                logo: "https://logo.clearbit.com/intercom.com",
                status: "active",
                growth_rate: 40,
                technical_employees_pct: 70,
                ncp_status: "Partner",
                partner_tier: "Gold",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "Series D",
                    amount: 240000000,
                    date: "2024-02-15"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-06-20"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 15,
                name: "Forethought",
                description: "AI-powered customer support automation platform",
                industry: "customer-experience",
                founded_year: 2017,
                employees: 120,
                location: "San Francisco, CA",
                website: "https://forethought.ai",
                funding_raised: 65000000,
                last_funding_round: "Series B",
                ceo: "Deon Nicholas",
                investors: ["New Enterprise Associates", "Kleiner Perkins", "Sound Ventures"],
                valuation: 300000000,
                logo: "https://logo.clearbit.com/forethought.ai",
                status: "active",
                growth_rate: 120,
                technical_employees_pct: 80,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series B",
                    amount: 65000000,
                    date: "2024-03-25"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 16,
                name: "HubSpot",
                description: "Inbound marketing, sales, and service platform",
                industry: "customer-experience",
                founded_year: 2006,
                employees: 7000,
                location: "Cambridge, MA",
                website: "https://hubspot.com",
                funding_raised: 100000000,
                last_funding_round: "IPO",
                ceo: "Yamini Rangan",
                investors: ["General Catalyst", "Matrix Partners", "Sequoia Capital"],
                valuation: 20000000000,
                logo: "https://logo.clearbit.com/hubspot.com",
                status: "public",
                growth_rate: 25,
                technical_employees_pct: 65,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "IPO",
                    amount: 100000000,
                    date: "2014-10-09"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-05-10"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 17,
                name: "Salesforce",
                description: "Cloud-based customer relationship management platform",
                industry: "customer-experience",
                founded_year: 1999,
                employees: 80000,
                location: "San Francisco, CA",
                website: "https://salesforce.com",
                funding_raised: 0,
                last_funding_round: "IPO",
                ceo: "Marc Benioff",
                investors: ["Public Company"],
                valuation: 200000000000,
                logo: "https://logo.clearbit.com/salesforce.com",
                status: "public",
                growth_rate: 15,
                technical_employees_pct: 60,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "IPO",
                    amount: 0,
                    date: "2004-06-23"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-04-15"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 18,
                name: "Zendesk",
                description: "Customer service and engagement platform",
                industry: "customer-experience",
                founded_year: 2007,
                employees: 6000,
                location: "San Francisco, CA",
                website: "https://zendesk.com",
                funding_raised: 100000000,
                last_funding_round: "IPO",
                ceo: "Tom Eggemeier",
                investors: ["Charles River Ventures", "Benchmark", "Matrix Partners"],
                valuation: 10000000000,
                logo: "https://logo.clearbit.com/zendesk.com",
                status: "public",
                growth_rate: 20,
                technical_employees_pct: 70,
                ncp_status: "Partner",
                partner_tier: "Gold",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "IPO",
                    amount: 100000000,
                    date: "2014-05-15"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-03-20"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 19,
                name: "Dialpad",
                description: "AI-powered business communications platform",
                industry: "customer-experience",
                founded_year: 2011,
                employees: 1000,
                location: "San Francisco, CA",
                website: "https://dialpad.com",
                funding_raised: 220000000,
                last_funding_round: "Series F",
                ceo: "Craig Walker",
                investors: ["Andreessen Horowitz", "GV", "ICONIQ Capital"],
                valuation: 2000000000,
                logo: "https://logo.clearbit.com/dialpad.com",
                status: "active",
                growth_rate: 60,
                technical_employees_pct: 75,
                ncp_status: "Partner",
                partner_tier: "Silver",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: true,
                funding: {
                    round: "Series F",
                    amount: 220000000,
                    date: "2024-01-30"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-07-05"
                },
                news: [],
                vcPortfolio: []
            },

            // Code Generation & Developer Tools
            {
                id: 20,
                name: "GitHub Copilot",
                description: "AI-powered code completion and generation tool",
                industry: "code-generation",
                founded_year: 2021,
                employees: 0,
                location: "San Francisco, CA",
                website: "https://github.com/features/copilot",
                funding_raised: 0,
                last_funding_round: "Internal",
                ceo: "Thomas Dohmke",
                investors: ["Microsoft"],
                valuation: 0,
                logo: "https://logo.clearbit.com/github.com",
                status: "active",
                growth_rate: 200,
                technical_employees_pct: 100,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Internal",
                    amount: 0,
                    date: "2021-06-29"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-06-15"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 21,
                name: "CodiumAI",
                description: "AI-powered code review and testing platform",
                industry: "code-generation",
                founded_year: 2021,
                employees: 80,
                location: "Tel Aviv, Israel",
                website: "https://codium.ai",
                funding_raised: 50000000,
                last_funding_round: "Series A",
                ceo: "Itamar Friedman",
                investors: ["Kleiner Perkins", "TLV Partners", "Viola Ventures"],
                valuation: 200000000,
                logo: "https://logo.clearbit.com/codium.ai",
                status: "active",
                growth_rate: 300,
                technical_employees_pct: 90,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series A",
                    amount: 50000000,
                    date: "2024-02-10"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 22,
                name: "Codeium",
                description: "AI-powered code completion and chat platform",
                industry: "code-generation",
                founded_year: 2021,
                employees: 60,
                location: "San Francisco, CA",
                website: "https://codeium.com",
                funding_raised: 65000000,
                last_funding_round: "Series A",
                ceo: "Varun Mohan",
                investors: ["General Catalyst", "Index Ventures", "NEA"],
                valuation: 300000000,
                logo: "https://logo.clearbit.com/codeium.com",
                status: "active",
                growth_rate: 400,
                technical_employees_pct: 85,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series A",
                    amount: 65000000,
                    date: "2024-03-05"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },

            // Productivity & Collaboration
            {
                id: 23,
                name: "ClickUp",
                description: "All-in-one productivity platform for teams",
                industry: "productivity-collaboration",
                founded_year: 2017,
                employees: 800,
                location: "San Diego, CA",
                website: "https://clickup.com",
                funding_raised: 400000000,
                last_funding_round: "Series C",
                ceo: "Zeb Evans",
                investors: ["Andreessen Horowitz", "Craft Ventures", "Tiger Global"],
                valuation: 4000000000,
                logo: "https://logo.clearbit.com/clickup.com",
                status: "active",
                growth_rate: 80,
                technical_employees_pct: 70,
                ncp_status: "Partner",
                partner_tier: "Silver",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "Series C",
                    amount: 400000000,
                    date: "2024-04-20"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-08-25"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 24,
                name: "Figma",
                description: "Collaborative interface design tool for teams",
                industry: "productivity-collaboration",
                founded_year: 2012,
                employees: 1200,
                location: "San Francisco, CA",
                website: "https://figma.com",
                funding_raised: 333000000,
                last_funding_round: "Series E",
                ceo: "Dylan Field",
                investors: ["Index Ventures", "Greylock Partners", "Kleiner Perkins"],
                valuation: 20000000000,
                logo: "https://logo.clearbit.com/figma.com",
                status: "private",
                growth_rate: 80,
                technical_employees_pct: 75,
                ncp_status: "Partner",
                partner_tier: "Gold",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "Series E",
                    amount: 333000000,
                    date: "2024-03-15"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-08-20"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 25,
                name: "Canva",
                description: "Online design and publishing tool for creating graphics, presentations, and documents",
                industry: "productivity-collaboration",
                founded_year: 2013,
                employees: 4000,
                location: "Sydney, Australia",
                website: "https://canva.com",
                funding_raised: 572000000,
                last_funding_round: "Series C",
                ceo: "Melanie Perkins",
                investors: ["Sequoia Capital", "Blackbird Ventures", "General Catalyst"],
                valuation: 40000000000,
                logo: "https://logo.clearbit.com/canva.com",
                status: "private",
                growth_rate: 60,
                technical_employees_pct: 70,
                ncp_status: "Partner",
                partner_tier: "Gold",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "Series C",
                    amount: 572000000,
                    date: "2024-04-12"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-07-15"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 26,
                name: "Airtable",
                description: "Low-code platform for building collaborative apps",
                industry: "productivity-collaboration",
                founded_year: 2012,
                employees: 1000,
                location: "San Francisco, CA",
                website: "https://airtable.com",
                funding_raised: 735000000,
                last_funding_round: "Series F",
                ceo: "Howie Liu",
                investors: ["Benchmark", "Coatue", "Thrive Capital"],
                valuation: 11000000000,
                logo: "https://logo.clearbit.com/airtable.com",
                status: "active",
                growth_rate: 70,
                technical_employees_pct: 75,
                ncp_status: "Partner",
                partner_tier: "Silver",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "Series F",
                    amount: 735000000,
                    date: "2024-05-30"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-06-30"
                },
                news: [],
                vcPortfolio: []
            },

            // Infrastructure, Hosting & Serving
            {
                id: 27,
                name: "AWS",
                description: "Amazon Web Services - comprehensive cloud computing platform",
                industry: "infrastructure-hosting",
                founded_year: 2006,
                employees: 0,
                location: "Seattle, WA",
                website: "https://aws.amazon.com",
                funding_raised: 0,
                last_funding_round: "Internal",
                ceo: "Adam Selipsky",
                investors: ["Amazon"],
                valuation: 0,
                logo: "https://logo.clearbit.com/aws.amazon.com",
                status: "active",
                growth_rate: 30,
                technical_employees_pct: 85,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "Internal",
                    amount: 0,
                    date: "2006-03-14"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-05-15"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 28,
                name: "Azure",
                description: "Microsoft Azure - cloud computing platform and services",
                industry: "infrastructure-hosting",
                founded_year: 2010,
                employees: 0,
                location: "Redmond, WA",
                website: "https://azure.microsoft.com",
                funding_raised: 0,
                last_funding_round: "Internal",
                ceo: "Satya Nadella",
                investors: ["Microsoft"],
                valuation: 0,
                logo: "https://logo.clearbit.com/azure.microsoft.com",
                status: "active",
                growth_rate: 35,
                technical_employees_pct: 85,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "Internal",
                    amount: 0,
                    date: "2010-02-01"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-04-20"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 29,
                name: "Google Cloud",
                description: "Google Cloud Platform - cloud computing and AI services",
                industry: "infrastructure-hosting",
                founded_year: 2008,
                employees: 0,
                location: "Mountain View, CA",
                website: "https://cloud.google.com",
                funding_raised: 0,
                last_funding_round: "Internal",
                ceo: "Thomas Kurian",
                investors: ["Google"],
                valuation: 0,
                logo: "https://logo.clearbit.com/cloud.google.com",
                status: "active",
                growth_rate: 40,
                technical_employees_pct: 90,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: true,
                funding: {
                    round: "Internal",
                    amount: 0,
                    date: "2008-04-07"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-03-25"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 30,
                name: "Oracle Cloud",
                description: "Oracle Cloud Infrastructure - enterprise cloud platform",
                industry: "infrastructure-hosting",
                founded_year: 2016,
                employees: 0,
                location: "Austin, TX",
                website: "https://oracle.com/cloud",
                funding_raised: 0,
                last_funding_round: "Internal",
                ceo: "Larry Ellison",
                investors: ["Oracle"],
                valuation: 0,
                logo: "https://logo.clearbit.com/oracle.com",
                status: "active",
                growth_rate: 25,
                technical_employees_pct: 80,
                ncp_status: "Partner",
                partner_tier: "Gold",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "Internal",
                    amount: 0,
                    date: "2016-09-16"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-02-28"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 31,
                name: "Vercel",
                description: "Frontend cloud platform for developers",
                industry: "infrastructure-hosting",
                founded_year: 2015,
                employees: 400,
                location: "San Francisco, CA",
                website: "https://vercel.com",
                funding_raised: 250000000,
                last_funding_round: "Series D",
                ceo: "Guillermo Rauch",
                investors: ["Accel", "CRV", "GV"],
                valuation: 2500000000,
                logo: "https://logo.clearbit.com/vercel.com",
                status: "active",
                growth_rate: 100,
                technical_employees_pct: 90,
                ncp_status: "Partner",
                partner_tier: "Silver",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                funding: {
                    round: "Series D",
                    amount: 250000000,
                    date: "2024-06-10"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-07-30"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 32,
                name: "Hugging Face",
                description: "AI community and platform for machine learning models",
                industry: "infrastructure-hosting",
                founded_year: 2016,
                employees: 200,
                location: "New York, NY",
                website: "https://huggingface.co",
                funding_raised: 235000000,
                last_funding_round: "Series D",
                ceo: "Clem Delangue",
                investors: ["Andreessen Horowitz", "Sequoia Capital", "Coatue"],
                valuation: 4500000000,
                logo: "https://logo.clearbit.com/huggingface.co",
                status: "active",
                growth_rate: 150,
                technical_employees_pct: 95,
                ncp_status: "Partner",
                partner_tier: "Gold",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series D",
                    amount: 235000000,
                    date: "2024-08-15"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-09-05"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 33,
                name: "Baseten",
                description: "ML infrastructure platform for deploying AI models",
                industry: "infrastructure-hosting",
                founded_year: 2020,
                employees: 80,
                location: "San Francisco, CA",
                website: "https://baseten.co",
                funding_raised: 40000000,
                last_funding_round: "Series A",
                ceo: "Amjad Masad",
                investors: ["Greylock Partners", "Index Ventures", "Y Combinator"],
                valuation: 200000000,
                logo: "https://logo.clearbit.com/baseten.co",
                status: "active",
                growth_rate: 200,
                technical_employees_pct: 90,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series A",
                    amount: 40000000,
                    date: "2024-03-20"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 34,
                name: "Together.ai",
                description: "AI infrastructure platform for training and inference",
                industry: "infrastructure-hosting",
                founded_year: 2022,
                employees: 150,
                location: "San Francisco, CA",
                website: "https://together.ai",
                funding_raised: 200000000,
                last_funding_round: "Series B",
                ceo: "Vipul Ved Prakash",
                investors: ["Kleiner Perkins", "NEA", "Lux Capital"],
                valuation: 1000000000,
                logo: "https://logo.clearbit.com/together.ai",
                status: "active",
                growth_rate: 300,
                technical_employees_pct: 95,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series B",
                    amount: 200000000,
                    date: "2024-07-25"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },

            // MLOps & Data Infrastructure
            {
                id: 35,
                name: "Scale AI",
                description: "Data platform for AI applications and machine learning",
                industry: "mlops-data-infrastructure",
                founded_year: 2016,
                employees: 1000,
                location: "San Francisco, CA",
                website: "https://scale.com",
                funding_raised: 600000000,
                last_funding_round: "Series F",
                ceo: "Alexandr Wang",
                investors: ["Accel", "Index Ventures", "Founders Fund"],
                valuation: 7300000000,
                logo: "https://logo.clearbit.com/scale.com",
                status: "active",
                growth_rate: 80,
                technical_employees_pct: 85,
                ncp_status: "Partner",
                partner_tier: "Gold",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series F",
                    amount: 600000000,
                    date: "2024-05-15"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-08-10"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 36,
                name: "Weights & Biases",
                description: "MLOps platform for experiment tracking and model management",
                industry: "mlops-data-infrastructure",
                founded_year: 2017,
                employees: 300,
                location: "San Francisco, CA",
                website: "https://wandb.ai",
                funding_raised: 200000000,
                last_funding_round: "Series C",
                ceo: "Lukas Biewald",
                investors: ["Insight Partners", "Coatue", "GV"],
                valuation: 1000000000,
                logo: "https://logo.clearbit.com/wandb.ai",
                status: "active",
                growth_rate: 120,
                technical_employees_pct: 90,
                ncp_status: "Partner",
                partner_tier: "Silver",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series C",
                    amount: 200000000,
                    date: "2024-04-05"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-07-20"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 37,
                name: "DataBricks",
                description: "Unified analytics platform for big data and AI",
                industry: "mlops-data-infrastructure",
                founded_year: 2013,
                employees: 6000,
                location: "San Francisco, CA",
                website: "https://databricks.com",
                funding_raised: 3500000000,
                last_funding_round: "Series I",
                ceo: "Ali Ghodsi",
                investors: ["Andreessen Horowitz", "NEA", "Tiger Global"],
                valuation: 43000000000,
                logo: "https://logo.clearbit.com/databricks.com",
                status: "active",
                growth_rate: 60,
                technical_employees_pct: 85,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series I",
                    amount: 3500000000,
                    date: "2024-09-15"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-09-20"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 38,
                name: "Pinecone",
                description: "Vector database for AI applications",
                industry: "mlops-data-infrastructure",
                founded_year: 2019,
                employees: 200,
                location: "San Francisco, CA",
                website: "https://pinecone.io",
                funding_raised: 138000000,
                last_funding_round: "Series B",
                ceo: "Edo Liberty",
                investors: ["Andreessen Horowitz", "ICONIQ Capital", "Menlo Ventures"],
                valuation: 700000000,
                logo: "https://logo.clearbit.com/pinecone.io",
                status: "active",
                growth_rate: 200,
                technical_employees_pct: 90,
                ncp_status: "Partner",
                partner_tier: "Silver",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series B",
                    amount: 138000000,
                    date: "2024-06-20"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-08-05"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 39,
                name: "LangChain",
                description: "Framework for developing applications powered by language models",
                industry: "mlops-data-infrastructure",
                founded_year: 2022,
                employees: 100,
                location: "San Francisco, CA",
                website: "https://langchain.com",
                funding_raised: 25000000,
                last_funding_round: "Series A",
                ceo: "Harrison Chase",
                investors: ["Sequoia Capital", "Benchmark", "Andreessen Horowitz"],
                valuation: 200000000,
                logo: "https://logo.clearbit.com/langchain.com",
                status: "active",
                growth_rate: 500,
                technical_employees_pct: 95,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Series A",
                    amount: 25000000,
                    date: "2024-02-28"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 40,
                name: "LlamaIndex",
                description: "Data framework for LLM applications",
                industry: "mlops-data-infrastructure",
                founded_year: 2022,
                employees: 50,
                location: "San Francisco, CA",
                website: "https://llamaindex.ai",
                funding_raised: 15000000,
                last_funding_round: "Seed",
                ceo: "Jerry Liu",
                investors: ["Greylock Partners", "Index Ventures", "Y Combinator"],
                valuation: 100000000,
                logo: "https://logo.clearbit.com/llamaindex.ai",
                status: "active",
                growth_rate: 400,
                technical_employees_pct: 95,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Seed",
                    amount: 15000000,
                    date: "2024-01-15"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },

            // CUDA-X / NVIDIA AI Platform
            {
                id: 41,
                name: "cuDNN",
                description: "CUDA Deep Neural Network library for GPU-accelerated deep learning",
                industry: "cuda-nvidia-ai",
                founded_year: 2014,
                employees: 0,
                location: "Santa Clara, CA",
                website: "https://developer.nvidia.com/cudnn",
                funding_raised: 0,
                last_funding_round: "Internal",
                ceo: "Jensen Huang",
                investors: ["NVIDIA"],
                valuation: 0,
                logo: "https://logo.clearbit.com/nvidia.com",
                status: "active",
                growth_rate: 50,
                technical_employees_pct: 100,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Internal",
                    amount: 0,
                    date: "2014-09-02"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-09-01"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 42,
                name: "TensorRT",
                description: "NVIDIA TensorRT - high-performance deep learning inference platform",
                industry: "cuda-nvidia-ai",
                founded_year: 2016,
                employees: 0,
                location: "Santa Clara, CA",
                website: "https://developer.nvidia.com/tensorrt",
                funding_raised: 0,
                last_funding_round: "Internal",
                ceo: "Jensen Huang",
                investors: ["NVIDIA"],
                valuation: 0,
                logo: "https://logo.clearbit.com/nvidia.com",
                status: "active",
                growth_rate: 60,
                technical_employees_pct: 100,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Internal",
                    amount: 0,
                    date: "2016-11-08"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-08-15"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 43,
                name: "CUTLASS",
                description: "CUDA Templates for Linear Algebra Subroutines - GPU-accelerated linear algebra",
                industry: "cuda-nvidia-ai",
                founded_year: 2017,
                employees: 0,
                location: "Santa Clara, CA",
                website: "https://github.com/NVIDIA/cutlass",
                funding_raised: 0,
                last_funding_round: "Internal",
                ceo: "Jensen Huang",
                investors: ["NVIDIA"],
                valuation: 0,
                logo: "https://logo.clearbit.com/nvidia.com",
                status: "active",
                growth_rate: 40,
                technical_employees_pct: 100,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Internal",
                    amount: 0,
                    date: "2017-12-12"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-07-30"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 44,
                name: "RAPIDS",
                description: "GPU-accelerated data science and machine learning platform",
                industry: "cuda-nvidia-ai",
                founded_year: 2018,
                employees: 0,
                location: "Santa Clara, CA",
                website: "https://rapids.ai",
                funding_raised: 0,
                last_funding_round: "Internal",
                ceo: "Jensen Huang",
                investors: ["NVIDIA"],
                valuation: 0,
                logo: "https://logo.clearbit.com/nvidia.com",
                status: "active",
                growth_rate: 70,
                technical_employees_pct: 100,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Internal",
                    amount: 0,
                    date: "2018-10-10"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-06-25"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 45,
                name: "Triton Inference Server",
                description: "NVIDIA Triton - scalable AI model serving platform",
                industry: "cuda-nvidia-ai",
                founded_year: 2019,
                employees: 0,
                location: "Santa Clara, CA",
                website: "https://developer.nvidia.com/triton-inference-server",
                funding_raised: 0,
                last_funding_round: "Internal",
                ceo: "Jensen Huang",
                investors: ["NVIDIA"],
                valuation: 0,
                logo: "https://logo.clearbit.com/nvidia.com",
                status: "active",
                growth_rate: 80,
                technical_employees_pct: 100,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Internal",
                    amount: 0,
                    date: "2019-03-18"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-05-20"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 46,
                name: "CUDA Toolkit",
                description: "NVIDIA CUDA Toolkit - parallel computing platform and programming model",
                industry: "cuda-nvidia-ai",
                founded_year: 2007,
                employees: 0,
                location: "Santa Clara, CA",
                website: "https://developer.nvidia.com/cuda-toolkit",
                funding_raised: 0,
                last_funding_round: "Internal",
                ceo: "Jensen Huang",
                investors: ["NVIDIA"],
                valuation: 0,
                logo: "https://logo.clearbit.com/nvidia.com",
                status: "active",
                growth_rate: 30,
                technical_employees_pct: 100,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                funding: {
                    round: "Internal",
                    amount: 0,
                    date: "2007-02-15"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-04-10"
                },
                news: [],
                vcPortfolio: []
            },

            // Additional Frontier Model Builders (European/Global)
            {
                id: 47,
                name: "Mistral",
                description: "European AI company developing efficient language models and AI infrastructure",
                industry: "frontier-model-builders",
                founded_year: 2023,
                employees: 200,
                location: "Paris, France",
                website: "https://mistral.ai",
                funding_raised: 600000000,
                last_funding_round: "Series B",
                ceo: "Arthur Mensch",
                investors: ["Andreessen Horowitz", "Lightspeed Venture Partners", "General Catalyst"],
                valuation: 2000000000,
                logo: "https://logo.clearbit.com/mistral.ai",
                status: "active",
                growth_rate: 400,
                technical_employees_pct: 95,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                company_type: "European Operations",
                funding: {
                    round: "Series B",
                    amount: 600000000,
                    date: "2024-12-06"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 48,
                name: "Aleph Alpha",
                description: "German AI company specializing in large language models and AI infrastructure",
                industry: "frontier-model-builders",
                founded_year: 2019,
                employees: 300,
                location: "Heidelberg, Germany",
                website: "https://aleph-alpha.com",
                funding_raised: 500000000,
                last_funding_round: "Series B",
                ceo: "Jonas Andrulis",
                investors: ["Bosch Ventures", "SAP Ventures", "HV Capital"],
                valuation: 1000000000,
                logo: "https://logo.clearbit.com/aleph-alpha.com",
                status: "active",
                growth_rate: 200,
                technical_employees_pct: 90,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                company_type: "European Operations",
                funding: {
                    round: "Series B",
                    amount: 500000000,
                    date: "2024-11-15"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 49,
                name: "Hugging Face",
                description: "AI community and platform for machine learning models (Global Operations)",
                industry: "frontier-model-builders",
                founded_year: 2016,
                employees: 200,
                location: "New York, NY",
                website: "https://huggingface.co",
                funding_raised: 235000000,
                last_funding_round: "Series D",
                ceo: "Clem Delangue",
                investors: ["Andreessen Horowitz", "Sequoia Capital", "Coatue"],
                valuation: 4500000000,
                logo: "https://logo.clearbit.com/huggingface.co",
                status: "active",
                growth_rate: 150,
                technical_employees_pct: 95,
                ncp_status: "Partner",
                partner_tier: "Gold",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                company_type: "Global Operations",
                funding: {
                    round: "Series D",
                    amount: 235000000,
                    date: "2024-08-15"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-09-05"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 50,
                name: "OpenAI",
                description: "AI research and deployment company focused on creating safe artificial general intelligence (Europe Operations)",
                industry: "frontier-model-builders",
                founded_year: 2015,
                employees: 1500,
                location: "London, UK",
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
                company_type: "Europe Operations",
                funding: {
                    round: "Series E",
                    amount: 13000000000,
                    date: "2024-09-20"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-09-15"
                },
                news: [],
                vcPortfolio: []
            },

            // Additional Agentic & Generative AI Applications
            {
                id: 51,
                name: "Synthesia",
                description: "AI-powered video creation platform for synthetic media",
                industry: "agentic-generative-ai",
                founded_year: 2017,
                employees: 400,
                location: "London, UK",
                website: "https://synthesia.io",
                funding_raised: 90000000,
                last_funding_round: "Series C",
                ceo: "Victor Riparbelli",
                investors: ["Kleiner Perkins", "GV", "Accel"],
                valuation: 1000000000,
                logo: "https://logo.clearbit.com/synthesia.io",
                status: "active",
                growth_rate: 150,
                technical_employees_pct: 85,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                company_type: "Video Generation",
                funding: {
                    round: "Series C",
                    amount: 90000000,
                    date: "2024-06-20"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 52,
                name: "Runway",
                description: "AI-powered creative tools for video editing and generation (Global Operations)",
                industry: "agentic-generative-ai",
                founded_year: 2018,
                employees: 300,
                location: "New York, NY",
                website: "https://runwayml.com",
                funding_raised: 237000000,
                last_funding_round: "Series C",
                ceo: "Cristóbal Valenzuela",
                investors: ["Google Ventures", "Amplify Partners", "Lux Capital"],
                valuation: 1500000000,
                logo: "https://logo.clearbit.com/runwayml.com",
                status: "active",
                growth_rate: 200,
                technical_employees_pct: 85,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                company_type: "Global Operations",
                funding: {
                    round: "Series C",
                    amount: 237000000,
                    date: "2024-06-15"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 53,
                name: "ElevenLabs",
                description: "AI voice synthesis and cloning platform (Global Operations)",
                industry: "agentic-generative-ai",
                founded_year: 2022,
                employees: 80,
                location: "London, UK",
                website: "https://elevenlabs.io",
                funding_raised: 101000000,
                last_funding_round: "Series B",
                ceo: "Piotr Dąbkowski",
                investors: ["Andreessen Horowitz", "Nat Friedman", "Daniel Gross"],
                valuation: 1000000000,
                logo: "https://logo.clearbit.com/elevenlabs.io",
                status: "active",
                growth_rate: 500,
                technical_employees_pct: 90,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                company_type: "Global Operations",
                funding: {
                    round: "Series B",
                    amount: 101000000,
                    date: "2024-04-30"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 54,
                name: "Descript",
                description: "AI-powered audio and video editing platform",
                industry: "agentic-generative-ai",
                founded_year: 2017,
                employees: 200,
                location: "San Francisco, CA",
                website: "https://descript.com",
                funding_raised: 100000000,
                last_funding_round: "Series C",
                ceo: "Andrew Mason",
                investors: ["Andreessen Horowitz", "Redpoint Ventures", "Spark Capital"],
                valuation: 500000000,
                logo: "https://logo.clearbit.com/descript.com",
                status: "active",
                growth_rate: 120,
                technical_employees_pct: 80,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                company_type: "Audio/Video Editing",
                funding: {
                    round: "Series C",
                    amount: 100000000,
                    date: "2024-05-10"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 55,
                name: "Krikey AI",
                description: "AI-powered 3D animation and avatar creation platform",
                industry: "agentic-generative-ai",
                founded_year: 2020,
                employees: 100,
                location: "San Francisco, CA",
                website: "https://krikey.ai",
                funding_raised: 50000000,
                last_funding_round: "Series A",
                ceo: "Ketaki Shriram",
                investors: ["General Catalyst", "Index Ventures", "Y Combinator"],
                valuation: 200000000,
                logo: "https://logo.clearbit.com/krikey.ai",
                status: "active",
                growth_rate: 300,
                technical_employees_pct: 85,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                company_type: "3D Animation",
                funding: {
                    round: "Series A",
                    amount: 50000000,
                    date: "2024-03-25"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 56,
                name: "Stability AI",
                description: "Open-source AI company developing image and video generation models",
                industry: "agentic-generative-ai",
                founded_year: 2020,
                employees: 300,
                location: "London, UK",
                website: "https://stability.ai",
                funding_raised: 101000000,
                last_funding_round: "Series A",
                ceo: "Emad Mostaque",
                investors: ["Coatue", "Lightspeed Venture Partners", "O'Shaughnessy Ventures"],
                valuation: 1000000000,
                logo: "https://logo.clearbit.com/stability.ai",
                status: "active",
                growth_rate: 250,
                technical_employees_pct: 90,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                company_type: "Open Source AI",
                funding: {
                    round: "Series A",
                    amount: 101000000,
                    date: "2024-02-15"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },

            // Additional Customer Experience (CX)
            {
                id: 57,
                name: "Ultimate AI",
                description: "AI-powered customer service automation platform",
                industry: "customer-experience",
                founded_year: 2017,
                employees: 150,
                location: "Berlin, Germany",
                website: "https://ultimate.ai",
                funding_raised: 30000000,
                last_funding_round: "Series B",
                ceo: "Reetu Kainulainen",
                investors: ["HV Capital", "Target Global", "Mosaic Ventures"],
                valuation: 150000000,
                logo: "https://logo.clearbit.com/ultimate.ai",
                status: "active",
                growth_rate: 180,
                technical_employees_pct: 85,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                company_type: "European Operations",
                funding: {
                    round: "Series B",
                    amount: 30000000,
                    date: "2024-04-20"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 58,
                name: "PolyAI",
                description: "Conversational AI platform for enterprise customer service",
                industry: "customer-experience",
                founded_year: 2017,
                employees: 200,
                location: "London, UK",
                website: "https://poly.ai",
                funding_raised: 50000000,
                last_funding_round: "Series B",
                ceo: "Nikola Mrkšić",
                investors: ["Khosla Ventures", "Point72 Ventures", "Amadeus Capital"],
                valuation: 300000000,
                logo: "https://logo.clearbit.com/poly.ai",
                status: "active",
                growth_rate: 150,
                technical_employees_pct: 90,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                company_type: "Conversational AI",
                funding: {
                    round: "Series B",
                    amount: 50000000,
                    date: "2024-06-30"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 59,
                name: "Heyday",
                description: "AI-powered conversational commerce platform",
                industry: "customer-experience",
                founded_year: 2019,
                employees: 100,
                location: "Montreal, Canada",
                website: "https://heyday.ai",
                funding_raised: 20000000,
                last_funding_round: "Series A",
                ceo: "Steve Desjarlais",
                investors: ["iNovia Capital", "Desjardins Capital", "Real Ventures"],
                valuation: 100000000,
                logo: "https://logo.clearbit.com/heyday.ai",
                status: "active",
                growth_rate: 200,
                technical_employees_pct: 80,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                company_type: "Conversational Commerce",
                funding: {
                    round: "Series A",
                    amount: 20000000,
                    date: "2024-05-15"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 60,
                name: "LivePerson",
                description: "Conversational AI platform for customer engagement",
                industry: "customer-experience",
                founded_year: 1995,
                employees: 2000,
                location: "New York, NY",
                website: "https://liveperson.com",
                funding_raised: 0,
                last_funding_round: "IPO",
                ceo: "Robert LoCascio",
                investors: ["Public Company"],
                valuation: 1000000000,
                logo: "https://logo.clearbit.com/liveperson.com",
                status: "public",
                growth_rate: 15,
                technical_employees_pct: 70,
                ncp_status: "Partner",
                partner_tier: "Silver",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: true,
                company_type: "Public Company",
                funding: {
                    round: "IPO",
                    amount: 0,
                    date: "2000-06-15"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-07-10"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 61,
                name: "Sprinklr",
                description: "Unified customer experience management platform",
                industry: "customer-experience",
                founded_year: 2009,
                employees: 3000,
                location: "New York, NY",
                website: "https://sprinklr.com",
                funding_raised: 200000000,
                last_funding_round: "Series F",
                ceo: "Ragy Thomas",
                investors: ["Battery Ventures", "Intel Capital", "Temasek"],
                valuation: 2000000000,
                logo: "https://logo.clearbit.com/sprinklr.com",
                status: "active",
                growth_rate: 30,
                technical_employees_pct: 75,
                ncp_status: "Partner",
                partner_tier: "Gold",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                company_type: "CX Management",
                funding: {
                    round: "Series F",
                    amount: 200000000,
                    date: "2024-08-25"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-09-01"
                },
                news: [],
                vcPortfolio: []
            },

            // Additional Code Generation & Developer Tools
            {
                id: 62,
                name: "GitHub Copilot",
                description: "AI-powered code completion and generation tool (EU Base)",
                industry: "code-generation",
                founded_year: 2021,
                employees: 0,
                location: "Dublin, Ireland",
                website: "https://github.com/features/copilot",
                funding_raised: 0,
                last_funding_round: "Internal",
                ceo: "Thomas Dohmke",
                investors: ["Microsoft"],
                valuation: 0,
                logo: "https://logo.clearbit.com/github.com",
                status: "active",
                growth_rate: 200,
                technical_employees_pct: 100,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                company_type: "EU Base",
                funding: {
                    round: "Internal",
                    amount: 0,
                    date: "2021-06-29"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-06-15"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 63,
                name: "CodiumAI",
                description: "AI-powered code review and testing platform (Global Operations)",
                industry: "code-generation",
                founded_year: 2021,
                employees: 80,
                location: "Tel Aviv, Israel",
                website: "https://codium.ai",
                funding_raised: 50000000,
                last_funding_round: "Series A",
                ceo: "Itamar Friedman",
                investors: ["Kleiner Perkins", "TLV Partners", "Viola Ventures"],
                valuation: 200000000,
                logo: "https://logo.clearbit.com/codium.ai",
                status: "active",
                growth_rate: 300,
                technical_employees_pct: 90,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                company_type: "Global Operations",
                funding: {
                    round: "Series A",
                    amount: 50000000,
                    date: "2024-02-10"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 64,
                name: "Replit",
                description: "Collaborative browser-based IDE and coding platform (Global Operations)",
                industry: "code-generation",
                founded_year: 2016,
                employees: 200,
                location: "San Francisco, CA",
                website: "https://replit.com",
                funding_raised: 200000000,
                last_funding_round: "Series B",
                ceo: "Amjad Masad",
                investors: ["Andreessen Horowitz", "Index Ventures", "Y Combinator"],
                valuation: 1000000000,
                logo: "https://logo.clearbit.com/replit.com",
                status: "active",
                growth_rate: 150,
                technical_employees_pct: 90,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: false,
                digital_native: true,
                company_type: "Global Operations",
                funding: {
                    round: "Series B",
                    amount: 200000000,
                    date: "2024-02-20"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 65,
                name: "Sourcegraph",
                description: "AI-powered code search and intelligence platform",
                industry: "code-generation",
                founded_year: 2013,
                employees: 300,
                location: "San Francisco, CA",
                website: "https://sourcegraph.com",
                funding_raised: 125000000,
                last_funding_round: "Series D",
                ceo: "Quinn Slack",
                investors: ["Andreessen Horowitz", "Sequoia Capital", "Goldman Sachs"],
                valuation: 2000000000,
                logo: "https://logo.clearbit.com/sourcegraph.com",
                status: "active",
                growth_rate: 100,
                technical_employees_pct: 90,
                ncp_status: "Partner",
                partner_tier: "Silver",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                company_type: "Code Intelligence",
                funding: {
                    round: "Series D",
                    amount: 125000000,
                    date: "2024-07-20"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-08-15"
                },
                news: [],
                vcPortfolio: []
            },

            // Additional Productivity & Collaboration
            {
                id: 66,
                name: "Typewise",
                description: "AI-powered keyboard and text prediction platform",
                industry: "productivity-collaboration",
                founded_year: 2018,
                employees: 50,
                location: "Zurich, Switzerland",
                website: "https://typewise.app",
                funding_raised: 10000000,
                last_funding_round: "Series A",
                ceo: "David Eberle",
                investors: ["Swisscom Ventures", "Verve Ventures", "Redalpine"],
                valuation: 50000000,
                logo: "https://logo.clearbit.com/typewise.app",
                status: "active",
                growth_rate: 150,
                technical_employees_pct: 80,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                company_type: "European Operations",
                funding: {
                    round: "Series A",
                    amount: 10000000,
                    date: "2024-03-10"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 67,
                name: "Krisp",
                description: "AI-powered noise cancellation and audio enhancement platform",
                industry: "productivity-collaboration",
                founded_year: 2017,
                employees: 100,
                location: "San Francisco, CA",
                website: "https://krisp.ai",
                funding_raised: 50000000,
                last_funding_round: "Series B",
                ceo: "Davit Baghdasaryan",
                investors: ["Sequoia Capital", "IVP", "RTP Global"],
                valuation: 200000000,
                logo: "https://logo.clearbit.com/krisp.ai",
                status: "active",
                growth_rate: 120,
                technical_employees_pct: 85,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                company_type: "Audio Enhancement",
                funding: {
                    round: "Series B",
                    amount: 50000000,
                    date: "2024-04-15"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 68,
                name: "Tome",
                description: "AI-powered presentation and storytelling platform (Global Operations)",
                industry: "productivity-collaboration",
                founded_year: 2020,
                employees: 150,
                location: "San Francisco, CA",
                website: "https://tome.app",
                funding_raised: 81000000,
                last_funding_round: "Series B",
                ceo: "Henri Liriani",
                investors: ["Greylock Partners", "Benchmark", "Lightspeed Venture Partners"],
                valuation: 500000000,
                logo: "https://logo.clearbit.com/tome.app",
                status: "active",
                growth_rate: 300,
                technical_employees_pct: 80,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                company_type: "Global Operations",
                funding: {
                    round: "Series B",
                    amount: 81000000,
                    date: "2024-05-20"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 69,
                name: "Notion",
                description: "All-in-one workspace for notes, docs, wikis, and project management (Global Operations)",
                industry: "productivity-collaboration",
                founded_year: 2016,
                employees: 500,
                location: "San Francisco, CA",
                website: "https://notion.so",
                funding_raised: 343000000,
                last_funding_round: "Series C",
                ceo: "Ivan Zhao",
                investors: ["Sequoia Capital", "Index Ventures", "First Round"],
                valuation: 10000000000,
                logo: "https://logo.clearbit.com/notion.so",
                status: "active",
                growth_rate: 100,
                technical_employees_pct: 75,
                ncp_status: "Partner",
                partner_tier: "Gold",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                company_type: "Global Operations",
                funding: {
                    round: "Series C",
                    amount: 343000000,
                    date: "2024-01-25"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-07-20"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 70,
                name: "Figma",
                description: "Collaborative interface design tool for teams (Global Operations)",
                industry: "productivity-collaboration",
                founded_year: 2012,
                employees: 1200,
                location: "San Francisco, CA",
                website: "https://figma.com",
                funding_raised: 333000000,
                last_funding_round: "Series E",
                ceo: "Dylan Field",
                investors: ["Index Ventures", "Greylock Partners", "Kleiner Perkins"],
                valuation: 20000000000,
                logo: "https://logo.clearbit.com/figma.com",
                status: "private",
                growth_rate: 80,
                technical_employees_pct: 75,
                ncp_status: "Partner",
                partner_tier: "Gold",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                company_type: "Global Operations",
                funding: {
                    round: "Series E",
                    amount: 333000000,
                    date: "2024-03-15"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-08-20"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 71,
                name: "Canva",
                description: "Online design and publishing tool for creating graphics, presentations, and documents (Global Operations)",
                industry: "productivity-collaboration",
                founded_year: 2013,
                employees: 4000,
                location: "Sydney, Australia",
                website: "https://canva.com",
                funding_raised: 572000000,
                last_funding_round: "Series C",
                ceo: "Melanie Perkins",
                investors: ["Sequoia Capital", "Blackbird Ventures", "General Catalyst"],
                valuation: 40000000000,
                logo: "https://logo.clearbit.com/canva.com",
                status: "private",
                growth_rate: 60,
                technical_employees_pct: 70,
                ncp_status: "Partner",
                partner_tier: "Gold",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                company_type: "Global Operations",
                funding: {
                    round: "Series C",
                    amount: 572000000,
                    date: "2024-04-12"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-07-15"
                },
                news: [],
                vcPortfolio: []
            },

            // Additional Infrastructure, Hosting & Serving
            {
                id: 72,
                name: "AWS",
                description: "Amazon Web Services - comprehensive cloud computing platform (Europe Operations)",
                industry: "infrastructure-hosting",
                founded_year: 2006,
                employees: 0,
                location: "Dublin, Ireland",
                website: "https://aws.amazon.com",
                funding_raised: 0,
                last_funding_round: "Internal",
                ceo: "Adam Selipsky",
                investors: ["Amazon"],
                valuation: 0,
                logo: "https://logo.clearbit.com/aws.amazon.com",
                status: "active",
                growth_rate: 30,
                technical_employees_pct: 85,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                company_type: "Europe Operations",
                funding: {
                    round: "Internal",
                    amount: 0,
                    date: "2006-03-14"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-05-15"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 73,
                name: "Azure Cloud",
                description: "Microsoft Azure - cloud computing platform and services (Global Operations)",
                industry: "infrastructure-hosting",
                founded_year: 2010,
                employees: 0,
                location: "Redmond, WA",
                website: "https://azure.microsoft.com",
                funding_raised: 0,
                last_funding_round: "Internal",
                ceo: "Satya Nadella",
                investors: ["Microsoft"],
                valuation: 0,
                logo: "https://logo.clearbit.com/azure.microsoft.com",
                status: "active",
                growth_rate: 35,
                technical_employees_pct: 85,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                company_type: "Global Operations",
                funding: {
                    round: "Internal",
                    amount: 0,
                    date: "2010-02-01"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-04-20"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 74,
                name: "Google Cloud Platform",
                description: "Google Cloud Platform - cloud computing and AI services (EU Operations)",
                industry: "infrastructure-hosting",
                founded_year: 2008,
                employees: 0,
                location: "Dublin, Ireland",
                website: "https://cloud.google.com",
                funding_raised: 0,
                last_funding_round: "Internal",
                ceo: "Thomas Kurian",
                investors: ["Google"],
                valuation: 0,
                logo: "https://logo.clearbit.com/cloud.google.com",
                status: "active",
                growth_rate: 40,
                technical_employees_pct: 90,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: true,
                company_type: "EU Operations",
                funding: {
                    round: "Internal",
                    amount: 0,
                    date: "2008-04-07"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-03-25"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 75,
                name: "Vercel",
                description: "Frontend cloud platform for developers (Global Operations)",
                industry: "infrastructure-hosting",
                founded_year: 2015,
                employees: 400,
                location: "San Francisco, CA",
                website: "https://vercel.com",
                funding_raised: 250000000,
                last_funding_round: "Series D",
                ceo: "Guillermo Rauch",
                investors: ["Accel", "CRV", "GV"],
                valuation: 2500000000,
                logo: "https://logo.clearbit.com/vercel.com",
                status: "active",
                growth_rate: 100,
                technical_employees_pct: 90,
                ncp_status: "Partner",
                partner_tier: "Silver",
                vc_tier: "Tier 1",
                ai_native: false,
                digital_native: true,
                company_type: "Global Operations",
                funding: {
                    round: "Series D",
                    amount: 250000000,
                    date: "2024-06-10"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-07-30"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 76,
                name: "Hugging Face Hub",
                description: "AI model hosting and sharing platform",
                industry: "infrastructure-hosting",
                founded_year: 2016,
                employees: 200,
                location: "New York, NY",
                website: "https://huggingface.co",
                funding_raised: 235000000,
                last_funding_round: "Series D",
                ceo: "Clem Delangue",
                investors: ["Andreessen Horowitz", "Sequoia Capital", "Coatue"],
                valuation: 4500000000,
                logo: "https://logo.clearbit.com/huggingface.co",
                status: "active",
                growth_rate: 150,
                technical_employees_pct: 95,
                ncp_status: "Partner",
                partner_tier: "Gold",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                company_type: "Model Hub",
                funding: {
                    round: "Series D",
                    amount: 235000000,
                    date: "2024-08-15"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-09-05"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 77,
                name: "Baseten",
                description: "ML infrastructure platform for deploying AI models (Global Operations)",
                industry: "infrastructure-hosting",
                founded_year: 2020,
                employees: 80,
                location: "San Francisco, CA",
                website: "https://baseten.co",
                funding_raised: 40000000,
                last_funding_round: "Series A",
                ceo: "Amjad Masad",
                investors: ["Greylock Partners", "Index Ventures", "Y Combinator"],
                valuation: 200000000,
                logo: "https://logo.clearbit.com/baseten.co",
                status: "active",
                growth_rate: 200,
                technical_employees_pct: 90,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                company_type: "Global Operations",
                funding: {
                    round: "Series A",
                    amount: 40000000,
                    date: "2024-03-20"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 78,
                name: "Scaleway",
                description: "European cloud computing and infrastructure platform",
                industry: "infrastructure-hosting",
                founded_year: 1999,
                employees: 1000,
                location: "Paris, France",
                website: "https://scaleway.com",
                funding_raised: 0,
                last_funding_round: "Internal",
                ceo: "Yann Lechelle",
                investors: ["Iliad Group"],
                valuation: 0,
                logo: "https://logo.clearbit.com/scaleway.com",
                status: "active",
                growth_rate: 25,
                technical_employees_pct: 80,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: false,
                digital_native: true,
                company_type: "European Operations",
                funding: {
                    round: "Internal",
                    amount: 0,
                    date: "1999-01-01"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 79,
                name: "Together AI",
                description: "AI infrastructure platform for training and inference (Global Operations)",
                industry: "infrastructure-hosting",
                founded_year: 2022,
                employees: 150,
                location: "San Francisco, CA",
                website: "https://together.ai",
                funding_raised: 200000000,
                last_funding_round: "Series B",
                ceo: "Vipul Ved Prakash",
                investors: ["Kleiner Perkins", "NEA", "Lux Capital"],
                valuation: 1000000000,
                logo: "https://logo.clearbit.com/together.ai",
                status: "active",
                growth_rate: 300,
                technical_employees_pct: 95,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                company_type: "Global Operations",
                funding: {
                    round: "Series B",
                    amount: 200000000,
                    date: "2024-07-25"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },

            // Additional MLOps & Data Infrastructure
            {
                id: 80,
                name: "Weights & Biases",
                description: "MLOps platform for experiment tracking and model management (Global Operations)",
                industry: "mlops-data-infrastructure",
                founded_year: 2017,
                employees: 300,
                location: "San Francisco, CA",
                website: "https://wandb.ai",
                funding_raised: 200000000,
                last_funding_round: "Series C",
                ceo: "Lukas Biewald",
                investors: ["Insight Partners", "Coatue", "GV"],
                valuation: 1000000000,
                logo: "https://logo.clearbit.com/wandb.ai",
                status: "active",
                growth_rate: 120,
                technical_employees_pct: 90,
                ncp_status: "Partner",
                partner_tier: "Silver",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                company_type: "Global Operations",
                funding: {
                    round: "Series C",
                    amount: 200000000,
                    date: "2024-04-05"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-07-20"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 81,
                name: "DataBricks",
                description: "Unified analytics platform for big data and AI (Europe Operations)",
                industry: "mlops-data-infrastructure",
                founded_year: 2013,
                employees: 6000,
                location: "Amsterdam, Netherlands",
                website: "https://databricks.com",
                funding_raised: 3500000000,
                last_funding_round: "Series I",
                ceo: "Ali Ghodsi",
                investors: ["Andreessen Horowitz", "NEA", "Tiger Global"],
                valuation: 43000000000,
                logo: "https://logo.clearbit.com/databricks.com",
                status: "active",
                growth_rate: 60,
                technical_employees_pct: 85,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                company_type: "Europe Operations",
                funding: {
                    round: "Series I",
                    amount: 3500000000,
                    date: "2024-09-15"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-09-20"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 82,
                name: "Pinecone",
                description: "Vector database for AI applications (Global Operations)",
                industry: "mlops-data-infrastructure",
                founded_year: 2019,
                employees: 200,
                location: "San Francisco, CA",
                website: "https://pinecone.io",
                funding_raised: 138000000,
                last_funding_round: "Series B",
                ceo: "Edo Liberty",
                investors: ["Andreessen Horowitz", "ICONIQ Capital", "Menlo Ventures"],
                valuation: 700000000,
                logo: "https://logo.clearbit.com/pinecone.io",
                status: "active",
                growth_rate: 200,
                technical_employees_pct: 90,
                ncp_status: "Partner",
                partner_tier: "Silver",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                company_type: "Global Operations",
                funding: {
                    round: "Series B",
                    amount: 138000000,
                    date: "2024-06-20"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-08-05"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 83,
                name: "LangChain",
                description: "Framework for developing applications powered by language models (Global Operations)",
                industry: "mlops-data-infrastructure",
                founded_year: 2022,
                employees: 100,
                location: "San Francisco, CA",
                website: "https://langchain.com",
                funding_raised: 25000000,
                last_funding_round: "Series A",
                ceo: "Harrison Chase",
                investors: ["Sequoia Capital", "Benchmark", "Andreessen Horowitz"],
                valuation: 200000000,
                logo: "https://logo.clearbit.com/langchain.com",
                status: "active",
                growth_rate: 500,
                technical_employees_pct: 95,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                company_type: "Global Operations",
                funding: {
                    round: "Series A",
                    amount: 25000000,
                    date: "2024-02-28"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 84,
                name: "LlamaIndex",
                description: "Data framework for LLM applications (Global Operations)",
                industry: "mlops-data-infrastructure",
                founded_year: 2022,
                employees: 50,
                location: "San Francisco, CA",
                website: "https://llamaindex.ai",
                funding_raised: 15000000,
                last_funding_round: "Seed",
                ceo: "Jerry Liu",
                investors: ["Greylock Partners", "Index Ventures", "Y Combinator"],
                valuation: 100000000,
                logo: "https://logo.clearbit.com/llamaindex.ai",
                status: "active",
                growth_rate: 400,
                technical_employees_pct: 95,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                company_type: "Global Operations",
                funding: {
                    round: "Seed",
                    amount: 15000000,
                    date: "2024-01-15"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 85,
                name: "Qdrant",
                description: "Vector database and similarity search engine",
                industry: "mlops-data-infrastructure",
                founded_year: 2021,
                employees: 80,
                location: "Berlin, Germany",
                website: "https://qdrant.tech",
                funding_raised: 20000000,
                last_funding_round: "Series A",
                ceo: "Andrey Vasnetsov",
                investors: ["Runa Capital", "Uncork Capital", "42CAP"],
                valuation: 100000000,
                logo: "https://logo.clearbit.com/qdrant.tech",
                status: "active",
                growth_rate: 300,
                technical_employees_pct: 90,
                ncp_status: "Not Partner",
                partner_tier: null,
                vc_tier: "Tier 2",
                ai_native: true,
                digital_native: false,
                company_type: "European Operations",
                funding: {
                    round: "Series A",
                    amount: 20000000,
                    date: "2024-06-10"
                },
                outreach: {
                    contacted: false,
                    lastMessage: null
                },
                news: [],
                vcPortfolio: []
            },

            // Additional CUDA-X / NVIDIA AI Platform
            {
                id: 86,
                name: "cuDNN",
                description: "CUDA Deep Neural Network library for GPU-accelerated deep learning (Global Operations)",
                industry: "cuda-nvidia-ai",
                founded_year: 2014,
                employees: 0,
                location: "Santa Clara, CA",
                website: "https://developer.nvidia.com/cudnn",
                funding_raised: 0,
                last_funding_round: "Internal",
                ceo: "Jensen Huang",
                investors: ["NVIDIA"],
                valuation: 0,
                logo: "https://logo.clearbit.com/nvidia.com",
                status: "active",
                growth_rate: 50,
                technical_employees_pct: 100,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                company_type: "Global Operations",
                funding: {
                    round: "Internal",
                    amount: 0,
                    date: "2014-09-02"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-09-01"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 87,
                name: "TensorRT",
                description: "NVIDIA TensorRT - high-performance deep learning inference platform (Global Operations)",
                industry: "cuda-nvidia-ai",
                founded_year: 2016,
                employees: 0,
                location: "Santa Clara, CA",
                website: "https://developer.nvidia.com/tensorrt",
                funding_raised: 0,
                last_funding_round: "Internal",
                ceo: "Jensen Huang",
                investors: ["NVIDIA"],
                valuation: 0,
                logo: "https://logo.clearbit.com/nvidia.com",
                status: "active",
                growth_rate: 60,
                technical_employees_pct: 100,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                company_type: "Global Operations",
                funding: {
                    round: "Internal",
                    amount: 0,
                    date: "2016-11-08"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-08-15"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 88,
                name: "RAPIDS",
                description: "GPU-accelerated data science and machine learning platform (Global Operations)",
                industry: "cuda-nvidia-ai",
                founded_year: 2018,
                employees: 0,
                location: "Santa Clara, CA",
                website: "https://rapids.ai",
                funding_raised: 0,
                last_funding_round: "Internal",
                ceo: "Jensen Huang",
                investors: ["NVIDIA"],
                valuation: 0,
                logo: "https://logo.clearbit.com/nvidia.com",
                status: "active",
                growth_rate: 70,
                technical_employees_pct: 100,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                company_type: "Global Operations",
                funding: {
                    round: "Internal",
                    amount: 0,
                    date: "2018-10-10"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-06-25"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 89,
                name: "Triton Inference Server",
                description: "NVIDIA Triton - scalable AI model serving platform (Global Operations)",
                industry: "cuda-nvidia-ai",
                founded_year: 2019,
                employees: 0,
                location: "Santa Clara, CA",
                website: "https://developer.nvidia.com/triton-inference-server",
                funding_raised: 0,
                last_funding_round: "Internal",
                ceo: "Jensen Huang",
                investors: ["NVIDIA"],
                valuation: 0,
                logo: "https://logo.clearbit.com/nvidia.com",
                status: "active",
                growth_rate: 80,
                technical_employees_pct: 100,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                company_type: "Global Operations",
                funding: {
                    round: "Internal",
                    amount: 0,
                    date: "2019-03-18"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-05-20"
                },
                news: [],
                vcPortfolio: []
            },
            {
                id: 90,
                name: "CUDA Toolkit",
                description: "NVIDIA CUDA Toolkit - parallel computing platform and programming model (Global Operations)",
                industry: "cuda-nvidia-ai",
                founded_year: 2007,
                employees: 0,
                location: "Santa Clara, CA",
                website: "https://developer.nvidia.com/cuda-toolkit",
                funding_raised: 0,
                last_funding_round: "Internal",
                ceo: "Jensen Huang",
                investors: ["NVIDIA"],
                valuation: 0,
                logo: "https://logo.clearbit.com/nvidia.com",
                status: "active",
                growth_rate: 30,
                technical_employees_pct: 100,
                ncp_status: "Partner",
                partner_tier: "Premier",
                vc_tier: "Tier 1",
                ai_native: true,
                digital_native: false,
                company_type: "Global Operations",
                funding: {
                    round: "Internal",
                    amount: 0,
                    date: "2007-02-15"
                },
                outreach: {
                    contacted: true,
                    lastMessage: "2024-04-10"
                },
                news: [],
                vcPortfolio: []
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
                focus_areas: ["AI", "Enterprise Software", "Crypto"],
                final_score: 92.3,
                logo: "",
                investments: 38
            },
            {
                id: 103,
                name: "General Catalyst",
                description: "Venture capital firm investing in technology and healthcare companies",
                location: "Cambridge, MA",
                investment_stage: "multi-stage",
                website: "https://generalcatalyst.com",
                portfolio_companies: 200,
                total_aum: 8000000000,
                focus_areas: ["AI", "Healthcare", "Enterprise"],
                final_score: 91.5,
                logo: "",
                investments: 35
            },
            {
                id: 104,
                name: "Kleiner Perkins",
                description: "Venture capital firm focused on early and growth stage investments",
                location: "Menlo Park, CA",
                investment_stage: "multi-stage",
                website: "https://kleinerperkins.com",
                portfolio_companies: 350,
                total_aum: 6000000000,
                focus_areas: ["AI", "Healthcare", "Consumer"],
                final_score: 89.2,
                logo: "",
                investments: 28
            },
            {
                id: 105,
                name: "Index Ventures",
                description: "International venture capital firm investing in technology companies",
                location: "San Francisco, CA",
                investment_stage: "multi-stage",
                website: "https://indexventures.com",
                portfolio_companies: 300,
                total_aum: 5000000000,
                focus_areas: ["AI", "Enterprise", "Consumer"],
                final_score: 87.6,
                logo: "",
                investments: 25
            },
            {
                id: 106,
                name: "Benchmark",
                description: "Early-stage venture capital firm focused on technology companies",
                location: "San Francisco, CA",
                investment_stage: "early-stage",
                website: "https://benchmark.com",
                portfolio_companies: 150,
                total_aum: 3000000000,
                focus_areas: ["AI", "Enterprise", "Consumer"],
                final_score: 85.4,
                logo: "",
                investments: 20
            }
        ];

        this.news = [
            {
                id: 1,
                headline: "OpenAI Raises $13B Series E Led by Microsoft to Scale AI Infrastructure",
                content: "OpenAI has secured a massive $13 billion Series E funding round led by Microsoft, marking one of the largest AI investments in history. The funding will be used to accelerate the development of artificial general intelligence and expand infrastructure capabilities.",
                what_this_means: "This massive funding round signals OpenAI's continued dominance in AI infrastructure, creating significant opportunities for NVIDIA's GPU ecosystem. As OpenAI scales their compute requirements, NVIDIA stands to benefit from increased demand for H100 and future GPU architectures. For NCP partners, this represents a validation of the AI market's growth trajectory and potential for increased enterprise AI adoption requiring NVIDIA's hardware and software solutions.",
                url: "https://techcrunch.com/openai-series-e-funding",
                source: "TechCrunch",
                published_at: "2024-09-20T10:00:00Z",
                category: "Funding",
                company_id: 1,
                read_time: "5 min read"
            },
            {
                id: 2,
                headline: "Anthropic Secures $8B Series C to Advance AI Safety Research",
                content: "Anthropic has raised $8 billion in Series C funding to accelerate AI safety research and development. The company plans to use the funds to expand its AI safety team and develop more robust AI systems.",
                what_this_means: "Anthropic's focus on AI safety research aligns perfectly with NVIDIA's enterprise AI strategy, emphasizing responsible AI deployment. This funding validates the importance of AI safety in enterprise environments, creating opportunities for NVIDIA's AI safety tools and frameworks. NCP partners can leverage this trend to position NVIDIA's solutions as enterprise-ready and safety-compliant, differentiating from competitors in the responsible AI space.",
                url: "https://techcrunch.com/anthropic-series-c-funding",
                source: "TechCrunch",
                published_at: "2024-05-27T14:30:00Z",
                category: "Funding",
                company_id: 2,
                read_time: "4 min read"
            },
            {
                id: 3,
                headline: "NVIDIA Partners with Leading AI Companies for CUDA-X Platform",
                content: "NVIDIA has announced strategic partnerships with major AI companies to expand its CUDA-X platform ecosystem, providing developers with enhanced tools for GPU-accelerated AI development.",
                what_this_means: "This partnership expansion directly strengthens NVIDIA's ecosystem dominance and creates more opportunities for NCP partners to integrate with leading AI companies. The CUDA-X platform's growth validates NVIDIA's developer-first approach, making it easier for NCP partners to build solutions on NVIDIA's infrastructure. This ecosystem expansion increases the value proposition for customers choosing NVIDIA over competitors.",
                url: "https://techcrunch.com/nvidia-cuda-x-partnerships",
                source: "TechCrunch",
                published_at: "2024-10-15T09:15:00Z",
                category: "Partnership",
                company_id: 41,
                read_time: "6 min read"
            },
            {
                id: 4,
                headline: "DataBricks Raises $3.5B Series I to Scale Unified Analytics Platform",
                content: "DataBricks has secured $3.5 billion in Series I funding to expand its unified analytics platform for big data and AI. The company plans to invest heavily in AI and machine learning capabilities.",
                what_this_means: "DataBricks' massive funding validates the enterprise demand for unified AI/ML platforms, creating significant opportunities for NVIDIA's data center GPUs and AI infrastructure. As DataBricks scales their platform, they'll require more NVIDIA hardware for training and inference. NCP partners can leverage this trend to position NVIDIA's solutions as essential infrastructure for enterprise AI transformation.",
                url: "https://techcrunch.com/databricks-series-i-funding",
                source: "TechCrunch",
                published_at: "2024-09-15T11:45:00Z",
                category: "Funding",
                company_id: 37,
                read_time: "5 min read"
            },
            {
                id: 5,
                headline: "Hugging Face Launches Enterprise AI Platform with $235M Series D",
                content: "Hugging Face has raised $235 million in Series D funding to launch its enterprise AI platform, enabling companies to deploy and manage AI models at scale with enhanced security and compliance features.",
                what_this_means: "Hugging Face's enterprise focus creates opportunities for NVIDIA's enterprise AI solutions and security frameworks. As enterprises adopt AI platforms, they'll need NVIDIA's enterprise-grade hardware and software for secure AI deployment. NCP partners can position NVIDIA's solutions as the secure foundation for enterprise AI platforms, competing against cloud-only solutions.",
                url: "https://techcrunch.com/hugging-face-series-d-enterprise",
                source: "TechCrunch",
                published_at: "2024-08-15T16:20:00Z",
                category: "Product",
                company_id: 32,
                read_time: "7 min read"
            }
        ];
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

    // Search companies
    searchCompanies(query) {
        if (!query) return this.companies;
        
        const searchTerm = query.toLowerCase();
        return this.companies.filter(company => 
            company.name.toLowerCase().includes(searchTerm) ||
            company.description.toLowerCase().includes(searchTerm) ||
            company.industry.toLowerCase().includes(searchTerm) ||
            company.location.toLowerCase().includes(searchTerm)
        );
    }

    // Search VCs
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
            article.category.toLowerCase().includes(searchTerm)
        );
    }

    // Get dashboard statistics
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
            avgGrowthRate: Math.round(avgGrowthRate * 100) / 100,
            aiNatives,
            digitalNatives
        };
    }

    // Get NCP progress metrics
    getNCPProgress() {
        const totalCompanies = this.companies.length;
        const partnerCompanies = this.companies.filter(company => company.ncp_status === 'Partner').length;
        const partnerPercentage = Math.round((partnerCompanies / totalCompanies) * 100);
        const aiNatives = this.companies.filter(company => company.ai_native).length;
        
        return {
            totalCompanies,
            partnerCompanies,
            partnerPercentage,
            aiNatives,
            nonPartners: totalCompanies - partnerCompanies
        };
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

    // Summarize news (placeholder implementation)
    async summarizeNews(newsUrl) {
        try {
        // Placeholder implementation - in a real app, this would call an AI service
            // For now, return a generic summary based on the URL
            const urlParts = newsUrl.split('/');
            const domain = urlParts[2] || 'news source';
            
            return `This article from ${domain} discusses recent developments in the tech industry. The content covers key trends, company updates, and market insights relevant to the business landscape. This is a placeholder summary - in a production environment, this would be generated by an AI service analyzing the full article content.`;
        } catch (error) {
            console.error('Error summarizing news:', error);
            return 'Unable to generate summary at this time.';
        }
    }
}

// Initialize data service
window.dataService = new DataService();