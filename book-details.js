// Gestion des commentaires avec localStorage
class CommentManager {
    constructor(bookId) {
        this.bookId = bookId;
        this.storageKey = `comments_${bookId}`;
        this.init();
    }

    init() {
        this.loadComments();
        this.setupForm();
    }

    setupForm() {
        const form = document.getElementById('commentForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        const comment = {
            id: Date.now(),
            name: form.querySelector('input[type="text"]').value,
            email: form.querySelector('input[type="email"]').value,
            rating: form.querySelector('input[name="rating"]:checked').value,
            text: form.querySelector('textarea').value,
            date: new Date().toLocaleDateString('fr-FR')
        };

        this.addComment(comment);
        form.reset();
        
        // Message de confirmation
        alert('Merci pour votre avis ! Il a été publié avec succès.');
    }

    addComment(comment) {
        const comments = this.getComments();
        comments.unshift(comment); // Ajouter au début
        localStorage.setItem(this.storageKey, JSON.stringify(comments));
        this.displayComments();
    }

    getComments() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    loadComments() {
        this.displayComments();
    }

    displayComments() {
        const comments = this.getComments();
        const commentsList = document.getElementById('commentsList');
        
        if (!commentsList) return;

        if (comments.length === 0) {
            commentsList.innerHTML = '<p class="no-comments">Aucun avis pour le moment. Soyez le premier à laisser un avis !</p>';
            return;
        }

        commentsList.innerHTML = comments.map(comment => `
            <div class="comment-item">
                <div class="comment-header">
                    <span class="comment-author">${this.escapeHtml(comment.name)}</span>
                    <span class="comment-date">${comment.date}</span>
                </div>
                <div class="comment-rating">
                    ${'★'.repeat(comment.rating)}${'☆'.repeat(5 - comment.rating)}
                </div>
                <div class="comment-text">
                    ${this.escapeHtml(comment.text)}
                </div>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Déterminer l'ID du livre basé sur l'URL
function getBookId() {
    const url = window.location.pathname;
    if (url.includes('croire-ou-penser')) return 'croire-ou-penser';
    if (url.includes('les-silences-de-la-terre')) return 'les-silences-de-la-terre';
    if (url.includes('roman')) return 'roman';
    return 'unknown';
}

// Initialiser le gestionnaire de commentaires
document.addEventListener('DOMContentLoaded', function() {
    const bookId = getBookId();
    new CommentManager(bookId);
});

// Ajouter le CSS des détails du livre
function addBookDetailsStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'book-details.css';
    document.head.appendChild(link);
}

// Appeler la fonction pour ajouter les styles
addBookDetailsStyles();

