/* ==========================================================================
   NS CREWS INTERACTIVE LOGIC (JavaScript)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. HEADER SCROLL EFFECT
    const header = document.querySelector('.main-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger once on load in case page was refreshed

    // 2. MOBILE MENU NAVIGATION
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('overflow-hidden'); // Prevent background scroll when menu is open
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('overflow-hidden');
            
            // Set active class link manually
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // 3. INTERSECTION OBSERVER FOR SCROLL REVEALS
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve after revealing to prevent refiring animations
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. ANIMATED STATS COUNTER
    const statNums = document.querySelectorAll('.stat-num');
    let hasCounted = false;

    const startCounting = () => {
        statNums.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 2000; // 2 seconds animation
            const increment = target / (duration / 16); // ~60fps
            let current = 0;

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    stat.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCount);
                } else {
                    stat.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Observe the stats section to trigger counting once visible
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasCounted) {
                    startCounting();
                    hasCounted = true;
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        statsObserver.observe(statsSection);
    }

    // 5. PORTFOLIO FILTERING LOGIC
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and add to clicked
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                // Add fade-out transition, then toggle display
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 6. CONTACT FORM SIMULATION & VISUAL FEEDBACK
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Disable button during simulation
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            // Simulate form submission delay
            setTimeout(() => {
                // Reset form and show success message
                contactForm.reset();
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;

                formFeedback.innerText = 'Thank you! Your message has been received. Surya or the NS Crews team will contact you shortly.';
                formFeedback.className = 'form-feedback success';
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formFeedback.className = 'form-feedback hidden';
                }, 6000);
            }, 1800);
        });
    }
});

// 7. INLINE PORTFOLIO VIDEO PLAYER
// Plays the video belonging to the clicked portfolio card.
window.playInlineVideo = (playButton, videoSrc) => {
    const videoPlaceholder = playButton.closest('.video-placeholder');
    const video = videoPlaceholder ? videoPlaceholder.querySelector('.placeholder-video-tag') : null;

    if (!video) {
        return;
    }

    if (!video.src || video.src !== new URL(videoSrc, document.baseURI).href) {
        video.src = videoSrc;
        video.load();
    }

    video.controls = true;
    video.play().then(() => {
        videoPlaceholder.classList.add('is-playing');
    }).catch(error => {
        console.log("Inline video playback failed, waiting for user click.", error);
    });
};

// 8. VIDEO PLAYER MODAL TRIGGERS
// Exposed globally so the hero showreel can use its modal player.
window.openVideoModal = (videoSrc) => {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    
    // Set video source
    video.src = videoSrc;
    
    // Open modal
    modal.classList.add('active');
    document.body.classList.add('overflow-hidden');
    
    // Auto play video
    video.play().catch(error => {
        console.log("Auto-play blocked or failed, waiting for user click.", error);
    });
};

window.closeVideoModal = () => {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    
    // Close modal
    modal.classList.remove('active');
    document.body.classList.remove('overflow-hidden');
    
    // Pause and reset video source to stop playback bandwidth
    video.pause();
    video.src = "";
};

// 9. INTERACTIVE PLAYHEAD SCRUBBER FOR EDITING TIMELINE
document.addEventListener('DOMContentLoaded', () => {
    const timelineBody = document.querySelector('.timeline-body');
    const timelineRuler = document.querySelector('.timeline-ruler');
    const playhead = document.getElementById('timelinePlayhead');
    const timecode = document.querySelector('.timeline-timecode');

    if (timelineBody && timelineRuler && playhead) {
        timelineBody.addEventListener('mousemove', (e) => {
            const rulerRect = timelineRuler.getBoundingClientRect();
            const x = e.clientX - rulerRect.left; // X coordinate relative to ruler tracks
            let percentage = (x / rulerRect.width) * 100;
            
            // Constrain between 0% and 100%
            if (percentage < 0) percentage = 0;
            if (percentage > 100) percentage = 100;
            
            // Move playhead position in percentage
            playhead.style.left = `${percentage}%`;
            
            // Calculate dynamic timecode: 8 seconds total, 30fps frames
            const totalSeconds = 8;
            const currentTotalSeconds = (percentage / 100) * totalSeconds;
            const seconds = Math.floor(currentTotalSeconds);
            const frames = Math.floor((currentTotalSeconds % 1) * 30);
            
            const secStr = seconds.toString().padStart(2, '0');
            const frameStr = frames.toString().padStart(2, '0');
            
            if (timecode) {
                timecode.innerText = `00:00:${secStr}:${frameStr}`;
            }
        });
        
        // Reset playhead position on mouse leave to initial spot (35%)
        timelineBody.addEventListener('mouseleave', () => {
            playhead.style.left = '35%';
            if (timecode) {
                timecode.innerText = '00:00:02:24';
            }
        });
    }
});
