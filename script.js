// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;
const body = document.body;

// Check if user has a saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
});

// Video Modal Functionality
const modal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const closeBtn = document.querySelector('.close');

// Open video modal function
function openVideoModal(element) {
    const videoSrc = element.closest('.portfolio-card').getAttribute('data-video');
    if (videoSrc) {
        modalVideo.src = videoSrc;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Close modal on X click
closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    modalVideo.pause();
    modalVideo.src = '';
    document.body.style.overflow = 'auto';
});

// Close modal on background click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
        modalVideo.pause();
        modalVideo.src = '';
        document.body.style.overflow = 'auto';
    }
});

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        modal.classList.remove('show');
        modalVideo.pause();
        modalVideo.src = '';
        document.body.style.overflow = 'auto';
    }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close menu when link is clicked
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Contact Form Submit
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: contactForm.querySelector('input[placeholder="Name"]').value,
            email: contactForm.querySelector('input[placeholder="Email"]').value,
            subject: contactForm.querySelector('input[placeholder="Subject"]').value,
            message: contactForm.querySelector('textarea[placeholder="Message"]').value
        };
        
        // Try to send to database via PHP
        fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Thank you for your message! I will get back to you soon.');
                console.log('Message saved to database:', data);
            } else {
                // Fallback to localStorage if database fails
                let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
                messages.push({...formData, timestamp: new Date().toLocaleString()});
                localStorage.setItem('contactMessages', JSON.stringify(messages));
                alert('Thank you for your message! I will get back to you soon.');
                console.log('Message saved to localStorage (Database unavailable)');
            }
            contactForm.reset();
        })
        .catch(error => {
            // Fallback to localStorage
            console.warn('Database error, saving to localStorage:', error);
            let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
            messages.push({...formData, timestamp: new Date().toLocaleString()});
            localStorage.setItem('contactMessages', JSON.stringify(messages));
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    });
}

// Function to view all messages (can be called from console)
window.viewMessages = function() {
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    if (messages.length === 0) {
        console.log('No messages yet');
        alert('No messages received yet');
        return;
    }
    console.table(messages);
    alert(`Total Messages: ${messages.length}\n\nCheck browser console (Press F12 > Console) to see all messages in detail`);
};

// Scroll animation for elements
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

document.querySelectorAll('.portfolio-card, .pricing-card, .review-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s, transform 0.6s';
    observer.observe(el);
});

// Navbar shadow on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});
// Star Rating Functionality
const starRating = document.getElementById('starRating');
const ratingValue = document.getElementById('ratingValue');
const stars = document.querySelectorAll('.star-rating i');

if (starRating) {
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = star.getAttribute('data-rating');
            ratingValue.value = rating;
            
            stars.forEach(s => {
                if (s.getAttribute('data-rating') <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
        
        star.addEventListener('mouseover', () => {
            const rating = star.getAttribute('data-rating');
            stars.forEach(s => {
                if (s.getAttribute('data-rating') <= rating) {
                    s.style.color = '#d4a574';
                } else {
                    s.style.color = 'rgba(212, 165, 116, 0.4)';
                }
            });
        });
    });
    
    starRating.addEventListener('mouseleave', () => {
        const currentRating = ratingValue.value;
        stars.forEach(s => {
            if (s.getAttribute('data-rating') <= currentRating) {
                s.style.color = '#d4a574';
            } else {
                s.style.color = 'rgba(212, 165, 116, 0.4)';
            }
        });
    });
}

// Review Form Submission
const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = reviewForm.querySelector('input[type="text"]').value;
        const email = reviewForm.querySelector('input[type="email"]').value;
        const rating = ratingValue.value;
        const review = reviewForm.querySelector('textarea').value;
        
        // Create FormData to send as form-urlencoded
        const formData = new FormData();
        formData.append('action', 'add_review');
        formData.append('name', name);
        formData.append('email', email);
        formData.append('rating', rating);
        formData.append('review', review);
        
        // Send to server (api.php)
        try {
            const response = await fetch('api.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Thank you for your review!');
                reviewForm.reset();
                ratingValue.value = 5;
                stars.forEach(s => s.classList.remove('active'));
                
                // Add new review to the reviews section
                addNewReviewToPage(name, email, rating, review);
                
                // Scroll to reviews
                document.querySelector('#reviews').scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('Error: ' + (data.error || 'Failed to submit review'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting review: ' + error.message);
        }
    });
}

// Function to generate initials avatar SVG
function generateInitialsAvatar(name) {
    const words = name.split(' ');
    let initials = '';
    
    for (let i = 0; i < Math.min(2, words.length); i++) {
        initials += words[i][0].toUpperCase();
    }
    
    const colors = ['FF6B6B', 'FF9999', 'FFCC99', 'FFFF99', '99FF99', '99FFCC', '99FFFF', '99CCFF', '99B3FF', 'FF99FF'];
    const colorIndex = name.charCodeAt(0) % colors.length;
    const bgColor = colors[colorIndex];
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
        <rect width="60" height="60" fill="#${bgColor}"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="24" font-weight="bold" fill="white" font-family="Arial">${initials}</text>
    </svg>`;
    
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// Function to add new review to page
function addNewReviewToPage(name, email, rating, reviewText) {
    const reviewsGrid = document.querySelector('.reviews-grid');
    
    // Generate star HTML
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
        starsHtml += `<i class="fas fa-star" style="color: ${i < rating ? '#ffc107' : '#ccc'};"></i>`;
    }
    
    // Generate avatar
    const avatarUrl = generateInitialsAvatar(name);
    
    // Create new review card
    const newReviewCard = document.createElement('div');
    newReviewCard.className = 'review-card';
    newReviewCard.innerHTML = `
        <div class="review-header">
            <img src="${avatarUrl}" alt="${name}" style="border-radius: 50%; width: 60px; height: 60px; object-fit: cover;">
            <div>
                <h4>${name}</h4>
                <div class="stars">
                    ${starsHtml}
                </div>
            </div>
        </div>
        <p class="review-text">"${reviewText}"</p>
    `;
    
    // Insert at the beginning of the reviews grid
    reviewsGrid.insertBefore(newReviewCard, reviewsGrid.firstChild);
}
