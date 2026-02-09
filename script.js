// ===================================
// 3D STARFIELD BACKGROUND USING THREE.JS
// ===================================
let scene, camera, renderer, stars, starGeo;

function init3DBackground() {
    const canvas = document.getElementById('starfield');
    
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0008);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.z = 1;
    camera.rotation.x = Math.PI / 2;
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create starfield
    starGeo = new THREE.BufferGeometry();
    const starCount = 6000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    
    const colorPalette = [
        new THREE.Color(0x00ff88), // Primary green
        new THREE.Color(0x00bfff), // Secondary blue
        new THREE.Color(0xff00ff), // Tertiary magenta
        new THREE.Color(0xffffff)  // White
    ];
    
    for (let i = 0; i < starCount * 3; i += 3) {
        // Position
        positions[i] = (Math.random() - 0.5) * 2000;
        positions[i + 1] = (Math.random() - 0.5) * 2000;
        positions[i + 2] = -Math.random() * 2000;
        
        // Color
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
        
        // Size
        sizes[i / 3] = Math.random() * 2;
    }
    
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Star material
    const starMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
    });
    
    stars = new THREE.Points(starGeo, starMaterial);
    scene.add(stars);
    
    // Add nebula-like particles
    createNebula();
    
    // Start animation
    animate3D();
}

function createNebula() {
    const nebulaGeo = new THREE.BufferGeometry();
    const nebulaCount = 200;
    const positions = new Float32Array(nebulaCount * 3);
    const colors = new Float32Array(nebulaCount * 3);
    const sizes = new Float32Array(nebulaCount);
    
    for (let i = 0; i < nebulaCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 1500;
        positions[i + 1] = (Math.random() - 0.5) * 1500;
        positions[i + 2] = -Math.random() * 1500;
        
        const greenish = Math.random() > 0.5;
        if (greenish) {
            colors[i] = 0;
            colors[i + 1] = 1;
            colors[i + 2] = 0.5;
        } else {
            colors[i] = 0;
            colors[i + 1] = 0.7;
            colors[i + 2] = 1;
        }
        
        sizes[i / 3] = Math.random() * 20 + 10;
    }
    
    nebulaGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    nebulaGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    nebulaGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const nebulaMaterial = new THREE.PointsMaterial({
        size: 15,
        vertexColors: true,
        transparent: true,
        opacity: 0.1,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
    });
    
    const nebula = new THREE.Points(nebulaGeo, nebulaMaterial);
    scene.add(nebula);
}

let mouseX = 0;
let mouseY = 0;

function animate3D() {
    requestAnimationFrame(animate3D);
    
    // Rotate starfield slowly
    stars.rotation.y += 0.0002;
    
    // Mouse parallax effect
    camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.05 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    // Pulsing effect for some stars
    const positions = starGeo.attributes.position.array;
    const time = Date.now() * 0.0001;
    
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += Math.sin(time + i) * 0.05;
        
        if (positions[i + 2] > 200) {
            positions[i + 2] = -2000;
        }
    }
    
    starGeo.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
}

// ===================================
// MOUSE MOVEMENT TRACKING
// ===================================
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

// ===================================
// WINDOW RESIZE HANDLER
// ===================================
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ===================================
// NAVIGATION
// ===================================
const navbar = document.querySelector('.navbar');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

// Sticky navbar on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// ===================================
// SMOOTH SCROLLING
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// ===================================
// SCROLL ANIMATIONS
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll(`
        .skill-category,
        .project-card,
        .cert-card,
        .achievement-card,
        .timeline-item,
        .experience-item
    `);
    
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// ===================================
// CONTACT FORM HANDLING
// ===================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    // Show success message
    alert('Thank you for your message! I will get back to you soon.');
    
    // Reset form
    contactForm.reset();
    
    // In a real application, you would send this data to a server
    console.log('Form submitted:', formData);
});

// ===================================
// SKILL BAR ANIMATIONS
// ===================================
const skillBars = document.querySelectorAll('.skill-progress');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const progress = bar.style.getPropertyValue('--progress');
            bar.style.width = progress;
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    bar.style.width = '0';
    skillObserver.observe(bar);
});

// ===================================
// CURSOR GLOW EFFECT
// ===================================
const cursor = document.createElement('div');
cursor.classList.add('cursor-glow');
cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 255, 136, 0.6), transparent);
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: screen;
    transition: transform 0.1s ease;
`;
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
});

// Enlarge cursor on hover over interactive elements
document.querySelectorAll('a, button, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(3)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
    });
});

// ===================================
// TYPING EFFECT FOR HERO SUBTITLE
// ===================================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Apply typing effect on page load
window.addEventListener('load', () => {
    const subtitle = document.querySelector('.hero-subtitle');
    const originalText = subtitle.textContent;
    setTimeout(() => {
        typeWriter(subtitle, originalText, 50);
    }, 1000);
});

// ===================================
// PARTICLE CURSOR TRAIL
// ===================================
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.life = 100;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 2;
        if (this.size > 0.1) this.size -= 0.05;
    }
    
    draw(ctx) {
        ctx.fillStyle = `rgba(0, 255, 136, ${this.life / 100})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create canvas for particle trail
const trailCanvas = document.createElement('canvas');
trailCanvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9998;
`;
document.body.appendChild(trailCanvas);

const trailCtx = trailCanvas.getContext('2d');
trailCanvas.width = window.innerWidth;
trailCanvas.height = window.innerHeight;

const particles = [];

document.addEventListener('mousemove', (e) => {
    particles.push(new Particle(e.clientX, e.clientY));
});

function animateParticles() {
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(trailCtx);
        
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
    
    requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
});

// ===================================
// INITIALIZE EVERYTHING
// ===================================
window.addEventListener('load', () => {
    init3DBackground();
    
    // Add loading animation complete
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================
let lastScrollTop = 0;
let ticking = false;

window.addEventListener('scroll', () => {
    lastScrollTop = window.scrollY;
    
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Any scroll-based updates here
            ticking = false;
        });
        ticking = true;
    }
});

// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause heavy animations
        renderer.setAnimationLoop(null);
    } else {
        // Resume animations
        renderer.setAnimationLoop(animate3D);
    }
});

// ===================================
// CONSOLE MESSAGE
// ===================================
console.log('%c💻 Welcome to Bhavya Parekh\'s Portfolio!', 
    'color: #00ff88; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with HTML, CSS, JavaScript & Three.js', 
    'color: #00bfff; font-size: 14px;');
console.log('%cInterested in the code? Check it out on GitHub!', 
    'color: #ff00ff; font-size: 14px;');