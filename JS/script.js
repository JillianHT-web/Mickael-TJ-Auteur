 // Données des livres
const books = {
    1: {
        title: "Croire ou Penser",
        type: "Essai",
        author: "Mickael T.J.",
        description: "Description à compléter...",
        releaseDate: "Bientôt disponible",
        rating: 5,
        reviews: 0
    },
    2: {
        title: "Les Silences de la Terre",
        type: "Essai",
        author: "Mickael T.J.",
        description: "Description à compléter...",
        releaseDate: "Bientôt disponible",
        rating: 5,
        reviews: 0
    },
    3: {
        title: "Les Chroniques de Kaelan Valois",
        type: "Roman",
        author: "Mickael TJ",
        description: "Description à compléter...",
        releaseDate: "Début 2026",
        rating: 0,
        reviews: 0
    }
};

// Filtrage des livres
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        
        // Mettre à jour le bouton actif
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Filtrer les livres
        document.querySelectorAll('.book-card').forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 10);
            } else {
                card.style.opacity = '0';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    });
});

// Modal pour les détails des livres
function openBookModal(bookId) {
    const book = books[bookId];
    const modal = document.getElementById('bookModal');
    const modalBody = document.getElementById('modalBody');
    
    const starsHTML = Array(5).fill('★').join('');
    
    modalBody.innerHTML = `
        <h2>${book.title}</h2>
        <p><strong>Type:</strong> ${book.type}</p>
        <p><strong>Auteur:</strong> ${book.author}</p>
        <p><strong>Sortie:</strong> ${book.releaseDate}</p>
        <hr>
        <h3>À propos du livre</h3>
        <p>${book.description}</p>
        <div class="book-rating">
            <span class="stars">${starsHTML}</span>
            <span class="rating-count">(${book.reviews} avis)</span>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeBookModal() {
    document.getElementById('bookModal').style.display = 'none';
}

// Fermer le modal en cliquant en dehors
window.onclick = function(event) {
    const modal = document.getElementById('bookModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Gestion du formulaire de contact
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Afficher un message de confirmation
    alert('Merci pour votre message ! Nous vous répondrons bientôt.');
    
    // Réinitialiser le formulaire
    this.reset();
});

// Smooth scroll pour les liens de navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// Animation au chargement
window.addEventListener('load', function() {
    document.querySelectorAll('.book-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animation = `slideIn 0.5s ease forwards`;
        card.style.animationDelay = `${index * 0.1}s`;
    });
});

