// Modern Digital Natives Intelligence Platform - Interactive JavaScript

class ModernDigitalNativesPlatform {
    constructor() {
        console.log('Creating ModernDigitalNativesPlatform...');
        this.dataService = null;
        this.currentSection = 'dashboard';
        this.charts = {};
        this.modals = {};
        this.chartRetryCount = 0;
        this.maxChartRetries = 10;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('Initializing platform...');
        try {
            this.dataService = new DataService();
            console.log('DataService created:', this.dataService);
            console.log('Companies loaded:', this.dataService.companies.length);
        } catch (error) {
            console.error('Error creating DataService:', error);
            // Create a fallback data service
            this.dataService = {
                companies: [],
                vcs: [],
                news: [],
                searchCompanies: () => [],
                searchVCs: () => [],
                searchNews: () => [],
                getDashboardStats: () => ({ 
                    totalCompanies: 0, 
                    totalVCs: 0, 
                    totalNews: 0, 
                    totalFunding: 0, 
                    totalValuation: 0, 
                    totalEmployees: 0, 
                    avgGrowthRate: 0, 
                    industries: 0 
                }),
                getNCPProgress: () => ({ partnerPercentage: 0, aiNatives: 0 }),
                getRecentNews: () => [],
                getTopCompaniesByValuation: () => [],
                getTopVCsByScore: () => [],
                formatCurrency: (amount) => `$${amount}`,
                formatDate: (date) => new Date(date).toLocaleDateString(),
                getCompanyById: () => null
            };
        }
        
        this.setupEventListeners();
        this.setupModalClose();
        this.loadDashboardData();
        this.setupThemeToggle();
        this.setupSearch();
        console.log('Platform initialization complete');
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        try {
            // Navigation
            const navLinks = document.querySelectorAll('.nav-link');
            console.log('Found nav links:', navLinks.length);
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const section = link.dataset.section;
                    console.log('Nav clicked:', section);
                    this.switchSection(section);
                });
            });

            // Modal controls
            const modalOverlay = document.getElementById('modalOverlay');
            const modalClose = document.getElementById('modalClose');
            
            if (modalClose) {
                modalClose.addEventListener('click', () => {
                    console.log('Modal close clicked');
                    this.closeModal();
                });
            }
            
            if (modalOverlay) {
                modalOverlay.addEventListener('click', (e) => {
                    if (e.target === modalOverlay) {
                        console.log('Modal overlay clicked');
                        this.closeModal();
                    }



                });
            }

            // Chart controls
            this.setupChartControls();
            
            // View toggles
            const toggleBtns = document.querySelectorAll('.toggle-btn');
            console.log('Found toggle buttons:', toggleBtns.length);
            toggleBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const view = btn.dataset.view;
                    console.log('Toggle clicked:', view);
                    this.toggleView(view);
                    this.updateActiveButton(e.target, '.toggle-btn');
                });
            });

            // Filter controls

            this.setupFilterControls();

            // View All buttons
            const viewAllBtns = document.querySelectorAll('.view-all');
            console.log('Found view all buttons:', viewAllBtns.length);
            viewAllBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('View all clicked');
                    this.handleViewAllClick(btn);
                });
            });

            // Range buttons (YTD, 1Y, 2Y)
            const rangeBtns = document.querySelectorAll('.range-btn');
            console.log('Found range buttons:', rangeBtns.length);
            rangeBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const range = btn.dataset.range;
                    console.log('Range clicked:', range);
                    this.updateInvestmentTimeframe(range);
                    this.updateActiveButton(e.target, '.range-btn');
                });
            });
            
            // Event delegation for company cards
            document.addEventListener('click', (e) => {
                const companyCard = e.target.closest('.company-card');
                if (companyCard) {
                    const companyId = companyCard.dataset.companyId;
                    if (companyId) {
                        console.log('Company card clicked:', companyId);
                        this.showCompanyModal(parseInt(companyId));
                    }
                }
            });
            
            console.log('Event listeners setup complete');
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    setupChartControls() {
        // Time filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = btn.dataset.period;
                this.updateChartTimeframe(period);
                this.updateActiveButton(e.target, '.filter-btn');
            });
        });

        // Chart type buttons
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = btn.dataset.type;
                this.updateChartType(type);
                this.updateActiveButton(e.target, '.type-btn');
            });
        });
    }

    setupFilterControls() {
        // Industry filter
        const industryFilter = document.getElementById('industryFilter');
        if (industryFilter) {
            industryFilter.addEventListener('change', (e) => {
                this.filterCompaniesByIndustry(e.target.value);
            });
        }

        // Valuation filter
        const valuationFilter = document.getElementById('valuationFilter');
        if (valuationFilter) {
            valuationFilter.addEventListener('change', (e) => {
                this.filterCompaniesByValuation(e.target.value);
            });
        }

        // Date filter
        const dateFilter = document.getElementById('dateFilter');
        if (dateFilter) {
            dateFilter.addEventListener('change', (e) => {
                this.filterCompaniesByDate(e.target.value);
            });
        }

        // VC filter
        const vcFilter = document.getElementById('vcFilter');
        if (vcFilter) {
            vcFilter.addEventListener('change', (e) => {
                this.filterCompaniesByVC(e.target.value);
            });
        }

        // Download non-partners button
        const downloadBtn = document.getElementById('downloadNonPartners');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadNonPartnersCSV();
            });
        }

        // News category filters
        document.querySelectorAll('.news-filters .filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = btn.dataset.category;
                this.filterNewsByCategory(category);
                this.updateActiveButton(e.target, '.news-filters .filter-btn');
            });
        });

        // VC filter buttons are handled in setupVCFilters() method
    }

    switchSection(section) {
        console.log('Switching to section:', section);
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = section;
            
            // Update navigation
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            document.querySelector(`[data-section="${section}"]`)?.classList.add('active');

            // Load section-specific data
            this.loadSectionData(section);
        } else {
            console.error('Section not found:', section);
        }
    }

    loadSectionData(section) {
        switch (section) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'companies':
                this.loadCompaniesData();
                break;
            case 'investments':
                this.loadInvestmentsData();
                break;
        }
    }

    loadInvestmentsData() {
        console.log('Loading investments data...');
        this.loadVCsGrid();
        this.loadVCPortfolio();
        this.loadInvestmentOverview();
        this.loadSectorTrendsSummary();
        this.setupVCFilters();
    }

    loadLatestNews(filterCategory = 'all') {
        console.log('=== LOADING LATEST NEWS (HARDCODED) ===');
        
        const newsGrid = document.getElementById('latestNewsGrid');
        console.log('News grid element:', newsGrid);
        
        if (!newsGrid) {
            console.error('latestNewsGrid element not found');
            return;
        }

        // Hardcoded news data to ensure it displays
        const allNews = [
            {
                id: 1,
                company_id: 1,
                company_name: "OpenAI",
                headline: "OpenAI announces major funding round of $13B",
                category: "funding",
                date: "2024-01-15",
                summary: "OpenAI has secured a massive $13 billion funding round led by Microsoft, bringing their total valuation to over $29 billion. This funding will accelerate development of GPT-5 and expand their AI infrastructure capabilities.",
                articleUrl: "https://openai.com/blog/funding-announcement",
                source: "OpenAI Blog"
            },
            {
                id: 2,
                company_id: 2,
                company_name: "Anthropic",
                headline: "Anthropic launches new AI product Claude 3.5",
                category: "product",
                date: "2024-01-12",
                summary: "Anthropic has released Claude 3.5 Sonnet, their most advanced AI model yet. The new model shows significant improvements in reasoning, coding, and multimodal capabilities, outperforming previous versions across multiple benchmarks.",
                articleUrl: "https://anthropic.com/news/claude-3-5-sonnet",
                source: "Anthropic News"
            },
            {
                id: 3,
                company_id: 3,
                company_name: "Inflection AI",
                headline: "Inflection AI partners with Microsoft for AI integration",
                category: "partnership",
                date: "2024-01-10",
                summary: "Inflection AI has announced a strategic partnership with Microsoft to integrate their conversational AI technology into Microsoft's enterprise products. This collaboration will bring advanced AI assistants to millions of business users.",
                articleUrl: "https://inflection.ai/news/microsoft-partnership",
                source: "Inflection AI"
            },
            {
                id: 4,
                company_id: 4,
                company_name: "Adept",
                headline: "Adept expands to new markets in Europe",
                category: "product",
                date: "2024-01-08",
                summary: "Adept is expanding its AI agent platform to European markets, starting with Germany and France. The expansion includes localized language models and compliance with EU AI regulations, targeting enterprise automation use cases.",
                articleUrl: "https://adept.ai/blog/europe-expansion",
                source: "Adept Blog"
            },
            {
                id: 5,
                company_id: 5,
                company_name: "Perplexity",
                headline: "Perplexity achieves key milestone of 10M users",
                category: "funding",
                date: "2024-01-05",
                summary: "Perplexity AI has reached 10 million monthly active users, marking a significant milestone for the AI-powered search engine. The platform's unique approach to providing cited answers has driven rapid user growth and engagement.",
                articleUrl: "https://perplexity.ai/news/10m-users",
                source: "Perplexity News"
            },
            {
                id: 6,
                company_id: 6,
                company_name: "Sierra",
                headline: "Sierra releases latest innovation in conversational AI",
                category: "product",
                date: "2024-01-03",
                summary: "Sierra has unveiled their latest conversational AI platform featuring advanced context understanding and multi-turn dialogue capabilities. The new system is designed specifically for enterprise customer service applications.",
                articleUrl: "https://sierra.ai/news/conversational-ai-platform",
                source: "Sierra AI"
            }
        ];

        // Filter news by category
        const filteredNews = filterCategory === 'all' ? allNews : allNews.filter(news => news.category === filterCategory);

        console.log('Filtered news items:', filteredNews);

        const newsHTML = filteredNews.map(news => `
            <div class="news-item" onclick="window.platform.showNewsModal(${news.id})">
                <div class="news-header">
                    <span class="news-category ${news.category}">${news.category}</span>
                    <span class="news-date">${new Date(news.date).toLocaleDateString()}</span>
                </div>
                <h4 class="news-headline">${news.headline}</h4>
                <p class="news-company">${news.company_name}</p>
            </div>
        `).join('');

        console.log('Generated HTML:', newsHTML);
        newsGrid.innerHTML = newsHTML;
        console.log('News grid updated, innerHTML length:', newsGrid.innerHTML.length);
        console.log('News items should now be visible!');
    }

    loadDashboardData() {
        try {
            console.log('loadDashboardData called');
            this.loadLatestNews();
            this.setupNewsFilters();
        } catch (error) {
            console.error('Error in loadDashboardData:', error);
        }
    }

    setupNewsFilters() {
        const newsFilterButtons = document.querySelectorAll('.news-filters .filter-btn');
        newsFilterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                newsFilterButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Filter news by category
                const category = e.target.dataset.category;
                this.loadLatestNews(category);
            });
        });
    }

    closeModal() {
        const modal = document.getElementById('modalOverlay');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    setupModalClose() {
        const closeBtn = document.getElementById('modalClose');
        const modal = document.getElementById('modalOverlay');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    loadVCPortfolio() {
        console.log('=== LOADING VC PORTFOLIO ===');
        const portfolioGrid = document.getElementById('vcPortfolioGrid');
        console.log('Portfolio grid element:', portfolioGrid);
        
        if (!portfolioGrid) {
            console.error('vcPortfolioGrid element not found');
            return;
        }

        // Get companies that have investors data (which indicates VC backing)
        const allCompanies = this.dataService.companies.filter(company => 
            company.investors && company.investors.length > 0
        );

        console.log('Total companies with investors:', allCompanies.length);
        console.log('Sample companies:', allCompanies.slice(0, 3));

        // Show first 20 companies
        const displayCompanies = allCompanies.slice(0, 20);
        console.log('Displaying companies:', displayCompanies.length);

        portfolioGrid.innerHTML = displayCompanies.map(company => 
            this.renderCompanyCard(company)
        ).join('');

        console.log('VC Portfolio loaded with', displayCompanies.length, 'companies');
    }

    setupVCFilters() {
        console.log('=== SETTING UP VC FILTERS ===');
        const vcFilterButtons = document.querySelectorAll('.portfolio-filters .filter-btn');
        console.log('Found VC filter buttons:', vcFilterButtons.length);
        
        // Debug: Test if buttons are found
        if (vcFilterButtons.length === 0) {
            console.error('NO VC FILTER BUTTONS FOUND!');
            console.log('Available elements with .filter-btn:', document.querySelectorAll('.filter-btn'));
            console.log('Available elements with .portfolio-filters:', document.querySelectorAll('.portfolio-filters'));
            return;
        }
        
        // Debug: Log all button details
        vcFilterButtons.forEach((btn, index) => {
            console.log(`Button ${index}:`, {
                text: btn.textContent,
                dataVc: btn.dataset.vc,
                classes: btn.className,
                element: btn
            });
        });
        
        vcFilterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('=== VC FILTER CLICKED ===');
                console.log('Button clicked:', e.target.textContent);
                console.log('data-vc value:', e.target.dataset.vc);
                console.log('Event target:', e.target);
                
                // Remove active class from all buttons
                vcFilterButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Filter companies by VC
                const vcName = e.target.dataset.vc;
                console.log('About to call filterCompaniesByVCCompany with:', vcName);
                this.filterCompaniesByVCCompany(vcName);
            });
        });
        
        console.log('VC filter event listeners attached successfully');
    }

    filterCompaniesByVCCompany(vcName) {
        console.log('=== FILTERING COMPANIES BY VC COMPANY:', vcName, '===');
        const portfolioGrid = document.getElementById('vcPortfolioGrid');
        
        if (!portfolioGrid) {
            console.error('vcPortfolioGrid element not found for filtering');
            return;
        }
        
        console.log('Portfolio grid found:', portfolioGrid);
        console.log('Total companies available:', this.dataService.companies.length);

        // Map short VC names to full names
        const vcNameMap = {
            'sequoia': 'Sequoia Capital',
            'a16z': 'Andreessen Horowitz', 
            'index': 'Index Ventures'
        };

        let filteredCompanies;
        if (vcName === 'all') {
            filteredCompanies = this.dataService.companies.filter(company => 
                company.investors && company.investors.length > 0
            );
            console.log('All VCs filter - showing companies with any investors:', filteredCompanies.length);
        } else {
            const fullVCName = vcNameMap[vcName] || vcName;
            console.log('Looking for VC:', fullVCName);
            
            // Debug: Show sample companies and their investors
            console.log('Sample companies with investors:');
            this.dataService.companies.slice(0, 3).forEach(company => {
                console.log(`${company.name}:`, company.investors);
            });
            
            filteredCompanies = this.dataService.companies.filter(company => {
                if (!company.investors || company.investors.length === 0) {
                    return false;
                }
                
                const hasVC = company.investors.some(investor => 
                    investor.toLowerCase().includes(fullVCName.toLowerCase())
                );
                
                if (hasVC) {
                    console.log(`✓ Found match: ${company.name} has investors:`, company.investors);
                }
                
                return hasVC;
            });
            
            console.log(`Filtered for ${fullVCName}:`, filteredCompanies.length, 'companies');
            console.log('Companies found:', filteredCompanies.map(c => c.name));
        }

        console.log('About to update portfolio grid with', filteredCompanies.slice(0, 20).length, 'companies');
        portfolioGrid.innerHTML = filteredCompanies.slice(0, 20).map(company => 
            this.renderCompanyCard(company)
        ).join('');

        console.log('VC Portfolio filtered and updated successfully');
    }

    // Debug function to test filtering manually
    testVCFiltering() {
        console.log('=== TESTING VC FILTERING ===');
        console.log('Available companies:', this.dataService.companies.length);
        
        // Test each VC filter
        const testVCs = ['all', 'sequoia', 'a16z', 'index'];
        testVCs.forEach(vc => {
            console.log(`\n--- Testing ${vc} filter ---`);
            this.filterCompaniesByVCCompany(vc);
        });
    }

    loadCompaniesData() {
        this.loadCompaniesGrid();
    }

    updateHeroStats() {
        const stats = this.dataService.getDashboardStats();
        const ncpProgress = this.dataService.getNCPProgress();
        
        const totalCompaniesEl = document.getElementById('totalCompanies');
        const ncpProgressEl = document.getElementById('ncpProgress');
        const totalFundingEl = document.getElementById('totalFunding');
        const aiNativesEl = document.getElementById('aiNatives');
        
        if (totalCompaniesEl) totalCompaniesEl.textContent = stats.totalCompanies;
        if (ncpProgressEl) ncpProgressEl.textContent = `${ncpProgress.partnerPercentage}%`;
        if (totalFundingEl) totalFundingEl.textContent = this.dataService.formatCurrency(stats.totalFunding);
        if (aiNativesEl) aiNativesEl.textContent = ncpProgress.aiNatives;
    }

    updateNCPProgress() {
        const ncpProgress = this.dataService.getNCPProgress();
        
        // Update NCP progress indicators
        const progressBars = document.querySelectorAll('.ncp-progress-bar');
        progressBars.forEach(bar => {
            const percentage = bar.dataset.percentage || ncpProgress.partnerPercentage;
            bar.style.width = `${percentage}%`;
        });
    }

    loadRecentFunding() {
        const container = document.getElementById('recentFundingList');
        if (!container) return;

        const recentCompanies = this.dataService.getTopCompaniesByValuation(5);
        
        container.innerHTML = recentCompanies.map(company => `
            <div class="funding-item" onclick="window.platform.showCompanyModal(${company.id})">
                <div class="funding-header">
                    <div class="company-info">
                        <div class="company-logo">
                            <img src="${this.getCompanyLogoUrl(company.name)}" alt="${company.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" onload="this.nextElementSibling.style.display='none';">
                            <div class="logo-fallback" style="display: flex;">${this.getCompanyInitials(company.name)}</div>
                        </div>
                        <div>
                            <h4>${company.name}</h4>
                            <span class="funding-round">${company.last_funding_round}</span>
                        </div>
                    </div>
                    <div class="funding-amount">${this.dataService.formatCurrency(company.funding_raised)}</div>
                </div>
                <div class="funding-details">
                    <span class="funding-date">${company.founded_year}</span>
                    <span class="funding-industry">${company.industry.replace('-', ' ')}</span>
                </div>
            </div>
        `).join('');
    }

    loadTopPerformers() {
        const container = document.getElementById('topPerformersList');
        if (!container) return;

        const topCompanies = this.dataService.getTopCompaniesByValuation(5);
        
        container.innerHTML = topCompanies.map(company => `
            <div class="performer-item" onclick="window.platform.showCompanyModal(${company.id})">
                <div class="performer-header">
                    <div class="company-info">
                        <div class="company-logo">
                            <img src="${this.getCompanyLogoUrl(company.name)}" alt="${company.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" onload="this.nextElementSibling.style.display='none';">
                            <div class="logo-fallback" style="display: flex;">${this.getCompanyInitials(company.name)}</div>
                        </div>
                        <div>
                            <h4>${company.name}</h4>
                            <span class="performer-industry">${company.industry.replace('-', ' ')}</span>
                        </div>
                    </div>
                    <div class="performer-score">
                        <span class="score-value">${company.growth_rate}%</span>
                        <span class="score-label">Growth</span>
                    </div>
                </div>
                <div class="performer-stats">
                    <div class="stat">
                        <span class="stat-value">${this.dataService.formatCurrency(company.valuation)}</span>
                        <span class="stat-label">Valuation</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${company.employees}</span>
                        <span class="stat-label">Employees</span>
                    </div>
                </div>
            </div>
        `).join('');
    }


    loadCompaniesGrid() {
        const container = document.getElementById('companiesGrid');
        if (!container) return;

        const companies = this.dataService.companies;
        container.innerHTML = companies.map(company => this.renderCompanyCard(company)).join('');
    }

    renderCompanyCard(company) {
        const aiBadge = company.ai_native ? '<span class="ai-badge">AI</span>' : '';
        const digitalBadge = company.digital_native ? '<span class="digital-badge">Digital</span>' : '';
        const ncpBadge = company.ncp_status === 'Partner' ? 
            `<div class="ncp-indicator" title="NVIDIA Partner${company.partner_tier ? ' - ' + company.partner_tier : ''}">
                <i class="fas fa-check-circle"></i>
            </div>` : '';

        return `
            <div class="company-card" data-company-id="${company.id}">
                <div class="company-header">
                    <div class="company-logo">
                        <img src="${this.getCompanyLogoUrl(company.name)}" alt="${company.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="logo-fallback" style="display: none;">${company.name.charAt(0)}</div>
                    </div>
                    <div class="company-info">
                        <div class="company-title-row">
                            <h3>${company.name}</h3>
                            ${ncpBadge}
                        </div>
                        <div class="company-badges">
                            ${aiBadge}
                            ${digitalBadge}
                        </div>
                    </div>
                </div>
                <div class="company-stats">
                    <div class="company-stat">
                        <span class="company-stat-value">${this.dataService.formatCurrency(company.valuation)}</span>
                        <span class="company-stat-label">Valuation</span>
                    </div>
                    <div class="company-stat">
                        <span class="company-stat-value">${company.last_funding_round || 'N/A'}</span>
                        <span class="company-stat-label">Funding Round</span>
                    </div>
                </div>
                <div class="company-outreach">
                    <div class="outreach-status ${company.outreach?.contacted ? 'contacted' : 'not-contacted'}">
                        <i class="fas fa-${company.outreach?.contacted ? 'check' : 'clock'}"></i>
                        <span>${company.outreach?.contacted ? 'Contacted' : 'Not Contacted'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    loadVCsGrid() {
        const container = document.getElementById('vcsGrid');
        if (!container) return;

        const vcs = this.dataService.getTopVCsByScore(6);
        
        container.innerHTML = vcs.map(vc => `
            <div class="vc-card" onclick="platform.showVCModal(${vc.id})">
                <div class="vc-header">
                    <div class="vc-logo">
                        <img src="${this.getVCLogoUrl(vc.name)}" alt="${vc.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="logo-fallback" style="display: none;">${vc.name.charAt(0)}</div>
                    </div>
                    <div class="vc-info">
                        <h3>${vc.name}</h3>
                        <span class="vc-location">${vc.location}</span>
                    </div>
                </div>
                <div class="vc-score">
                    <span class="score-value">${vc.final_score}</span>
                    <span class="score-label">Score</span>
                </div>
                <div class="vc-stats">
                    <div class="vc-stat">
                        <span class="vc-stat-value">${vc.investments}</span>
                        <span class="vc-stat-label">Investments</span>
                    </div>
                    <div class="vc-stat">
                        <span class="vc-stat-value">${vc.portfolio_companies}</span>
                        <span class="vc-stat-label">Portfolio</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadInvestmentOverview() {
        const container = document.querySelector('.investment-overview');
        if (!container) return;

        const stats = this.dataService.getDashboardStats();
        
        container.innerHTML = `
            <div class="overview-card">
                <h3>Portfolio Summary</h3>
                <div class="portfolio-stats">
                    <div class="stat-item">
                        <div class="stat-number">${this.dataService.formatCurrency(stats.totalValuation)}</div>
                        <div class="stat-label">Total Portfolio Value</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${stats.totalCompanies}</div>
                        <div class="stat-label">Active Companies</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${stats.avgGrowthRate}%</div>
                        <div class="stat-label">Avg Growth Rate</div>
                    </div>
                </div>
            </div>
            
            <div class="overview-card">
                <h3>Recent Activity</h3>
                <div class="activity-stats">
                    <div class="stat-item">
                        <div class="stat-number">${Math.floor(stats.totalCompanies * 0.3)}</div>
                        <div class="stat-label">Deals This Quarter</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${this.dataService.formatCurrency(stats.totalFunding * 0.2)}</div>
                        <div class="stat-label">Q3 Investment</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${Math.floor(stats.totalCompanies * 0.1)}</div>
                        <div class="stat-label">New Exits</div>
                    </div>
                </div>
            </div>
        `;
    }

    loadSectorTrendsSummary() {
        const container = document.querySelector('.sector-trends-summary');
        if (!container) return;

        const industries = ['ai-natives', 'digital-natives', 'fintech', 'healthtech'];
        
        container.innerHTML = industries.map(industry => {
            const companies = this.dataService.getCompaniesByIndustry?.(industry) || [];
            const totalValuation = companies.reduce((sum, c) => sum + (c.valuation || 0), 0);
            const avgGrowthRate = companies.length > 0 ? 
                companies.reduce((sum, c) => sum + (c.growth_rate || 0), 0) / companies.length : 0;
            
            return `
                <div class="sector-trend-card">
                    <div class="sector-name">${industry.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                    <div class="sector-stats">
                        <span class="funding">${this.dataService.formatCurrency(totalValuation)}</span>
                        <span class="deals">${companies.length} deals</span>
                        <span class="growth">+${Math.round(avgGrowthRate)}%</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    showCompanyModal(companyId) {
        console.log('showCompanyModal called with ID:', companyId);
        try {
            const company = this.dataService.getCompanyById(companyId);
            console.log('Company found:', company);
            if (!company) {
                console.error('Company not found with ID:', companyId);
                return;
            }

            const modal = document.getElementById('modalOverlay');
            const title = document.getElementById('modalTitle');
            const content = document.getElementById('modalContent');
            
            console.log('Modal elements:', { modal, title, content });

            if (!modal || !title || !content) {
                console.error('Modal elements not found');
                return;
            }

            title.textContent = company.name;
            
            // Generate modal content step by step to avoid template string issues
            let modalContent = '<div class="company-modal">';
            
            // Company header
            modalContent += `
                <div class="company-header">
                    <div class="company-logo-large">
                        <img src="${this.getCompanyLogoUrl(company.name)}" alt="${company.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" onload="this.nextElementSibling.style.display='none';">
                        <div class="logo-fallback" style="display: flex;">${this.getCompanyInitials(company.name)}</div>
                    </div>
                    <div class="company-details">
                        <h2>${company.name}</h2>
                        <p class="company-description">${company.description}</p>
                        <div class="company-meta">
                            <span class="meta-item">
                                <i class="fas fa-map-marker-alt"></i>
                                ${company.location}
                            </span>
                            <span class="meta-item">
                                <i class="fas fa-calendar"></i>
                                Founded ${company.founded_year}
                            </span>
                            <span class="meta-item">
                                <i class="fas fa-users"></i>
                                ${company.employees} employees
                            </span>
                            <span class="meta-item">
                                <i class="fas fa-industry"></i>
                                ${company.industry.replace('-', ' ')}
                            </span>
                        </div>
                    </div>
                </div>
            `;
            
            // Stats grid
            modalContent += `
                <div class="company-stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${this.dataService.formatCurrency(company.valuation)}</div>
                        <div class="stat-label">Valuation</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${this.dataService.formatCurrency(company.funding_raised)}</div>
                        <div class="stat-label">Latest Funding</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${company.vc_tier || 'N/A'}</div>
                        <div class="stat-label">VC Tier</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${company.last_funding_round}</div>
                        <div class="stat-label">Latest Round</div>
                    </div>
                </div>
            `;
            
            // Leadership section
            modalContent += `
                <div class="company-section">
                    <h3>Leadership</h3>
                    <div class="leadership-info">
                        <div class="ceo-info">
                            <h4>${company.ceo}</h4>
                            <p>CEO & Founder since ${company.founded_year}</p>
                            <div class="contact-info">
                                <a href="mailto:${company.ceo.toLowerCase().replace(/\s+/g, '.')}@${company.name.toLowerCase().replace(/\s+/g, '')}.com" class="contact-email">
                                    <i class="fas fa-envelope"></i>
                                    ${company.ceo.toLowerCase().replace(/\s+/g, '.')}@${company.name.toLowerCase().replace(/\s+/g, '')}.com
                                </a>
                                <a href="https://linkedin.com/in/${company.ceo.toLowerCase().replace(/\s+/g, '-')}" target="_blank" class="contact-linkedin">
                                    <i class="fab fa-linkedin"></i>
                                    LinkedIn Profile
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Employee Contact section
            modalContent += `
                <div class="company-section">
                    <h3>Employee Contact Information</h3>
                    <div class="employee-contact">
                        <div class="contact-methods">
                            <div class="contact-method">
                                <i class="fas fa-envelope"></i>
                                <div>
                                    <h4>General Contact</h4>
                                    <p>contact@${company.name.toLowerCase().replace(/\s+/g, '')}.com</p>
                                </div>
                            </div>
                            <div class="contact-method">
                                <i class="fas fa-phone"></i>
                                <div>
                                    <h4>Business Development</h4>
                                    <p>bd@${company.name.toLowerCase().replace(/\s+/g, '')}.com</p>
                                </div>
                            </div>
                            <div class="contact-method">
                                <i class="fas fa-handshake"></i>
                                <div>
                                    <h4>Partnerships</h4>
                                    <p>partnerships@${company.name.toLowerCase().replace(/\s+/g, '')}.com</p>
                                </div>
                            </div>
                        </div>
                        <div class="contact-actions">
                            <button class="modal-btn primary" onclick="window.platform.showExecutivesModal(${company.id})">
                                <i class="fas fa-users"></i>
                                View All Executives
                            </button>
                            <a href="${company.website}" target="_blank" class="modal-btn secondary">
                                <i class="fas fa-external-link-alt"></i>
                                Visit Website
                            </a>
                        </div>
                    </div>
                </div>
            `;
            
            // Investors section
            if (company.investors && company.investors.length > 0) {
                modalContent += `
                    <div class="company-section">
                        <h3>Key Investors</h3>
                        <div class="investors-list">
                `;
                
                company.investors.forEach(investor => {
                    modalContent += `<span class="investor-tag">${investor}</span>`;
                });
                
                modalContent += `
                        </div>
                    </div>
                `;
            }
            
            // NCP Status section
            modalContent += `
                <div class="company-section">
                    <h3>NVIDIA Cloud Partner Status</h3>
                    <div class="ncp-status">
            `;
            
            if (company.ncp_status === "Partner") {
                modalContent += `
                    <div class="ncp-badge partner">
                        <i class="fas fa-check-circle"></i>
                        <span>NVIDIA Cloud Partner</span>
                        ${company.partner_tier ? `<span class="ncp-tier">${company.partner_tier} Tier</span>` : ''}
                    </div>
                    <p class="ncp-description">This company is an active NVIDIA Cloud Partner, leveraging NVIDIA's AI and cloud infrastructure solutions.</p>
                `;
            } else {
                modalContent += `
                    <div class="ncp-badge not-partner">
                        <i class="fas fa-exclamation-circle"></i>
                        <span>Not an NVIDIA Cloud Partner</span>
                    </div>
                    <p class="ncp-description">This company is not currently an NVIDIA Cloud Partner but may be a potential candidate for partnership.</p>
                    <div class="ncp-actions">
                        <a href="${company.website}" target="_blank" class="modal-btn ncp-contact">
                            <i class="fas fa-external-link-alt"></i>
                            Visit Company Website
                        </a>
                        <a href="https://linkedin.com/in/${company.ceo.toLowerCase().replace(/\s+/g, '-')}" target="_blank" class="modal-btn ncp-contact">
                            <i class="fab fa-linkedin"></i>
                            Contact CEO on LinkedIn
                        </a>
                    </div>
                `;
            }
            
            modalContent += `
                    </div>
                </div>
            `;
            
            modalContent += '</div>';
            
            content.innerHTML = modalContent;
            modal.style.display = 'flex';
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
        } catch (error) {
            console.error('Error showing company modal:', error);
        }
    }

    showNewsModal(newsId) {
        console.log('Showing news modal for ID:', newsId);
        
        // Find the news item from hardcoded data
        const newsItems = [
            {
                id: 1,
                company_id: 1,
                company_name: "OpenAI",
                headline: "OpenAI announces major funding round of $13B",
                category: "funding",
                date: "2024-01-15",
                summary: "OpenAI has secured a massive $13 billion funding round led by Microsoft, bringing their total valuation to over $29 billion. This funding will accelerate development of GPT-5 and expand their AI infrastructure capabilities.",
                articleUrl: "https://openai.com/blog/funding-announcement",
                source: "OpenAI Blog"
            },
            {
                id: 2,
                company_id: 2,
                company_name: "Anthropic",
                headline: "Anthropic launches new AI product Claude 3.5",
                category: "product",
                date: "2024-01-12",
                summary: "Anthropic has released Claude 3.5 Sonnet, their most advanced AI model yet. The new model shows significant improvements in reasoning, coding, and multimodal capabilities, outperforming previous versions across multiple benchmarks.",
                articleUrl: "https://anthropic.com/news/claude-3-5-sonnet",
                source: "Anthropic News"
            },
            {
                id: 3,
                company_id: 3,
                company_name: "Inflection AI",
                headline: "Inflection AI partners with Microsoft for AI integration",
                category: "partnership",
                date: "2024-01-10",
                summary: "Inflection AI has announced a strategic partnership with Microsoft to integrate their conversational AI technology into Microsoft's enterprise products. This collaboration will bring advanced AI assistants to millions of business users.",
                articleUrl: "https://inflection.ai/news/microsoft-partnership",
                source: "Inflection AI"
            },
            {
                id: 4,
                company_id: 4,
                company_name: "Adept",
                headline: "Adept expands to new markets in Europe",
                category: "product",
                date: "2024-01-08",
                summary: "Adept is expanding its AI agent platform to European markets, starting with Germany and France. The expansion includes localized language models and compliance with EU AI regulations, targeting enterprise automation use cases.",
                articleUrl: "https://adept.ai/blog/europe-expansion",
                source: "Adept Blog"
            },
            {
                id: 5,
                company_id: 5,
                company_name: "Perplexity",
                headline: "Perplexity achieves key milestone of 10M users",
                category: "funding",
                date: "2024-01-05",
                summary: "Perplexity AI has reached 10 million monthly active users, marking a significant milestone for the AI-powered search engine. The platform's unique approach to providing cited answers has driven rapid user growth and engagement.",
                articleUrl: "https://perplexity.ai/news/10m-users",
                source: "Perplexity News"
            },
            {
                id: 6,
                company_id: 6,
                company_name: "Sierra",
                headline: "Sierra releases latest innovation in conversational AI",
                category: "product",
                date: "2024-01-03",
                summary: "Sierra has unveiled their latest conversational AI platform featuring advanced context understanding and multi-turn dialogue capabilities. The new system is designed specifically for enterprise customer service applications.",
                articleUrl: "https://sierra.ai/news/conversational-ai-platform",
                source: "Sierra AI"
            }
        ];
        
        const news = newsItems.find(n => n.id === newsId);
        if (!news) {
            console.error('News article not found:', newsId);
            return;
        }

        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');
        
        if (!modal || !title || !content) {
            console.error('Modal elements not found');
            return;
        }

        // Set title in the header
        title.textContent = news.headline;
        
        // Put all content below the title
        content.innerHTML = `
            <div class="news-modal-content">
                <div class="news-modal-header">
                    <div class="news-meta">
                        <span class="news-category ${news.category}">${news.category}</span>
                        <span class="news-date">${new Date(news.date).toLocaleDateString()}</span>
                        <span class="news-source">${news.source}</span>
                    </div>
                    <div class="news-company">${news.company_name}</div>
                </div>
                
                <div class="news-summary">
                    <h4>Summary</h4>
                    <p>${news.summary}</p>
                </div>
                
                <div class="news-actions">
                    <a href="${news.articleUrl}" target="_blank" class="btn btn-primary">
                        <i class="fas fa-external-link-alt"></i>
                        Read Full Article
                    </a>
                    <button class="btn btn-secondary" onclick="window.platform.closeModal(); window.platform.showCompanyModal(${news.company_id})">
                        <i class="fas fa-building"></i>
                        View Company Profile
                    </button>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    async summarizeNews(newsUrl) {
        try {
            if (!newsUrl || newsUrl === '#') {
                alert('No URL available for summarization');
                return;
            }
            
            // Placeholder implementation - in real app would call AI service
            const summary = await this.dataService.summarizeNews?.(newsUrl) || 
                'This is a placeholder summary. In a real implementation, this would call an AI service to summarize the news article.';
            
            // Show summary in a simple alert for now
            alert(`News Summary:\n\n${summary}`);
            
        } catch (error) {
            console.error('Error summarizing news:', error);
            alert('Unable to generate summary at this time.');
        }
    }

    showVCModal(vcId) {
        console.log('Showing VC modal for:', vcId);
        try {
            const vc = this.dataService.vcs.find(v => v.id === vcId);
            if (!vc) {
                console.error('VC not found:', vcId);
                return;
            }

            const modal = document.getElementById('modalOverlay');
            const title = document.getElementById('modalTitle');
            const content = document.getElementById('modalContent');
            
            if (!modal || !title || !content) {
                console.error('Modal elements not found');
                return;
            }

            title.textContent = vc.name;
            
            let modalContent = '<div class="vc-modal">';
            
            // VC header
            modalContent += `
                <div class="vc-header">
                    <div class="vc-logo-large">
                        <img src="${this.getVCLogoUrl(vc.name)}" alt="${vc.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="logo-fallback" style="display: flex;">${vc.name.charAt(0)}</div>
                    </div>
                    <div class="vc-details">
                        <h2>${vc.name}</h2>
                        <p class="vc-description">${vc.description}</p>
                        <div class="vc-meta">
                            <span class="meta-item">
                                <i class="fas fa-map-marker-alt"></i>
                                ${vc.location}
                            </span>
                            <span class="meta-item">
                                <i class="fas fa-chart-line"></i>
                                ${vc.investment_stage}
                            </span>
                        </div>
                    </div>
                </div>
            `;
            
            // VC stats
            modalContent += `
                <div class="vc-stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${vc.final_score}</div>
                        <div class="stat-label">Overall Score</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${vc.investments}</div>
                        <div class="stat-label">Total Investments</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${vc.portfolio_companies}</div>
                        <div class="stat-label">Portfolio Companies</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${this.dataService.formatCurrency(vc.total_aum)}</div>
                        <div class="stat-label">Total AUM</div>
                    </div>
                </div>
            `;
            
            // Portfolio companies
            const portfolioCompanies = this.dataService.companies.filter(c => 
                c.investors && c.investors.some(investor => 
                    investor.toLowerCase().includes(vc.name.toLowerCase())
                )
            ).slice(0, 6);
            
            if (portfolioCompanies.length > 0) {
                modalContent += `
                    <div class="vc-section">
                        <h3>Portfolio Companies</h3>
                        <div class="portfolio-companies">
                            ${portfolioCompanies.map(company => `
                                <div class="portfolio-company" onclick="window.platform.showCompanyModal(${company.id})">
                                    <div class="company-logo-small">
                                        <img src="${this.getCompanyLogoUrl(company.name)}" alt="${company.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                        <div class="logo-fallback" style="display: none;">${this.getCompanyInitials(company.name)}</div>
                                    </div>
                                    <div class="company-info-small">
                                        <h4>${company.name}</h4>
                                        <span class="company-industry">${company.industry.replace('-', ' ')}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            
            // Actions
            modalContent += `
                <div class="vc-actions">
                    <a href="${vc.website || '#'}" target="_blank" class="modal-btn primary">
                        <i class="fas fa-external-link-alt"></i>
                        Visit Website
                    </a>
                    <button class="modal-btn secondary" onclick="window.platform.showExecutivesModal(${vc.id})">
                        <i class="fas fa-users"></i>
                        View Executives & Email Templates
                    </button>
                </div>
            `;
            
            modalContent += '</div>';
            
            content.innerHTML = modalContent;
            modal.classList.add('active');
            
        } catch (error) {
            console.error('Error showing VC modal:', error);
        }
    }

    showExecutivesModal(companyId) {
        console.log('Showing executives modal for:', companyId);
        try {
            const company = this.dataService.getCompanyById(companyId);
            if (!company) {
                console.error('Company not found:', companyId);
                return;
            }

            const modal = document.getElementById('modalOverlay');
            const title = document.getElementById('modalTitle');
            const content = document.getElementById('modalContent');
            
            if (!modal || !title || !content) {
                console.error('Modal elements not found');
                return;
            }

            title.textContent = `${company.name} - Executives & Contact Info`;
            
            let modalContent = '<div class="executives-modal">';
            
            // Company header
            modalContent += `
                <div class="company-header">
                    <div class="company-logo-large">
                        <img src="${this.getCompanyLogoUrl(company.name)}" alt="${company.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="logo-fallback" style="display: flex;">${this.getCompanyInitials(company.name)}</div>
                    </div>
                    <div class="company-details">
                        <h2>${company.name}</h2>
                        <p class="company-description">${company.description}</p>
                    </div>
                </div>
            `;
            
            // Leadership section with enhanced contact matching
            modalContent += `
                <div class="executives-section">
                    <h3>Leadership Team</h3>
                    <div class="executive-list">
                        <div class="executive-item">
                            <div class="executive-info">
                                <h4>${company.ceo}</h4>
                                <p>CEO & Founder</p>
                                <span class="executive-tenure">Since ${company.founded_year}</span>
                                <div class="contact-details">
                                    <span class="contact-email">${company.ceo.toLowerCase().replace(/\s+/g, '.')}@${company.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                                </div>
                            </div>
                            <div class="executive-actions">
                                <button class="modal-btn primary" onclick="window.platform.copyEmailTemplate('partnership', ${company.id}, '${company.ceo}')">
                                    <i class="fas fa-copy"></i>
                                    Partnership Email
                                </button>
                                <button class="modal-btn secondary" onclick="window.platform.copyEmailTemplate('integration', ${company.id}, '${company.ceo}')">
                                    <i class="fas fa-copy"></i>
                                    Integration Email
                                </button>
                                <a href="https://linkedin.com/in/${company.ceo.toLowerCase().replace(/\s+/g, '-')}" target="_blank" class="modal-btn secondary">
                                    <i class="fab fa-linkedin"></i>
                                    LinkedIn
                                </a>
                            </div>
                        </div>
                        
                        <!-- Additional executives if available -->
                        <div class="executive-item">
                            <div class="executive-info">
                                <h4>Business Development Team</h4>
                                <p>Partnerships & Business Development</p>
                                <div class="contact-details">
                                    <span class="contact-email">bd@${company.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                                </div>
                            </div>
                            <div class="executive-actions">
                                <button class="modal-btn primary" onclick="window.platform.copyEmailTemplate('partnership', ${company.id}, 'BD Team')">
                                    <i class="fas fa-copy"></i>
                                    Partnership Email
                                </button>
                                <button class="modal-btn secondary" onclick="window.platform.copyEmailTemplate('introduction', ${company.id}, 'BD Team')">
                                    <i class="fas fa-copy"></i>
                                    Introduction Email
                                </button>
                            </div>
                        </div>
                        
                        <div class="executive-item">
                            <div class="executive-info">
                                <h4>Technical Team</h4>
                                <p>Engineering & Product Integration</p>
                                <div class="contact-details">
                                    <span class="contact-email">tech@${company.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                                </div>
                            </div>
                            <div class="executive-actions">
                                <button class="modal-btn primary" onclick="window.platform.copyEmailTemplate('integration', ${company.id}, 'Tech Team')">
                                    <i class="fas fa-copy"></i>
                                    Integration Email
                                </button>
                                <button class="modal-btn secondary" onclick="window.platform.copyEmailTemplate('introduction', ${company.id}, 'Tech Team')">
                                    <i class="fas fa-copy"></i>
                                    Introduction Email
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Email templates
            modalContent += `
                <div class="email-templates-section">
                    <h3>Email Templates</h3>
                    <div class="template-list">
                        <div class="template-item">
                            <h4>Partnership Inquiry</h4>
                            <p>Template for reaching out about potential NVIDIA partnership opportunities.</p>
                            <button class="template-btn" onclick="window.platform.copyEmailTemplate('partnership', ${company.id})">
                                <i class="fas fa-copy"></i>
                                Copy Template
                            </button>
                        </div>
                        <div class="template-item">
                            <h4>Product Integration</h4>
                            <p>Template for discussing AI/GPU integration possibilities.</p>
                            <button class="template-btn" onclick="window.platform.copyEmailTemplate('integration', ${company.id})">
                                <i class="fas fa-copy"></i>
                                Copy Template
                            </button>
                        </div>
                        <div class="template-item">
                            <h4>General Introduction</h4>
                            <p>Template for initial contact and relationship building.</p>
                            <button class="template-btn" onclick="window.platform.copyEmailTemplate('introduction', ${company.id})">
                                <i class="fas fa-copy"></i>
                                Copy Template
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            modalContent += '</div>';
            
            content.innerHTML = modalContent;
            modal.classList.add('active');
            
        } catch (error) {
            console.error('Error showing executives modal:', error);
        }
    }

    copyEmailTemplate(templateType, companyId, contactName = null) {
        const company = this.dataService.getCompanyById(companyId);
        if (!company) return;

        let template = '';
        const recipient = contactName || company.ceo;
        
        switch (templateType) {
            case 'partnership':
                template = `Subject: NVIDIA Partnership Opportunity - ${company.name}

Dear ${recipient},

I hope this email finds you well. I'm reaching out from NVIDIA to explore potential partnership opportunities with ${company.name}.

Given your company's focus on ${company.industry.replace('-', ' ')} and impressive growth trajectory, I believe there could be significant synergies between our organizations.

Would you be available for a brief call to discuss how NVIDIA's AI and GPU technologies could support ${company.name}'s continued success?

Best regards,
[Your Name]
NVIDIA Partnership Team`;
                break;
                
            case 'integration':
                template = `Subject: AI/GPU Integration Discussion - ${company.name}

Dear ${recipient},

I'm writing to discuss potential AI and GPU integration opportunities with ${company.name}.

NVIDIA's cutting-edge AI platforms could significantly enhance ${company.name}'s capabilities in ${company.industry.replace('-', ' ')}.

I'd love to schedule a brief call to explore how we might work together.

Best regards,
[Your Name]
NVIDIA Technical Partnerships`;
                break;
                
            case 'introduction':
                template = `Subject: Introduction from NVIDIA

Dear ${recipient},

I hope this message finds you well. I'm reaching out from NVIDIA to introduce myself and explore potential collaboration opportunities with ${company.name}.

I've been following your company's impressive progress in ${company.industry.replace('-', ' ')} and would love to learn more about your vision and how NVIDIA might support your growth.

Would you be open to a brief conversation?

Best regards,
[Your Name]
NVIDIA Business Development`;
                break;
        }
        
        // Copy to clipboard
        navigator.clipboard.writeText(template).then(() => {
            alert('Email template copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = template;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Email template copied to clipboard!');
        });
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.body.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                // Set the data-theme attribute
                document.body.setAttribute('data-theme', newTheme);
                
                // Update the icon
                const isDark = newTheme === 'dark';
                themeToggle.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>`;
                
                // Save preference to localStorage
                localStorage.setItem('theme', newTheme);
                
                console.log('Theme switched to:', newTheme);
            });
            
            // Load saved theme preference
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.body.setAttribute('data-theme', savedTheme);
            
            // Set initial icon
            const isDark = savedTheme === 'dark';
            themeToggle.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>`;
        }
    }

    setupSearch() {
        const searchInput = document.getElementById('globalSearch');
        const searchDropdown = document.getElementById('searchDropdown');
        
        if (searchInput && searchDropdown) {
            let searchTimeout;
            
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value;
                
                // Clear previous timeout
                clearTimeout(searchTimeout);
                
                // Debounce search - wait 300ms after user stops typing
                searchTimeout = setTimeout(() => {
                    this.performGlobalSearch(query);
                }, 300);
            });
            
            // Hide dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
                    this.hideSearchDropdown();
                }
            });
            
            // Show dropdown when input is focused and has content
            searchInput.addEventListener('focus', (e) => {
                if (e.target.value.trim()) {
                    this.performGlobalSearch(e.target.value);
                }
            });
            
        } else {
            console.error('Search input or dropdown not found!');
        }
    }

    performGlobalSearch(query) {
        console.log('Performing global search for:', query);
        
        const searchDropdown = document.getElementById('searchDropdown');
        const searchResults = document.getElementById('searchResults');
        
        if (!searchDropdown || !searchResults) {
            console.error('Search dropdown elements not found');
            return;
        }
        
        if (!query.trim()) {
            this.hideSearchDropdown();
            return;
        }
        
        // Search companies
        const companies = this.dataService.searchCompanies(query);
        console.log('Found companies:', companies.length);
        
        // Limit results to first 8 for better UX
        const limitedCompanies = companies.slice(0, 8);
        
        if (limitedCompanies.length === 0) {
            searchResults.innerHTML = `
                <div class="search-result-item">
                    <div class="search-result-info">
                        <div class="search-result-name">No companies found</div>
                        <div class="search-result-details">Try a different search term</div>
                    </div>
                </div>
            `;
        } else {
            searchResults.innerHTML = limitedCompanies.map(company => `
                <div class="search-result-item" data-company-id="${company.id}">
                    <img src="${company.logo || 'https://via.placeholder.com/32x32?text=' + company.name.charAt(0)}" 
                         alt="${company.name}" 
                         class="search-result-logo"
                         onerror="this.src='https://via.placeholder.com/32x32?text=${company.name.charAt(0)}'">
                    <div class="search-result-info">
                        <div class="search-result-name">${company.name}</div>
                        <div class="search-result-details">${company.industry}</div>
                    </div>
                </div>
            `).join('');
            
            // Add click handlers to search results
            this.setupSearchResultClickHandlers();
        }
        
        this.showSearchDropdown();
    }

    showSearchDropdown() {
        const searchDropdown = document.getElementById('searchDropdown');
        if (searchDropdown) {
            searchDropdown.classList.add('show');
        }
    }
    
    hideSearchDropdown() {
        const searchDropdown = document.getElementById('searchDropdown');
        if (searchDropdown) {
            searchDropdown.classList.remove('show');
        }
    }
    
    setupSearchResultClickHandlers() {
        const searchResultItems = document.querySelectorAll('.search-result-item[data-company-id]');
        searchResultItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const companyId = parseInt(e.currentTarget.dataset.companyId);
                const company = this.dataService.companies.find(c => c.id === companyId);
                
                if (company) {
                    console.log('Opening company modal for:', company.name);
                    this.showCompanyModal(company.id);
                    this.hideSearchDropdown();
                    
                    // Clear search input
                    const searchInput = document.getElementById('globalSearch');
                    if (searchInput) {
                        searchInput.value = '';
                    }
                }
            });
        });
    }

    updateActiveButton(target, selector) {
        document.querySelectorAll(selector).forEach(btn => {
            btn.classList.remove('active');
        });
        target.classList.add('active');
    }

    toggleView(view) {
        console.log('Toggling view to:', view);
        const companiesGrid = document.getElementById('companiesGrid');
        if (companiesGrid) {
            companiesGrid.className = `companies-grid ${view}-view`;
        }
    }

    filterCompaniesByIndustry(industry) {
        console.log('Filtering companies by industry:', industry);
        const companiesGrid = document.getElementById('companiesGrid');
        if (!companiesGrid) return;

        let filteredCompanies = this.dataService.companies;
        
        if (industry && industry !== 'all') {
            filteredCompanies = filteredCompanies.filter(company => 
                company.industry.toLowerCase().includes(industry.toLowerCase())
            );
        }

        companiesGrid.innerHTML = filteredCompanies.map(company => this.renderCompanyCard(company)).join('');
    }

    filterCompaniesByValuation(valuationRange) {
        console.log('Filtering companies by valuation:', valuationRange);
        const companiesGrid = document.getElementById('companiesGrid');
        if (!companiesGrid) return;

        let filteredCompanies = this.dataService.companies;
        
        if (valuationRange && valuationRange !== '') {
            if (valuationRange.includes('+')) {
                // Handle ranges like "100000000000+" (100B+)
                const minValue = parseInt(valuationRange.replace(/[^\d]/g, ''));
                filteredCompanies = filteredCompanies.filter(company => 
                    company.valuation >= minValue
                );
            } else {
                // Handle ranges like "0-1000000000" ($0 - $1B)
                const [min, max] = valuationRange.split('-').map(v => parseInt(v));
                filteredCompanies = filteredCompanies.filter(company => 
                    company.valuation >= min && company.valuation <= max
                );
            }
        }

        companiesGrid.innerHTML = filteredCompanies.map(company => this.renderCompanyCard(company)).join('');
    }

    filterCompaniesByFunding(fundingRange) {
        console.log('Filtering companies by funding:', fundingRange);
        const companiesGrid = document.getElementById('companiesGrid');
        if (!companiesGrid) return;

        let filteredCompanies = this.dataService.companies;
        
        if (fundingRange && fundingRange !== '') {
            const [min, max] = fundingRange.split('-').map(v => v.replace(/[^\d]/g, ''));
            filteredCompanies = filteredCompanies.filter(company => {
                const funding = company.funding_raised;
                if (max) {
                    return funding >= parseInt(min) && funding <= parseInt(max);
                } else {
                    return funding >= parseInt(min);
                }
            });
        }

        companiesGrid.innerHTML = filteredCompanies.map(company => this.renderCompanyCard(company)).join('');
    }

    filterCompaniesByDate(dateFilter) {
        console.log('Filtering companies by date:', dateFilter);
        const companiesGrid = document.getElementById('companiesGrid');
        if (!companiesGrid) return;

        let filteredCompanies = this.dataService.companies;
        
        if (dateFilter && dateFilter !== '') {
            filteredCompanies = filteredCompanies.filter(company => {
                const fundingDate = company.funding?.date;
                return fundingDate && fundingDate.startsWith(dateFilter);
            });
        }

        companiesGrid.innerHTML = filteredCompanies.map(company => this.renderCompanyCard(company)).join('');
    }

    filterCompaniesByVC(fundingRound) {
        console.log('Filtering companies by funding round:', fundingRound);
        const companiesGrid = document.getElementById('companiesGrid');
        if (!companiesGrid) return;

        let filteredCompanies = this.dataService.companies;
        
        if (fundingRound && fundingRound !== '') {
            filteredCompanies = filteredCompanies.filter(company => 
                company.last_funding_round === fundingRound
            );
        }

        companiesGrid.innerHTML = filteredCompanies.map(company => this.renderCompanyCard(company)).join('');
    }

    filterNewsByCategory(category) {
        console.log('Filtering news by category:', category);
        const newsGrid = document.getElementById('latestNewsGrid');
        if (!newsGrid) return;

        let filteredNews = this.dataService.getRecentNews(6);
        
        if (category && category !== 'all') {
            filteredNews = filteredNews.filter(article => 
                article.category.toLowerCase().includes(category.toLowerCase())
            );
        }

        newsGrid.innerHTML = filteredNews.map(article => `
            <div class="news-item" onclick="window.platform.showCompanyModal(${article.company_id})">
                <div class="news-header">
                    <span class="news-category">${article.category}</span>
                    <span class="news-time">${article.read_time}</span>
                </div>
                <h3 class="news-title">${article.headline}</h3>
                <p class="news-content">${article.content}</p>
                <div class="news-footer">
                    <span class="news-source">${article.source}</span>
                    <span class="news-date">${this.dataService.formatDate(article.published_at)}</span>
                </div>
            </div>
        `).join('');
    }

    updateChartTimeframe(period) {
        console.log('Updating chart timeframe to:', period);
        // Update trend cards with filtered data
        this.updateTrendCards(period);
    }

    updateChartType(type) {
        console.log('Updating chart type to:', type);
        // Update chart display type
        const chartContainer = document.querySelector('.chart-container');
        if (chartContainer) {
            chartContainer.className = `chart-container ${type}-chart`;
        }
    }

    updateInvestmentTimeframe(range) {
        console.log('Updating investment timeframe to:', range);
        // Update investment data based on timeframe
        this.loadInvestmentOverview();
        this.loadSectorTrendsSummary();
    }

    updateTrendCards(period) {
        const stats = this.dataService.getDashboardStats();
        const periodMultiplier = period === '6m' ? 0.5 : period === '1y' ? 1 : period === '2y' ? 2 : 1;
        
        // Update trend values based on period
        const totalFundingTrend = document.getElementById('totalFundingTrend');
        const totalDealsTrend = document.getElementById('totalDealsTrend');
        const avgDealSizeTrend = document.getElementById('avgDealSizeTrend');
        
        if (totalFundingTrend) {
            const funding = Math.round(stats.totalFunding * periodMultiplier / 1000000000 * 100) / 100;
            totalFundingTrend.textContent = `$${funding}B`;
        }
        
        if (totalDealsTrend) {
            const deals = Math.round(stats.totalCompanies * periodMultiplier);
            totalDealsTrend.textContent = deals.toString();
        }
        
        if (avgDealSizeTrend) {
            const avgDeal = Math.round(stats.totalFunding / stats.totalCompanies / 1000000 * periodMultiplier * 100) / 100;
            avgDealSizeTrend.textContent = `$${avgDeal}M`;
        }
    }

    handleViewAllClick(btn) {
        console.log('View all clicked');
        // Implementation for view all functionality
    }

    filterVCsByTier(vcTier) {
        console.log('Filtering VCs by tier:', vcTier);
        const vcsGrid = document.getElementById('vcsGrid');
        if (!vcsGrid) return;

        let filteredVCs = this.dataService.getTopVCsByScore(6);
        
        if (vcTier && vcTier !== 'all') {
            filteredVCs = filteredVCs.filter(vc => 
                vc.name.toLowerCase().includes(vcTier.toLowerCase())
            );
        }

        vcsGrid.innerHTML = filteredVCs.map(vc => `
            <div class="vc-card" onclick="platform.showVCModal(${vc.id})">
                <div class="vc-header">
                    <div class="vc-logo">
                        <img src="${this.getVCLogoUrl(vc.name)}" alt="${vc.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="logo-fallback" style="display: none;">${vc.name.charAt(0)}</div>
                    </div>
                    <div class="vc-info">
                        <h3>${vc.name}</h3>
                        <span class="vc-location">${vc.location}</span>
                    </div>
                </div>
                <div class="vc-score">
                    <span class="score-value">${vc.final_score}</span>
                    <span class="score-label">Score</span>
                </div>
                <div class="vc-stats">
                    <div class="vc-stat">
                        <span class="vc-stat-value">${vc.investments}</span>
                        <span class="vc-stat-label">Investments</span>
                    </div>
                    <div class="vc-stat">
                        <span class="vc-stat-value">${vc.portfolio_companies}</span>
                        <span class="vc-stat-label">Portfolio</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    downloadNonPartnersCSV() {
        console.log('Downloading non-partners CSV');
        const nonPartners = this.dataService.companies.filter(company => company.ncp_status !== 'Partner');
        
        const csvContent = [
            ['Company Name', 'Industry', 'CEO', 'Funding Raised', 'Valuation', 'Location', 'Website'],
            ...nonPartners.map(company => [
                company.name,
                company.industry,
                company.ceo,
                company.funding_raised,
                company.valuation,
                company.location,
                company.website
            ])
        ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'non-partners.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    getCompanyLogoUrl(companyName) {
        // First, try to get logo from data service
        const company = this.dataService.companies.find(c => c.name === companyName);
        if (company && company.logo) {
            return company.logo;
        }
        
        // Fallback to Clearbit logo service
        try {
            const cleanName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
            return `https://logo.clearbit.com/${cleanName}.com`;
        } catch (error) {
            console.warn('Error generating logo URL:', error);
            return '';
        }
    }

    getCompanyInitials(companyName) {
        // Generate initials from company name
        return companyName.split(' ')
            .map(word => word.charAt(0))
            .join('')
            .substring(0, 2)
            .toUpperCase();
    }

    getVCLogoUrl(vcName) {
        // First, try to get logo from data service
        const vc = this.dataService.vcs.find(v => v.name === vcName);
        if (vc && vc.logo) {
            return vc.logo;
        }
        
        // Fallback to Clearbit logo service
        try {
            const cleanName = vcName.toLowerCase().replace(/[^a-z0-9]/g, '');
            return `https://logo.clearbit.com/${cleanName}.com`;
        } catch (error) {
            console.warn('Error generating VC logo URL:', error);
            return '';
        }
    }
}

// Initialize the platform when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing platform...');
    window.platform = new ModernDigitalNativesPlatform();
    console.log('Platform initialized:', window.platform);
});

// Fallback initialization if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
    console.log('Waiting for DOM to load...');
} else {
    // DOM is already loaded, initialize immediately
    console.log('DOM already loaded, initializing platform immediately...');
    window.platform = new ModernDigitalNativesPlatform();
    console.log('Platform initialized:', window.platform);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        window.platform?.closeModal();
    }
});

// Window resize handler
window.addEventListener('resize', () => {
    // Handle window resize if needed
});