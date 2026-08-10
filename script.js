/* ==========================================
   FALCON VISUALS PORTFOLIO
========================================== */

let portfolio = {};
let currentImages = [];
let currentIndex = 0;
let activeFilter = 'All';
let searchTerm = '';

const sectionMap = {
    'Artwork': 'artwork',
    'Mascot': 'mascot',
    'Text Base': 'textbase',
    'Vector Art': 'vector',
    'Emotes': 'emotes',
    'V-tuber': 'vtuber'
};

const overlay = document.getElementById('galleryOverlay');
const searchInput = document.getElementById('search');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const cursor = document.querySelector('.cursor-glow');
const header = document.getElementById('header');
const bookingForm = document.getElementById('bookingForm');

async function loadPortfolio() {
    try {
        const response = await fetch('projects.json', { cache: 'no-store' });
        portfolio = await response.json();
        createGallery();
        updateStats();
        applyFilters();
    } catch (error) {
        console.error('Projects JSON Error:', error);
    }
}

function createGallery() {
    Object.keys(portfolio).forEach(category => {
        const gallery = document.querySelector(`#${sectionMap[category]} .gallery`);
        if (!gallery) return;

        gallery.innerHTML = '';

        portfolio[category].forEach(project => {
            const card = document.createElement('article');
            card.className = 'project-card';
            card.dataset.title = (project.title || '').toLowerCase();
            card.dataset.category = category;

            const firstImage = (project.images && project.images[0]) ? project.images[0] : 'preview.jpg';

            card.innerHTML = `
                <div class="thumb-wrap">
                    <img src="${firstImage}" alt="${project.title}" loading="lazy">
                    <span class="thumb-shade"></span>
                </div>
                <h4>${project.title}</h4>
            `;

            card.addEventListener('click', () => {
                currentImages = (project.images || []).filter(Boolean);
                currentIndex = 0;
                openGallery();
            });

            gallery.appendChild(card);
        });
    });
}

function openGallery() {
    if (!currentImages.length) return;

    overlay.innerHTML = '';
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const content = document.createElement('div');
    content.className = 'gallery-content';

    const close = document.createElement('button');
    close.className = 'gallery-close';
    close.setAttribute('aria-label', 'Close gallery');
    close.innerHTML = '<i class="fas fa-times"></i>';

    const prev = document.createElement('button');
    prev.className = 'gallery-prev';
    prev.setAttribute('aria-label', 'Previous image');
    prev.innerHTML = '<i class="fas fa-chevron-left"></i>';

    const next = document.createElement('button');
    next.className = 'gallery-next';
    next.setAttribute('aria-label', 'Next image');
    next.innerHTML = '<i class="fas fa-chevron-right"></i>';

    const counter = document.createElement('div');
    counter.className = 'gallery-counter';

    const tip = document.createElement('div');
    tip.className = 'gallery-tip';
    tip.textContent = 'Protected preview • Do not copy or download';

    const escHandler = (event) => {
        if (event.key === 'Escape') closeGallery();
        if (event.key === 'ArrowLeft') showPrev();
        if (event.key === 'ArrowRight') showNext();
    };

    const closeGallery = () => {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        overlay.innerHTML = '';
        document.body.style.overflow = '';
        overlay.removeEventListener('click', overlayClickHandler);
        document.removeEventListener('keydown', escHandler);
    };

    function showImage() {
        const oldMedia = content.querySelector('.image-wrapper, video');
        if (oldMedia) oldMedia.remove();

        const file = currentImages[currentIndex];
        if (!file) return;

        const ext = file.split('.').pop().toLowerCase();
        counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;

        if (['mp4', 'webm'].includes(ext)) {
            const video = document.createElement('video');
            video.className = 'gallery-media';
            video.src = file;
            video.controls = true;
            video.playsInline = true;
            video.autoplay = true;
            content.insertBefore(video, close);
        } else {
            const wrapper = document.createElement('div');
            wrapper.className = 'image-wrapper';

            const img = document.createElement('img');
            img.className = 'gallery-media';
            img.src = file;
            img.alt = 'Project preview';
            img.loading = 'lazy';
            img.draggable = false;

            const watermark = document.createElement('div');
            watermark.className = 'watermark';
            watermark.textContent = '© Falcon Visuals';

            wrapper.appendChild(img);
            wrapper.appendChild(watermark);
            content.insertBefore(wrapper, close);
        }
    }

    const showPrev = () => {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        showImage();
    };

    const showNext = () => {
        currentIndex = (currentIndex + 1) % currentImages.length;
        showImage();
    };

    close.addEventListener('click', closeGallery);
    prev.addEventListener('click', showPrev);
    next.addEventListener('click', showNext);

    const overlayClickHandler = (event) => {
        if (event.target === overlay) closeGallery();
    };

    overlay.addEventListener('click', overlayClickHandler);
    document.addEventListener('keydown', escHandler);

    let touchStartX = 0;
    content.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    content.addEventListener('touchend', (event) => {
        const touchEndX = event.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) showNext();
        if (touchEndX - touchStartX > 50) showPrev();
    }, { passive: true });

    content.appendChild(close);
    content.appendChild(prev);
    content.appendChild(next);
    content.appendChild(counter);
    content.appendChild(tip);
    overlay.appendChild(content);
    showImage();
}

function applyFilters() {
    document.querySelectorAll('#portfolio section').forEach(section => {
        const sectionTitle = section.dataset.category || section.querySelector('h3')?.textContent || '';
        const cards = Array.from(section.querySelectorAll('.project-card'));

        let visibleCards = 0;
        cards.forEach(card => {
            const title = card.dataset.title || '';
            const matchesSearch = !searchTerm || title.includes(searchTerm);
            const matchesFilter = activeFilter === 'All' || sectionTitle === activeFilter;
            const shouldShow = matchesSearch && matchesFilter;
            card.style.display = shouldShow ? '' : 'none';
            if (shouldShow) visibleCards += 1;
        });

        section.style.display = (visibleCards > 0) ? 'block' : 'none';
    });
}

function updateStats() {
    const projectCount = Object.values(portfolio).reduce((sum, list) => sum + list.length, 0);
    const categoryCount = Object.keys(portfolio).length;
    const statTargets = document.querySelectorAll('.counter');
    if (statTargets[0]) statTargets[0].dataset.target = projectCount;
    if (statTargets[1]) statTargets[1].dataset.target = categoryCount;
}

if (searchInput) {
    searchInput.addEventListener('input', function () {
        searchTerm = this.value.trim().toLowerCase();
        applyFilters();
    });
}

document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        activeFilter = button.textContent.trim();
        applyFilters();
    });
});

document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        button.parentElement.classList.toggle('active');
    });
});

const reveals = document.querySelectorAll('.reveal');
function revealOnScroll() {
    reveals.forEach(section => {
        const top = section.getBoundingClientRect().top;
        const trigger = window.innerHeight - 120;
        if (top < trigger) section.classList.add('active');
    });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const counter = entry.target;
        const target = Number(counter.dataset.target || 0);
        let value = 0;
        const speed = Math.max(target / 80, 1);

        function update() {
            value += speed;
            if (value < target) {
                counter.textContent = Math.floor(value);
                requestAnimationFrame(update);
            } else {
                counter.textContent = `${target}+`;
            }
        }

        update();
        counterObserver.unobserve(counter);
    });
});
counters.forEach(counter => counterObserver.observe(counter));

if (menuToggle) {
    menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
}

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('active'));
});

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
});

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    requestAnimationFrame(() => {
        setTimeout(() => loader?.classList.add('hide'), 250);
    });
    document.body.classList.add('cursor-active');
});

const typingTarget = document.getElementById('typingText');
if (typingTarget) {
    const words = ['Professional Graphic Designer', 'Creative Design For Streamers', 'Branding & Custom Visuals'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
        const currentWord = words[wordIndex];
        typingTarget.textContent = currentWord.slice(0, charIndex);

        if (!isDeleting) {
            charIndex++;
            if (charIndex > currentWord.length) {
                isDeleting = true;
                setTimeout(typeLoop, 1200);
                return;
            }
        } else {
            charIndex--;
            if (charIndex < 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                charIndex = 0;
            }
        }

        setTimeout(typeLoop, isDeleting ? 45 : 75);
    }

    typeLoop();
}

document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('dragstart', event => {
    if (event.target.tagName === 'IMG') event.preventDefault();
});
document.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    if ((event.ctrlKey || event.metaKey) && ['s', 'u', 'p'].includes(key)) event.preventDefault();
});

if (cursor) {
    document.addEventListener('mousemove', event => {
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
    });

    document.querySelectorAll('a, button, .project-card, input, textarea, select').forEach(item => {
        item.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        item.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

if (bookingForm) {
    bookingForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('clientName').value.trim();
        const discord = document.getElementById('discordUsername').value.trim();
        const service = document.getElementById('serviceType').value.trim();
        const budget = document.getElementById('budgetRange').value.trim() || 'Not specified';
        const brief = document.getElementById('projectBrief').value.trim();

        const message = [
            'Falcon Visuals Project Brief',
            `Name: ${name}`,
            `Discord Username: ${discord}`,
            `Category: ${service}`,
            `Budget: ${budget}`,
            `Requirements: ${brief}`
        ].join('\n');

        try {
            await navigator.clipboard.writeText(message);
            alert('Your project brief has been copied. Discord will open next — just paste the brief there.');
        } catch (error) {
            alert('Your project brief is ready. Discord will open next — if clipboard permission is blocked, copy the details manually.');
        }

        window.open('https://discord.gg/d3ZEnrrrNt', '_blank', 'noopener');
        bookingForm.reset();
    });
}

loadPortfolio();
