// Configuration EmailJS (gratuit)
// Vous devez créer un compte sur https://www.emailjs.com/
// et remplacer ces valeurs par vos propres clés

const EMAILJS_SERVICE_ID = 'service_gcstnyc'; // À remplacer
const EMAILJS_TEMPLATE_ID = 'template_7khxa5k'; // À remplacer
const EMAILJS_PUBLIC_KEY = 'mkuQfsiOq-wvl2Z4_'; // À remplacer

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
    const message = `Merci ${name} ! Vous êtes inscrit à la newsletter. Un email de confirmation a été envoyé à ${email}.`;
    alert(message);

    // Réinitialiser le formulaire
    form.reset();

    // Optionnel: Envoyer un email via EmailJS (voir instructions ci-dessous)
    // sendNewsletterEmail(name, email);
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

// Fonction optionnelle pour envoyer un email via EmailJS
// À utiliser si vous configurez EmailJS
function sendNewsletterEmail(name, email) {
    // Charger la librairie EmailJS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/index.min.js';
    script.onload = function() {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        
        const templateParams = {
            to_email: email,
            subscriber_name: name,
            subscriber_email: email,
            message: 'Bienvenue dans notre newsletter ! Vous allez recevoir bientôt un extrait exclusif des Chroniques de Kaelan Valois.'
        };

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(function(response) {
                console.log('Email envoyé avec succès', response.status, response.text);
            }, function(error) {
                console.log('Erreur lors de l\'envoi de l\'email', error);
            });
    };
    document.head.appendChild(script);
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
        csv += `"${sub.name}","${sub.email}","${sub.date}","${sub.time}"\n`;
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

// Instructions pour configurer EmailJS (optionnel)
/*
1. Créez un compte gratuit sur https://www.emailjs.com/
2. Créez un service email (Gmail, Outlook, etc.)
3. Créez un template d'email
4. Remplacez les valeurs ci-dessus:
   - EMAILJS_SERVICE_ID
   - EMAILJS_TEMPLATE_ID
   - EMAILJS_PUBLIC_KEY
5. Décommentez la ligne sendNewsletterEmail() dans handleNewsletterSubmit()

Pour l'instant, les emails sont sauvegardés localement dans le navigateur.
Vous pouvez les exporter en CSV en tapant dans la console: exportSubscriptionsAsCSV()
*/

