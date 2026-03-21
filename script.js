// 1. Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 800,
    once: false,
    offset: 100,
});

// 2. Typing Animation
const roles = [
    "Full Stack Developer.",
    "Problem Solver.",
    "Team Player."
];

let index = 0;
let charIndex = 0;
let isDeleting = false;
const typingTextElement = document.getElementById("typing-text");

function typeEffect() {
    const currentRole = roles[index];
    
    if (isDeleting) {
        typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 100;

    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2000; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        index = (index + 1) % roles.length;
        typeSpeed = 500; // Pause before starting new word
    }

    setTimeout(typeEffect, typeSpeed);
}
setTimeout(typeEffect, 1000);

// 3. Smooth 3D Tilt Effect for Project Cards
const cards = document.querySelectorAll(".project-card");

cards.forEach(card => {
    const content = card.querySelector('.card-content');
    
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;
        
        content.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        content.style.boxShadow = `${-rotateY}px ${rotateX}px 30px rgba(6, 182, 212, 0.2)`; 
    });

    card.addEventListener("mouseleave", () => {
        content.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
        content.style.transform = "rotateX(0) rotateY(0) scale3d(1, 1, 1)";
        content.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.2)";
        
        setTimeout(() => {
            content.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
        }, 500);
    });
});

// 4. Contact Form SMTP Integration via EmailJS
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
const btnSpinner = document.getElementById('btn-spinner');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // UI Loading State
    submitBtn.disabled = true;
    btnText.textContent = "Sending...";
    btnSpinner.classList.remove('hidden');
    formStatus.classList.add('hidden');

 emailjs.sendForm(
        'service_h0yzfcg', 
        'template_d5il7ll', 
        this, 
        'xOL30wMgzXtoASL6o' 
    )
    .then(() => {
        showStatusMessage("Message sent successfully! I will get back to you soon.", "text-emerald-400");
        contactForm.reset();
    }, (error) => {
        showStatusMessage("Failed to send message. Please try again later.", "text-red-400");
        console.log('FAILED...', error);
    })
    .finally(() => {
        resetButton();
    });
});



function showStatusMessage(message, colorClass) {
    formStatus.textContent = message;
    formStatus.className = `text-center text-sm font-medium mt-4 block ${colorClass}`;
}

function resetButton() {
    submitBtn.disabled = false;
    btnText.textContent = "Send Message via SMTP";
    btnSpinner.classList.add('hidden');
}

// Image Modal (Lightbox) Logic
const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalClose = document.getElementById('modal-close');

function openImageModal({ src, title, description }) {
    modalImage.src = src;
    modalImage.alt = title;
    modalTitle.textContent = title;
    modalDesc.textContent = description;
    imageModal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    imageModal.classList.remove('open');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeImageModal);
imageModal.addEventListener('click', (event) => {
    if (event.target === imageModal || event.target.id === 'modal-backdrop') {
        closeImageModal();
    }
});

// Attach modal triggers to project and certificate images
function bindImagePopup(selector) {
    document.querySelectorAll(selector).forEach(img => {
        img.addEventListener('click', () => {
            openImageModal({
                src: img.dataset.full || img.src,
                title: img.dataset.title || img.alt || '',
                description: img.dataset.desc || ''
            });
        });
    });
}

bindImagePopup('.project-img');
bindImagePopup('.cert-img');

// 5. Make whole project card clickable as fallback (including mobile/taps and any anchor block issues)
const projectCards = document.querySelectorAll('.project-card[data-url]');
projectCards.forEach(card => {
    const targetUrl = card.dataset.url;
    if (!targetUrl) return;
    card.addEventListener('click', (event) => {
        if (event.target.closest('a')) return; // let link element handle itself
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
    });
});
