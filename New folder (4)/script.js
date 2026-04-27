// ==========================================================================
// SCROLL REVEAL ANIMATION (Intersection Observer)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal Animation (Simplified version)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });

    // Mobile Menu Toggle logic
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksAnchors = document.querySelectorAll('.nav-links a');

    const toggleMenu = () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleMenu);

    navLinksAnchors.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        
        // Save preference
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
        
        // Adjust particle colors if needed
        if (typeof window.initParticles === 'function') {
            // Re-init particles if they need color adjustment
            // (Optional: current particles are teal/gold which work on both)
        }
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.background = body.classList.contains('light-mode') 
                ? 'rgba(255, 255, 255, 0.95)' 
                : 'rgba(10, 10, 10, 0.95)';
        } else {
            header.style.padding = '20px 0';
        }
    });

    // ==========================================================================
    // WHY AL-JISR SLIDER LOGIC
    // ==========================================================================
    const sliderTrack = document.querySelector('.slider-track');
    const sliderBtnPrev = document.querySelector('.slider-btn.prev');
    const sliderBtnNext = document.querySelector('.slider-btn.next');
    const sliderDotsContainer = document.querySelector('.slider-dots');
    const sliderCards = document.querySelectorAll('.feature-card');

    if (sliderTrack) {
        let currentIndex = 0;
        let cardsToShow = 3;

        const updateCardsToShow = () => {
            if (window.innerWidth <= 600) {
                cardsToShow = 1;
            } else if (window.innerWidth <= 992) {
                cardsToShow = 2;
            } else {
                cardsToShow = 3;
            }
            createDots();
            moveToSlide(currentIndex);
        };

        const createDots = () => {
            sliderDotsContainer.innerHTML = '';
            const totalSlides = Math.ceil(sliderCards.length / cardsToShow);
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = i * cardsToShow;
                    moveToSlide(currentIndex);
                });
                sliderDotsContainer.appendChild(dot);
            }
        };

        const updateDots = () => {
            const activeDotIndex = Math.floor(currentIndex / cardsToShow);
            const dots = sliderDotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeDotIndex);
            });
        };

        const moveToSlide = (index) => {
            const maxIndex = sliderCards.length - cardsToShow;
            if (index < 0) index = 0;
            if (index > maxIndex) index = maxIndex;
            
            currentIndex = index;
            const gap = 30; // From CSS
            const cardWidth = sliderCards[0].offsetWidth;
            const offset = currentIndex * (cardWidth + gap);
            
            sliderTrack.style.transform = `translateX(${offset}px)`; // RTL uses positive translateX to move left
            updateDots();
        };

        sliderBtnNext.addEventListener('click', () => {
            if (currentIndex < sliderCards.length - cardsToShow) {
                moveToSlide(currentIndex + 1);
            } else {
                moveToSlide(0); // Loop back
            }
        });

        sliderBtnPrev.addEventListener('click', () => {
            if (currentIndex > 0) {
                moveToSlide(currentIndex - 1);
            } else {
                moveToSlide(sliderCards.length - cardsToShow); // Loop to end
            }
        });

        // Initialize Slider
        window.addEventListener('resize', updateCardsToShow);
        updateCardsToShow();

        // Optional: Swipe support
        let startX = 0;
        let isDragging = false;

        sliderTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        sliderTrack.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    sliderBtnPrev.click(); // In RTL, swiping right (diff > 0) means prev? 
                    // Wait, RTL logic: move right to go forward? 
                    // Let's test: 
                    // Swipe Left (currentX < startX => diff > 0) should go to Next
                    // Swipe Right (currentX > startX => diff < 0) should go to Prev
                    sliderBtnNext.click();
                } else {
                    sliderBtnPrev.click();
                }
                isDragging = false;
            }
        });

        sliderTrack.addEventListener('touchend', () => {
            isDragging = false;
        });
    }
});

// ==========================================================================
// BACKGROUND PARTICLES EFFECT (Dynamic energy in Teal & Gold)
// ==========================================================================
const canvas = document.getElementById('particle-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const particleCount = 70; // Adjust for density
    
    // Resize canvas to cover hero section
    function resizeCanvas() {
        // Because canvas is absolutely positioned inside a relative hero section
        const hero = document.getElementById('hero');
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // The brand colors: Navy & Gold
    const colors = [
        '#153B5B', // Navy
        '#C59634', // Mid-Gold
        '#EFDD9C', // Cream-Gold
        'rgba(21, 59, 91, 0.5)' // Soft Navy
    ];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1; // Particle size 1-4px
            
            // Slow, fluid motion
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = (Math.random() - 0.5) * 0.8;
            
            this.color = colors[Math.floor(Math.random() * colors.length)];
            
            // Opacity breathing effect base
            this.baseAlpha = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off edges smoothly
            if (this.x < 0 || this.x > canvas.width) {
                this.speedX *= -1;
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.speedY *= -1;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.baseAlpha;
            ctx.fill();
            
            // Add a slight glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Connect particles if they are close (adds a tech/network feel)
    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                             + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                
                if (distance < 15000) {
                    // Line opacity based on distance
                    opacityValue = 1 - (distance / 15000);
                    ctx.strokeStyle = `rgba(212, 175, 55, ${opacityValue * 0.15})`; // Very faint gold connections
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.globalAlpha = 1; 
        ctx.shadowBlur = 0; // Reset shadow before drawing connections to avoid heavy performance cost
        
        connectParticles();

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        requestAnimationFrame(animateParticles);
    }

    // Start effect
    initParticles();
    animateParticles();
}
