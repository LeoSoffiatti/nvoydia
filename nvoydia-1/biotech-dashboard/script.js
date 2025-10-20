// Biotech Dashboard JavaScript
class BiotechDashboard {
    constructor() {
        this.currentPage = 'dashboard';
        this.currentTheme = 'light';
        this.chart = null;
        this.updateInterval = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.startLiveUpdates();
        this.initializeChart();
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

        // Search functionality
        const searchInput = document.querySelector('.search-bar input');
        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Modal functionality
        this.setupModalListeners();
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

        // Handle different filter types
        if (button.dataset.year) {
            this.updateChartData(button.dataset.year);
        } else if (button.dataset.period) {
            this.updateNewsData(button.dataset.period);
        }
    }

    handleTabClick(button) {
        const container = button.closest('.card-header');
        container.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        this.updateSectorInvestments(button.dataset.sector);
    }

    handleSearch(query) {
        // Implement search functionality
        console.log('Searching for:', query);
        // This would typically filter data based on the query
    }

    setupModalListeners() {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');

        // Close modal when clicking close button
        modalClose.addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal when clicking overlay
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                this.closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal(title, content) {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');

        modalTitle.textContent = title;
        modalContent.innerHTML = content;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    showNotificationDetails(title, description, time, priority) {
        const content = `
            <h3>${title}</h3>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Time:</strong> ${time}</p>
            ${priority ? `<p><strong>Priority:</strong> <span style="color: var(--error-color); font-weight: 600;">${priority}</span></p>` : ''}
            <h3>Additional Information</h3>
            <p>This notification contains important updates about your biotech portfolio. Here are some additional details:</p>
            <ul>
                <li>Impact on portfolio performance</li>
                <li>Recommended actions to take</li>
                <li>Related companies and investments</li>
                <li>Market implications</li>
            </ul>
            <p>For more detailed analysis, please contact your portfolio manager or review the full report in the investments section.</p>
        `;
        this.openModal(title, content);
    }

    showCompanyDetails(company) {
        const content = `
            <h3>${company.name}</h3>
            <p><strong>Location:</strong> ${company.location}</p>
            <p><strong>Valuation:</strong> ${company.valuation}</p>
            <p><strong>Funding Stage:</strong> ${company.funding}</p>
            <p><strong>Employees:</strong> ${company.employees}</p>
            <h3>Company Description</h3>
            <p>${company.description}</p>
            <h3>Recent Developments</h3>
            <ul>
                <li>Latest funding round completed successfully</li>
                <li>Key partnerships announced</li>
                <li>Product pipeline updates</li>
                <li>Leadership team expansion</li>
            </ul>
            <h3>Investment Highlights</h3>
            <ul>
                <li>Strong market position in biotech sector</li>
                <li>Innovative technology platform</li>
                <li>Experienced management team</li>
                <li>Growing revenue streams</li>
            </ul>
        `;
        this.openModal(`${company.name} - Company Details`, content);
    }

    showInvestorDetails(investor) {
        const content = `
            <h3>${investor.name}</h3>
            <p><strong>Total Investments:</strong> ${investor.totalInvestments}</p>
            <p><strong>Portfolio Size:</strong> ${investor.portfolioSize} companies</p>
            <p><strong>Recent Investments (2025):</strong> ${investor.recent}</p>
            <h3>Focus Areas</h3>
            <p>${investor.focusAreas.join(', ')}</p>
            <h3>Investment Strategy</h3>
            <p>This investor focuses on early to mid-stage biotech companies with innovative technologies and strong growth potential. They typically invest in companies that are developing breakthrough therapies and have experienced management teams.</p>
            <h3>Recent Portfolio Additions</h3>
            <ul>
                <li>Series A investments in AI-driven drug discovery</li>
                <li>Seed funding for personalized medicine platforms</li>
                <li>Growth capital for digital health solutions</li>
                <li>Strategic investments in biotech manufacturing</li>
            </ul>
            <h3>Investment Criteria</h3>
            <ul>
                <li>Innovative technology with clear competitive advantage</li>
                <li>Experienced and proven management team</li>
                <li>Large addressable market opportunity</li>
                <li>Clear path to profitability</li>
            </ul>
        `;
        this.openModal(`${investor.name} - Investor Profile`, content);
    }

    showFundingDetails(funding) {
        const content = `
            <h3>${funding.name} - ${funding.stage}</h3>
            <p><strong>Funding Amount:</strong> ${funding.amount}</p>
            <p><strong>Industry:</strong> ${funding.industry}</p>
            <p><strong>Time:</strong> ${funding.time}</p>
            <h3>Funding Round Details</h3>
            <p>This ${funding.stage} funding round represents a significant milestone for ${funding.name}. The company has demonstrated strong growth and market traction in the ${funding.industry} sector.</p>
            <h3>Use of Funds</h3>
            <ul>
                <li>Product development and R&D</li>
                <li>Market expansion and sales team growth</li>
                <li>Technology infrastructure improvements</li>
                <li>Strategic partnerships and acquisitions</li>
            </ul>
            <h3>Market Impact</h3>
            <p>This funding round positions ${funding.name} as a key player in the ${funding.industry} market, enabling them to accelerate their growth and expand their market presence.</p>
            <h3>Investor Confidence</h3>
            <p>The successful completion of this funding round demonstrates strong investor confidence in the company's business model, technology, and growth prospects.</p>
        `;
        this.openModal(`${funding.name} - Funding Details`, content);
    }

    loadInitialData() {
        this.loadDashboardData();
        this.loadCompaniesData();
        this.loadInvestmentsData();
        this.loadNotificationsData();
    }

    loadPageData(page) {
        switch (page) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'companies':
                this.loadCompaniesData();
                break;
            case 'investments':
                this.loadInvestmentsData();
                break;
            case 'notifications':
                this.loadNotificationsData();
                break;
        }
    }

    loadDashboardData() {
        this.loadFundingRounds();
        this.loadNewsData();
    }

    loadFundingRounds() {
        const fundingData = [
            {
                name: 'NeuroTech',
                initials: 'N',
                color: '#10b981',
                stage: 'Series A',
                time: '2h ago',
                amount: '$15.2M',
                industry: 'AI/ML'
            },
            {
                name: 'BioMed Labs',
                initials: 'B',
                color: '#3b82f6',
                stage: 'Seed',
                time: '5h ago',
                amount: '$8.7M',
                industry: 'Healthcare'
            },
            {
                name: 'QuantumVault',
                initials: 'Q',
                color: '#8b5cf6',
                stage: 'Series B',
                time: '8h ago',
                amount: '$25.1M',
                industry: 'Fintech'
            },
            {
                name: 'GreenEnergy Co',
                initials: 'G',
                color: '#10b981',
                stage: 'Series A',
                time: '12h ago',
                amount: '$12.4M',
                industry: 'Clean Tech'
            },
            {
                name: 'DataFlow Systems',
                initials: 'D',
                color: '#ef4444',
                stage: 'Series A',
                time: '1 day ago',
                amount: '$18.9M',
                industry: 'Enterprise'
            },
            {
                name: 'RoboticsMed',
                initials: 'R',
                color: '#f59e0b',
                stage: 'Seed',
                time: '1 day ago',
                amount: '$7.3M',
                industry: 'Healthcare'
            },
            {
                name: 'CyberShield',
                initials: 'C',
                color: '#1e40af',
                stage: 'Series B',
                time: '2 days ago',
                amount: '$22.6M',
                industry: 'Security'
            },
            {
                name: 'SmartLogistics',
                initials: 'S',
                color: '#ec4899',
                stage: 'Series A',
                time: '2 days ago',
                amount: '$9.8M',
                industry: 'Supply Chain'
            }
        ];

        const fundingList = document.getElementById('fundingList');
        fundingList.innerHTML = fundingData.map(item => `
            <div class="funding-item" onclick="window.biotechDashboard.showFundingDetails(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                <div class="company-icon" style="background-color: ${item.color}">
                    ${item.initials}
                </div>
                <div class="company-info">
                    <div class="company-name">${item.name}</div>
                    <div class="company-details">
                        <span>${item.stage}</span>
                        <span>${item.time}</span>
                        <span class="funding-amount">${item.amount}</span>
                        <span>${item.industry}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadNewsData() {
        const newsData = [
            {
                company: 'NeuroTech',
                date: '1/15',
                title: 'NeuroTech raises $15M Series A funding round from leading venture capital firms',
                summary: 'AI startup secures significant funding for brain-computer interface development and commercial expansion across multiple therapeutic areas.'
            },
            {
                company: 'BioMed Labs',
                date: '1/14',
                title: 'BioMed Labs announces breakthrough in personalized medicine',
                summary: 'Company reveals new AI-driven platform for drug discovery that reduces development time by 40%.'
            },
            {
                company: 'QuantumVault',
                date: '1/13',
                title: 'QuantumVault partners with major financial institutions',
                summary: 'Cybersecurity firm expands enterprise client base with quantum-resistant encryption solutions.'
            },
            {
                company: 'GreenEnergy Co',
                date: '1/12',
                title: 'GreenEnergy Co launches sustainable biotech manufacturing',
                summary: 'Company introduces eco-friendly production methods for pharmaceutical manufacturing.'
            }
        ];

        const newsTableBody = document.getElementById('newsTableBody');
        newsTableBody.innerHTML = newsData.map(item => `
            <tr>
                <td>${item.company}</td>
                <td>${item.date}</td>
                <td>${item.title}</td>
                <td>${item.summary}</td>
            </tr>
        `).join('');
    }

    loadCompaniesData() {
        const companiesData = {
            'digitalBio': [
                {
                    name: 'CRISPR Therapeutics',
                    initials: 'CT',
                    color: '#10b981',
                    location: 'Cambridge, MA',
                    valuation: '$1.2B',
                    funding: 'Series C',
                    employees: 420,
                    description: 'Leading gene editing company developing transformative gene-based medicines for serious diseases.'
                },
                {
                    name: 'BioNTech',
                    initials: 'BT',
                    color: '#3b82f6',
                    location: 'Mainz, Germany',
                    valuation: '$2.1B',
                    funding: 'Public',
                    employees: 520,
                    description: 'Immunotherapy company developing novel therapies for cancer and infectious diseases.'
                }
            ],
            'digitalHealth': [
                {
                    name: 'Ginkgo Bioworks',
                    initials: 'GB',
                    color: '#3b82f6',
                    location: 'Boston, MA',
                    valuation: '$800M',
                    funding: 'Series B',
                    employees: 350,
                    description: 'Platform biotechnology company that designs custom microbes for customers across multiple markets.'
                },
                {
                    name: 'Synthego',
                    initials: 'SY',
                    color: '#f59e0b',
                    location: 'Redwood City, CA',
                    valuation: '$180M',
                    funding: 'Series A',
                    employees: 150,
                    description: 'Genome engineering company providing CRISPR kits and services for research.'
                }
            ],
            'digitalDevices': [
                {
                    name: 'Deep Genomics',
                    initials: 'DG',
                    color: '#8b5cf6',
                    location: 'Toronto, Canada',
                    valuation: '$250M',
                    funding: 'Series A',
                    employees: 140,
                    description: 'AI-powered drug discovery platform for genetic diseases using machine learning.'
                },
                {
                    name: 'Zymergen',
                    initials: 'ZY',
                    color: '#10b981',
                    location: 'Emeryville, CA',
                    valuation: '$320M',
                    funding: 'Series B',
                    employees: 220,
                    description: 'Biofacturing platform company engineering microbes for sustainable materials.'
                },
                {
                    name: 'Recursion Pharmaceuticals',
                    initials: 'RP',
                    color: '#ec4899',
                    location: 'Salt Lake City, UT',
                    valuation: '$450M',
                    funding: 'Series B',
                    employees: 290,
                    description: 'Clinical-stage biotechnology company decoding biology to industrialize drug discovery.'
                },
                {
                    name: 'Twist Bioscience',
                    initials: 'TB',
                    color: '#6b7280',
                    location: 'South San Francisco, CA',
                    valuation: '$680M',
                    funding: 'Public',
                    employees: 380,
                    description: 'Synthetic biology company manufacturing synthetic DNA for research and therapeutic applications.'
                }
            ]
        };

        // Load Digital Bio companies
        const digitalBioContainer = document.getElementById('digitalBioCompanies');
        digitalBioContainer.innerHTML = companiesData.digitalBio.map(company => this.createCompanyCard(company)).join('');

        // Load Digital Health companies
        const digitalHealthContainer = document.getElementById('digitalHealthCompanies');
        digitalHealthContainer.innerHTML = companiesData.digitalHealth.map(company => this.createCompanyCard(company)).join('');

        // Load Digital Devices companies
        const digitalDevicesContainer = document.getElementById('digitalDevicesCompanies');
        digitalDevicesContainer.innerHTML = companiesData.digitalDevices.map(company => this.createCompanyCard(company)).join('');
    }

    createCompanyCard(company) {
        return `
            <div class="company-card" onclick="window.biotechDashboard.showCompanyDetails(${JSON.stringify(company).replace(/"/g, '&quot;')})">
                <div class="company-card-header">
                    <div class="company-card-icon" style="background-color: ${company.color}">
                        ${company.initials}
                    </div>
                    <div class="company-card-info">
                        <h4>${company.name}</h4>
                        <div class="company-location">${company.location}</div>
                    </div>
                    <i class="fas fa-external-link-alt external-link"></i>
                </div>
                <div class="company-stats">
                    <div class="company-stat">
                        <div class="company-stat-label">Valuation</div>
                        <div class="company-stat-value">${company.valuation}</div>
                    </div>
                    <div class="company-stat">
                        <div class="company-stat-label">Funding</div>
                        <div class="company-stat-value">${company.funding}</div>
                    </div>
                    <div class="company-stat">
                        <div class="company-stat-label">Employees</div>
                        <div class="company-stat-value">${company.employees}</div>
                    </div>
                </div>
                <div class="company-description">${company.description}</div>
            </div>
        `;
    }

    loadInvestmentsData() {
        this.loadInvestorsData();
        this.loadSectorInvestments('digital-bio');
        this.loadTopInvestorsData();
    }

    loadInvestorsData() {
        const investorsData = [
            {
                name: 'NVIDIA Ventures',
                initials: 'NV',
                color: '#10b981',
                totalInvestments: '$2.8B',
                portfolioSize: 125,
                recent: 18,
                focusAreas: ['Digital Health', 'Digital Devices', 'Digital Bio']
            },
            {
                name: 'Google Ventures',
                initials: 'GV',
                color: '#3b82f6',
                totalInvestments: '$7.1B',
                portfolioSize: 300,
                recent: 24,
                focusAreas: ['Digital Health', 'Digital Bio', 'Digital Devices']
            },
            {
                name: 'Intel Capital',
                initials: 'IC',
                color: '#8b5cf6',
                totalInvestments: '$1.9B',
                portfolioSize: 95,
                recent: 12,
                focusAreas: ['Digital Devices', 'Digital Health', 'Digital Bio']
            },
            {
                name: 'Salesforce Ventures',
                initials: 'SF',
                color: '#f59e0b',
                totalInvestments: '$800M',
                portfolioSize: 45,
                recent: 8,
                focusAreas: ['Digital Health', 'Digital Devices']
            },
            {
                name: 'Microsoft Ventures',
                initials: 'MS',
                color: '#3b82f6',
                totalInvestments: '$3.2B',
                portfolioSize: 180,
                recent: 15,
                focusAreas: ['Digital Bio', 'Digital Health', 'Digital Devices']
            },
            {
                name: 'Johnson & Johnson Innovation',
                initials: 'JJ',
                color: '#f59e0b',
                totalInvestments: '$1.2B',
                portfolioSize: 75,
                recent: 10,
                focusAreas: ['Digital Bio', 'Digital Health']
            }
        ];

        const investorsGrid = document.getElementById('investorsGrid');
        investorsGrid.innerHTML = investorsData.map(investor => `
            <div class="investor-card" onclick="window.biotechDashboard.showInvestorDetails(${JSON.stringify(investor).replace(/"/g, '&quot;')})">
                <div class="investor-icon" style="background-color: ${investor.color}">
                    ${investor.initials}
                </div>
                <div class="investor-name">${investor.name}</div>
                <div class="investor-stats">
                    <div class="investor-stat">
                        <div class="investor-stat-label">Total Investments</div>
                        <div class="investor-stat-value">${investor.totalInvestments}</div>
                    </div>
                    <div class="investor-stat">
                        <div class="investor-stat-label">Portfolio Size</div>
                        <div class="investor-stat-value">${investor.portfolioSize}</div>
                    </div>
                    <div class="investor-stat">
                        <div class="investor-stat-label">Recent (2025)</div>
                        <div class="investor-stat-value">${investor.recent}</div>
                    </div>
                </div>
                <div class="focus-areas">
                    ${investor.focusAreas.map(area => `
                        <span class="focus-tag">${area}</span>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    loadSectorInvestments(sector) {
        const sectorData = {
            'digital-bio': [
                { company: 'CRISPR Therapeutics', investor: 'Google Ventures', amount: '$85M', stage: 'Series B' },
                { company: 'Ginkgo Bioworks', investor: 'Johnson & Johnson Innovation', amount: '$120M', stage: 'Series C' },
                { company: 'Recursion Pharmaceuticals', investor: 'Microsoft Ventures', amount: '$95M', stage: 'Series B' },
                { company: 'Deep Genomics', investor: 'NVIDIA Ventures', amount: '$40M', stage: 'Series A' },
                { company: 'BioNTech', investor: 'Intel Capital', amount: '$75M', stage: 'Partnership' }
            ],
            'digital-health': [
                { company: 'HealthTech Solutions', investor: 'Google Ventures', amount: '$65M', stage: 'Series A' },
                { company: 'MediAI', investor: 'Microsoft Ventures', amount: '$90M', stage: 'Series B' },
                { company: 'CareConnect', investor: 'NVIDIA Ventures', amount: '$55M', stage: 'Series A' }
            ],
            'digital-devices': [
                { company: 'DeviceCorp', investor: 'Intel Capital', amount: '$110M', stage: 'Series B' },
                { company: 'TechMed Devices', investor: 'Google Ventures', amount: '$80M', stage: 'Series A' },
                { company: 'SmartHealth', investor: 'Microsoft Ventures', amount: '$70M', stage: 'Series A' }
            ]
        };

        const sectorInvestments = document.getElementById('sectorInvestments');
        const data = sectorData[sector] || [];
        
        sectorInvestments.innerHTML = data.map(item => `
            <div class="sector-investment-item">
                <div class="investment-company">${item.company}</div>
                <div class="investment-details">
                    <span>by ${item.investor}</span>
                    <span class="investment-amount">${item.amount}</span>
                    <span>${item.stage}</span>
                </div>
            </div>
        `).join('');
    }

    loadTopInvestorsData() {
        const topInvestorsData = [
            {
                sector: 'Digital Bio',
                leader: 'Johnson & Johnson Innovation',
                amount: '$1.1B',
                count: '42 investments'
            },
            {
                sector: 'Digital Health',
                leader: 'Google Ventures',
                amount: '$1.8B',
                count: '58 investments'
            },
            {
                sector: 'Digital Devices',
                leader: 'Intel Capital',
                amount: '$980M',
                count: '35 investments'
            }
        ];

        const topInvestors = document.getElementById('topInvestors');
        topInvestors.innerHTML = topInvestorsData.map(item => `
            <div class="top-investor-item">
                <div class="top-investor-info">
                    <div class="top-investor-sector">${item.sector}</div>
                    <div class="top-investor-leader">Led by ${item.leader}</div>
                </div>
                <div class="top-investor-stats">
                    <div class="top-investor-amount">${item.amount}</div>
                    <div class="top-investor-count">${item.count}</div>
                </div>
                <i class="fas fa-arrow-right top-investor-arrow"></i>
            </div>
        `).join('');
    }

    loadNotificationsData() {
        const notificationsData = [
            {
                icon: 'fas fa-dollar-sign',
                iconColor: '#10b981',
                title: 'New Investment Alert',
                hasDot: true,
                priority: 'High Priority',
                description: 'TechCorp completed Series B funding of $25M',
                time: '2 hours ago'
            },
            {
                icon: 'fas fa-building',
                iconColor: '#3b82f6',
                title: 'Company Update',
                hasDot: true,
                priority: null,
                description: 'XX Healthcare added 15 new technical employees',
                time: '4 hours ago'
            },
            {
                icon: 'fas fa-chart-line',
                iconColor: '#8b5cf6',
                title: 'Market Trends',
                hasDot: false,
                priority: null,
                description: 'Digital Health sector showing 23% growth this quarter',
                time: '6 hours ago'
            },
            {
                icon: 'fas fa-exclamation-triangle',
                iconColor: '#ef4444',
                title: 'Portfolio Alert',
                hasDot: true,
                priority: 'High Priority',
                description: 'XX Devices valuation dropped by 12% due to market conditions',
                time: '8 hours ago'
            },
            {
                icon: 'fas fa-calendar',
                iconColor: '#f59e0b',
                title: 'Upcoming Meeting',
                hasDot: false,
                priority: null,
                description: 'Quarterly review with XX Bio scheduled for tomorrow',
                time: '12 hours ago'
            },
            {
                icon: 'fas fa-users',
                iconColor: '#3b82f6',
                title: 'Team Expansion',
                hasDot: false,
                priority: null,
                description: 'XX Analytics is hiring 50+ engineers across all departments',
                time: '1 day ago'
            },
            {
                icon: 'fas fa-dollar-sign',
                iconColor: '#10b981',
                title: 'IPO Announcement',
                hasDot: true,
                priority: 'High Priority',
                description: 'XX Health announced plans to go public in Q2 2025',
                time: '2 days ago'
            },
            {
                icon: 'fas fa-chart-bar',
                iconColor: '#3b82f6',
                title: 'Sector Analysis',
                hasDot: false,
                priority: null,
                description: 'Biotech sector shows strong Q4 performance with 15% growth',
                time: '3 days ago'
            }
        ];

        const notificationsList = document.getElementById('notificationsList');
        notificationsList.innerHTML = notificationsData.map(notification => `
            <div class="notification-item" onclick="window.biotechDashboard.showNotificationDetails('${notification.title}', '${notification.description}', '${notification.time}', '${notification.priority || ''}')">
                <div class="notification-icon-large" style="background-color: ${notification.iconColor}">
                    <i class="${notification.icon}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">
                        <span class="notification-title-text">${notification.title}</span>
                        ${notification.hasDot ? '<span class="notification-dot"></span>' : ''}
                        ${notification.priority ? `<span class="notification-priority">${notification.priority}</span>` : ''}
                    </div>
                    <div class="notification-description">${notification.description}</div>
                    <div class="notification-time">${notification.time}</div>
                </div>
            </div>
        `).join('');
    }

    initializeChart() {
        const ctx = document.getElementById('investmentChart').getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
                datasets: [{
                    label: 'Investment Trends ($M)',
                    data: [300, 450, 400, 500, 350, 450, 600],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 800,
                        ticks: {
                            stepSize: 200,
                            callback: function(value) {
                                return value;
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    updateChartColors() {
        if (this.chart) {
            const isDark = this.currentTheme === 'dark';
            this.chart.options.scales.y.grid.color = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            this.chart.update();
        }
    }

    updateChartData(year) {
        // Simulate different data for different years
        const yearData = {
            '2023': [200, 300, 250, 350, 280, 320, 400],
            '2024': [300, 450, 400, 500, 350, 450, 600],
            '2025': [400, 550, 500, 650, 450, 550, 700]
        };

        if (this.chart && yearData[year]) {
            this.chart.data.datasets[0].data = yearData[year];
            this.chart.update();
        }
    }

    updateNewsData(period) {
        // Simulate different news data for different periods
        console.log('Updating news data for period:', period);
        // In a real application, this would fetch new data from an API
    }

    updateSectorInvestments(sector) {
        this.loadSectorInvestments(sector);
    }

    startLiveUpdates() {
        // Simulate live data updates every 30 seconds
        this.updateInterval = setInterval(() => {
            this.simulateLiveUpdate();
        }, 30000);
    }

    simulateLiveUpdate() {
        // Simulate random updates to make the dashboard feel live
        const randomUpdate = Math.random();
        
        if (randomUpdate < 0.3) {
            // Update funding rounds
            this.addNewFundingRound();
        } else if (randomUpdate < 0.6) {
            // Update notifications
            this.addNewNotification();
        } else {
            // Update chart data slightly
            this.updateChartSlightly();
        }
    }

    addNewFundingRound() {
        const fundingList = document.getElementById('fundingList');
        const newFunding = {
            name: 'NewTech Corp',
            initials: 'NT',
            color: '#8b5cf6',
            stage: 'Seed',
            time: 'Just now',
            amount: '$5.2M',
            industry: 'AI/ML'
        };

        const newElement = document.createElement('div');
        newElement.className = 'funding-item fade-in';
        newElement.innerHTML = `
            <div class="company-icon" style="background-color: ${newFunding.color}">
                ${newFunding.initials}
            </div>
            <div class="company-info">
                <div class="company-name">${newFunding.name}</div>
                <div class="company-details">
                    <span>${newFunding.stage}</span>
                    <span>${newFunding.time}</span>
                    <span class="funding-amount">${newFunding.amount}</span>
                    <span>${newFunding.industry}</span>
                </div>
            </div>
        `;

        fundingList.insertBefore(newElement, fundingList.firstChild);
        
        // Remove oldest item if we have too many
        if (fundingList.children.length > 8) {
            fundingList.removeChild(fundingList.lastChild);
        }
    }

    addNewNotification() {
        const notificationsList = document.getElementById('notificationsList');
        const newNotification = {
            icon: 'fas fa-bell',
            iconColor: '#3b82f6',
            title: 'Live Update',
            hasDot: true,
            priority: null,
            description: 'Dashboard data has been refreshed with latest information',
            time: 'Just now'
        };

        const newElement = document.createElement('div');
        newElement.className = 'notification-item fade-in';
        newElement.innerHTML = `
            <div class="notification-icon-large" style="background-color: ${newNotification.iconColor}">
                <i class="${newNotification.icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">
                    <span class="notification-title-text">${newNotification.title}</span>
                    ${newNotification.hasDot ? '<span class="notification-dot"></span>' : ''}
                    ${newNotification.priority ? `<span class="notification-priority">${newNotification.priority}</span>` : ''}
                </div>
                <div class="notification-description">${newNotification.description}</div>
                <div class="notification-time">${newNotification.time}</div>
            </div>
        `;

        notificationsList.insertBefore(newElement, notificationsList.firstChild);
        
        // Update notification count
        const badge = document.querySelector('.nav-item[data-page="notifications"] .notification-badge');
        const currentCount = parseInt(badge.textContent);
        badge.textContent = currentCount + 1;
    }

    updateChartSlightly() {
        if (this.chart) {
            const currentData = this.chart.data.datasets[0].data;
            const newData = currentData.map(value => {
                const change = (Math.random() - 0.5) * 20; // Random change between -10 and +10
                return Math.max(0, value + change);
            });
            
            this.chart.data.datasets[0].data = newData;
            this.chart.update('none'); // Update without animation for smoother live updates
        }
    }

    // Cleanup method
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.chart) {
            this.chart.destroy();
        }
    }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.biotechDashboard = new BiotechDashboard();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.biotechDashboard) {
        window.biotechDashboard.destroy();
    }
});
