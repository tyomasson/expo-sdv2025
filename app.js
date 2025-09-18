class PresentationApp {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 10;
        this.slides = document.querySelectorAll('.slide');
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateSlideCounter();
        this.updateProgressBar();
        this.updateNavButtons();
        this.setupKeyboardNavigation();
        this.addHoverEffects();
    }

    setupEventListeners() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        // Remove any existing listeners and add new ones
        prevBtn.removeEventListener('click', this.handlePrevClick);
        nextBtn.removeEventListener('click', this.handleNextClick);
        
        this.handlePrevClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.previousSlide();
        };
        
        this.handleNextClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.nextSlide();
        };

        prevBtn.addEventListener('click', this.handlePrevClick);
        nextBtn.addEventListener('click', this.handleNextClick);

        // Touch/swipe support for mobile
        this.setupTouchNavigation();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
                default:
                    // Number keys for direct navigation
                    if (e.key >= '1' && e.key <= '9') {
                        const slideNum = parseInt(e.key);
                        if (slideNum <= this.totalSlides) {
                            e.preventDefault();
                            this.goToSlide(slideNum);
                        }
                    }
                    break;
            }
        });
    }

    setupTouchNavigation() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;

            const deltaX = endX - startX;
            const deltaY = endY - startY;

            // Only handle horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        }, { passive: true });
    }

    nextSlide() {
        if (this.isAnimating || this.currentSlide >= this.totalSlides) return;
        console.log(`Next slide: ${this.currentSlide} -> ${this.currentSlide + 1}`);
        this.goToSlide(this.currentSlide + 1);
    }

    previousSlide() {
        if (this.isAnimating || this.currentSlide <= 1) return;
        console.log(`Previous slide: ${this.currentSlide} -> ${this.currentSlide - 1}`);
        this.goToSlide(this.currentSlide - 1);
    }

    goToSlide(slideNumber) {
        if (this.isAnimating || slideNumber === this.currentSlide || 
            slideNumber < 1 || slideNumber > this.totalSlides) {
            console.log(`Cannot navigate to slide ${slideNumber}: isAnimating=${this.isAnimating}, current=${this.currentSlide}`);
            return;
        }

        console.log(`Going to slide ${slideNumber} from ${this.currentSlide}`);
        this.isAnimating = true;

        // Remove active class from current slide
        const currentSlideElement = document.getElementById(`slide${this.currentSlide}`);
        if (currentSlideElement) {
            currentSlideElement.classList.remove('active');

            // Add prev class for slide-out animation
            if (slideNumber > this.currentSlide) {
                currentSlideElement.classList.add('prev');
            }
        }

        // Update current slide
        const previousSlide = this.currentSlide;
        this.currentSlide = slideNumber;

        // Show new slide after a brief delay
        setTimeout(() => {
            // Remove prev class from all slides
            this.slides.forEach(slide => slide.classList.remove('prev'));

            // Add active class to new slide
            const newSlideElement = document.getElementById(`slide${this.currentSlide}`);
            if (newSlideElement) {
                newSlideElement.classList.add('active');
                console.log(`Activated slide ${this.currentSlide}`);
            }

            // Update UI
            this.updateSlideCounter();
            this.updateProgressBar();
            this.updateNavButtons();

            // Trigger slide-specific animations
            setTimeout(() => {
                this.triggerSlideAnimations();
            }, 100);

            // Re-enable navigation after animation
            setTimeout(() => {
                this.isAnimating = false;
                console.log(`Navigation re-enabled for slide ${this.currentSlide}`);
            }, 200);
        }, 150);
    }

    updateSlideCounter() {
        const counter = document.getElementById('slideCounter');
        if (counter) {
            counter.textContent = `${this.currentSlide} / ${this.totalSlides}`;
            console.log(`Updated counter: ${this.currentSlide} / ${this.totalSlides}`);
        }
    }

    updateProgressBar() {
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            const progress = (this.currentSlide / this.totalSlides) * 100;
            progressFill.style.width = `${progress}%`;
        }
    }

    updateNavButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) {
            prevBtn.disabled = this.currentSlide <= 1;
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentSlide >= this.totalSlides;
        }
    }

    triggerSlideAnimations() {
        const currentSlideElement = document.getElementById(`slide${this.currentSlide}`);
        if (!currentSlideElement) return;
        
        // Reset any existing animations
        const animatedElements = currentSlideElement.querySelectorAll('[style*="opacity"], [style*="transform"]');
        animatedElements.forEach(el => {
            el.style.opacity = '';
            el.style.transform = '';
            el.style.transition = '';
        });
        
        // Add entrance animations based on slide content
        switch(this.currentSlide) {
            case 1:
                this.animateTitleSlide();
                break;
            case 2:
                this.animateProblemCards();
                break;
            case 3:
                this.animateExpertiseStats();
                break;
            case 4:
                this.animateTierCards();
                break;
            case 5:
                this.animateBenefitCards();
                break;
            case 6:
                this.animateSDVFeatures();
                break;
            case 7:
                this.animateMetrics();
                break;
            case 8:
                this.animateRoadmap();
                break;
            case 9:
                this.animateValueProps();
                break;
            case 10:
                this.animateCTA();
                break;
        }
    }

    animateTitleSlide() {
        const elements = [
            '.company-logo',
            '.main-title',
            '.tagline',
            '.specialization'
        ];

        elements.forEach((selector, index) => {
            const element = document.querySelector(`#slide${this.currentSlide} ${selector}`);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.6s ease-out';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }

    animateProblemCards() {
        const cards = document.querySelectorAll(`#slide${this.currentSlide} .problem-card`);
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }

    animateExpertiseStats() {
        const stats = document.querySelectorAll(`#slide${this.currentSlide} .stat`);
        stats.forEach((stat, index) => {
            const number = stat.querySelector('.stat-number');
            if (number) {
                const finalValue = number.textContent;
                let currentValue = 0;
                const increment = finalValue.includes('%') ? 
                    parseFloat(finalValue) / 30 : 
                    parseInt(finalValue) / 20;

                number.textContent = '0';
                
                setTimeout(() => {
                    const counter = setInterval(() => {
                        currentValue += increment;
                        if (finalValue.includes('%')) {
                            if (currentValue >= parseFloat(finalValue)) {
                                number.textContent = finalValue;
                                clearInterval(counter);
                            } else {
                                number.textContent = `${Math.floor(currentValue)}%`;
                            }
                        } else {
                            if (currentValue >= parseInt(finalValue)) {
                                number.textContent = finalValue;
                                clearInterval(counter);
                            } else {
                                number.textContent = Math.floor(currentValue);
                            }
                        }
                    }, 50);
                }, index * 200);
            }
        });
    }

    animateTierCards() {
        const cards = document.querySelectorAll(`#slide${this.currentSlide} .tier-card`);
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, index * 200);
        });
    }

    animateBenefitCards() {
        const cards = document.querySelectorAll(`#slide${this.currentSlide} .benefit-card`);
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-50px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, index * 150);
        });
    }

    animateSDVFeatures() {
        const features = document.querySelectorAll(`#slide${this.currentSlide} .feature-row`);
        features.forEach((feature, index) => {
            feature.style.opacity = '0';
            feature.style.transform = 'translateX(-60px)';
            
            setTimeout(() => {
                feature.style.transition = 'all 0.6s ease-out';
                feature.style.opacity = '1';
                feature.style.transform = 'translateX(0)';
            }, index * 200);
        });
    }

    animateMetrics() {
        const metrics = document.querySelectorAll(`#slide${this.currentSlide} .metric-item`);
        metrics.forEach((metric, index) => {
            metric.style.opacity = '0';
            metric.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                metric.style.transition = 'all 0.5s ease-out';
                metric.style.opacity = '1';
                metric.style.transform = 'scale(1)';
            }, index * 150);
        });
    }

    animateRoadmap() {
        const phases = document.querySelectorAll(`#slide${this.currentSlide} .roadmap-phase`);
        phases.forEach((phase, index) => {
            phase.style.opacity = '0';
            phase.style.transform = 'translateY(40px)';
            
            setTimeout(() => {
                phase.style.transition = 'all 0.6s ease-out';
                phase.style.opacity = '1';
                phase.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    animateValueProps() {
        const cards = document.querySelectorAll(`#slide${this.currentSlide} .value-card`);
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    animateCTA() {
        const elements = [
            '.cta-main',
            '.cta-contact'
        ];

        elements.forEach((selector, index) => {
            const element = document.querySelector(`#slide${this.currentSlide} ${selector}`);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateX(40px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.6s ease-out';
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                }, index * 300);
            }
        });
    }

    addHoverEffects() {
        // Add interactive hover effects to metric badges
        const hoverCards = document.querySelectorAll('.hover-card');
        hoverCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const metric = card.dataset.metric;
                if (metric) {
                    const badge = card.querySelector('.metric-badge');
                    if (badge) {
                        badge.style.transform = 'scale(1.1)';
                        badge.style.boxShadow = '0 4px 12px rgba(33, 128, 141, 0.3)';
                    }
                }
            });

            card.addEventListener('mouseleave', () => {
                const badge = card.querySelector('.metric-badge');
                if (badge) {
                    badge.style.transform = 'scale(1)';
                    badge.style.boxShadow = 'none';
                }
            });
        });

        // Add click handler for CTA button
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                // Simulate contact action
                this.showContactModal();
            });
        }
    }

    showContactModal() {
        // Create a simple modal effect
        const button = document.querySelector('.cta-button');
        if (!button) return;
        
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-check"></i> Thank You!';
        button.style.background = 'var(--color-success)';
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = 'var(--color-primary)';
            button.disabled = false;
        }, 2000);
    }

    // Auto-play functionality (optional)
    startAutoPlay(interval = 10000) {
        this.autoPlayInterval = setInterval(() => {
            if (this.currentSlide < this.totalSlides) {
                this.nextSlide();
            } else {
                this.stopAutoPlay();
            }
        }, interval);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    // Utility method to reset presentation
    reset() {
        this.goToSlide(1);
    }
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const presentation = new PresentationApp();

    // Optional: Add auto-play toggle
    let autoPlayEnabled = false;
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'p' && e.ctrlKey) {
            e.preventDefault();
            if (autoPlayEnabled) {
                presentation.stopAutoPlay();
                autoPlayEnabled = false;
                console.log('Auto-play stopped');
            } else {
                presentation.startAutoPlay(8000); // 8 seconds per slide
                autoPlayEnabled = true;
                console.log('Auto-play started');
            }
        }
        
        // Reset presentation with Ctrl+R
        if (e.key.toLowerCase() === 'r' && e.ctrlKey) {
            e.preventDefault();
            presentation.reset();
        }
    });

    // Add window resize handler for responsive adjustments
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Trigger re-animation for current slide after resize
            presentation.triggerSlideAnimations();
        }, 250);
    });

    // Add visibility change handler to pause auto-play when not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && autoPlayEnabled) {
            presentation.stopAutoPlay();
        } else if (!document.hidden && autoPlayEnabled) {
            presentation.startAutoPlay(8000);
        }
    });

    // Expose presentation instance globally for debugging
    window.presentation = presentation;
});