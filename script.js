// ========================================
// SYZYGY INSTITUTE - MAIN JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // MOBILE NAVIGATION
    // ========================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                mainNav.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
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
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
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
    
    // Auto-play slider
    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }
    
    function stopSlider() {
        clearInterval(slideInterval);
    }
    
    if (heroSlides.length > 1) {
        startSlider();
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                nextSlide();
                stopSlider();
                startSlider();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                prevSlide();
                stopSlider();
                startSlider();
            });
        }
    }
    
    // ========================================
    // LECTURER CAROUSEL
    // ========================================
    const carousel = document.getElementById('lecturerCarousel');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    
    if (carousel) {
        const cards = Array.from(carousel.querySelectorAll('.l-card'));
        let currentIndex = 2; // Start with middle card as center
        
        function updateCarousel() {
            cards.forEach((card, index) => {
                // Calculate position relative to current center
                let position = index - currentIndex;
                
                // Handle wrapping
                if (position < -2) position += cards.length;
                if (position > 2) position -= cards.length;
                
                // Set position attribute for CSS styling
                card.setAttribute('data-position', Math.abs(position));
                
                // Apply transformations
                card.style.order = position + 2;
                
                // Add smooth transition
                card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        }
        
        function rotateCarousel(direction) {
            if (direction === 'next') {
                currentIndex = (currentIndex + 1) % cards.length;
            } else {
                currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            }
            updateCarousel();
        }
        
        // Initialize carousel
        updateCarousel();
        
        // Event listeners
        if (carouselNext) {
            carouselNext.addEventListener('click', () => rotateCarousel('next'));
        }
        
        if (carouselPrev) {
            carouselPrev.addEventListener('click', () => rotateCarousel('prev'));
        }
        
        // Auto-rotate carousel
        let carouselInterval = setInterval(() => rotateCarousel('next'), 4000);
        
        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            carouselInterval = setInterval(() => rotateCarousel('next'), 4000);
        });
        
        // Click on card to center it
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
                clearInterval(carouselInterval);
                carouselInterval = setInterval(() => rotateCarousel('next'), 4000);
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
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // ========================================
    // SMOOTH SCROLL FOR NAVIGATION
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or "#login"
            if (href === '#' || href === '#login') {
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
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
            const navLink = document.querySelector(`nav ul li a[href="#${sectionId}"]`);
            
            if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
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
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
    });
    
    // ========================================
    // SCROLL ANIMATIONS (Simple Fade-in)
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // ========================================
    // CARD HOVER EFFECTS
    // ========================================
    const cards = document.querySelectorAll('.feature-card, .grid-card, .tt-card, .fb-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // ========================================
    // TIMETABLE CARD CLICK HANDLER
    // ========================================
    const ttCards = document.querySelectorAll('.tt-card');
    
    ttCards.forEach(card => {
        card.addEventListener('click', function() {
            const year = this.querySelector('h3').textContent;
            alert(`Redirecting to ${year} timetable...`);
            // In production, replace with: window.location.href = 'timetable.html?year=' + year;
        });
    });
    
    // ========================================
    // LAZY LOADING IMAGES
    // ========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ========================================
    // CONSOLE WELCOME MESSAGE
    // ========================================
    console.log('%c🎓 Welcome to SyZyGy Institute! ', 'background: #1E40AF; color: white; padding: 10px; font-size: 16px; font-weight: bold;');
    console.log('%cReach Your Potential with Expert Education', 'color: #D32F2F; font-size: 14px;');
    
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Debounce function for scroll events
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth scroll to top button (if needed)
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}