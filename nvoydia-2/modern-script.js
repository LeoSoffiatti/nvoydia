// Updated at 1759111913
// Modern Digital Natives Intelligence Platform - Interactive JavaScript

class ModernDigitalNativesPlatform {
    constructor() {
        console.log('Creating ModernDigitalNativesPlatform...');
        this.dataService = new DataService();
        console.log('DataService created:', this.dataService);
        console.log('Companies loaded:', this.dataService.companies.length);
        
        this.currentSection = 'dashboard';
        this.charts = {};
        this.modals = {};
        this.chartRetryCount = 0;
        this.maxChartRetries = 10;
        
        this.init();
    }

    init() {
        console.log('Initializing platform...');
        this.setupEventListeners();
        this.loadDashboardData();
        this.setupThemeToggle();
        this.setupSearch();
        console.log('Platform initialization complete');
        console.log('Theme toggle button found:', document.getElementById('themeToggle'));
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

        // Executives modal controls
        const executivesModalOverlay = document.getElementById('executivesModalOverlay');
        const executivesModalClose = document.getElementById('executivesModalClose');
        
        executivesModalClose?.addEventListener('click', () => {
            this.closeExecutivesModal();
        });
        
        executivesModalOverlay?.addEventListener('click', (e) => {
            if (e.target === executivesModalOverlay) {
                this.closeExecutivesModal();
            }
        });

        // Chart controls
        this.setupChartControls();
        
        // View toggles
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = btn.dataset.view;
                this.toggleView(view);
                this.updateActiveButton(e.target, '.toggle-btn');
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

        // Funding filter
        const fundingFilter = document.getElementById('fundingFilter');
        fundingFilter?.addEventListener('change', (e) => {
            this.filterCompaniesByFunding(e.target.value);
        });

        // Date filter
        const dateFilter = document.getElementById('dateFilter');
        dateFilter?.addEventListener('change', (e) => {
            this.filterCompaniesByDate(e.target.value);
        });

        // VC filter
        const vcFilter = document.getElementById('vcFilter');
        vcFilter?.addEventListener('change', (e) => {
            this.filterCompaniesByVC(e.target.value);
        });

        // Download non-partners button
        const downloadBtn = document.getElementById('downloadNonPartners');
        downloadBtn?.addEventListener('click', () => {
            this.downloadNonPartnersCSV();
        });

        // News category filters
        document.querySelectorAll('.news-filters .filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = btn.dataset.category;
                this.filterNewsByCategory(category);
                this.updateActiveButton(e.target, '.news-filters .filter-btn');
            });
        });

        // VC portfolio filters
        document.querySelectorAll('.portfolio-filters .filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const vc = btn.dataset.vc;
                this.filterVCPortfolio(vc);
                this.updateActiveButton(e.target, '.portfolio-filters .filter-btn');
            });
        });
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        // Set initial theme
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        // Set initial icon
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
        
        themeToggle?.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Apply theme immediately
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icon
            const icon = themeToggle.querySelector('i');
            icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            
            // Update chart colors for dark mode
            this.updateChartColors();
            
            console.log('Theme switched to:', newTheme);
        });
    }

    setupSearch() {
        console.log('Setting up search...');
        const searchInput = document.getElementById('globalSearch');

        if (searchInput) {
            console.log('Search input found:', searchInput);
            
            // Keyboard shortcuts - only Enter opens search
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.openSearchPage(searchInput.value);
                }
            });

            // Click outside to close search page if open
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.search-container') && !e.target.closest('.search-overlay')) {
                    this.closeSearchPage();
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
        this.updateNCPProgress();
        
        // Wait for Chart.js to be available
        if (typeof Chart !== 'undefined') {
            this.createInvestmentTrendsChart();
        } else if (this.chartRetryCount < this.maxChartRetries) {
            this.chartRetryCount++;
            console.warn(`Chart.js not loaded yet, retrying... (${this.chartRetryCount}/${this.maxChartRetries})`);
            setTimeout(() => this.loadDashboardData(), 100);
            return;
        } else {
            console.error('Chart.js failed to load after maximum retries, showing fallback');
            this.showChartFallback('investmentTrendsChart');
        }
        
        this.loadRecentFunding();
        this.loadTopPerformers();
        this.loadLatestNews();
    }

    loadInvestmentsData() {
        // Wait for Chart.js to be available
        if (typeof Chart !== 'undefined') {
            this.createPortfolioChart();
            this.createTimelineChart();
            this.createSectorTrendsChart();
        } else {
            console.warn('Chart.js not loaded yet for investments, retrying...');
            setTimeout(() => this.loadInvestmentsData(), 100);
            return;
        }
        
        this.loadVCsGrid();
        this.loadVCPortfolio();
    }

    updateHeroStats() {
        const stats = this.dataService.getDashboardStats();
        const ncpProgress = this.dataService.getNCPProgress();
        
        document.getElementById('totalCompanies').textContent = stats.totalCompanies;
        document.getElementById('ncpProgress').textContent = `${ncpProgress.partnerPercentage}%`;
        document.getElementById('totalFunding').textContent = this.dataService.formatCurrency(stats.totalFunding);
        document.getElementById('aiNatives').textContent = ncpProgress.aiNatives;
    }

    updateNCPProgress() {
        const ncpProgress = this.dataService.getNCPProgress();
        
        // Update progress bars
        const partnerProgressBar = document.querySelector('.progress-card:nth-child(1) .progress-fill');
        const outreachProgressBar = document.querySelector('.progress-card:nth-child(2) .progress-fill');
        
        if (partnerProgressBar) {
            partnerProgressBar.style.width = `${ncpProgress.partnerPercentage}%`;
        }
        if (outreachProgressBar) {
            outreachProgressBar.style.width = `${ncpProgress.contactedPercentage}%`;
        }
        
        // Update progress stats
        const progressStats = document.querySelector('.progress-stats');
        if (progressStats) {
            progressStats.innerHTML = `
                <span class="progress-stat">${ncpProgress.partners} Partners</span>
                <span class="progress-stat">${ncpProgress.totalCompanies - ncpProgress.partners} Non-Partners</span>
                <span class="progress-stat">${ncpProgress.partnerPercentage}% Complete</span>
            `;
        }
        
        // Update progress details
        const premierPartners = this.dataService.companies.filter(c => c.partner_tier === 'Premier').length;
        const standardPartners = this.dataService.companies.filter(c => c.partner_tier === 'Standard').length;
        
        const progressDetails = document.querySelector('.progress-card:nth-child(1) .progress-details');
        if (progressDetails) {
            progressDetails.innerHTML = `
                <div class="progress-item">
                    <span class="progress-label">Premier Partners</span>
                    <span class="progress-value">${premierPartners}</span>
                </div>
                <div class="progress-item">
                    <span class="progress-label">Standard Partners</span>
                    <span class="progress-value">${standardPartners}</span>
                </div>
            `;
        }
        
        const contactedDetails = document.querySelector('.progress-card:nth-child(2) .progress-details');
        if (contactedDetails) {
            contactedDetails.innerHTML = `
                <div class="progress-item">
                    <span class="progress-label">Contacted</span>
                    <span class="progress-value">${ncpProgress.contacted}</span>
                </div>
                <div class="progress-item">
                    <span class="progress-label">Not Contacted</span>
                    <span class="progress-value">${ncpProgress.totalCompanies - ncpProgress.contacted}</span>
                </div>
            `;
        }
    }

    createInvestmentTrendsChart() {
        const ctx = document.getElementById('investmentTrendsChart');
        if (!ctx) {
            console.error('investmentTrendsChart canvas not found');
            return;
        }
        
        if (typeof Chart === 'undefined') {
            console.error('Chart.js library not loaded');
            return;
        }
        
        console.log('Creating investment trends chart...');

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

        try {
            this.charts.investmentTrends = new Chart(ctx, config);
            console.log('Investment trends chart created successfully');
        } catch (error) {
            console.error('Error creating investment trends chart:', error);
            this.showChartFallback('investmentTrendsChart');
        }
    }

    showChartFallback(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        // Create a simple fallback display
        canvas.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.className = 'chart-fallback';
        fallback.innerHTML = `
            <div class="fallback-content">
                <i class="fas fa-chart-line"></i>
                <h3>Chart Loading...</h3>
                <p>Investment trends data is being processed</p>
                <div class="fallback-stats">
                    <div class="stat">
                        <span class="stat-value">$2.4B</span>
                        <span class="stat-label">Total Funding</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">156</span>
                        <span class="stat-label">Deals</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">+23%</span>
                        <span class="stat-label">Growth</span>
                    </div>
                </div>
            </div>
        `;
        canvas.parentNode.appendChild(fallback);
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
        container.innerHTML = companies.map(company => this.renderCompanyCard(company)).join('');
    }

    loadIndustryOverview() {
        const industries = ['ai-natives', 'digital-natives', 'fintech'];
        
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

    loadVCPortfolio() {
        this.filterVCPortfolio('all');
    }

    createPortfolioChart() {
        const ctx = document.getElementById('portfolioChart');
        if (!ctx) return;

        const data = {
            labels: ['AI Natives', 'Digital Natives', 'Fintech', 'Social Media', 'Marketplace'],
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

        try {
            this.charts.portfolio = new Chart(ctx, config);
            console.log('Portfolio chart created successfully');
        } catch (error) {
            console.error('Error creating portfolio chart:', error);
        }
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

        try {
            this.charts.timeline = new Chart(ctx, config);
            console.log('Timeline chart created successfully');
        } catch (error) {
            console.error('Error creating timeline chart:', error);
        }
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

    createSectorTrendsChart() {
        const ctx = document.getElementById('sectorTrendsChart');
        if (!ctx) return;

        const sectors = ['AI Natives', 'Digital Natives', 'Fintech', 'Social Media'];
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

        try {
            this.charts.sectorTrends = new Chart(ctx, config);
            console.log('Sector trends chart created successfully');
        } catch (error) {
            console.error('Error creating sector trends chart:', error);
        }
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
            
            // NCP Status Section (First)
            modalContent += `
                <div class="ncp-status">
                    <div class="ncp-badge ${company.ncp_status === 'Partner' ? 'partner' : 'not-partner'}">
                        <i class="fas fa-${company.ncp_status === 'Partner' ? 'check-circle' : 'clock'}"></i>
                        <span>${company.ncp_status === 'Partner' ? 'NVIDIA Partner' : 'Not Partner'}</span>
                        ${company.partner_tier ? `<span class="ncp-tier">${company.partner_tier}</span>` : ''}
                    </div>
                    <div class="ncp-description">
                        ${company.ncp_status === 'Partner' ? 
                            `This company is an active NVIDIA Partner with ${company.partner_tier} tier status.` : 
                            'This company is not currently an NVIDIA Partner but may be a potential candidate.'
                        }
                    </div>
                    <div class="ncp-actions">
                        <button class="ncp-contact" onclick="platform.showExecutivesModal(${company.id})">
                            <i class="fas fa-users"></i>
                            View Executives & Email Templates
                        </button>
                        <a href="https://linkedin.com/company/${company.name.toLowerCase().replace(/\s+/g, '-')}" class="ncp-contact" target="_blank">
                            <i class="fab fa-linkedin"></i>
                            LinkedIn Profile
                        </a>
                    </div>
                </div>
            `;

            // Recent News Section (Second)
            const companyNews = company.news || [];
            if (companyNews.length > 0) {
                modalContent += `
                    <div class="company-section">
                        <h3>Recent News</h3>
                        <div class="news-list">
                            ${companyNews.map(article => `
                                <div class="news-item">
                                    <h4>${article.headline}</h4>
                                    <p>${article.summary}</p>
                                    <div class="news-date">${this.dataService.formatDate(article.published_at)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            // Stats grid
            modalContent += `
                <div class="company-stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${this.dataService.formatCurrency(company.valuation)}</div>
                        <div class="stat-label">Valuation</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${this.dataService.formatCurrency(company.funding?.amount || company.funding_raised)}</div>
                        <div class="stat-label">Latest Funding</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${company.vc_tier || 'N/A'}</div>
                        <div class="stat-label">VC Tier</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${company.funding?.round || company.last_funding_round}</div>
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
                        <span class="ncp-tier">${company.ncp_tier} Tier</span>
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
                            <div class="news-item" onclick="window.platform.showNewsModal(${article.id})">
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
        console.log('showVCModal called with ID:', vcId);
        try {
            const vc = this.dataService.getVCById(vcId);
            if (!vc) {
                console.error('VC not found with ID:', vcId);
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
            
            // Generate modal content step by step
            let modalContent = '<div class="company-modal">';
            
            // VC header
            modalContent += `
                <div class="company-header">
                    <div class="company-logo-large">
                        <img src="${this.getVCLogoUrl(vc.name)}" alt="${vc.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" onload="this.nextElementSibling.style.display='none';">
                        <div class="logo-fallback" style="display: flex;">${vc.name.charAt(0)}</div>
                    </div>
                    <div class="company-details">
                        <h2>${vc.name}</h2>
                        <p class="company-description">${vc.description}</p>
                        <div class="company-meta">
                            <span class="meta-item">
                                <i class="fas fa-map-marker-alt"></i>
                                ${vc.location}
                            </span>
                            <span class="meta-item">
                                <i class="fas fa-chart-line"></i>
                                ${vc.investment_stage}
                            </span>
                            <span class="meta-item">
                                <i class="fas fa-building"></i>
                                ${vc.portfolio_companies} portfolio companies
                            </span>
                            <span class="meta-item">
                                <i class="fas fa-dollar-sign"></i>
                                ${this.dataService.formatCurrency(vc.total_aum)} AUM
                            </span>
                        </div>
                    </div>
                </div>
            `;
            
            // VC stats section
            modalContent += `
                <div class="company-section">
                    <h3>Investment Statistics</h3>
                    <div class="vc-stats-list">
                        <div class="stat-row">
                            <div class="stat-label">
                                <i class="fas fa-star"></i>
                                Final Score
                            </div>
                            <div class="stat-value">${vc.final_score}</div>
                        </div>
                        <div class="stat-row">
                            <div class="stat-label">
                                <i class="fas fa-handshake"></i>
                                Total Investments
                            </div>
                            <div class="stat-value">${vc.investments}</div>
                        </div>
                        <div class="stat-row">
                            <div class="stat-label">
                                <i class="fas fa-building"></i>
                                Portfolio Companies
                            </div>
                            <div class="stat-value">${vc.portfolio_companies}</div>
                        </div>
                        <div class="stat-row">
                            <div class="stat-label">
                                <i class="fas fa-chart-pie"></i>
                                Assets Under Management
                            </div>
                            <div class="stat-value">${this.dataService.formatCurrency(vc.total_aum)}</div>
                        </div>
                    </div>
                </div>
            `;
            
            // Focus areas section
            modalContent += `
                <div class="company-section">
                    <h3>Focus Areas</h3>
                    <div class="focus-areas">
            `;
            
            if (vc.focus_areas && vc.focus_areas.length > 0) {
                vc.focus_areas.forEach(focus => {
                    modalContent += `<span class="focus-tag">${focus}</span>`;
                });
            } else {
                modalContent += `
                    <span class="focus-tag">Technology</span>
                    <span class="focus-tag">Digital Natives</span>
                    <span class="focus-tag">AI</span>
                `;
            }
            
            modalContent += `
                    </div>
                </div>
            `;
            
            // Portfolio companies section (if available)
            modalContent += `
                <div class="company-section">
                    <h3>Portfolio Highlights</h3>
                    <div class="portfolio-highlights">
                        <p>This venture capital firm has made ${vc.investments} investments across ${vc.portfolio_companies} portfolio companies, with a focus on ${vc.investment_stage} stage investments.</p>
                        <p>With ${this.dataService.formatCurrency(vc.total_aum)} in assets under management, they continue to be a leading investor in the digital natives ecosystem.</p>
                    </div>
                </div>
            `;
            
            modalContent += `
                <div class="modal-actions">
                    <a href="${vc.website}" target="_blank" class="modal-btn">
                        <i class="fas fa-external-link-alt"></i>
                        Visit Website
                    </a>
                </div>
            </div>
            `;
            
            content.innerHTML = modalContent;
            modal.classList.add('active');
        } catch (error) {
            console.error('Error showing VC modal:', error);
            alert('Error loading VC details. Please try again.');
        }
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
                    <p>This funding round represents a significant milestone for ${companyName} in the digital natives industry. The investment will enable the company to accelerate its research and development efforts, expand its team, and bring innovative solutions to market faster.</p>
                    <p>The digital natives sector continues to see strong investor interest, with companies focusing on AI-powered platforms, innovative user experiences, and breakthrough technologies showing particular promise for future growth.</p>
                `;
                break;
            case 'product':
                expandedContent += `
                    <p>This product launch demonstrates ${companyName}'s commitment to addressing critical healthcare challenges. The new offering is expected to have a significant impact on patient outcomes and healthcare delivery efficiency.</p>
                    <p>Innovation in digital native products continues to drive the industry forward, with companies leveraging cutting-edge technology to create solutions that improve both user experiences and business capabilities.</p>
                `;
                break;
            case 'partnership':
                expandedContent += `
                    <p>This strategic partnership represents a significant opportunity for ${companyName} to leverage complementary strengths and accelerate innovation in the digital natives space. Such collaborations are becoming increasingly important as the industry evolves.</p>
                    <p>Partnerships in digital natives often lead to breakthrough innovations by combining different areas of expertise, from technology development to user experience and market expansion.</p>
                `;
                break;
            default:
                expandedContent += `
                    <p>This development highlights the dynamic nature of the digital natives industry, where innovation and collaboration continue to drive progress in technology and user experience.</p>
                `;
        }
        
        return expandedContent;
    }

    closeModal() {
        const modal = document.getElementById('modalOverlay');
        modal.classList.remove('active');
    }

    showExecutivesModal(companyId) {
        const company = this.dataService.getCompanyById(companyId);
        if (!company) return;

        const executives = this.dataService.getCompanyExecutives(companyId);
        const modal = document.getElementById('executivesModalOverlay');
        const title = document.getElementById('executivesModalTitle');
        const content = document.getElementById('executivesModalContent');

        if (!modal || !title || !content) return;

        title.textContent = `${company.name} - Executives & Outreach`;

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
                    <div class="company-meta">
                        <span class="meta-item">
                            <i class="fas fa-industry"></i>
                            ${company.industry.replace('-', ' ')}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-handshake"></i>
                            ${company.ncp_status}
                        </span>
                    </div>
                </div>
            </div>
        `;

        if (executives.length > 0) {
            modalContent += `
                <div class="executives-section">
                    <h3>Key Executives</h3>
                    <div class="executives-grid">
                        ${executives.map(exec => `
                            <div class="executive-card">
                                <div class="executive-header">
                                    <h4>${exec.name}</h4>
                                    <span class="executive-title">${exec.title}</span>
                                </div>
                                <div class="executive-details">
                                    <div class="executive-contact">
                                        <a href="mailto:${exec.email}" class="contact-link">
                                            <i class="fas fa-envelope"></i>
                                            ${exec.email}
                                        </a>
                                        <a href="${exec.linkedin}" target="_blank" class="contact-link">
                                            <i class="fab fa-linkedin"></i>
                                            LinkedIn
                                        </a>
                                    </div>
                                    <div class="executive-department">
                                        <span class="department-badge">${exec.department}</span>
                                    </div>
                                </div>
                                <div class="email-templates">
                                    <h5>Email Templates</h5>
                                    <div class="template-buttons">
                                        <button class="template-btn" onclick="platform.generateEmail(${companyId}, '${exec.name}', 'ncp_intro')">
                                            <i class="fas fa-envelope"></i>
                                            NCP Introduction
                                        </button>
                                        <button class="template-btn" onclick="platform.generateEmail(${companyId}, '${exec.name}', 'follow_up')">
                                            <i class="fas fa-redo"></i>
                                            Follow Up
                                        </button>
                                        <button class="template-btn" onclick="platform.generateEmail(${companyId}, '${exec.name}', 'technical_focus')">
                                            <i class="fas fa-code"></i>
                                            Technical Focus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        if (executives.length === 0) {
            modalContent += `
                <div class="no-executives">
                    <div class="no-executives-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <h3>No Executive Data Available</h3>
                    <p>Executive contact information for ${company.name} is not currently available.</p>
                    <div class="fallback-contacts">
                        <a href="mailto:contact@${company.name.toLowerCase().replace(/\s+/g, '')}.com" class="contact-btn">
                            <i class="fas fa-envelope"></i>
                            Contact Company
                        </a>
                        <a href="${company.website}" target="_blank" class="contact-btn">
                            <i class="fas fa-globe"></i>
                            Visit Website
                        </a>
                    </div>
                </div>
            `;
        }

        // Add custom email template section
        modalContent += `
            <div class="custom-email-section">
                <h3>Custom Email Template</h3>
                <div class="custom-email-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="executiveName">Executive Name:</label>
                            <input type="text" id="executiveName" placeholder="Enter executive name">
                        </div>
                        <div class="form-group">
                            <label for="executiveTitle">Position:</label>
                            <input type="text" id="executiveTitle" placeholder="Enter position/title">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="emailTemplate">Email Template:</label>
                        <textarea id="emailTemplate" rows="12" placeholder="Enter your custom email template...">${this.generateCustomTemplate(company)}</textarea>
                    </div>
                    <div class="form-actions">
                        <button class="generate-btn" onclick="platform.generateCustomEmail(${companyId})">
                            <i class="fas fa-magic"></i>
                            Generate Custom Email
                        </button>
                        <button class="preview-btn" onclick="platform.previewCustomEmail(${companyId})">
                            <i class="fas fa-eye"></i>
                            Preview Email
                        </button>
                    </div>
                </div>
            </div>
        `;

        modalContent += '</div>';
        content.innerHTML = modalContent;
        modal.classList.add('active');
    }

    closeExecutivesModal() {
        const modal = document.getElementById('executivesModalOverlay');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    generateEmail(companyId, executiveName, templateType) {
        const emailData = this.dataService.generatePersonalizedEmail(companyId, executiveName, templateType);
        if (!emailData) return;

        // Create email modal
        const emailModal = document.createElement('div');
        emailModal.className = 'email-modal-overlay';
        emailModal.innerHTML = `
            <div class="email-modal">
                <div class="email-modal-header">
                    <h3>Generated Email for ${executiveName}</h3>
                    <button class="email-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="email-modal-content">
                    <div class="email-field">
                        <label>To:</label>
                        <input type="email" value="${executiveName}" readonly>
                    </div>
                    <div class="email-field">
                        <label>Subject:</label>
                        <input type="text" value="${emailData.subject}" readonly>
                    </div>
                    <div class="email-field">
                        <label>Body:</label>
                        <textarea readonly rows="15">${emailData.body}</textarea>
                    </div>
                    <div class="email-actions">
                        <button class="copy-btn" onclick="platform.copyCustomEmail('${emailData.subject}', '${emailData.body.replace(/\n/g, '\\n')}')">
                            <i class="fas fa-copy"></i>
                            Copy Email
                        </button>
                        <a href="mailto:${executiveName}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}" class="send-btn">
                            <i class="fas fa-paper-plane"></i>
                            Open in Email Client
                        </a>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(emailModal);
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            // Show success message
            const notification = document.createElement('div');
            notification.className = 'copy-notification';
            notification.textContent = 'Email copied to clipboard!';
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    copyCustomEmail(subject, body) {
        const fullEmail = subject + '\n\n' + body;
        navigator.clipboard.writeText(fullEmail).then(() => {
            // Show success message
            const notification = document.createElement('div');
            notification.className = 'copy-notification';
            notification.textContent = 'Email copied to clipboard!';
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    generateCustomTemplate(company) {
        const industry = company.industry.replace('-', ' ');
        const recentNews = company.news?.[0]?.headline || 'innovative developments';
        const ncpStatus = company.ncp_status === 'Partner' ? 'current NVIDIA Partner' : 'potential NVIDIA Partner';
        
        return `Hi [EXECUTIVE_NAME],

I hope this email finds you well. I'm reaching out from NVIDIA to discuss a potential partnership opportunity that could significantly benefit ${company.name}.

Given ${company.name}'s impressive growth in the ${industry} space and your recent ${recentNews}, I believe there's a strong alignment for collaboration through our NVIDIA Partner Program (NCP).

As [POSITION] at ${company.name}, you understand the importance of cutting-edge technology in driving innovation. The NCP offers:

• Access to NVIDIA's latest AI and GPU technologies
• Co-marketing opportunities and joint go-to-market strategies  
• Technical support and training for your engineering teams
• Priority access to new NVIDIA products and solutions
• Partnership with other industry leaders in our ecosystem

${company.ncp_status === 'Partner' ? 
    'Since ' + company.name + ' is already a ' + company.partner_tier + ' tier partner, I\'d love to explore how we can deepen our collaboration and unlock new opportunities together.' :
    'I believe ' + company.name + ' would be an excellent addition to our partner ecosystem, and I\'d love to discuss how we can work together.'
}

Would you be available for a brief 15-minute call next week to explore this opportunity?

Best regards,
[YOUR_NAME]
NVIDIA Partner Development

P.S. I've attached some materials about our partner program and recent success stories that might be of interest.`;
    }

    generateCustomEmail(companyId) {
        const company = this.dataService.getCompanyById(companyId);
        if (!company) return;

        const executiveName = document.getElementById('executiveName')?.value || '[EXECUTIVE_NAME]';
        const executiveTitle = document.getElementById('executiveTitle')?.value || '[POSITION]';
        const template = document.getElementById('emailTemplate')?.value || '';

        if (!template.trim()) {
            alert('Please enter an email template first.');
            return;
        }

        // Replace placeholders
        const personalizedTemplate = template
            .replace(/\[EXECUTIVE_NAME\]/g, executiveName)
            .replace(/\[POSITION\]/g, executiveTitle)
            .replace(/\[YOUR_NAME\]/g, 'Your Name');

        // Generate subject line
        const subject = `Partnership Opportunity: NVIDIA Partner Program - ${company.name}`;

        // Create email modal
        const emailModal = document.createElement('div');
        emailModal.className = 'email-modal-overlay';
        emailModal.innerHTML = `
            <div class="email-modal">
                <div class="email-modal-header">
                    <h3>Custom Email for ${executiveName}</h3>
                    <button class="email-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="email-modal-content">
                    <div class="email-field">
                        <label>To:</label>
                        <input type="email" value="${executiveName}" readonly>
                    </div>
                    <div class="email-field">
                        <label>Subject:</label>
                        <input type="text" value="${subject}" readonly>
                    </div>
                    <div class="email-field">
                        <label>Body:</label>
                        <textarea readonly rows="15">${personalizedTemplate}</textarea>
                    </div>
                    <div class="email-actions">
                        <button class="copy-btn" onclick="platform.copyCustomEmail('${subject}', '${personalizedTemplate.replace(/\n/g, '\\n')}')">
                            <i class="fas fa-copy"></i>
                            Copy Email
                        </button>
                        <a href="mailto:${executiveName}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(personalizedTemplate)}" class="send-btn">
                            <i class="fas fa-paper-plane"></i>
                            Open in Email Client
                        </a>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(emailModal);
    }

    previewCustomEmail(companyId) {
        const company = this.dataService.getCompanyById(companyId);
        if (!company) return;

        const executiveName = document.getElementById('executiveName')?.value || '[EXECUTIVE_NAME]';
        const executiveTitle = document.getElementById('executiveTitle')?.value || '[POSITION]';
        const template = document.getElementById('emailTemplate')?.value || '';

        if (!template.trim()) {
            alert('Please enter an email template first.');
            return;
        }

        // Replace placeholders for preview
        const previewTemplate = template
            .replace(/\[EXECUTIVE_NAME\]/g, executiveName)
            .replace(/\[POSITION\]/g, executiveTitle)
            .replace(/\[YOUR_NAME\]/g, 'Your Name');

        // Create preview modal
        const previewModal = document.createElement('div');
        previewModal.className = 'email-modal-overlay';
        previewModal.innerHTML = `
            <div class="email-modal">
                <div class="email-modal-header">
                    <h3>Email Preview</h3>
                    <button class="email-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="email-modal-content">
                    <div class="preview-content">
                        <h4>To: ${executiveName}</h4>
                        <h4>Subject: Partnership Opportunity: NVIDIA Partner Program - ${company.name}</h4>
                        <div class="preview-body">
                            ${previewTemplate.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(previewModal);
    }

    openSearchPage(query) {
        console.log('Opening search page for:', query);
        
        // Create or show search overlay
        let searchOverlay = document.getElementById('searchOverlay');
        if (!searchOverlay) {
            searchOverlay = document.createElement('div');
            searchOverlay.id = 'searchOverlay';
            searchOverlay.className = 'search-overlay';
            document.body.appendChild(searchOverlay);
        }

        // Store search query for recent searches
        if (query.trim()) {
            this.addToRecentSearches(query);
        }

        // Show search page with input and results
        this.showSearchPage(query);
    }

    closeSearchPage() {
        const searchOverlay = document.getElementById('searchOverlay');
        if (searchOverlay) {
            searchOverlay.style.display = 'none';
        }
    }

    showSearchPage(initialQuery) {
        const searchOverlay = document.getElementById('searchOverlay');
        
        searchOverlay.innerHTML = `
            <div class="search-page">
                <div class="search-page-header">
                    <div class="search-page-input-container">
                        <i class="fas fa-search"></i>
                        <input type="text" id="searchPageInput" placeholder="Search companies, VCs, news..." value="${initialQuery || ''}" autofocus>
                        <button class="search-page-close" onclick="window.platform.closeSearchPage()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="search-page-content" id="searchPageContent">
                    ${initialQuery ? this.generateSearchResults(initialQuery) : this.generateEmptySearchState()}
                </div>
            </div>
        `;
        
        searchOverlay.style.display = 'flex';
        
        // Set up the search page input
        const searchPageInput = document.getElementById('searchPageInput');
        if (searchPageInput) {
            searchPageInput.addEventListener('input', (e) => {
                this.updateSearchPageResults(e.target.value);
            });
            
            searchPageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeSearchPage();
                }
            });
        }
    }

    updateSearchPageResults(query) {
        const content = document.getElementById('searchPageContent');
        if (!content) return;
        
        if (!query.trim()) {
            content.innerHTML = this.generateEmptySearchState();
            return;
        }
        
        content.innerHTML = this.generateSearchResults(query);
    }

    generateEmptySearchState() {
        const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        
        return `
            <div class="search-empty-state">
                <div class="search-empty-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>Search Digital Natives Intelligence</h3>
                <p>Find digital natives companies, AI startups, investors, and industry news</p>
                
                ${recentSearches.length > 0 ? `
                    <div class="recent-searches-section">
                        <h4>Recent Searches</h4>
                        <div class="recent-searches-list">
                            ${recentSearches.slice(0, 5).map(search => `
                                <div class="recent-search-item" onclick="document.getElementById('searchPageInput').value='${search}'; window.platform.updateSearchPageResults('${search}');">
                                    <i class="fas fa-history"></i>
                                    <span>${search}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="search-suggestions">
                    <h4>Try searching for:</h4>
                    <div class="suggestion-tags">
                        <span class="suggestion-tag" onclick="document.getElementById('searchPageInput').value='AI'; window.platform.updateSearchPageResults('AI');">AI</span>
                        <span class="suggestion-tag" onclick="document.getElementById('searchPageInput').value='digital natives'; window.platform.updateSearchPageResults('digital natives');">digital natives</span>
                        <span class="suggestion-tag" onclick="document.getElementById('searchPageInput').value='Series A'; window.platform.updateSearchPageResults('Series A');">Series A</span>
                        <span class="suggestion-tag" onclick="document.getElementById('searchPageInput').value='fintech'; window.platform.updateSearchPageResults('fintech');">fintech</span>
                    </div>
                </div>
            </div>
        `;
    }

    generateSearchResults(query) {
        // Search across all data types
        const companies = this.dataService.searchCompanies(query);
        const vcs = this.dataService.searchVCs(query);
        const news = this.dataService.searchNews(query);
        const fundingRounds = this.dataService.searchFundingRounds(query);
        const investors = this.dataService.searchInvestors(query);
        
        const totalResults = companies.length + vcs.length + news.length + fundingRounds.length + investors.length;
        
        if (totalResults === 0) {
            return `
                <div class="search-no-results">
                    <div class="no-results-icon">🔍</div>
                    <h3>No results found for "${query}"</h3>
                    <p>Try different keywords or check your spelling</p>
                </div>
            `;
        }
        
        return `
            <div class="search-results-page">
                <div class="search-results-header">
                    <h3>Search Results</h3>
                    <span class="results-count">${totalResults} results for "${query}"</span>
                </div>
                
                <div class="search-results-sections">
                    ${companies.length > 0 ? `
                        <div class="search-results-section">
                            <h4><i class="fas fa-building"></i> Companies (${companies.length})</h4>
                            <div class="search-results-grid">
                                ${companies.slice(0, 6).map(company => `
                                    <div class="search-result-item" onclick="window.platform.showCompanyModal(${company.id}); window.platform.closeSearchPage();">
                                        <div class="result-item-logo">
                                            <img src="${this.getCompanyLogoUrl(company.name)}" alt="${company.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                            <div class="logo-fallback" style="display: none;">${company.name.charAt(0)}</div>
                                        </div>
                                        <div class="result-item-info">
                                            <h5>${this.highlightSearchTerm(company.name, query)}</h5>
                                            <p>${company.industry.replace('-', ' ')} • ${company.location}</p>
                                            <span class="result-meta">${company.last_funding_round} • ${this.dataService.formatCurrency(company.funding_raised)}</span>
                                        </div>
                                    </div>
                                `).join('')}
                                ${companies.length > 6 ? `<div class="show-more">+${companies.length - 6} more companies</div>` : ''}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${vcs.length > 0 ? `
                        <div class="search-results-section">
                            <h4><i class="fas fa-hand-holding-usd"></i> Venture Capital (${vcs.length})</h4>
                            <div class="search-results-grid">
                                ${vcs.slice(0, 4).map(vc => `
                                    <div class="search-result-item" onclick="window.platform.showVCModal(${vc.id}); window.platform.closeSearchPage();">
                                        <div class="result-item-logo">
                                            <img src="${this.getVCLogoUrl(vc.name)}" alt="${vc.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                            <div class="logo-fallback" style="display: none;">${vc.name.charAt(0)}</div>
                                        </div>
                                        <div class="result-item-info">
                                            <h5>${this.highlightSearchTerm(vc.name, query)}</h5>
                                            <p>${vc.location} • ${vc.investments} investments</p>
                                            <span class="result-meta">Focus: ${vc.focus_areas.join(', ')}</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${news.length > 0 ? `
                        <div class="search-results-section">
                            <h4><i class="fas fa-newspaper"></i> News (${news.length})</h4>
                            <div class="search-results-list">
                                ${news.slice(0, 4).map(article => `
                                    <div class="search-result-item news-item" onclick="window.platform.showNewsModal(${article.id}); window.platform.closeSearchPage();">
                                        <div class="result-item-info">
                                            <h5>${this.highlightSearchTerm(article.headline, query)}</h5>
                                            <p>${article.content.substring(0, 100)}...</p>
                                            <span class="result-meta">${article.source} • ${this.dataService.formatDate(article.published_at)}</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    showSearchSuggestions(query) {
        console.log('Showing search suggestions for:', query);
        
        if (!query.trim()) {
            this.showRecentSearches();
            return;
        }

        // Get limited suggestions (first 3-5 results from each category)
        const companies = this.dataService.searchCompanies(query).slice(0, 3);
        const vcs = this.dataService.searchVCs(query).slice(0, 2);
        const news = this.dataService.searchNews(query).slice(0, 2);
        
        const totalSuggestions = companies.length + vcs.length + news.length;
        
        if (totalSuggestions === 0) {
            this.showNoSuggestions(query);
            return;
        }

        this.showSuggestionsOverlay({ 
            companies, 
            vcs, 
            news, 
            query 
        });
    }

    performFullSearch(query) {
        console.log('Performing full search for:', query);
        
        if (!query.trim()) {
            this.closeSearchBox();
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

        console.log('Full search results:', { companies, vcs, news, fundingRounds, investors });

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
        
        // Close the search box after performing search
        this.closeSearchBox();
    }

    showSuggestionsOverlay(suggestions) {
        // Create or update search suggestions overlay
        let searchOverlay = document.getElementById('searchOverlay');
        if (!searchOverlay) {
            searchOverlay = document.createElement('div');
            searchOverlay.id = 'searchOverlay';
            searchOverlay.className = 'search-overlay';
            document.body.appendChild(searchOverlay);
        }

        const { companies, vcs, news, query } = suggestions;
        const totalSuggestions = companies.length + vcs.length + news.length;
        
        searchOverlay.innerHTML = `
            <div class="search-results">
                <div class="search-results-header">
                    <div class="search-header-info">
                        <h3>Suggestions</h3>
                        <span class="search-count">${totalSuggestions} suggestions for "${query}"</span>
                    </div>
                    <button class="search-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="search-results-content">
                    ${companies.length > 0 ? `
                        <div class="search-section">
                            <h4><i class="fas fa-building"></i> Companies (${companies.length})</h4>
                            <div class="search-items">
                                ${companies.map(company => `
                                    <div class="search-item" onclick="if(window.platform) { window.platform.showCompanyModal(${company.id}); } this.parentElement.parentElement.parentElement.parentElement.remove();">
                                        <div class="search-item-logo">
                                            <img src="${this.getCompanyLogoUrl(company.name)}" alt="${company.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                            <div class="logo-fallback" style="display: none;">${company.name.charAt(0)}</div>
                                        </div>
                                        <div class="search-item-info">
                                            <div class="search-item-name">${this.highlightSearchTerm(company.name, query)}</div>
                                            <div class="search-item-desc">${company.industry.replace('-', ' ')} • ${company.location}</div>
                                            <div class="search-item-meta">${company.last_funding_round} • ${this.dataService.formatCurrency(company.funding_raised)}</div>
                                        </div>
                                        <i class="fas fa-arrow-right search-item-arrow"></i>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${vcs.length > 0 ? `
                        <div class="search-section">
                            <h4><i class="fas fa-hand-holding-usd"></i> Venture Capital (${vcs.length})</h4>
                            <div class="search-items">
                                ${vcs.map(vc => `
                                    <div class="search-item" onclick="if(window.platform) { window.platform.showVCModal(${vc.id}); } this.parentElement.parentElement.parentElement.parentElement.remove();">
                                        <div class="search-item-logo">
                                            <img src="${this.getVCLogoUrl(vc.name)}" alt="${vc.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                            <div class="logo-fallback" style="display: none;">${vc.name.charAt(0)}</div>
                                        </div>
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
                    
                    ${news.length > 0 ? `
                        <div class="search-section">
                            <h4><i class="fas fa-newspaper"></i> News (${news.length})</h4>
                            <div class="search-items">
                                ${news.map(article => `
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
                </div>
                
                <div class="search-footer">
                    <div class="search-shortcuts">
                        <span>Press <kbd>Enter</kbd> for full search</span>
                        <span>Press <kbd>Esc</kbd> to close</span>
                    </div>
                </div>
            </div>
        `;
        searchOverlay.style.display = 'block';
    }

    showNoSuggestions(query) {
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
                        <h3>No Suggestions</h3>
                        <span class="search-count">No suggestions for "${query}"</span>
                    </div>
                    <button class="search-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="search-results-content">
                    <div class="search-no-results">
                        <div class="no-results-icon">🔍</div>
                        <h4>No suggestions found</h4>
                        <p>Press <kbd>Enter</kbd> to perform a full search</p>
                    </div>
                </div>
                
                <div class="search-footer">
                    <div class="search-shortcuts">
                        <span>Press <kbd>Enter</kbd> for full search</span>
                        <span>Press <kbd>Esc</kbd> to close</span>
                    </div>
                </div>
            </div>
        `;
        searchOverlay.style.display = 'block';
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
                                        <div class="search-item-logo">
                                            <img src="${this.getCompanyLogoUrl(company.name)}" alt="${company.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                            <div class="logo-fallback" style="display: none;">${company.name.charAt(0)}</div>
                                        </div>
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
                                        <div class="search-item-logo">
                                            <img src="${this.getVCLogoUrl(vc.name)}" alt="${vc.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                            <div class="logo-fallback" style="display: none;">${vc.name.charAt(0)}</div>
                                        </div>
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
                                <li>Industries (e.g., "ai natives", "digital natives")</li>
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
        
        // Update active button states
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === view) {
                btn.classList.add('active');
            }
        });
        
        console.log('View switched to:', view);
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

    filterCompaniesByPartner(partnerStatus) {
        // Filter companies by partner status
        const companiesGrid = document.getElementById('companiesGrid');
        if (!companiesGrid) return;

        const allCompanies = this.dataService.companies;
        let filteredCompanies = this.filterCompaniesByPartnerStatus(allCompanies, partnerStatus);

        // Apply industry filter if active
        const industryFilter = document.getElementById('industryFilter');
        if (industryFilter && industryFilter.value) {
            filteredCompanies = filteredCompanies.filter(company => company.industry === industryFilter.value);
        }

        companiesGrid.innerHTML = filteredCompanies.map(company => `
            <div class="company-card" data-company-id="${company.id}">
                <div class="company-header">
                    <div class="company-logo">
                        <img src="${this.getCompanyLogoUrl(company.name)}" alt="${company.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="logo-fallback" style="display: none;">${company.name.charAt(0)}</div>
                    </div>
                    <div class="company-info">
                        <div class="company-title-row">
                            <h3>${company.name}</h3>
                            ${company.ncp_status === 'Partner' ? `<div class="ncp-indicator" title="NVIDIA Partner${company.ncp_tier ? ' - ' + company.ncp_tier : ''}">
                                <i class="fas fa-check-circle"></i>
                            </div>` : ''}
                        </div>
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

    filterCompaniesByPartnerStatus(companies, partnerStatus) {
        if (!partnerStatus) return companies;
        
        switch(partnerStatus) {
            case 'partner':
                return companies.filter(company => company.ncp_status === 'Partner');
            case 'not-partner':
                return companies.filter(company => company.ncp_status === 'Not Partner');
            default:
                return companies;
        }
    }

    filterCompaniesByIndustry(industry) {
        this.applyAllFilters();
    }

    filterCompaniesByFunding(fundingRange) {
        this.applyAllFilters();
    }

    filterCompaniesByDate(dateYear) {
        this.applyAllFilters();
    }

    filterCompaniesByVC(vcTier) {
        this.applyAllFilters();
    }

    applyAllFilters() {
        const companiesGrid = document.getElementById('companiesGrid');
        if (!companiesGrid) return;

        let filteredCompanies = [...this.dataService.companies];

        // Apply industry filter
        const industryFilter = document.getElementById('industryFilter');
        if (industryFilter && industryFilter.value) {
            filteredCompanies = filteredCompanies.filter(company => company.industry === industryFilter.value);
        }

        // Apply funding filter
        const fundingFilter = document.getElementById('fundingFilter');
        if (fundingFilter && fundingFilter.value) {
            const [minStr, maxStr] = fundingFilter.value.split('-');
            const min = minStr === '0' ? 0 : parseInt(minStr);
            const max = maxStr === '+' ? Infinity : parseInt(maxStr);
            filteredCompanies = filteredCompanies.filter(company => {
                const amount = company.funding?.amount || 0;
                return amount >= min && amount <= max;
            });
        }

        // Apply date filter
        const dateFilter = document.getElementById('dateFilter');
        if (dateFilter && dateFilter.value) {
            filteredCompanies = filteredCompanies.filter(company => {
                const fundingDate = company.funding?.date;
                return fundingDate && fundingDate.startsWith(dateFilter.value);
            });
        }

        // Apply VC tier filter
        const vcFilter = document.getElementById('vcFilter');
        if (vcFilter && vcFilter.value) {
            filteredCompanies = filteredCompanies.filter(company => company.vc_tier === vcFilter.value);
        }

        companiesGrid.innerHTML = filteredCompanies.map(company => this.renderCompanyCard(company)).join('');
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
                            <span class="company-industry">${company.industry.replace('-', ' ')}</span>
                        </div>
                    </div>
                </div>
                <div class="company-stats">
                    <div class="company-stat">
                        <span class="company-stat-value">${this.dataService.formatCurrency(company.valuation)}</span>
                        <span class="company-stat-label">Valuation</span>
                    </div>
                    <div class="company-stat">
                        <span class="company-stat-value">${company.vc_tier || 'N/A'}</span>
                        <span class="company-stat-label">VC Tier</span>
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

    downloadNonPartnersCSV() {
        const csvContent = this.dataService.exportNonPartnersToCSV();
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

    filterVCPortfolio(vcName) {
        const portfolioGrid = document.getElementById('vcPortfolioGrid');
        if (!portfolioGrid) return;

        let companies = [...this.dataService.companies];
        
        if (vcName !== 'all') {
            companies = companies.filter(company => 
                company.vcPortfolio && company.vcPortfolio.some(vc => 
                    vc.toLowerCase().includes(vcName.toLowerCase())
                )
            );
        }

        portfolioGrid.innerHTML = companies.map(company => `
            <div class="portfolio-item" data-company-id="${company.id}">
                <div class="portfolio-header">
                    <h4>${company.name}</h4>
                    <span class="portfolio-tier">${company.vc_tier}</span>
                </div>
                <div class="portfolio-details">
                    <span class="portfolio-industry">${company.industry}</span>
                    <span class="portfolio-funding">${this.dataService.formatCurrency(company.funding?.amount || 0)}</span>
                </div>
                <div class="portfolio-vcs">
                    ${company.vcPortfolio?.map(vc => `<span class="vc-tag">${vc}</span>`).join('') || ''}
                </div>
            </div>
        `).join('');
    }

    async summarizeNews(newsUrl) {
        try {
            const summary = await this.dataService.summarizeNews(newsUrl);
            return summary;
        } catch (error) {
            console.error('Error summarizing news:', error);
            return 'Unable to summarize news at this time.';
        }
    }

    async loadLatestNews() {
        const newsGrid = document.getElementById('latestNewsGrid');
        if (!newsGrid) return;

        const recentNews = this.dataService.getRecentNews(6);
        
        newsGrid.innerHTML = await Promise.all(recentNews.map(async (article) => {
            const company = this.dataService.getCompanyById(article.company_id);
            const summary = await this.summarizeNews(article.url || '');
            
            return `
                <div class="news-item" onclick="platform.showNewsModal(${article.id})">
                    <div class="news-header">
                        <span class="news-category">${article.category}</span>
                        <span class="news-time">${this.dataService.formatDate(article.published_at)}</span>
                    </div>
                    <div class="news-title">${article.headline}</div>
                    <div class="news-content">${summary}</div>
                    <div class="news-footer">
                        <span class="news-source">${article.source}</span>
                        <span class="news-date">${company?.name || 'Unknown Company'}</span>
                    </div>
                </div>
            `;
        }));
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

