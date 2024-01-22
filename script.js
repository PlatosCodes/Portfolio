document.addEventListener("DOMContentLoaded", () => {
    // Initialize functions
    lazyLoading();
    animateSkillsOnScroll();
    initializeDarkModeToggle();
    initializeModalContent();
    initializeProjectCardHover();
    initializeSmoothScrolling();
    handleStickyNavbar();
});

// Function to handle smooth scrolling
const initializeSmoothScrolling = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - calculateOffset(),
                    behavior: 'smooth'
                });
            }
        });
    });
};

// Function to calculate offset for smooth scrolling (e.g., fixed navbar height)
const calculateOffset = () => {
    const navbarHeight = document.querySelector('#navbar').offsetHeight;
    return navbarHeight + 10; // Additional offset can be added if needed
};

// Function for lazy loading images
const lazyLoading = () => {
    const lazyImages = document.querySelectorAll("img.lazy");

    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove("lazy");
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(lazyImage => lazyImageObserver.observe(lazyImage));
    } else {
        // Fallback for browsers without IntersectionObserver support
        lazyImages.forEach(lazyImage => {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.remove("lazy");
        });
    }
};

// Function to animate skill boxes on scroll
const animateSkillsOnScroll = () => {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            } else {
                entry.target.classList.remove('animate');
            }
        });
    });

    const skillBoxes = document.querySelectorAll('.skill-box');
    skillBoxes.forEach(box => observer.observe(box));
};

// Function to toggle dark mode
const initializeDarkModeToggle = () => {
    document.getElementById('dark-mode-toggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        let iconSrc = document.body.classList.contains('dark-mode') ? './images/sun.svg' : './images/moon.svg';
        document.getElementById('dark-mode-icon').src = iconSrc;
    });
};

// Function to initialize modal content
const initializeModalContent = () => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', () => {
            const videoElement = modal.querySelector('video');
            if (videoElement) {
                const videoSrc = modal.getAttribute('data-video-src');
                videoElement.src = videoSrc;
                videoElement.load();
                videoElement.play();
            }

            const images = modal.querySelectorAll('img.lazy');
            images.forEach(img => {
                img.src = img.dataset.src || img.src;
            });
        });

        modal.addEventListener('hidden.bs.modal', () => {
            const videoElement = modal.querySelector('video');
            if (videoElement) {
                videoElement.pause();
                videoElement.src = '';
            }
        });
    });
};

// Function to handle sticky navbar
const handleStickyNavbar = () => {
    const navbar = document.querySelector('#navbar');
    const stickyOffset = navbar.offsetTop;

    window.addEventListener('scroll', () => {
        if (window.scrollY >= stickyOffset) {
            navbar.classList.add('navbar-sticky');
        } else {
            navbar.classList.remove('navbar-sticky');
        }
    });
};

// Function for hover effect on project cards
const initializeProjectCardHover = () => {
    document.querySelectorAll('.project-card').forEach(card => {
        const image = card.querySelector('.project-image');
        const video = card.querySelector('.project-video');
        const videoSrc = video.getAttribute('data-hover-src');

        card.addEventListener('mouseenter', () => {
            image.style.display = 'none';
            video.style.display = 'block';
            video.src = videoSrc;
            loadAndPlayVideo(video);
        });

        card.addEventListener('mouseleave', () => {
            video.pause();
            video.style.display = 'none';
            image.style.display = 'block';
        });
    });
};

// Function to load and play video safely with a delay
const loadAndPlayVideo = (video) => {
    video.load();
    setTimeout(() => {
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Automatic playback started
            }).catch(error => {
                // Auto-play was prevented
                console.log("Auto-play was prevented: ", error);
            });
        }
    }, 100); // Delay in milliseconds
};

function toggleProjectVideo(card) {
    const image = card.querySelector('.project-image');
    const video = card.querySelector('.project-video');
    const videoSrc = video.getAttribute('data-hover-src');

    if (video.style.display === 'none') {
        image.style.display = 'none';
        video.style.display = 'block';
        video.src = videoSrc;
        loadAndPlayVideo(video);
    } else {
        video.pause();
        video.style.display = 'none';
        image.style.display = 'block';
    }
}
