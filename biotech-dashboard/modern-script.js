// Updated at 1759111913
// Modern Biotech Intelligence Platform - Interactive JavaScript

class ModernBiotechPlatform {
    constructor() {
        console.log('Creating ModernBiotechPlatform...');
        this.dataService = new DataService();
        console.log('DataService created:', this.dataService);
        console.log('Companies loaded:', this.dataService.companies.length);
        
        this.currentSection = 'dashboard';
        this.charts = {};
        this.modals = {};
        
        this.init();
    }

    init() {
        console.log('Initializing platform...');
        this.setupEventListeners();
        this.initializeCharts();
        this.loadDashboardData();
        this.setupThemeToggle();
        this.setupSearch();
        console.log('Platform initialization complete');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.switchSection(section);
            });
        });

        // Modal controls
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');
        
        modalClose?.addEventListener('click', () => {
            this.closeModal();
        });
        
        modalOverlay?.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                this.closeModal();
            }
        });

        // Chart controls
        this.setupChartControls();
        
        // View toggles
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = btn.dataset.view;
                this.toggleView(view);
            });
        });

        // Filter controls
        this.setupFilterControls();

        // View All buttons
        document.querySelectorAll('.view-all').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleViewAllClick(btn);
            });
        });

        // Range buttons (YTD, 1Y, 2Y)
        document.querySelectorAll('.range-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const range = btn.dataset.range;
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
                    console.log('Company card clicked via delegation:', companyId);
                    this.showCompanyModal(parseInt(companyId));
                }
            }
            
            const fundingItem = e.target.closest('.funding-item');
            if (fundingItem) {
                const onclickAttr = fundingItem.getAttribute('onclick');
                if (onclickAttr && onclickAttr.includes('showCompanyModal')) {
                    const match = onclickAttr.match(/showCompanyModal\((\d+)\)/);
                    if (match) {
                        const companyId = parseInt(match[1]);
                        console.log('Funding item clicked via delegation:', companyId);
                        this.showCompanyModal(companyId);
                    }
                }
            }
            
            const performerItem = e.target.closest('.performer-item');
            if (performerItem) {
                const onclickAttr = performerItem.getAttribute('onclick');
                if (onclickAttr && onclickAttr.includes('showCompanyModal')) {
                    const match = onclickAttr.match(/showCompanyModal\((\d+)\)/);
                    if (match) {
                        const companyId = parseInt(match[1]);
                        console.log('Performer item clicked via delegation:', companyId);
                        this.showCompanyModal(companyId);
                    }
                }
            }
        });
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

        // Trend buttons
        document.querySelectorAll('.trend-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const metric = btn.dataset.metric;
                this.updateTrendMetric(metric);
                this.updateActiveButton(e.target, '.trend-btn');
            });
        });
    }

    setupFilterControls() {
        // Industry filter
        const industryFilter = document.getElementById('industryFilter');
        industryFilter?.addEventListener('change', (e) => {
            this.filterCompaniesByIndustry(e.target.value);
        });

        // News category filters
        document.querySelectorAll('.news-filters .filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = btn.dataset.category;
                this.filterNewsByCategory(category);
                this.updateActiveButton(e.target, '.news-filters .filter-btn');
            });
        });
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        themeToggle?.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icon
            const icon = themeToggle.querySelector('i');
            icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            
            // Update chart colors for dark mode
            this.updateChartColors();
        });
    }

    setupSearch() {
        console.log('Setting up search...');
        const searchInput = document.getElementById('globalSearch');
        let searchTimeout;

        if (searchInput) {
            console.log('Search input found:', searchInput);
            
            // Input event with debouncing
            searchInput.addEventListener('input', (e) => {
                console.log('Search input event:', e.target.value);
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300);
            });

            // Focus event to show recent searches
            searchInput.addEventListener('focus', () => {
                console.log('Search input focused');
                if (searchInput.value.trim()) {
                    this.performSearch(searchInput.value);
                } else {
                    this.showRecentSearches();
                }
            });

            // Keyboard shortcuts
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.clearSearchResults();
                    searchInput.blur();
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch(searchInput.value);
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.navigateSearchResults('down');
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.navigateSearchResults('up');
                }
            });

            // Click outside to close
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.search-container') && !e.target.closest('.search-overlay')) {
                    this.clearSearchResults();
                }
            });
        } else {
            console.error('Search input not found!');
        }
    }

    switchSection(section) {
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

    loadDashboardData() {
        this.updateHeroStats();
        this.createInvestmentTrendsChart();
        this.loadRecentFunding();
        this.loadTopPerformers();
        this.loadLatestNews();
    }

    updateHeroStats() {
        const stats = this.dataService.getDashboardStats();
        
        document.getElementById('totalCompanies').textContent = stats.totalCompanies;
        document.getElementById('totalFunding').textContent = this.dataService.formatCurrency(stats.totalFunding);
        document.getElementById('avgGrowth').textContent = `${Math.round(stats.avgGrowthRate)}%`;
        document.getElementById('totalEmployees').textContent = stats.totalEmployees.toLocaleString();
    }

    createInvestmentTrendsChart() {
        const ctx = document.getElementById('investmentTrendsChart');
        if (!ctx) return;

        // Generate sample investment data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();
        
        const data = {
            labels: months,
            datasets: [
                {
                    label: 'Funding ($M)',
                    data: [45, 52, 38, 67, 89, 95, 78, 102, 85, 76, 88, 95],
                    borderColor: '#0066ff',
                    backgroundColor: 'rgba(0, 102, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#0066ff',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'Deals',
                    data: [12, 15, 11, 18, 22, 25, 20, 28, 24, 21, 23, 26],
                    borderColor: '#00d4aa',
                    backgroundColor: 'rgba(0, 212, 170, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#00d4aa',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    yAxisID: 'y1'
                }
            ]
        };

        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#0066ff',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                if (context.datasetIndex === 0) {
                                    return `Funding: $${context.parsed.y}M`;
                                } else {
                                    return `Deals: ${context.parsed.y}`;
                                }
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11,
                                weight: '500'
                            },
                            color: '#737373'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 11,
                                weight: '500'
                            },
                            color: '#737373',
                            callback: function(value) {
                                return '$' + value + 'M';
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        },
                        ticks: {
                            font: {
                                size: 11,
                                weight: '500'
                            },
                            color: '#737373'
                        }
                    }
                },
                elements: {
                    point: {
                        hoverBackgroundColor: '#0066ff'
                    }
                }
            }
        };

        this.charts.investmentTrends = new Chart(ctx, config);
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

    getCompanyLogoUrl(companyName) {
        // For now, return empty string to use fallback initials
        // This prevents external service errors from breaking the modal
        return '';
    }
    
    getCompanyInitials(companyName) {
        // Generate initials from company name
        return companyName.split(' ')
            .map(word => word.charAt(0))
            .join('')
            .substring(0, 2)
            .toUpperCase();
    }

    loadLatestNews() {
        const container = document.getElementById('latestNewsGrid');
        if (!container) return;

        const recentNews = this.dataService.getRecentNews(6);
        
        container.innerHTML = recentNews.map(article => `
            <div class="news-item" onclick="window.platform.showNewsModal(${article.id})">
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

    loadCompaniesData() {
        this.loadCompaniesGrid();
        this.loadIndustryOverview();
    }

    loadCompaniesGrid() {
        const container = document.getElementById('companiesGrid');
        if (!container) return;

        const companies = this.dataService.companies;
        
        container.innerHTML = companies.map(company => `
            <div class="company-card" data-company-id="${company.id}">
                <div class="company-header">
                    <div class="company-logo">
                        <img src="${this.getCompanyLogoUrl(company.name)}" alt="${company.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="logo-fallback" style="display: none;">${company.name.charAt(0)}</div>
                    </div>
                    <div class="company-info">
                        <h3>${company.name}</h3>
                        <span class="company-industry">${company.industry.replace('-', ' ')}</span>
                    </div>
                </div>
                <div class="company-stats">
                    <div class="company-stat">
                        <span class="company-stat-value">${this.dataService.formatCurrency(company.valuation)}</span>
                        <span class="company-stat-label">Valuation</span>
                    </div>
                    <div class="company-stat">
                        <span class="company-stat-value">${company.employees}</span>
                        <span class="company-stat-label">Employees</span>
                    </div>
                </div>
                <div class="company-growth">
                    <div class="growth-indicator"></div>
                    <span>${company.growth_rate}% growth</span>
                </div>
            </div>
        `).join('');
    }

    loadIndustryOverview() {
        const industries = ['medical-imaging', 'digital-health', 'biotech'];
        
        industries.forEach(industry => {
            const companies = this.dataService.getCompaniesByIndustry(industry);
            const totalValuation = companies.reduce((sum, c) => sum + c.valuation, 0);
            const avgTechEmployees = companies.reduce((sum, c) => sum + c.technical_employees_pct, 0) / companies.length;
            
            const card = document.querySelector(`[data-industry="${industry}"]`);
            if (card) {
                card.querySelector('.company-count').textContent = `${companies.length} companies`;
                card.querySelector('.stat-value').textContent = this.dataService.formatCurrency(totalValuation);
                card.querySelector('.stat-label').textContent = 'Total Valuation';
                
                const techStat = card.querySelectorAll('.stat')[1];
                if (techStat) {
                    techStat.querySelector('.stat-value').textContent = `${Math.round(avgTechEmployees)}%`;
                    techStat.querySelector('.stat-label').textContent = 'Tech Employees';
                }
            }
        });
    }

    loadInvestmentsData() {
        this.createPortfolioChart();
        this.createTimelineChart();
        this.loadVCsGrid();
        this.createSectorTrendsChart();
    }

    createPortfolioChart() {
        const ctx = document.getElementById('portfolioChart');
        if (!ctx) return;

        const data = {
            labels: ['Medical Imaging', 'Digital Health', 'Biotech', 'Neurotechnology', 'Personalized Medicine'],
            datasets: [{
                data: [280, 150, 420, 1200, 180],
                backgroundColor: [
                    '#0066ff',
                    '#00d4aa',
                    '#ff6b35',
                    '#ff4757',
                    '#9c88ff'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        };

        const config = {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#0066ff',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: $${context.parsed}M`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        };

        this.charts.portfolio = new Chart(ctx, config);
    }

    createTimelineChart() {
        const ctx = document.getElementById('timelineChart');
        if (!ctx) return;

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const data = {
            labels: months,
            datasets: [{
                label: 'Investment Timeline',
                data: [45, 52, 38, 67, 89, 95],
                backgroundColor: 'rgba(0, 102, 255, 0.1)',
                borderColor: '#0066ff',
                borderWidth: 2,
                borderRadius: 4,
                borderSkipped: false
            }]
        };

        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#0066ff',
                        borderWidth: 1,
                        cornerRadius: 8
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11,
                                weight: '500'
                            },
                            color: '#737373'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 11,
                                weight: '500'
                            },
                            color: '#737373',
                            callback: function(value) {
                                return '$' + value + 'M';
                            }
                        }
                    }
                }
            }
        };

        this.charts.timeline = new Chart(ctx, config);
    }

    loadVCsGrid() {
        const container = document.getElementById('vcsGrid');
        if (!container) return;

        const vcs = this.dataService.getTopVCsByScore(6);
        
        container.innerHTML = vcs.map(vc => `
            <div class="vc-card" onclick="platform.showVCModal(${vc.id})">
                <div class="vc-header">
                    <div class="vc-logo">${vc.logo}</div>
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

    createSectorTrendsChart() {
        const ctx = document.getElementById('sectorTrendsChart');
        if (!ctx) return;

        const sectors = ['Medical Imaging', 'Digital Health', 'Biotech', 'Neurotechnology'];
        const data = {
            labels: sectors,
            datasets: [{
                label: 'Funding ($M)',
                data: [280, 150, 420, 1200],
                backgroundColor: [
                    'rgba(0, 102, 255, 0.8)',
                    'rgba(0, 212, 170, 0.8)',
                    'rgba(255, 107, 53, 0.8)',
                    'rgba(255, 71, 87, 0.8)'
                ],
                borderColor: [
                    '#0066ff',
                    '#00d4aa',
                    '#ff6b35',
                    '#ff4757'
                ],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false
            }]
        };

        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#0066ff',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return `Funding: $${context.parsed.y}M`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11,
                                weight: '500'
                            },
                            color: '#737373'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 11,
                                weight: '500'
                            },
                            color: '#737373',
                            callback: function(value) {
                                return '$' + value + 'M';
                            }
                        }
                    }
                }
            }
        };

        this.charts.sectorTrends = new Chart(ctx, config);
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
                        <div class="stat-label">Funding Raised</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${company.growth_rate}%</div>
                        <div class="stat-label">Growth Rate</div>
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
                        </div>
                    </div>
                </div>
            `;
            
            // Investors section
            modalContent += `
                <div class="company-section">
                    <h3>Key Investors</h3>
                    <div class="investors-list">
            `;
            
            company.investors.forEach(investor => {
                modalContent += `<span class="investor-tag" onclick="window.platform.showVCModal('${investor}')">${investor}</span>`;
            });
            
            modalContent += `
                    </div>
                </div>
            `;
            
            // News section
            modalContent += `
                <div class="company-section">
                    <h3>Recent News</h3>
                    <div class="news-list">
            `;
            
            try {
                const companyNews = this.dataService.getNewsByCompanyId(companyId);
                if (companyNews && companyNews.length > 0) {
                    companyNews.slice(0, 2).forEach(article => {
                        modalContent += `
                            <div class="news-item">
                                <h4>${article.headline}</h4>
                                <p>${article.content.substring(0, 150)}...</p>
                                <span class="news-date">${this.dataService.formatDate(article.published_at)}</span>
                            </div>
                        `;
                    });
                } else {
                    modalContent += '<div class="news-item"><p>No recent news available for this company.</p></div>';
                }
            } catch (newsError) {
                console.warn('Error loading news:', newsError);
                modalContent += '<div class="news-item"><p>No recent news available for this company.</p></div>';
            }
            
            modalContent += `
                    </div>
                </div>
                
                <div class="modal-actions">
                    <a href="${company.website}" target="_blank" class="modal-btn">
                        <i class="fas fa-external-link-alt"></i>
                        Visit Website
                    </a>
                </div>
            </div>
            `;
            
            content.innerHTML = modalContent;

            modal.classList.add('active');
        } catch (error) {
            console.error('Error showing company modal:', error);
            alert('Error loading company details. Please try again.');
        }
    }

    showVCModal(vcId) {
        const vc = this.dataService.getVCById(vcId);
        if (!vc) return;

        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');

        title.textContent = vc.name;
        content.innerHTML = `
            <div class="vc-modal">
                <div class="vc-header">
                    <div class="vc-logo-large">${vc.logo}</div>
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
                
                <div class="vc-stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${vc.final_score}</div>
                        <div class="stat-label">Final Score</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${vc.investments}</div>
                        <div class="stat-label">Investments</div>
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
                
                <div class="vc-section">
                    <h3>Focus Areas</h3>
                    <div class="focus-areas">
                        <span class="focus-tag">Healthcare</span>
                        <span class="focus-tag">Biotech</span>
                        <span class="focus-tag">Digital Health</span>
                        <span class="focus-tag">Medical Devices</span>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    showNewsModal(newsId) {
        console.log('showNewsModal called with ID:', newsId);
        const article = this.dataService.news.find(n => n.id === newsId);
        console.log('Article found:', article);
        if (!article) {
            console.error('Article not found with ID:', newsId);
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

        title.textContent = article.headline;
        
        // Generate expanded content for the full article
        const expandedContent = this.generateExpandedNewsContent(article);
        
        content.innerHTML = `
            <div class="news-modal">
                <div class="news-header">
                    <div class="news-meta">
                        <span class="news-category">${article.category}</span>
                        <span class="news-source">${article.source}</span>
                        <span class="news-date">${this.dataService.formatDate(article.published_at)}</span>
                        <span class="news-read-time">
                            <i class="fas fa-clock"></i>
                            ${article.read_time}
                        </span>
                    </div>
                </div>
                
                <div class="news-content-full">
                    <h2>${article.headline}</h2>
                    <div class="news-body">
                        ${expandedContent}
                    </div>
                </div>
                
                <div class="news-footer">
                    <div class="news-actions">
                        <a href="#" class="modal-btn secondary" onclick="window.open('https://${article.source.toLowerCase().replace(/\s+/g, '')}.com', '_blank')">
                            <i class="fas fa-external-link-alt"></i>
                            Read on ${article.source}
                        </a>
                    </div>
                </div>
            </div>
        `;

        console.log('About to show modal');
        modal.classList.add('active');
        console.log('Modal should now be visible');
    }
    
    generateExpandedNewsContent(article) {
        // Generate more detailed content based on the article type and company
        const company = this.dataService.getCompanyById(article.company_id);
        const companyName = company ? company.name : 'the company';
        
        let expandedContent = `<p>${article.content}</p>`;
        
        // Add more context based on category
        switch(article.category) {
            case 'funding':
                expandedContent += `
                    <p>This funding round represents a significant milestone for ${companyName} in the biotech industry. The investment will enable the company to accelerate its research and development efforts, expand its team, and bring innovative solutions to market faster.</p>
                    <p>The biotech sector continues to see strong investor interest, with companies focusing on AI-powered diagnostics, personalized medicine, and breakthrough therapies showing particular promise for future growth.</p>
                `;
                break;
            case 'product':
                expandedContent += `
                    <p>This product launch demonstrates ${companyName}'s commitment to addressing critical healthcare challenges. The new offering is expected to have a significant impact on patient outcomes and healthcare delivery efficiency.</p>
                    <p>Innovation in biotech products continues to drive the industry forward, with companies leveraging cutting-edge technology to create solutions that improve both patient care and healthcare provider capabilities.</p>
                `;
                break;
            case 'partnership':
                expandedContent += `
                    <p>This strategic partnership represents a significant opportunity for ${companyName} to leverage complementary strengths and accelerate innovation in the biotech space. Such collaborations are becoming increasingly important as the industry evolves.</p>
                    <p>Partnerships in biotech often lead to breakthrough innovations by combining different areas of expertise, from research and development to commercialization and market access.</p>
                `;
                break;
            default:
                expandedContent += `
                    <p>This development highlights the dynamic nature of the biotech industry, where innovation and collaboration continue to drive progress in healthcare and life sciences.</p>
                `;
        }
        
        return expandedContent;
    }

    closeModal() {
        const modal = document.getElementById('modalOverlay');
        modal.classList.remove('active');
    }

    performSearch(query) {
        console.log('Performing search for:', query);
        
        if (!query.trim()) {
            this.clearSearchResults();
            return;
        }

        // Store search query for recent searches
        this.addToRecentSearches(query);

        // Search across all data types
        const companies = this.dataService.searchCompanies(query);
        const vcs = this.dataService.searchVCs(query);
        const news = this.dataService.searchNews(query);
        
        // Also search for funding rounds, investors, and other data
        const fundingRounds = this.dataService.searchFundingRounds(query);
        const investors = this.dataService.searchInvestors(query);

        console.log('Search results:', { companies, vcs, news, fundingRounds, investors });

        // Filter current page content if we're on a specific section
        this.filterCurrentPageContent(query);

        this.showSearchResults({ 
            companies, 
            vcs, 
            news, 
            fundingRounds, 
            investors,
            query 
        });
    }

    showSearchResults(results) {
        // Create or update search results overlay
        let searchOverlay = document.getElementById('searchOverlay');
        if (!searchOverlay) {
            searchOverlay = document.createElement('div');
            searchOverlay.id = 'searchOverlay';
            searchOverlay.className = 'search-overlay';
            document.body.appendChild(searchOverlay);
        }

        const { companies, vcs, news, fundingRounds, investors, query } = results;
        const totalResults = companies.length + vcs.length + news.length + fundingRounds.length + investors.length;
        
        searchOverlay.innerHTML = `
            <div class="search-results">
                <div class="search-results-header">
                    <div class="search-header-info">
                        <h3>Search Results</h3>
                        <span class="search-count">${totalResults} results for "${query}"</span>
                    </div>
                    <button class="search-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="search-results-content">
                    ${companies.length > 0 ? `
                        <div class="search-section">
                            <h4><i class="fas fa-building"></i> Companies (${companies.length})</h4>
                            <div class="search-items">
                                ${companies.slice(0, 8).map(company => `
                                    <div class="search-item" onclick="if(window.platform) { window.platform.showCompanyModal(${company.id}); } this.parentElement.parentElement.parentElement.parentElement.remove();">
                                        <div class="search-item-logo">${company.logo}</div>
                                        <div class="search-item-info">
                                            <div class="search-item-name">${this.highlightSearchTerm(company.name, query)}</div>
                                            <div class="search-item-desc">${company.industry.replace('-', ' ')} • ${company.location}</div>
                                            <div class="search-item-meta">${company.last_funding_round} • ${this.dataService.formatCurrency(company.funding_raised)}</div>
                                        </div>
                                        <i class="fas fa-arrow-right search-item-arrow"></i>
                                    </div>
                                `).join('')}
                                ${companies.length > 8 ? `<div class="search-more">+${companies.length - 8} more companies</div>` : ''}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${vcs.length > 0 ? `
                        <div class="search-section">
                            <h4><i class="fas fa-hand-holding-usd"></i> Venture Capital (${vcs.length})</h4>
                            <div class="search-items">
                                ${vcs.slice(0, 5).map(vc => `
                                    <div class="search-item" onclick="if(window.platform) { window.platform.showVCModal(${vc.id}); } this.parentElement.parentElement.parentElement.parentElement.remove();">
                                        <div class="search-item-logo">${vc.logo}</div>
                                        <div class="search-item-info">
                                            <div class="search-item-name">${this.highlightSearchTerm(vc.name, query)}</div>
                                            <div class="search-item-desc">${vc.location} • ${vc.investments} investments</div>
                                            <div class="search-item-meta">Focus: ${vc.focus_areas.join(', ')}</div>
                                        </div>
                                        <i class="fas fa-arrow-right search-item-arrow"></i>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${fundingRounds.length > 0 ? `
                        <div class="search-section">
                            <h4><i class="fas fa-dollar-sign"></i> Funding Rounds (${fundingRounds.length})</h4>
                            <div class="search-items">
                                ${fundingRounds.slice(0, 5).map(round => `
                                    <div class="search-item" onclick="if(window.platform) { window.platform.showFundingModal(${round.id}); } this.parentElement.parentElement.parentElement.parentElement.remove();">
                                        <div class="search-item-logo">💰</div>
                                        <div class="search-item-info">
                                            <div class="search-item-name">${this.highlightSearchTerm(round.company_name, query)}</div>
                                            <div class="search-item-desc">${round.round_type} • ${this.dataService.formatCurrency(round.amount)}</div>
                                            <div class="search-item-meta">${round.date} • ${round.industry}</div>
                                        </div>
                                        <i class="fas fa-arrow-right search-item-arrow"></i>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${news.length > 0 ? `
                        <div class="search-section">
                            <h4><i class="fas fa-newspaper"></i> News (${news.length})</h4>
                            <div class="search-items">
                                ${news.slice(0, 5).map(article => `
                                    <div class="search-item" onclick="if(window.platform) { window.platform.showNewsModal(${article.id}); } this.parentElement.parentElement.parentElement.parentElement.remove();">
                                        <div class="search-item-info">
                                            <div class="search-item-name">${this.highlightSearchTerm(article.headline, query)}</div>
                                            <div class="search-item-desc">${article.source} • ${this.dataService.formatDate(article.published_at)}</div>
                                            <div class="search-item-meta">${article.category}</div>
                                        </div>
                                        <i class="fas fa-arrow-right search-item-arrow"></i>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${totalResults === 0 ? `
                        <div class="search-no-results">
                            <div class="no-results-icon">🔍</div>
                            <h4>No results found</h4>
                            <p>Try searching for:</p>
                            <ul>
                                <li>Company names (e.g., "MediTech", "BioNTech")</li>
                                <li>Industries (e.g., "biotech", "digital health")</li>
                                <li>Locations (e.g., "San Francisco", "Boston")</li>
                                <li>Funding stages (e.g., "Series A", "Seed")</li>
                                <li>VC firms (e.g., "Sequoia", "Andreessen")</li>
                            </ul>
                        </div>
                    ` : ''}
                </div>
                
                ${totalResults > 0 ? `
                    <div class="search-footer">
                        <div class="search-shortcuts">
                            <span>Press <kbd>Esc</kbd> to close</span>
                            <span>Press <kbd>Enter</kbd> to search</span>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        searchOverlay.style.display = 'block';
    }

    clearSearchResults() {
        const searchOverlay = document.getElementById('searchOverlay');
        if (searchOverlay) {
            searchOverlay.style.display = 'none';
        }
        
        // Clear any page filtering
        this.clearPageFiltering();
    }

    // Helper methods for enhanced search
    highlightSearchTerm(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    addToRecentSearches(query) {
        let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        recentSearches = recentSearches.filter(search => search !== query);
        recentSearches.unshift(query);
        recentSearches = recentSearches.slice(0, 10); // Keep only 10 recent searches
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }

    showRecentSearches() {
        const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        if (recentSearches.length === 0) return;

        let searchOverlay = document.getElementById('searchOverlay');
        if (!searchOverlay) {
            searchOverlay = document.createElement('div');
            searchOverlay.id = 'searchOverlay';
            searchOverlay.className = 'search-overlay';
            document.body.appendChild(searchOverlay);
        }

        searchOverlay.innerHTML = `
            <div class="search-results">
                <div class="search-results-header">
                    <div class="search-header-info">
                        <h3>Recent Searches</h3>
                        <span class="search-count">${recentSearches.length} recent searches</span>
                    </div>
                    <button class="search-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="search-results-content">
                    <div class="search-section">
                        <div class="search-items">
                            ${recentSearches.map(search => `
                                <div class="search-item recent-search" onclick="document.getElementById('globalSearch').value='${search}'; if(window.platform) { window.platform.performSearch('${search}'); }">
                                    <div class="search-item-logo">🔍</div>
                                    <div class="search-item-info">
                                        <div class="search-item-name">${search}</div>
                                    </div>
                                    <i class="fas fa-arrow-right search-item-arrow"></i>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        searchOverlay.style.display = 'block';
    }

    filterCurrentPageContent(query) {
        // Filter content on the current page based on search query
        const currentSection = document.querySelector('.content-section.active');
        if (!currentSection) return;

        const searchTerm = query.toLowerCase();
        
        // Filter company cards
        const companyCards = currentSection.querySelectorAll('.company-card');
        companyCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            if (cardText.includes(searchTerm)) {
                card.style.display = 'block';
                card.classList.add('search-highlight');
            } else {
                card.style.display = 'none';
            }
        });

        // Filter funding items
        const fundingItems = currentSection.querySelectorAll('.funding-item');
        fundingItems.forEach(item => {
            const itemText = item.textContent.toLowerCase();
            if (itemText.includes(searchTerm)) {
                item.style.display = 'block';
                item.classList.add('search-highlight');
            } else {
                item.style.display = 'none';
            }
        });

        // Filter news items
        const newsItems = currentSection.querySelectorAll('.news-item');
        newsItems.forEach(item => {
            const itemText = item.textContent.toLowerCase();
            if (itemText.includes(searchTerm)) {
                item.style.display = 'block';
                item.classList.add('search-highlight');
            } else {
                item.style.display = 'none';
            }
        });
    }

    clearPageFiltering() {
        // Remove search highlighting and restore all content
        document.querySelectorAll('.search-highlight').forEach(element => {
            element.classList.remove('search-highlight');
        });
        
        document.querySelectorAll('[style*="display: none"]').forEach(element => {
            if (element.classList.contains('company-card') || 
                element.classList.contains('funding-item') || 
                element.classList.contains('news-item')) {
                element.style.display = '';
            }
        });
    }

    navigateSearchResults(direction) {
        const searchItems = document.querySelectorAll('.search-item');
        if (searchItems.length === 0) return;

        const activeItem = document.querySelector('.search-item.active');
        let newIndex = 0;

        if (activeItem) {
            const currentIndex = Array.from(searchItems).indexOf(activeItem);
            if (direction === 'down') {
                newIndex = Math.min(currentIndex + 1, searchItems.length - 1);
            } else {
                newIndex = Math.max(currentIndex - 1, 0);
            }
        }

        searchItems.forEach(item => item.classList.remove('active'));
        searchItems[newIndex]?.classList.add('active');
    }

    updateChartColors() {
        // Update chart colors based on current theme
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#ffffff' : '#1a1a1a';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
        
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.options) {
                if (chart.options.scales) {
                    Object.values(chart.options.scales).forEach(scale => {
                        if (scale.grid) {
                            scale.grid.color = gridColor;
                        }
                        if (scale.ticks) {
                            scale.ticks.color = textColor;
                        }
                    });
                }
                chart.update();
            }
        });
    }

    updateActiveButton(activeBtn, selector) {
        document.querySelectorAll(selector).forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    updateChartTimeframe(period) {
        // Update chart data based on timeframe
        if (this.charts.investmentTrends) {
            const yearData = {
                '6m': [45, 52, 38, 67, 89, 95],
                '1y': [45, 52, 38, 67, 89, 95, 78, 102, 85, 76, 88, 95],
                '2y': [30, 35, 28, 45, 52, 38, 67, 89, 95, 78, 102, 85, 76, 88, 95, 110, 95, 88, 102, 115, 98, 105, 112, 120],
                'all': [20, 25, 30, 35, 28, 45, 52, 38, 67, 89, 95, 78, 102, 85, 76, 88, 95, 110, 95, 88, 102, 115, 98, 105, 112, 120, 125, 118, 130, 135]
            };
            
            const months = {
                '6m': ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                '1y': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                '2y': ['Jan 23', 'Feb 23', 'Mar 23', 'Apr 23', 'May 23', 'Jun 23', 'Jul 23', 'Aug 23', 'Sep 23', 'Oct 23', 'Nov 23', 'Dec 23', 'Jan 24', 'Feb 24', 'Mar 24', 'Apr 24', 'May 24', 'Jun 24', 'Jul 24', 'Aug 24', 'Sep 24', 'Oct 24', 'Nov 24', 'Dec 24'],
                'all': ['2020', '2021', '2022', '2023', '2024', '2025']
            };
            
            this.charts.investmentTrends.data.labels = months[period] || months['1y'];
            this.charts.investmentTrends.data.datasets[0].data = yearData[period] || yearData['1y'];
            this.charts.investmentTrends.update();
        }
    }

    updateChartType(type) {
        // Update chart type (line/bar)
        if (this.charts.investmentTrends) {
            this.charts.investmentTrends.config.type = type;
            this.charts.investmentTrends.update();
        }
    }

    updateTrendMetric(metric) {
        // Update trend chart metric
        if (this.charts.sectorTrends) {
            const metricData = {
                'funding': [280, 150, 420, 1200],
                'deals': [12, 8, 15, 25],
                'valuation': [1.2, 0.8, 2.1, 3.5]
            };
            
            this.charts.sectorTrends.data.datasets[0].data = metricData[metric] || metricData['funding'];
            this.charts.sectorTrends.update();
        }
    }

    updateInvestmentTimeframe(range) {
        // Update investment charts based on timeframe
        if (this.charts.portfolio) {
            const rangeData = {
                'ytd': [180, 120, 280, 800, 150],
                '1y': [280, 150, 420, 1200, 180],
                '2y': [350, 200, 550, 1500, 250]
            };
            
            this.charts.portfolio.data.datasets[0].data = rangeData[range] || rangeData['1y'];
            this.charts.portfolio.update();
        }
        
        if (this.charts.timeline) {
            const timelineData = {
                'ytd': [25, 35, 28, 45, 52, 38],
                '1y': [45, 52, 38, 67, 89, 95],
                '2y': [30, 35, 28, 45, 52, 38, 67, 89, 95, 78, 102, 85]
            };
            
            this.charts.timeline.data.datasets[0].data = timelineData[range] || timelineData['1y'];
            this.charts.timeline.update();
        }
    }

    toggleView(view) {
        // Toggle between grid/list view
        const companiesGrid = document.getElementById('companiesGrid');
        if (companiesGrid) {
            if (view === 'list') {
                companiesGrid.style.gridTemplateColumns = '1fr';
                companiesGrid.classList.add('list-view');
            } else {
                companiesGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(350px, 1fr))';
                companiesGrid.classList.remove('list-view');
            }
        }
    }

    handleViewAllClick(button) {
        // Determine which section the View All button belongs to
        const card = button.closest('.activity-card');
        if (card) {
            const cardTitle = card.querySelector('h3').textContent;
            
            if (cardTitle.includes('Recent Funding Rounds')) {
                this.switchSection('companies');
            } else if (cardTitle.includes('Top Performers')) {
                this.switchSection('companies');
            } else if (cardTitle.includes('Latest Industry News')) {
                // Show all news in a modal
                this.showAllNews();
            }
        }
    }

    showAllNews() {
        const allNews = this.dataService.news;
        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');

        title.textContent = 'All Industry News';
        content.innerHTML = `
            <div class="all-news-modal">
                ${allNews.map(article => `
                    <div class="news-item-detailed" onclick="window.platform.showNewsModal(${article.id})">
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
                `).join('')}
            </div>
        `;

        modal.classList.add('active');
    }

    filterCompaniesByIndustry(industry) {
        // Filter companies by industry
        const companiesGrid = document.getElementById('companiesGrid');
        if (!companiesGrid) return;

        const allCompanies = this.dataService.companies;
        const filteredCompanies = industry ? 
            allCompanies.filter(company => company.industry === industry) : 
            allCompanies;

        companiesGrid.innerHTML = filteredCompanies.map(company => `
            <div class="company-card" data-company-id="${company.id}">
                <div class="company-header">
                    <div class="company-logo">
                        <img src="${this.getCompanyLogoUrl(company.name)}" alt="${company.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="logo-fallback" style="display: none;">${company.name.charAt(0)}</div>
                    </div>
                    <div class="company-info">
                        <h3>${company.name}</h3>
                        <span class="company-industry">${company.industry.replace('-', ' ')}</span>
                    </div>
                </div>
                <div class="company-stats">
                    <div class="company-stat">
                        <span class="company-stat-value">${this.dataService.formatCurrency(company.valuation)}</span>
                        <span class="company-stat-label">Valuation</span>
                    </div>
                    <div class="company-stat">
                        <span class="company-stat-value">${company.employees}</span>
                        <span class="company-stat-label">Employees</span>
                    </div>
                </div>
                <div class="company-growth">
                    <div class="growth-indicator"></div>
                    <span>${company.growth_rate}% growth</span>
                </div>
            </div>
        `).join('');
    }

    filterNewsByCategory(category) {
        // Filter news by category
        const newsGrid = document.getElementById('latestNewsGrid');
        if (!newsGrid) return;

        const allNews = this.dataService.news;
        const filteredNews = category === 'all' ? 
            allNews : 
            allNews.filter(article => article.category === category);

        newsGrid.innerHTML = filteredNews.slice(0, 6).map(article => `
            <div class="news-item" onclick="window.platform.showNewsModal(${article.id})">
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
}

// Initialize the platform when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing platform...');
    window.platform = new ModernBiotechPlatform();
    console.log('Platform initialized:', window.platform);
});

// Fallback initialization if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
    console.log('Waiting for DOM to load...');
} else {
    // DOM is already loaded, initialize immediately
    console.log('DOM already loaded, initializing platform immediately...');
    window.platform = new ModernBiotechPlatform();
    console.log('Platform initialized:', window.platform);
}

// Test function to verify platform is working
window.testPlatform = () => {
    console.log('Testing platform...');
    if (window.platform) {
        console.log('Platform exists');
        window.platform.showCompanyModal(1);
    } else {
        console.log('Platform not found');
    }
};

// Platform initialization is handled above

// Add some additional utility functions
window.addEventListener('resize', () => {
    // Resize charts on window resize
    Object.values(window.platform?.charts || {}).forEach(chart => {
        if (chart && typeof chart.resize === 'function') {
            chart.resize();
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        window.platform?.closeModal();
    }
});
