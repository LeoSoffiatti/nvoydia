// Modern Biotech Intelligence Platform - Interactive JavaScript

class ModernBiotechPlatform {
    constructor() {
        this.dataService = new DataService();
        this.currentSection = 'dashboard';
        this.charts = {};
        this.modals = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeCharts();
        this.loadDashboardData();
        this.setupThemeToggle();
        this.setupSearch();
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
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icon
            const icon = themeToggle.querySelector('i');
            icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('globalSearch');
        let searchTimeout;

        searchInput?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });
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
            case 'analytics':
                this.loadAnalyticsData();
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
            <div class="funding-item" onclick="platform.showCompanyModal(${company.id})">
                <div class="funding-header">
                    <div class="company-info">
                        <span class="company-logo">${company.logo}</span>
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
            <div class="performer-item" onclick="platform.showCompanyModal(${company.id})">
                <div class="performer-header">
                    <div class="company-info">
                        <span class="company-logo">${company.logo}</span>
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

    loadLatestNews() {
        const container = document.getElementById('latestNewsGrid');
        if (!container) return;

        const recentNews = this.dataService.getRecentNews(6);
        
        container.innerHTML = recentNews.map(article => `
            <div class="news-item" onclick="platform.showNewsModal(${article.id})">
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
            <div class="company-card" onclick="platform.showCompanyModal(${company.id})">
                <div class="company-header">
                    <div class="company-logo">${company.logo}</div>
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

    loadAnalyticsData() {
        this.createGrowthChart();
    }

    createGrowthChart() {
        const ctx = document.getElementById('growthChart');
        if (!ctx) return;

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const data = {
            labels: months,
            datasets: [{
                label: 'Growth Rate (%)',
                data: [35, 42, 38, 45, 52, 47],
                borderColor: '#00d4aa',
                backgroundColor: 'rgba(0, 212, 170, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#00d4aa',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        };

        const config = {
            type: 'line',
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
                        borderColor: '#00d4aa',
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
                                return value + '%';
                            }
                        }
                    }
                }
            }
        };

        this.charts.growth = new Chart(ctx, config);
    }

    showCompanyModal(companyId) {
        const company = this.dataService.getCompanyById(companyId);
        if (!company) return;

        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');

        title.textContent = company.name;
        content.innerHTML = `
            <div class="company-modal">
                <div class="company-header">
                    <div class="company-logo-large">${company.logo}</div>
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
                        </div>
                    </div>
                </div>
                
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
                        <div class="stat-value">${company.technical_employees_pct}%</div>
                        <div class="stat-label">Technical Employees</div>
                    </div>
                </div>
                
                <div class="company-section">
                    <h3>Leadership</h3>
                    <div class="leadership-info">
                        <div class="ceo-info">
                            <h4>CEO: ${company.ceo}</h4>
                            <p>Leading ${company.name} since ${company.founded_year}</p>
                        </div>
                    </div>
                </div>
                
                <div class="company-section">
                    <h3>Investors</h3>
                    <div class="investors-list">
                        ${company.investors.map(investor => `
                            <span class="investor-tag">${investor}</span>
                        `).join('')}
                    </div>
                </div>
                
                <div class="company-section">
                    <h3>Recent News</h3>
                    <div class="news-list">
                        ${this.dataService.getNewsByCompanyId(companyId).slice(0, 3).map(article => `
                            <div class="news-item">
                                <h4>${article.headline}</h4>
                                <p>${article.content}</p>
                                <span class="news-date">${this.dataService.formatDate(article.published_at)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
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
        const article = this.dataService.news.find(n => n.id === newsId);
        if (!article) return;

        const modal = document.getElementById('modalOverlay');
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');

        title.textContent = article.headline;
        content.innerHTML = `
            <div class="news-modal">
                <div class="news-header">
                    <div class="news-meta">
                        <span class="news-category">${article.category}</span>
                        <span class="news-source">${article.source}</span>
                        <span class="news-date">${this.dataService.formatDate(article.published_at)}</span>
                    </div>
                </div>
                
                <div class="news-content">
                    <h2>${article.headline}</h2>
                    <p>${article.content}</p>
                </div>
                
                <div class="news-footer">
                    <div class="read-time">
                        <i class="fas fa-clock"></i>
                        ${article.read_time}
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('modalOverlay');
        modal.classList.remove('active');
    }

    performSearch(query) {
        if (!query.trim()) return;

        const companies = this.dataService.searchCompanies(query);
        const vcs = this.dataService.searchVCs(query);
        const news = this.dataService.searchNews(query);

        // Show search results (implement search results UI)
        console.log('Search results:', { companies, vcs, news });
    }

    updateActiveButton(activeBtn, selector) {
        document.querySelectorAll(selector).forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    updateChartTimeframe(period) {
        // Update chart data based on timeframe
        console.log('Updating chart timeframe:', period);
    }

    updateChartType(type) {
        // Update chart type (line/bar)
        console.log('Updating chart type:', type);
    }

    updateTrendMetric(metric) {
        // Update trend chart metric
        console.log('Updating trend metric:', metric);
    }

    toggleView(view) {
        // Toggle between grid/list view
        console.log('Toggling view:', view);
    }

    filterCompaniesByIndustry(industry) {
        // Filter companies by industry
        console.log('Filtering companies by industry:', industry);
    }

    filterNewsByCategory(category) {
        // Filter news by category
        console.log('Filtering news by category:', category);
    }
}

// Initialize the platform when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.platform = new ModernBiotechPlatform();
});

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
