// Enhanced Biotech Dashboard JavaScript with Piloterr Data Integration
class BiotechDashboard {
    constructor() {
        this.currentPage = 'dashboard';
        this.currentTheme = 'light';
        this.chart = null;
        this.updateInterval = null;
        this.dataService = new DataService();
        this.searchResults = [];
        this.currentSearchQuery = '';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.startLiveUpdates();
        this.initializeChart();
        this.renderDashboard();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterClick(e.currentTarget);
            });
        });

        // Tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleTabClick(e.currentTarget);
            });
        });

        // Enhanced search functionality
        const searchInput = document.querySelector('.search-bar input');
        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Modal functionality
        this.setupModalListeners();
        
        // Company card clicks
        this.setupCompanyCardListeners();
    }

    navigateToPage(page) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Update page title
        document.querySelector('.page-title').textContent = 
            page.charAt(0).toUpperCase() + page.slice(1);

        // Show/hide page content
        document.querySelectorAll('.page-content').forEach(content => {
            content.classList.add('hidden');
        });
        document.getElementById(page).classList.remove('hidden');

        this.currentPage = page;

        // Load page-specific data
        this.loadPageData(page);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        
        // Update chart colors for dark mode
        if (this.chart) {
            this.updateChartColors();
        }
    }

    handleFilterClick(button) {
        const container = button.closest('.card-header');
        container.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        const filterType = button.dataset.filter;
        this.applyFilter(filterType);
    }

    handleTabClick(button) {
        const container = button.closest('.tab-container');
        container.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        const tabType = button.dataset.tab;
        this.switchTab(tabType);
    }

    handleSearch(query) {
        this.currentSearchQuery = query;
        
        if (query.length < 2) {
            this.clearSearchResults();
            return;
        }

        // Search across all data types
        const companyResults = this.dataService.searchCompanies(query);
        const vcResults = this.dataService.searchVCs(query);
        const newsResults = this.dataService.searchNews(query);

        this.searchResults = {
            companies: companyResults,
            vcs: vcResults,
            news: newsResults,
            total: companyResults.length + vcResults.length + newsResults.length
        };

        this.displaySearchResults();
    }

    displaySearchResults() {
        const searchContainer = document.querySelector('.search-results');
        if (!searchContainer) return;

        if (this.searchResults.total === 0) {
            searchContainer.innerHTML = `
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    <p>No results found for "${this.currentSearchQuery}"</p>
                </div>
            `;
            searchContainer.classList.add('active');
            return;
        }

        let html = `
            <div class="search-results-header">
                <h3>Search Results (${this.searchResults.total})</h3>
                <button class="close-search" onclick="this.closest('.search-results').classList.remove('active')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Companies results
        if (this.searchResults.companies.length > 0) {
            html += `
                <div class="search-section">
                    <h4><i class="fas fa-building"></i> Companies (${this.searchResults.companies.length})</h4>
                    <div class="search-items">
                        ${this.searchResults.companies.map(company => `
                            <div class="search-item company-item" onclick="dashboard.showCompanyDetails(${company.id})">
                                <div class="search-item-icon">${company.logo}</div>
                                <div class="search-item-content">
                                    <h5>${company.name}</h5>
                                    <p>${company.description}</p>
                                    <span class="search-item-meta">${company.location} • ${company.industry}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // VCs results
        if (this.searchResults.vcs.length > 0) {
            html += `
                <div class="search-section">
                    <h4><i class="fas fa-chart-line"></i> VCs (${this.searchResults.vcs.length})</h4>
                    <div class="search-items">
                        ${this.searchResults.vcs.map(vc => `
                            <div class="search-item vc-item" onclick="dashboard.showVCDetails(${vc.id})">
                                <div class="search-item-icon">${vc.logo}</div>
                                <div class="search-item-content">
                                    <h5>${vc.name}</h5>
                                    <p>${vc.description}</p>
                                    <span class="search-item-meta">Score: ${vc.final_score} • ${vc.location}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // News results
        if (this.searchResults.news.length > 0) {
            html += `
                <div class="search-section">
                    <h4><i class="fas fa-newspaper"></i> News (${this.searchResults.news.length})</h4>
                    <div class="search-items">
                        ${this.searchResults.news.map(article => `
                            <div class="search-item news-item" onclick="dashboard.showNewsDetails(${article.id})">
                                <div class="search-item-content">
                                    <h5>${article.headline}</h5>
                                    <p>${article.content.substring(0, 100)}...</p>
                                    <span class="search-item-meta">${article.source} • ${this.dataService.formatDate(article.published_at)}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        searchContainer.innerHTML = html;
        searchContainer.classList.add('active');
    }

    clearSearchResults() {
        const searchContainer = document.querySelector('.search-results');
        if (searchContainer) {
            searchContainer.classList.remove('active');
        }
        this.searchResults = [];
    }

    setupCompanyCardListeners() {
        // This will be called after rendering company cards
        document.addEventListener('click', (e) => {
            if (e.target.closest('.company-card')) {
                const card = e.target.closest('.company-card');
                const companyId = parseInt(card.dataset.companyId);
                this.showCompanyDetails(companyId);
            }
        });
    }

    showCompanyDetails(companyId) {
        const company = this.dataService.getCompanyById(companyId);
        if (!company) return;

        const modal = document.getElementById('companyModal');
        const modalContent = modal.querySelector('.modal-content');
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${company.logo} ${company.name}</h2>
                <button class="modal-close" onclick="this.closest('.modal').classList.remove('active')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="company-details">
                    <div class="company-info">
                        <p class="company-description">${company.description}</p>
                        <div class="company-meta">
                            <div class="meta-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${company.location}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-calendar"></i>
                                <span>Founded ${company.founded_year}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-users"></i>
                                <span>${company.employees} employees</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-code"></i>
                                <span>${company.technical_employees_pct}% technical</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="company-funding">
                        <h3>Funding Information</h3>
                        <div class="funding-grid">
                            <div class="funding-item">
                                <span class="funding-label">Total Raised</span>
                                <span class="funding-value">${this.dataService.formatCurrency(company.funding_raised)}</span>
                            </div>
                            <div class="funding-item">
                                <span class="funding-label">Last Round</span>
                                <span class="funding-value">${company.last_funding_round}</span>
                            </div>
                            <div class="funding-item">
                                <span class="funding-label">Valuation</span>
                                <span class="funding-value">${this.dataService.formatCurrency(company.valuation)}</span>
                            </div>
                            <div class="funding-item">
                                <span class="funding-label">Growth Rate</span>
                                <span class="funding-value">${company.growth_rate}%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="company-team">
                        <h3>Leadership</h3>
                        <div class="team-member">
                            <div class="member-info">
                                <h4>${company.ceo}</h4>
                                <span>CEO & Founder</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="company-investors">
                        <h3>Investors</h3>
                        <div class="investors-list">
                            ${company.investors.map(investor => `
                                <span class="investor-tag">${investor}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="company-news">
                        <h3>Recent News</h3>
                        <div class="news-list">
                            ${this.dataService.getNewsByCompanyId(companyId).map(article => `
                                <div class="news-item">
                                    <h4>${article.headline}</h4>
                                    <p>${article.content}</p>
                                    <span class="news-meta">${article.source} • ${this.dataService.formatDate(article.published_at)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    }

    showVCDetails(vcId) {
        const vc = this.dataService.getVCById(vcId);
        if (!vc) return;

        const modal = document.getElementById('vcModal');
        const modalContent = modal.querySelector('.modal-content');
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${vc.logo} ${vc.name}</h2>
                <button class="modal-close" onclick="this.closest('.modal').classList.remove('active')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="vc-details">
                    <div class="vc-info">
                        <p class="vc-description">${vc.description}</p>
                        <div class="vc-meta">
                            <div class="meta-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${vc.location}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-chart-line"></i>
                                <span>${vc.investment_stage}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-building"></i>
                                <span>${vc.portfolio_companies} portfolio companies</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="vc-stats">
                        <h3>Investment Statistics</h3>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <span class="stat-label">Total AUM</span>
                                <span class="stat-value">${this.dataService.formatCurrency(vc.total_aum)}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Healthcare Focus</span>
                                <span class="stat-value">${vc.healthcare_focus ? 'Yes' : 'No'}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Final Score</span>
                                <span class="stat-value">${vc.final_score}/100</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Recent Investments</span>
                                <span class="stat-value">${vc.investments}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    }

    showNewsDetails(newsId) {
        const article = this.dataService.news.find(n => n.id === newsId);
        if (!article) return;

        const modal = document.getElementById('newsModal');
        const modalContent = modal.querySelector('.modal-content');
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${article.headline}</h2>
                <button class="modal-close" onclick="this.closest('.modal').classList.remove('active')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="news-details">
                    <div class="news-meta">
                        <span class="news-source">${article.source}</span>
                        <span class="news-date">${this.dataService.formatDate(article.published_at)}</span>
                        <span class="news-read-time">${article.read_time}</span>
                    </div>
                    <div class="news-content">
                        <p>${article.content}</p>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    }

    renderDashboard() {
        this.renderDashboardStats();
        this.renderTopCompanies();
        this.renderRecentNews();
        this.renderTopVCs();
    }

    renderDashboardStats() {
        const stats = this.dataService.getDashboardStats();
        
        // Update stat cards
        const statCards = document.querySelectorAll('.stat-card');
        if (statCards.length >= 4) {
            statCards[0].querySelector('.stat-value').textContent = stats.totalCompanies;
            statCards[1].querySelector('.stat-value').textContent = this.dataService.formatCurrency(stats.totalFunding);
            statCards[2].querySelector('.stat-value').textContent = this.dataService.formatCurrency(stats.totalValuation);
            statCards[3].querySelector('.stat-value').textContent = stats.totalEmployees;
        }
    }

    renderTopCompanies() {
        const topCompanies = this.dataService.getTopCompaniesByValuation(5);
        const companiesContainer = document.querySelector('.companies-list');
        
        if (companiesContainer) {
            companiesContainer.innerHTML = topCompanies.map(company => `
                <div class="company-card" data-company-id="${company.id}">
                    <div class="company-header">
                        <div class="company-logo">${company.logo}</div>
                        <div class="company-info">
                            <h3>${company.name}</h3>
                            <p>${company.description}</p>
                        </div>
                        <div class="company-score">
                            <span class="score-value">${company.growth_rate}%</span>
                            <span class="score-label">Growth</span>
                        </div>
                    </div>
                    <div class="company-details">
                        <div class="detail-item">
                            <span class="detail-label">Valuation</span>
                            <span class="detail-value">${this.dataService.formatCurrency(company.valuation)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Employees</span>
                            <span class="detail-value">${company.employees}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Location</span>
                            <span class="detail-value">${company.location}</span>
                        </div>
                    </div>
                    <div class="company-actions">
                        <button class="btn-primary" onclick="dashboard.showCompanyDetails(${company.id})">
                            View Details
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    renderRecentNews() {
        const recentNews = this.dataService.getRecentNews(5);
        const newsContainer = document.querySelector('.news-list');
        
        if (newsContainer) {
            newsContainer.innerHTML = recentNews.map(article => `
                <div class="news-item" onclick="dashboard.showNewsDetails(${article.id})">
                    <div class="news-header">
                        <h4>${article.headline}</h4>
                        <span class="news-category">${article.category}</span>
                    </div>
                    <p>${article.content}</p>
                    <div class="news-meta">
                        <span class="news-source">${article.source}</span>
                        <span class="news-date">${this.dataService.formatDate(article.published_at)}</span>
                        <span class="news-read-time">${article.read_time}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    renderTopVCs() {
        const topVCs = this.dataService.getTopVCsByScore(3);
        const vcsContainer = document.querySelector('.vcs-list');
        
        if (vcsContainer) {
            vcsContainer.innerHTML = topVCs.map(vc => `
                <div class="vc-card" onclick="dashboard.showVCDetails(${vc.id})">
                    <div class="vc-header">
                        <div class="vc-logo">${vc.logo}</div>
                        <div class="vc-info">
                            <h3>${vc.name}</h3>
                            <p>${vc.description}</p>
                        </div>
                        <div class="vc-score">
                            <span class="score-value">${vc.final_score}</span>
                            <span class="score-label">Score</span>
                        </div>
                    </div>
                    <div class="vc-details">
                        <div class="detail-item">
                            <span class="detail-label">AUM</span>
                            <span class="detail-value">${this.dataService.formatCurrency(vc.total_aum)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Portfolio</span>
                            <span class="detail-value">${vc.portfolio_companies}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Stage</span>
                            <span class="detail-value">${vc.investment_stage}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    loadPageData(page) {
        switch(page) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'companies':
                this.renderCompaniesPage();
                break;
            case 'investments':
                this.renderInvestmentsPage();
                break;
            case 'notifications':
                this.renderNotificationsPage();
                break;
        }
    }

    renderCompaniesPage() {
        const companiesContainer = document.getElementById('companies');
        if (!companiesContainer) return;

        const allCompanies = this.dataService.companies;
        
        companiesContainer.innerHTML = `
            <div class="page-header">
                <h2>All Companies</h2>
                <div class="page-actions">
                    <div class="search-bar">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="Search companies..." id="companiesSearch">
                    </div>
                    <div class="filter-buttons">
                        <button class="filter-btn active" data-filter="all">All</button>
                        <button class="filter-btn" data-filter="medical-imaging">Medical Imaging</button>
                        <button class="filter-btn" data-filter="digital-health">Digital Health</button>
                        <button class="filter-btn" data-filter="biotech">Biotech</button>
                        <button class="filter-btn" data-filter="neurotechnology">Neurotech</button>
                    </div>
                </div>
            </div>
            <div class="companies-grid">
                ${allCompanies.map(company => `
                    <div class="company-card" data-company-id="${company.id}">
                        <div class="company-header">
                            <div class="company-logo">${company.logo}</div>
                            <div class="company-info">
                                <h3>${company.name}</h3>
                                <p>${company.description}</p>
                            </div>
                            <div class="company-score">
                                <span class="score-value">${company.growth_rate}%</span>
                                <span class="score-label">Growth</span>
                            </div>
                        </div>
                        <div class="company-details">
                            <div class="detail-item">
                                <span class="detail-label">Valuation</span>
                                <span class="detail-value">${this.dataService.formatCurrency(company.valuation)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Employees</span>
                                <span class="detail-value">${company.employees}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Location</span>
                                <span class="detail-value">${company.location}</span>
                            </div>
                        </div>
                        <div class="company-actions">
                            <button class="btn-primary" onclick="dashboard.showCompanyDetails(${company.id})">
                                View Details
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Setup search for companies page
        const searchInput = document.getElementById('companiesSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterCompanies(e.target.value);
            });
        }
    }

    filterCompanies(query) {
        const companies = query ? this.dataService.searchCompanies(query) : this.dataService.companies;
        const grid = document.querySelector('.companies-grid');
        
        if (grid) {
            grid.innerHTML = companies.map(company => `
                <div class="company-card" data-company-id="${company.id}">
                    <div class="company-header">
                        <div class="company-logo">${company.logo}</div>
                        <div class="company-info">
                            <h3>${company.name}</h3>
                            <p>${company.description}</p>
                        </div>
                        <div class="company-score">
                            <span class="score-value">${company.growth_rate}%</span>
                            <span class="score-label">Growth</span>
                        </div>
                    </div>
                    <div class="company-details">
                        <div class="detail-item">
                            <span class="detail-label">Valuation</span>
                            <span class="detail-value">${this.dataService.formatCurrency(company.valuation)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Employees</span>
                            <span class="detail-value">${company.employees}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Location</span>
                            <span class="detail-value">${company.location}</span>
                        </div>
                    </div>
                    <div class="company-actions">
                        <button class="btn-primary" onclick="dashboard.showCompanyDetails(${company.id})">
                            View Details
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    renderInvestmentsPage() {
        const investmentsContainer = document.getElementById('investments');
        if (!investmentsContainer) return;

        const companies = this.dataService.companies.sort((a, b) => b.funding_raised - a.funding_raised);
        
        investmentsContainer.innerHTML = `
            <div class="page-header">
                <h2>Investment Overview</h2>
                <div class="investment-stats">
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-dollar-sign"></i></div>
                        <div class="stat-content">
                            <div class="stat-value">${this.dataService.formatCurrency(this.dataService.companies.reduce((sum, c) => sum + c.funding_raised, 0))}</div>
                            <div class="stat-label">Total Funding</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
                        <div class="stat-content">
                            <div class="stat-value">${this.dataService.companies.length}</div>
                            <div class="stat-label">Companies</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="investments-list">
                ${companies.map(company => `
                    <div class="investment-card" onclick="dashboard.showCompanyDetails(${company.id})">
                        <div class="investment-header">
                            <div class="company-logo">${company.logo}</div>
                            <div class="company-info">
                                <h3>${company.name}</h3>
                                <p>${company.last_funding_round} • ${this.dataService.formatCurrency(company.funding_raised)}</p>
                            </div>
                            <div class="investment-amount">
                                <span class="amount-value">${this.dataService.formatCurrency(company.funding_raised)}</span>
                                <span class="amount-label">Raised</span>
                            </div>
                        </div>
                        <div class="investment-details">
                            <div class="detail-item">
                                <span class="detail-label">Valuation</span>
                                <span class="detail-value">${this.dataService.formatCurrency(company.valuation)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Investors</span>
                                <span class="detail-value">${company.investors.length}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Growth</span>
                                <span class="detail-value">${company.growth_rate}%</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderNotificationsPage() {
        const notificationsContainer = document.getElementById('notifications');
        if (!notificationsContainer) return;

        const recentNews = this.dataService.getRecentNews(10);
        
        notificationsContainer.innerHTML = `
            <div class="page-header">
                <h2>Recent Activity</h2>
                <div class="notification-filters">
                    <button class="filter-btn active" data-filter="all">All</button>
                    <button class="filter-btn" data-filter="funding">Funding</button>
                    <button class="filter-btn" data-filter="product">Product</button>
                    <button class="filter-btn" data-filter="partnership">Partnership</button>
                </div>
            </div>
            <div class="notifications-list">
                ${recentNews.map(article => `
                    <div class="notification-item" onclick="dashboard.showNewsDetails(${article.id})">
                        <div class="notification-icon">
                            <i class="fas fa-${this.getNotificationIcon(article.category)}"></i>
                        </div>
                        <div class="notification-content">
                            <h4>${article.headline}</h4>
                            <p>${article.content}</p>
                            <div class="notification-meta">
                                <span class="notification-source">${article.source}</span>
                                <span class="notification-date">${this.dataService.formatDate(article.published_at)}</span>
                            </div>
                        </div>
                        <div class="notification-badge ${article.category}"></div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getNotificationIcon(category) {
        const icons = {
            'funding': 'dollar-sign',
            'product': 'rocket',
            'partnership': 'handshake',
            'regulatory': 'shield-alt',
            'default': 'bell'
        };
        return icons[category] || icons.default;
    }

    applyFilter(filterType) {
        // Implementation for applying filters
        console.log('Applying filter:', filterType);
    }

    switchTab(tabType) {
        // Implementation for switching tabs
        console.log('Switching tab:', tabType);
    }

    setupModalListeners() {
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
    }

    loadInitialData() {
        // Load initial data
        console.log('Loading initial data...');
    }

    startLiveUpdates() {
        // Start live updates
        console.log('Starting live updates...');
    }

    initializeChart() {
        // Initialize charts
        console.log('Initializing charts...');
    }

    updateChartColors() {
        // Update chart colors for theme
        console.log('Updating chart colors...');
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new BiotechDashboard();
});
