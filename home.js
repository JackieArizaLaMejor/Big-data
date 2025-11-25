// Scroll suave al botón "Ver qué hace el sistema"
const scrollBtn = document.getElementById("scrollToFeatures");
if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
        const section = document.getElementById("features");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    });
}

// Contadores animados en la sección hero
const counters = document.querySelectorAll(".metric-number");
let countersAnimated = false;

function animateCounters() {
    if (countersAnimated) return;
    const heroRect = document.querySelector(".hero").getBoundingClientRect();
    if (heroRect.top < window.innerHeight && heroRect.bottom > 0) {
        countersAnimated = true;
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute("data-target"), 10);
            let current = 0;
            const duration = 1200;
            const startTime = performance.now();

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                current = Math.floor(target * progress);
                counter.textContent = target > 1000 ? current.toLocaleString() : current;
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            requestAnimationFrame(update);
        });
    }
}

// Animación de entrada (reveal) con IntersectionObserver
const observerOptions = {
    threshold: 0.15
};

const revealElements = document.querySelectorAll(".reveal, .timeline-step, .team-card, .cta-box");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

revealElements.forEach(el => observer.observe(el));

// Parallax suave para los taxis flotantes
const taxis = document.querySelectorAll(".taxi");
window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    taxis.forEach((taxi, index) => {
        const factor = 0.03 + index * 0.02;
        taxi.style.transform = `translateY(${Math.sin(scrollY * factor) * 10}px)`;
    });
    animateCounters();
});

// Llamar una vez por si el hero ya está visible al cargar
animateCounters();
