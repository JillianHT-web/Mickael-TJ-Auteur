// Configuration EmailJS
const EMAILJS_SERVICE_ID = 'service_gcstnyc';
const EMAILJS_TEMPLATE_ID = 'template_7khxa5k';
const EMAILJS_PUBLIC_KEY = 'mkuQfsiOq-wvl2Z4_';

// Gestion de la newsletter
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletterSubmit(this);
        });
    }
});

function handleNewsletterSubmit(form) {
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const consent = form.querySelector('input[name="consent"]').checked;

    if (!consent) {
        alert('Veuillez accepter les conditions pour continuer.');
        return;
    }

    // Sauvegarder l'email localement
    saveNewsletterSubscription(name, email);

    // Afficher un message de confirmation
    const message = 'Merci ' + name + ' ! Vous êtes inscrit à la newsletter. Un email de confirmation a été envoyé à ' + email + '.';
    alert(message);

    // Réinitialiser le formulaire
    form.reset();

    // Envoyer un email via EmailJS
    sendNewsletterEmail(name, email);
}

function saveNewsletterSubscription(name, email) {
    // Récupérer les abonnements existants
    let subscriptions = localStorage.getItem('newsletter_subscriptions');
    subscriptions = subscriptions ? JSON.parse(subscriptions) : [];

    // Ajouter le nouvel abonnement
    subscriptions.push({
        id: Date.now(),
        name: name,
        email: email,
        date: new Date().toLocaleDateString('fr-FR'),
        time: new Date().toLocaleTimeString('fr-FR')
    });

    // Sauvegarder dans localStorage
    localStorage.setItem('newsletter_subscriptions', JSON.stringify(subscriptions));

    // Afficher dans la console (pour vérification)
    console.log('Nouvel abonnement:', { name, email });
    console.log('Total abonnés:', subscriptions.length);
}

// Fonction pour envoyer un email via EmailJS
function sendNewsletterEmail(name, email) {
    // Charger la librairie EmailJS si elle n'est pas déjà chargée
    if (typeof emailjs === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/index.min.js';
        script.onload = function() {
            initializeEmailJS(name, email);
        };
        document.head.appendChild(script);
    } else {
        initializeEmailJS(name, email);
    }
}

function initializeEmailJS(name, email) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    
    const templateParams = {
        to_email: email,
        subscriber_name: name,
        subscriber_email: email,
        from_name: 'Mickael TJ - Auteur',
        message: 'Bienvenue dans notre newsletter ! Vous allez recevoir bientôt un extrait exclusif des Chroniques de Kaelan Valois et des mises à jour sur nos nouveaux livres.'
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('Email de confirmation envoyé avec succès', response.status, response.text);
        }, function(error) {
            console.log('Erreur lors de l\'envoi de l\'email', error);
            // L'abonnement est quand même sauvegardé localement
        });
}

// Fonction pour afficher les abonnés (à usage administrateur)
function displaySubscriptions() {
    const subscriptions = localStorage.getItem('newsletter_subscriptions');
    if (subscriptions) {
        console.table(JSON.parse(subscriptions));
    } else {
        console.log('Aucun abonnement pour le moment.');
    }
}

// Fonction pour exporter les abonnés en CSV
function exportSubscriptionsAsCSV() {
    const subscriptions = localStorage.getItem('newsletter_subscriptions');
    if (!subscriptions) {
        alert('Aucun abonnement à exporter.');
        return;
    }

    const data = JSON.parse(subscriptions);
    let csv = 'Nom,Email,Date d\'inscription,Heure\n';
    
    data.forEach(sub => {
        csv += '"' + sub.name + '","' + sub.email + '","' + sub.date + '","' + sub.time + '"\n';
    });

    // Créer un blob et télécharger
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'newsletter_subscriptions.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

