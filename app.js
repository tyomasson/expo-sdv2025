class PresentationApp {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 11;
        this.slides = document.querySelectorAll('.slide');
        this.isAnimating = false;
        
        // Assessment data
        this.assessmentData = {
            questions: [
                {
                    id: "automation_level",
                    question: "What is your current level of automation in software development processes?",
                    options: [
                        {value: 1, label: "Manual processes, minimal automation"},
                        {value: 2, label: "Basic automation (CI, some tests)"},
                        {value: 3, label: "Full CI/CD with automated testing"}
                    ]
                },
                {
                    id: "platforms_count", 
                    question: "How many automotive platforms are you developing?",
                    options: [
                        {value: 1, label: "1-2 platforms"},
                        {value: 2, label: "3-5 platforms"},
                        {value: 3, label: "More than 5 platforms"}
                    ]
                },
                {
                    id: "quality_metrics",
                    question: "What quality metrics do you track?",
                    options: [
                        {value: 1, label: "Not tracking systematically"},
                        {value: 2, label: "Basic metrics (bugs, development time)"},
                        {value: 3, label: "Advanced metrics with dashboards and analytics"}
                    ]
                },
                {
                    id: "production_defects",
                    question: "How often do you experience defects in production?",
                    options: [
                        {value: 1, label: "Often (several times per month)"},
                        {value: 2, label: "Sometimes (once a month or less)"},
                        {value: 3, label: "Rarely (once a quarter or less)"}
                    ]
                },
                {
                    id: "sdv_plans",
                    question: "Are you planning to transition to Software-Defined Vehicle architecture?",
                    options: [
                        {value: 1, label: "Not planning in the near future"},
                        {value: 2, label: "Considering the possibilities"},
                        {value: 3, label: "Actively planning implementation"}
                    ]
                }
            ],
            readinessLevels: [
                {
                    level: "low",
                    range: [0, 6],
                    title: "Initial Readiness Level",
                    description: "We recommend starting with basic automation of development processes",
                    recommendations: [
                        "Implement basic CI/CD processes",
                        "Automate testing procedures", 
                        "Establish quality metrics",
                        "Train team in DevOps practices"
                    ]
                },
                {
                    level: "medium",
                    range: [7, 12], 
                    title: "DevOps Factory Ready",
                    description: "You have the foundation to implement DevOps Factory approaches",
                    recommendations: [
                        "Extend automation to all processes",
                        "Implement quality gates",
                        "Integrate real-time metrics",
                        "Prepare for scaling"
                    ]
                },
                {
                    level: "high",
                    range: [13, 15],
                    title: "SDV Factory Ready", 
                    description: "High readiness for transformation to SDV Factory",
                    recommendations: [
                        "Centralize development tools",
                        "Implement cross-platform automation",
                        "Deploy OTA updates and validation",
                        "Integrate AI-driven analytics and optimization"
                    ]
                }
            ]
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateSlideCounter();
        this.updateProgressBar();
        this.updateNavButtons();
        this.setupKeyboardNavigation();
        this.addHoverEffects();
        this.setupAssessmentForm();
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
            // Don't handle keyboard events when in assessment form
            if (this.currentSlide === 10 && e.target.tagName === 'INPUT') {
                return;
            }

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

            // Only handle horizontal swipes outside of assessment slide
            if (this.currentSlide !== 10 && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        }, { passive: true });
    }

    setupAssessmentForm() {
        const submitBtn = document.getElementById('submitAssessment');
        const retakeBtn = document.getElementById('retakeAssessment');
        
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleAssessmentSubmit();
            });
        }

        if (retakeBtn) {
            retakeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetAssessment();
            });
        }

        // Contact us button handler
        const contactBtns = document.querySelectorAll('.contact-us-btn, .cta-button');
        contactBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.showContactModal();
            });
        });
    }

    handleAssessmentSubmit() {
        const submitBtn = document.getElementById('submitAssessment');
        const contactInputs = ['contactName', 'contactEmail', 'contactCompany', 'contactRole'];
        
        // Validate contact information
        let isContactValid = true;
        contactInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (!input || !input.value.trim()) {
                isContactValid = false;
                if (input) {
                    input.style.borderColor = 'var(--color-error)';
                    input.addEventListener('input', () => {
                        input.style.borderColor = '';
                    }, { once: true });
                }
            }
        });

        // Validate email format
        const emailInput = document.getElementById('contactEmail');
        if (emailInput && emailInput.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                isContactValid = false;
                emailInput.style.borderColor = 'var(--color-error)';
                emailInput.addEventListener('input', () => {
                    emailInput.style.borderColor = '';
                }, { once: true });
            }
        }

        if (!isContactValid) {
            this.showNotification('Please fill in all contact information fields correctly.', 'error');
            return;
        }

        // Calculate assessment score
        const score = this.calculateAssessmentScore();
        
        if (score === null) {
            this.showNotification('Please answer all assessment questions.', 'error');
            return;
        }

        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner"></i> Calculating Results...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        // Simulate processing time
        setTimeout(() => {
            this.showAssessmentResults(score);
            submitBtn.innerHTML = '<i class="fas fa-chart-line"></i> Get Readiness Assessment';
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }, 1500);
    }

    calculateAssessmentScore() {
        let totalScore = 0;
        let answeredQuestions = 0;
        
        this.assessmentData.questions.forEach(question => {
            const selectedOption = document.querySelector(`input[name="${question.id}"]:checked`);
            if (selectedOption) {
                totalScore += parseInt(selectedOption.value);
                answeredQuestions++;
            }
        });

        return answeredQuestions === this.assessmentData.questions.length ? totalScore : null;
    }

    showAssessmentResults(score) {
        const resultsSection = document.getElementById('resultsSection');
        const resultsTitle = document.getElementById('resultsTitle');
        const scoreValue = document.getElementById('scoreValue');
        const resultsDescription = document.getElementById('resultsDescription');
        const recommendationsList = document.getElementById('recommendationsList');

        // Find the appropriate readiness level
        const readinessLevel = this.assessmentData.readinessLevels.find(level => 
            score >= level.range[0] && score <= level.range[1]
        );

        if (!readinessLevel) return;

        // Update results display
        resultsTitle.textContent = readinessLevel.title;
        scoreValue.textContent = score;
        resultsDescription.textContent = readinessLevel.description;

        // Clear and populate recommendations
        recommendationsList.innerHTML = '';
        readinessLevel.recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            recommendationsList.appendChild(li);
        });

        // Show results with animation
        resultsSection.classList.remove('hidden');
        setTimeout(() => {
            resultsSection.classList.add('visible');
            // Scroll to results
            document.getElementById('assessmentContainer').scrollTop = resultsSection.offsetTop - 100;
        }, 100);

        // Update results icon based on score
        const resultsIcon = document.querySelector('.results-icon');
        if (score <= 6) {
            resultsIcon.className = 'fas fa-seedling results-icon';
            resultsIcon.style.color = '#ffd700';
        } else if (score <= 12) {
            resultsIcon.className = 'fas fa-cogs results-icon';
            resultsIcon.style.color = '#ffd700';
        } else {
            resultsIcon.className = 'fas fa-trophy results-icon';
            resultsIcon.style.color = '#ffd700';
        }
    }

    resetAssessment() {
        // Clear all form inputs
        const form = document.querySelector('.assessment-form');
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type === 'radio') {
                input.checked = false;
            } else {
                input.value = '';
            }
            input.style.borderColor = '';
        });

        // Hide results
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.classList.remove('visible');
        setTimeout(() => {
            resultsSection.classList.add('hidden');
        }, 300);

        // Scroll to top of assessment
        document.getElementById('assessmentContainer').scrollTop = 0;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-${type === 'error' ? 'error' : 'info'});
            color: var(--color-btn-primary-text);
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
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
                this.animateAssessment();
                break;
            case 11:
                this.animateCTA();
                break;
        }
    }

    animateAssessment() {
        const elements = [
            '.contact-section',
            '.questions-section',
            '.submit-section'
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

        // Animate question cards
        setTimeout(() => {
            const questionCards = document.querySelectorAll(`#slide${this.currentSlide} .question-card`);
            questionCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateX(-30px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.5s ease-out';
                    card.style.opacity = '1';
                    card.style.transform = 'translateX(0)';
                }, index * 100);
            });
        }, 800);
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
    }

    showContactModal() {
        // Create a simple modal effect
        const buttons = document.querySelectorAll('.cta-button, .contact-us-btn');
        
        buttons.forEach(button => {
            if (!button.dataset.clicked) {
                const originalText = button.innerHTML;
                
                button.innerHTML = '<i class="fas fa-check"></i> Thank You!';
                button.style.background = 'var(--color-success)';
                button.disabled = true;
                button.dataset.clicked = 'true';

                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = '';
                    button.disabled = false;
                    delete button.dataset.clicked;
                }, 2000);
            }
        });
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
        this.resetAssessment();
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