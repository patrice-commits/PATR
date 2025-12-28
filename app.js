// ================================
// INTERACTIVE CV APPLICATION
// Patrice Rivest - v1.0
// ================================

class CVApp {
    constructor() {
        this.currentLang = 'fr';
        this.content = {};
        this.portfolio = {};
        this.activeFilters = new Set();

        this.init();
    }

    async init() {
        await this.loadContent();
        this.setupEventListeners();
        this.renderContent();
        this.setupSmoothScroll();
        this.setupScrollEffects();

        // Load language preference
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang && savedLang !== this.currentLang) {
            this.switchLanguage(savedLang);
        }
    }

    // ================================
    // CONTENT LOADING
    // ================================
    async loadContent() {
        try {
            // Load French content
            const frResponse = await fetch('content.fr.json');
            this.content.fr = await frResponse.json();

            // Load English content
            const enResponse = await fetch('content.en.json');
            this.content.en = await enResponse.json();

            // Load portfolio
            const portfolioResponse = await fetch('portfolio.json');
            this.portfolio = await portfolioResponse.json();

        } catch (error) {
            console.error('Error loading content:', error);
        }
    }

    // ================================
    // CONTENT RENDERING
    // ================================
    renderContent() {
        const data = this.content[this.currentLang];
        if (!data) return;

        // Update all elements with data-content attribute
        document.querySelectorAll('[data-content]').forEach(el => {
            const path = el.getAttribute('data-content');
            const value = this.getNestedProperty(data, path);
            if (value) {
                el.textContent = value;
            }
        });

        // Render dynamic sections
        this.renderCompetencies(data.competencies);
        this.renderExperience(data.experience);
        this.renderAchievements(data.achievements);
        this.renderPortfolio();

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;
    }

    renderCompetencies(competenciesData) {
        const container = document.getElementById('competenciesContainer');
        if (!container) return;

        container.innerHTML = competenciesData.categories.map(category => `
            <div class="competency-category">
                <h3 class="competency-category-name">${category.name}</h3>
                <div class="competency-tags">
                    ${category.skills.map(skill => `
                        <span class="tag" data-skill="${skill}">${skill}</span>
                    `).join('')}
                </div>
            </div>
        `).join('');

        // Add click handlers to tags
        container.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', () => {
                tag.classList.toggle('active');
                const skill = tag.getAttribute('data-skill');

                if (tag.classList.contains('active')) {
                    this.activeFilters.add(skill.toLowerCase());
                } else {
                    this.activeFilters.delete(skill.toLowerCase());
                }

                this.filterExperienceAndPortfolio();
            });
        });
    }

    renderExperience(experienceData) {
        const container = document.getElementById('experienceTimeline');
        if (!container) return;

        container.innerHTML = experienceData.positions.map((position, index) => `
            <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-card" data-position="${index}">
                    <div class="timeline-header">
                        <div>
                            <div class="timeline-company">${position.company}</div>
                            <h3 class="timeline-title">${position.title}</h3>
                        </div>
                        <span class="timeline-period">${position.period}</span>
                    </div>
                    <p class="timeline-description">${position.description}</p>
                    ${position.tags ? `
                        <div class="timeline-tags">
                            ${position.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                    <div class="timeline-achievements collapsed" id="achievements-${index}">
                        <h4>Key Achievements:</h4>
                        <ul>
                            ${position.achievements.map(achievement => `
                                <li>${achievement}</li>
                            `).join('')}
                        </ul>
                    </div>
                    <button class="timeline-toggle" data-target="achievements-${index}">
                        <span class="toggle-text">Show Details</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');

        // Add toggle handlers
        container.querySelectorAll('.timeline-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const targetId = btn.getAttribute('data-target');
                const target = document.getElementById(targetId);
                const toggleText = btn.querySelector('.toggle-text');

                target.classList.toggle('collapsed');
                btn.classList.toggle('expanded');

                if (target.classList.contains('collapsed')) {
                    toggleText.textContent = this.currentLang === 'fr' ? 'Voir Détails' : 'Show Details';
                } else {
                    toggleText.textContent = this.currentLang === 'fr' ? 'Masquer Détails' : 'Hide Details';
                }
            });
        });
    }

    renderAchievements(achievementsData) {
        const container = document.getElementById('achievementsGrid');
        if (!container) return;

        container.innerHTML = achievementsData.metrics.map(metric => `
            <div class="achievement-card">
                <div class="achievement-value">${metric.value}</div>
                <div class="achievement-label">${metric.label}</div>
            </div>
        `).join('');
    }

    renderPortfolio() {
        const filterContainer = document.getElementById('portfolioFilters');
        const gridContainer = document.getElementById('portfolioGrid');
        const data = this.content[this.currentLang];

        if (!filterContainer || !gridContainer) return;

        // Get unique categories
        const categories = [...new Set(this.portfolio.items.map(item => item.category))];

        // Render filter buttons (keep "All" button, add category buttons)
        const categoryButtons = categories.map(cat => {
            const categoryLabel = data.portfolioSection.categories[cat] || cat;
            return `<button class="filter-btn" data-filter="${cat}">${categoryLabel}</button>`;
        }).join('');

        // Keep the existing "All" button and append category buttons
        const allButton = filterContainer.querySelector('[data-filter="all"]');
        if (allButton) {
            allButton.insertAdjacentHTML('afterend', categoryButtons);
        }

        // Render portfolio items
        gridContainer.innerHTML = this.portfolio.items.map(item => {
            const title = this.currentLang === 'fr' ? item.title : (item.titleEn || item.title);
            const description = this.currentLang === 'fr' ? item.description : (item.descriptionEn || item.description);
            const hasUrl = item.url && item.url.trim() !== '';

            // Generate video thumbnail if it's a video
            let thumbnailHtml = '';
            if (item.category === 'video' && hasUrl) {
                let thumbnailUrl = '';

                // YouTube thumbnail
                if (item.url.includes('youtube.com') || item.url.includes('youtu.be')) {
                    const videoId = this.extractYouTubeId(item.url);
                    if (videoId) {
                        thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                    }
                }
                // Facebook video placeholder
                else if (item.url.includes('facebook.com')) {
                    thumbnailUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="480" height="360"%3E%3Crect width="480" height="360" fill="%231877f2"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="28" fill="white"%3EFacebook Video%3C/text%3E%3C/svg%3E';
                }

                if (thumbnailUrl) {
                    thumbnailHtml = `
                        <div class="portfolio-thumbnail">
                            <img src="${thumbnailUrl}" alt="${title}" class="portfolio-thumb-img">
                            <div class="play-icon">
                                <svg width="60" height="60" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" fill="rgba(0,0,0,0.7)"/>
                                    <polygon points="10,8 16,12 10,16" fill="white"/>
                                </svg>
                            </div>
                        </div>
                    `;
                }
            }

            return `
                <div class="portfolio-card" data-category="${item.category}" data-tags="${item.tags.join(',').toLowerCase()}">
                    ${thumbnailHtml}
                    <div class="portfolio-content">
                        <span class="portfolio-type">${item.type}</span>
                        <h3 class="portfolio-title">${title}</h3>
                        <p class="portfolio-platform">${item.platform} ${item.year ? `• ${item.year}` : ''}</p>
                        <p class="portfolio-description">${description}</p>
                        <div class="portfolio-tags">
                            ${item.tags.map(tag => `<span class="portfolio-tag">${tag}</span>`).join('')}
                        </div>
                        ${hasUrl
                    ? `<a href="${item.url}" class="portfolio-link available" target="_blank" rel="noopener">View →</a>`
                    : `<span class="portfolio-link">${this.currentLang === 'fr' ? 'URL à venir' : 'URL coming soon'}</span>`
                }
                    </div>
                </div>
            `;
        }).join('');

        // Setup filter handlers
        this.setupPortfolioFilters();
    }

    extractYouTubeId(url) {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
    }

    // ================================
    // PORTFOLIO FILTERING
    // ================================
    setupPortfolioFilters() {
        const filterBtns = document.querySelectorAll('#portfolioFilters .filter-btn');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');
                this.filterPortfolioByCategory(filter);
            });
        });
    }

    filterPortfolioByCategory(category) {
        const cards = document.querySelectorAll('.portfolio-card');

        cards.forEach(card => {
            if (category === 'all') {
                card.classList.remove('hidden');
            } else {
                const cardCategory = card.getAttribute('data-category');
                if (cardCategory === category) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            }
        });
    }

    filterExperienceAndPortfolio() {
        if (this.activeFilters.size === 0) {
            // Show all if no filters active
            document.querySelectorAll('.timeline-item').forEach(item => {
                item.style.display = 'block';
            });
            document.querySelectorAll('.portfolio-card').forEach(card => {
                card.classList.remove('hidden');
            });
            return;
        }

        // Filter experience
        document.querySelectorAll('.timeline-item').forEach(item => {
            const tags = Array.from(item.querySelectorAll('.timeline-tags .tag'))
                .map(tag => tag.textContent.toLowerCase());

            const matches = tags.some(tag =>
                Array.from(this.activeFilters).some(filter =>
                    tag.includes(filter) || filter.includes(tag)
                )
            );

            item.style.display = matches ? 'block' : 'none';
        });

        // Filter portfolio
        document.querySelectorAll('.portfolio-card').forEach(card => {
            const tags = card.getAttribute('data-tags').split(',');

            const matches = tags.some(tag =>
                Array.from(this.activeFilters).some(filter =>
                    tag.includes(filter) || filter.includes(tag)
                )
            );

            if (matches) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    // ================================
    // LANGUAGE SWITCHING
    // ================================
    setupEventListeners() {
        // Language toggle
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                const newLang = this.currentLang === 'fr' ? 'en' : 'fr';
                this.switchLanguage(newLang);
            });
        }

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking a link
            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    switchLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('preferred-language', lang);

        // Update language toggle UI
        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
        });

        // Re-render content
        this.renderContent();
    }

    // ================================
    // SMOOTH SCROLL
    // ================================
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ================================
    // SCROLL EFFECTS
    // ================================
    setupScrollEffects() {
        const header = document.querySelector('.header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Add scrolled class to header
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });

        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe timeline items and cards
        setTimeout(() => {
            document.querySelectorAll('.timeline-item, .achievement-card, .portfolio-card, .competency-category').forEach(el => {
                observer.observe(el);
            });
        }, 500);
    }

    // ================================
    // UTILITY FUNCTIONS
    // ================================
    getNestedProperty(obj, path) {
        return path.split('.').reduce((current, prop) => current?.[prop], obj);
    }
}

// ================================
// INITIALIZE APP
// ================================
document.addEventListener('DOMContentLoaded', () => {
    new CVApp();
});
