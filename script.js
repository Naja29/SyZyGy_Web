// ========================================
// SYZYGY INSTITUTE - MAIN JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // MOBILE NAVIGATION
    // ========================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (!icon) return;
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && mainNav && mobileMenuToggle) {
                mainNav.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                if (!icon) return;
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });

    // ========================================
    // HERO SLIDER
    // ========================================
    const heroSlides = document.querySelectorAll('.hero-slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        heroSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % heroSlides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
        showSlide(currentSlide);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    if (heroSlides.length > 1) {
        startSlider();

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                stopSlider();
                startSlider();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                stopSlider();
                startSlider();
            });
        }
    }

    // ========================================
    // LECTURER CAROUSEL
    // (center card large, side cards smaller – like the design)
    // ========================================
    const lecturerCarousel = document.getElementById('lecturerCarousel');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');

    if (lecturerCarousel) {
        const lecturerCards = Array.from(
            lecturerCarousel.querySelectorAll('.l-card')
        );

        // Index of the card that should be in the center
        let currentIndex = Math.floor(lecturerCards.length / 2);

        function updateCarousel() {
            const total = lecturerCards.length;

            lecturerCards.forEach((card, index) => {
                // position relative to current center in range [-2, 2]
                let position = index - currentIndex;
                if (position < -2) position += total;
                if (position > 2) position -= total;

                // Map relative position (-2..2) to data-position (0..4)
                // -2 -> 0 (far left)
                // -1 -> 1 (left)
                //  0 -> 2 (center)
                //  1 -> 3 (right)
                //  2 -> 4 (far right)
                const mapped = position + 2;

                card.dataset.position = String(mapped);
                card.style.order = String(mapped);

                // Optional small z-index tweak so center card is always on top
                if (mapped === 2) {
                    card.style.zIndex = '5';
                } else if (mapped === 1 || mapped === 3) {
                    card.style.zIndex = '3';
                } else {
                    card.style.zIndex = '1';
                }

                card.style.transition =
                    'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        }

        function rotateCarousel(direction) {
            const total = lecturerCards.length;
            if (direction === 'next') {
                currentIndex = (currentIndex + 1) % total;
            } else {
                currentIndex = (currentIndex - 1 + total) % total;
            }
            updateCarousel();
        }

        // Initialize positions
        updateCarousel();

        // Controls
        if (carouselNext) {
            carouselNext.addEventListener('click', () => {
                rotateCarousel('next');
            });
        }

        if (carouselPrev) {
            carouselPrev.addEventListener('click', () => {
                rotateCarousel('prev');
            });
        }

        // Auto-rotate
        let carouselInterval = setInterval(
            () => rotateCarousel('next'),
            4000
        );

        // Pause on hover
        lecturerCarousel.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });

        lecturerCarousel.addEventListener('mouseleave', () => {
            carouselInterval = setInterval(
                () => rotateCarousel('next'),
                4000
            );
        });

        // Click on card to bring it to center
        lecturerCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
                clearInterval(carouselInterval);
                carouselInterval = setInterval(
                    () => rotateCarousel('next'),
                    4000
                );
            });
        });
    }

    // ========================================
    // FAQ ACCORDION
    // ========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // ========================================
    // SMOOTH SCROLL FOR NAVIGATION
    // ========================================
    document
        .querySelectorAll('a[href^="#"]')
        .forEach(anchor => {
            anchor.addEventListener('click', e => {
                const href = anchor.getAttribute('href');
                if (href === '#' || href === '#login') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition =
                    elementPosition +
                    window.pageYOffset -
                    headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            });
        });

    // ========================================
    // ACTIVE NAVIGATION ON SCROLL
    // ========================================
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(
                `nav ul li a[href="#${sectionId}"]`
            );

            if (
                navLink &&
                scrollY > sectionTop &&
                scrollY <= sectionTop + sectionHeight
            ) {
                navLinks.forEach(link =>
                    link.classList.remove('active')
                );
                navLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ========================================
    // HEADER SHADOW ON SCROLL
    // ========================================
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (!header) return;
        if (window.scrollY > 50) {
            header.style.boxShadow =
                '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow =
                '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
    });

    // ========================================
    // SCROLL ANIMATIONS (Simple Fade-in)
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document
        .querySelectorAll('[data-aos]')
        .forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition =
                'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });

    // ========================================
    // CARD HOVER EFFECTS
    // (separate variable name to avoid conflict with lecturer cards)
    // ========================================
    const hoverCards = document.querySelectorAll(
        '.feature-card, .grid-card, .tt-card, .fb-card'
    );

    hoverCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // ========================================
    // TIMETABLE CARD CLICK HANDLER
    // ========================================
    const ttCards = document.querySelectorAll('.tt-card');

    ttCards.forEach(card => {
        card.addEventListener('click', function () {
            const year = this.querySelector('h3')?.textContent || '';
            if (!year) return;
            alert(`Redirecting to ${year} timetable...`);
            // In production: window.location.href = 'timetable.html?year=' + encodeURIComponent(year);
        });
    });

    // ========================================
    // LAZY LOADING IMAGES
    // ========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(
            (entries, observerInstance) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        observerInstance.unobserve(img);
                    }
                });
            }
        );

        document
            .querySelectorAll('img[data-src]')
            .forEach(img => imageObserver.observe(img));
    }

    // ========================================
    // CONSOLE WELCOME MESSAGE
    // ========================================
    console.log(
        'SyZyGy Institute – Reach Your Potential (scripts loaded)'
    );
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function debounced() {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
            (window.innerHeight ||
                document.documentElement.clientHeight) &&
        rect.right <=
            (window.innerWidth ||
                document.documentElement.clientWidth)
    );
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}