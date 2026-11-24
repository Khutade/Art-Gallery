// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.remove('active');
}

// Image modal functions (UPDATED)
function openModal(imageSrc, description) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');
    
    modalImage.src = imageSrc;
    modalDescription.textContent = description || "No description provided."; // Set the description
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(event) {
    // Prevent closing when clicking on the content inside the wrapper
    if (event && (event.target.closest('.modal-content-wrapper') && !event.target.classList.contains('modal-close'))) {
        return;
    }
    
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Responsive adjustments
window.addEventListener('resize', function() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (window.innerWidth > 1024) {
        mobileMenu.classList.remove('active');
    }
});

// Intersection Observer for animations (simple version)
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });
});

// Authentication functions
async function checkSession() {
    try {
        const response = await fetch('/api/session');
        const data = await response.json();
        
        const authLink = document.getElementById('auth-link');
        const mobileAuthLink = document.getElementById('mobile-auth-link');
        
        if (data.user) {
            authLink.textContent = `Logout (${data.user.username})`;
            authLink.href = '#';
            authLink.onclick = handleLogout;
            authLink.setAttribute('data-testid', 'link-logout');
            
            mobileAuthLink.textContent = `Logout (${data.user.username})`;
            mobileAuthLink.href = '#';
            mobileAuthLink.setAttribute('data-testid', 'link-mobile-logout');
        } else {
            authLink.textContent = 'Login';
            authLink.href = '/login.html';
            authLink.onclick = null;
            authLink.setAttribute('data-testid', 'link-login');
            
            mobileAuthLink.textContent = 'Login';
            mobileAuthLink.href = '/login.html';
            mobileAuthLink.setAttribute('data-testid', 'link-mobile-login');
        }
    } catch (error) {
        console.error('Error checking session:', error);
    }
}

async function handleLogout(e) {
    e.preventDefault();
    
    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
        });
        
        if (response.ok) {
            await checkSession();
        }
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

function handleMobileAuth(event) {
    const link = event.target;
    if (link.textContent.startsWith('Logout')) {
        event.preventDefault();
        handleLogout(event);
        closeMobileMenu();
    } else {
        closeMobileMenu();
    }
}

document.addEventListener('DOMContentLoaded', checkSession);