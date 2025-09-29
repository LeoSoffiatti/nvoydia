// Data Service - Loads Piloterr sample data
class DataService {
    constructor() {
        this.companies = [];
        this.vcs = [];
        this.news = [];
        this.loadSampleData();
    }

    loadSampleData() {
        // Load our Piloterr sample data
        this.companies = [
            {
                id: 1,
                name: "MediTech Solutions",
                description: "AI-powered medical imaging platform for early disease detection",
                industry: "medical-imaging",
                founded_year: 2020,
                employees: 85,
                location: "San Francisco, CA",
                website: "https://meditechsolutions.com",
                funding_raised: 45000000,
                last_funding_round: "Series B",
                ceo: "Dr. Sarah Chen",
                investors: ["Sequoia Capital", "Andreessen Horowitz", "GV"],
                valuation: 280000000,
                logo: "🏥",
                status: "active",
                growth_rate: 45,
                technical_employees_pct: 75
            },
            {
                id: 2,
                name: "HealthFlow",
                description: "Digital health platform for telemedicine and patient monitoring",
                industry: "digital-health",
                founded_year: 2019,
                employees: 120,
                location: "Austin, TX",
                website: "https://healthflow.io",
                funding_raised: 32000000,
                last_funding_round: "Series A",
                ceo: "Michael Rodriguez",
                investors: ["First Round Capital", "Khosla Ventures", "General Catalyst"],
                valuation: 150000000,
                logo: "💊",
                status: "active",
                growth_rate: 38,
                technical_employees_pct: 60
            },
            {
                id: 3,
                name: "BioInnovate",
                description: "CRISPR-based gene therapy solutions for rare diseases",
                industry: "biotech",
                founded_year: 2021,
                employees: 65,
                location: "Boston, MA",
                website: "https://bioinnovate.com",
                funding_raised: 75000000,
                last_funding_round: "Series A",
                ceo: "Dr. Lisa Thompson",
                investors: ["Flagship Pioneering", "Third Rock Ventures", "Polaris Partners"],
                valuation: 420000000,
                logo: "🧬",
                status: "active",
                growth_rate: 52,
                technical_employees_pct: 80
            },
            {
                id: 4,
                name: "NeuroLink",
                description: "Brain-computer interface technology for medical applications",
                industry: "neurotechnology",
                founded_year: 2018,
                employees: 95,
                location: "Palo Alto, CA",
                website: "https://neuralink.com",
                funding_raised: 180000000,
                last_funding_round: "Series C",
                ceo: "Dr. Alex Kumar",
                investors: ["Kleiner Perkins", "Lux Capital", "GV"],
                valuation: 1200000000,
                logo: "🧠",
                status: "active",
                growth_rate: 28,
                technical_employees_pct: 85
            },
            {
                id: 5,
                name: "VitaCare",
                description: "Personalized medicine platform using AI and genomics",
                industry: "personalized-medicine",
                founded_year: 2020,
                employees: 45,
                location: "Seattle, WA",
                website: "https://vitacare.com",
                funding_raised: 28000000,
                last_funding_round: "Series A",
                ceo: "Dr. Maria Santos",
                investors: ["Andreessen Horowitz", "Index Ventures", "Bessemer Venture Partners"],
                valuation: 180000000,
                logo: "💉",
                status: "active",
                growth_rate: 41,
                technical_employees_pct: 70
            },
            {
                id: 6,
                name: "CardioAI",
                description: "AI-powered cardiovascular disease prediction and monitoring",
                industry: "cardiology",
                founded_year: 2022,
                employees: 32,
                location: "New York, NY",
                website: "https://cardioai.com",
                funding_raised: 18000000,
                last_funding_round: "Seed",
                ceo: "Dr. James Wilson",
                investors: ["Y Combinator", "Accel", "General Catalyst"],
                valuation: 95000000,
                logo: "❤️",
                status: "active",
                growth_rate: 67,
                technical_employees_pct: 78
            },
            {
                id: 7,
                name: "DermTech",
                description: "Digital dermatology platform with AI skin analysis",
                industry: "dermatology",
                founded_year: 2019,
                employees: 78,
                location: "Los Angeles, CA",
                website: "https://dermtech.ai",
                funding_raised: 55000000,
                last_funding_round: "Series B",
                ceo: "Dr. Emily Chen",
                investors: ["Kleiner Perkins", "GV", "Bessemer Venture Partners"],
                valuation: 320000000,
                logo: "🔬",
                status: "active",
                growth_rate: 43,
                technical_employees_pct: 72
            },
            {
                id: 8,
                name: "OrthoBot",
                description: "Robotic surgery systems for orthopedic procedures",
                industry: "robotics",
                founded_year: 2020,
                employees: 156,
                location: "Chicago, IL",
                website: "https://orthobot.com",
                funding_raised: 95000000,
                last_funding_round: "Series C",
                ceo: "Dr. Robert Kim",
                investors: ["Sequoia Capital", "Andreessen Horowitz", "Lux Capital"],
                valuation: 680000000,
                logo: "🤖",
                status: "active",
                growth_rate: 35,
                technical_employees_pct: 88
            },
            {
                id: 9,
                name: "PharmaAI",
                description: "AI-driven drug discovery and development platform",
                industry: "pharmaceuticals",
                founded_year: 2021,
                employees: 89,
                location: "Cambridge, MA",
                website: "https://pharmaai.com",
                funding_raised: 72000000,
                last_funding_round: "Series A",
                ceo: "Dr. Anna Rodriguez",
                investors: ["Flagship Pioneering", "Third Rock Ventures", "GV"],
                valuation: 450000000,
                logo: "💊",
                status: "active",
                growth_rate: 58,
                technical_employees_pct: 82
            },
            {
                id: 10,
                name: "MentalHealth Pro",
                description: "AI-powered mental health assessment and therapy platform",
                industry: "mental-health",
                founded_year: 2020,
                employees: 67,
                location: "Denver, CO",
                website: "https://mentalhealthpro.com",
                funding_raised: 42000000,
                last_funding_round: "Series B",
                ceo: "Dr. Jennifer Lee",
                investors: ["First Round Capital", "Index Ventures", "General Catalyst"],
                valuation: 240000000,
                logo: "🧠",
                status: "active",
                growth_rate: 49,
                technical_employees_pct: 65
            }
        ];

        this.vcs = [
            {
                id: 101,
                name: "Sequoia Capital",
                description: "Leading venture capital firm focused on technology investments",
                location: "Menlo Park, CA",
                investment_stage: "multi-stage",
                website: "https://sequoiacap.com",
                portfolio_companies: 500,
                total_aum: 15000000000,
                healthcare_focus: true,
                final_score: 95.8,
                logo: "🌲",
                investments: 45
            },
            {
                id: 102,
                name: "Andreessen Horowitz",
                description: "Silicon Valley venture capital firm",
                location: "Menlo Park, CA",
                investment_stage: "multi-stage",
                website: "https://a16z.com",
                portfolio_companies: 400,
                total_aum: 12000000000,
                healthcare_focus: true,
                final_score: 92.3,
                logo: "🚀",
                investments: 38
            },
            {
                id: 103,
                name: "Khosla Ventures",
                description: "Venture capital firm focused on early-stage technology companies",
                location: "Menlo Park, CA",
                investment_stage: "early-stage",
                website: "https://khoslaventures.com",
                portfolio_companies: 300,
                total_aum: 5000000000,
                healthcare_focus: true,
                final_score: 87.6,
                logo: "⚡",
                investments: 32
            },
            {
                id: 104,
                name: "GV (Google Ventures)",
                description: "Venture capital arm of Alphabet Inc.",
                location: "Mountain View, CA",
                investment_stage: "multi-stage",
                website: "https://gv.com",
                portfolio_companies: 350,
                total_aum: 8000000000,
                healthcare_focus: true,
                final_score: 89.2,
                logo: "🔍",
                investments: 28
            },
            {
                id: 105,
                name: "Flagship Pioneering",
                description: "Biotechnology venture capital firm",
                location: "Cambridge, MA",
                investment_stage: "early-stage",
                website: "https://flagshippioneering.com",
                portfolio_companies: 200,
                total_aum: 6000000000,
                healthcare_focus: true,
                final_score: 91.5,
                logo: "🏴",
                investments: 35
            },
            {
                id: 106,
                name: "Third Rock Ventures",
                description: "Healthcare-focused venture capital firm",
                location: "Boston, MA",
                investment_stage: "early-stage",
                website: "https://thirdrockventures.com",
                portfolio_companies: 150,
                total_aum: 4000000000,
                healthcare_focus: true,
                final_score: 88.7,
                logo: "🪨",
                investments: 25
            }
        ];

        this.news = [
            {
                id: 1,
                headline: "MediTech Solutions Raises $45M Series B to Scale AI Medical Imaging",
                content: "Medical imaging startup secures major funding round led by Sequoia Capital to expand their AI-powered diagnostic platform...",
                published_at: "2024-09-20T10:00:00Z",
                source: "TechCrunch",
                company_id: 1,
                category: "funding",
                read_time: "3 min read"
            },
            {
                id: 2,
                headline: "HealthFlow Launches New Telemedicine Platform for Rural Areas",
                content: "Digital health company expands its offerings to underserved communities with new telemedicine infrastructure...",
                published_at: "2024-09-18T14:30:00Z",
                source: "Healthcare Weekly",
                company_id: 2,
                category: "product",
                read_time: "2 min read"
            },
            {
                id: 3,
                headline: "BioInnovate Receives FDA Breakthrough Designation for Gene Therapy",
                content: "CRISPR-based treatment shows promising results in clinical trials, receiving FDA breakthrough therapy designation...",
                published_at: "2024-09-15T09:15:00Z",
                source: "FierceBiotech",
                company_id: 3,
                category: "regulatory",
                read_time: "4 min read"
            },
            {
                id: 4,
                headline: "NeuroLink Announces Partnership with Major Hospital Network",
                content: "Brain-computer interface company partners with leading hospital network to pilot new medical applications...",
                published_at: "2024-09-12T16:45:00Z",
                source: "MedTech Dive",
                company_id: 4,
                category: "partnership",
                read_time: "3 min read"
            },
            {
                id: 5,
                headline: "VitaCare Secures $28M Series A for Personalized Medicine Platform",
                content: "AI-driven personalized medicine startup raises Series A funding to accelerate platform development...",
                published_at: "2024-09-10T11:20:00Z",
                source: "BioPharma Dive",
                company_id: 5,
                category: "funding",
                read_time: "2 min read"
            },
            {
                id: 6,
                headline: "CardioAI's AI Algorithm Shows 95% Accuracy in Heart Disease Prediction",
                content: "New AI-powered cardiovascular screening tool demonstrates exceptional accuracy in early disease detection...",
                published_at: "2024-09-08T08:30:00Z",
                source: "Cardiology Today",
                company_id: 6,
                category: "product",
                read_time: "3 min read"
            },
            {
                id: 7,
                headline: "DermTech Partners with Mayo Clinic for Skin Cancer Detection Study",
                content: "Digital dermatology platform collaborates with Mayo Clinic on groundbreaking skin cancer research...",
                published_at: "2024-09-05T13:15:00Z",
                source: "Dermatology Times",
                company_id: 7,
                category: "partnership",
                read_time: "4 min read"
            },
            {
                id: 8,
                headline: "OrthoBot Completes First Robotic Knee Surgery with 99% Success Rate",
                content: "Robotic surgery system achieves milestone with near-perfect success rate in orthopedic procedures...",
                published_at: "2024-09-03T15:45:00Z",
                source: "Surgical Innovation",
                company_id: 8,
                category: "product",
                read_time: "3 min read"
            },
            {
                id: 9,
                headline: "PharmaAI Discovers New Drug Candidate for Alzheimer's Treatment",
                content: "AI-driven drug discovery platform identifies promising compound for neurodegenerative disease treatment...",
                published_at: "2024-09-01T10:00:00Z",
                source: "Pharmaceutical Journal",
                company_id: 9,
                category: "research",
                read_time: "5 min read"
            },
            {
                id: 10,
                headline: "MentalHealth Pro Expands to 15 States with Telehealth Services",
                content: "Mental health platform scales operations to provide accessible therapy services across multiple states...",
                published_at: "2024-08-28T12:30:00Z",
                source: "Mental Health Weekly",
                company_id: 10,
                category: "expansion",
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
                industry: "medical-imaging",
                investors: ["Sequoia Capital", "Andreessen Horowitz"]
            },
            {
                id: 2,
                company_name: "HealthFlow",
                round_type: "Series A",
                amount: 32000000,
                date: "2024-02-20",
                industry: "digital-health",
                investors: ["First Round Capital", "Khosla Ventures"]
            },
            {
                id: 3,
                company_name: "BioGenetics Corp",
                round_type: "Seed",
                amount: 15000000,
                date: "2024-03-10",
                industry: "biotech",
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
                focus_areas: ["Healthcare", "Technology", "Biotech"],
                logo: "🌲"
            },
            {
                id: 2,
                name: "Andreessen Horowitz",
                type: "VC",
                location: "Menlo Park, CA",
                investments: 980,
                focus_areas: ["Technology", "Healthcare", "AI"],
                logo: "🚀"
            },
            {
                id: 3,
                name: "First Round Capital",
                type: "VC",
                location: "San Francisco, CA",
                investments: 750,
                focus_areas: ["Early Stage", "Technology", "Healthcare"],
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
