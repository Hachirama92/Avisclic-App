document.addEventListener('DOMContentLoaded', () => {
    const initialFeedbackSection = document.getElementById('initial-feedback-section'); 
    const companyLogo = document.getElementById('company-logo'); 
    const companyNameSpan = document.getElementById('company-name'); 
    const starRating = document.getElementById('star-rating');
    const stars = starRating.querySelectorAll('.star');
    const feedbackLowScore = document.getElementById('feedback-low-score');
    const improvementOptionsContainer = feedbackLowScore.querySelector('.improvement-options');
    const optionButtons = improvementOptionsContainer.querySelectorAll('.option-button');
    const otherFeedbackTextarea = document.getElementById('other-feedback');
    const submitLowScoreButton = document.getElementById('submit-low-score');
    const thankYouMessage = document.getElementById('thank-you-message');
    const backToStarsButton = document.getElementById('back-to-stars'); 
    const resetAppButton = document.getElementById('reset-app'); 

    let selectedRating = 0; 
    let selectedOptions = new Set(); 

    // Récupérer les paramètres de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const company = urlParams.get('nomEntreprise') || 'votre expérience'; 
    const logo = urlParams.get('logoUrl');
    const googleReviewUrlFromParam = urlParams.get('googleUrl') || 'https://www.google.com'; 

    // Mettre à jour le texte du titre
    companyNameSpan.textContent = company;

    // Afficher le logo si l'URL est fournie
    if (logo) {
        companyLogo.src = logo;
        companyLogo.classList.remove('hidden');
    } else {
        companyLogo.classList.add('hidden'); 
    }

    // ⭐⭐⭐ INFORMATIONS PRÉCISES POUR TON GOOGLE FORM IMMOBILIER ⭐⭐⭐
    const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSc_Yep8FBpyDfZRs0bgTDz1AV1h3d7FLdQ6MgncFdNdYROGUg/formResponse'; 
    const FORM_FIELD_NAMES = {
        note: 'entry.1825203782',           
        options: 'entry.1148647656',        
        commentaire: 'entry.39037695',      
        nomEntreprise: 'entry.161944146',   
        urlLogo: 'entry.200445465',         
    };
    // ⭐⭐⭐ FIN DES INFOS PRÉCISES IMMO ⭐⭐⭐

    // Fonction pour mettre à jour l'affichage des étoiles
    function updateStarDisplay(ratingValue) { 
        stars.forEach((s, index) => {
            if (index < ratingValue) {
                s.classList.add('selected');
            } else {
                s.classList.remove('selected');
            }
        });
    }

    // Fonction pour réinitialiser l'application à son état initial
    function resetApplication() { 
        selectedRating = 0;
        selectedOptions.clear();
        otherFeedbackTextarea.value = '';
        optionButtons.forEach(btn => btn.classList.remove('selected')); 

        updateStarDisplay(0); 
        starRating.classList.remove('rated'); 

        initialFeedbackSection.classList.remove('hidden'); 
        feedbackLowScore.classList.add('hidden');
        thankYouMessage.classList.add('hidden');
        submitLowScoreButton.classList.remove('hidden'); 
        
        toggleStarListeners(true); 
    }

    // Fonction pour activer/désactiver les écouteurs de clic et survol sur les étoiles
    function toggleStarListeners(enable) { 
        stars.forEach(star => {
            if (enable) {
                star.addEventListener('click', handleStarClick);
                star.addEventListener('mouseover', handleStarMouseOver);
                star.addEventListener('mouseout', handleStarMouseOut);
                star.style.cursor = 'pointer'; 
            } else {
                star.removeEventListener('click', handleStarClick);
                star.removeEventListener('mouseover', handleStarMouseOver);
                star.removeEventListener('mouseout', handleStarMouseOut);
                star.style.cursor = 'default'; 
            }
        });
    }

    // Gestionnaire de clic sur étoile
    function handleStarClick() { 
        selectedRating = parseInt(this.dataset.value); 
        
        updateStarDisplay(selectedRating); 
        starRating.classList.add('rated'); 

        toggleStarListeners(false); 

        initialFeedbackSection.classList.add('hidden');

        if (selectedRating <= 3) {
            feedbackLowScore.classList.remove('hidden');
            thankYouMessage.classList.add('hidden'); 
        } else {
            window.location.href = googleReviewUrlFromParam;
        }
    }

    // Gestionnaire de survol d'étoile
    function handleStarMouseOver() { 
        if (!starRating.classList.contains('rated')) { 
            const hoverValue = parseInt(this.dataset.value);
            updateStarDisplay(hoverValue);
        }
    }

    // Gestionnaire de sortie de survol d'étoile
    function handleStarMouseOut() { 
        if (!starRating.classList.contains('rated')) { 
            updateStarDisplay(0); 
        } else { 
            updateStarDisplay(selectedRating);
        }
    }

    // Gestion des options d'amélioration pour les notes basses (sélection multiple)
    optionButtons.forEach(button => { 
        button.addEventListener('click', () => {
            const optionValue = button.dataset.option;
            if (selectedOptions.has(optionValue)) {
                selectedOptions.delete(optionValue);
                button.classList.remove('selected');
            } else {
                selectedOptions.add(optionValue);
                button.classList.add('selected');
            }
        });
    });

    // --- MISE À JOUR ICI POUR ENVOYER À GOOGLE FORMS VIA IFRAME ---
    submitLowScoreButton.addEventListener('click', () => { // Plus besoin de 'async'
        const comments = otherFeedbackTextarea.value.trim();
        
        // Créer un formulaire temporaire pour envoyer les données
        const form = document.createElement('form');
        form.action = GOOGLE_FORM_ACTION_URL;
        form.method = 'POST';
        form.target = 'hidden_iframe'; // Cible l'iframe caché

        // Ajouter les champs cachés au formulaire temporaire
        const addHiddenField = (name, value) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
        };

        addHiddenField(FORM_FIELD_NAMES.note, selectedRating);
        
        Array.from(selectedOptions).forEach(option => {
            addHiddenField(FORM_FIELD_NAMES.options, option); 
        });
        
        addHiddenField(FORM_FIELD_NAMES.commentaire, comments);
        addHiddenField(FORM_FIELD_NAMES.nomEntreprise, company); 
        addHiddenField(FORM_FIELD_NAMES.urlLogo, logo);         

        // Ajouter le formulaire temporaire au corps du document et le soumettre
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form); // Nettoyer le formulaire temporaire

        // Une fois envoyé, afficher le message de remerciement
        feedbackLowScore.classList.add('hidden');
        thankYouMessage.classList.remove('hidden');
        initialFeedbackSection.classList.add('hidden'); 

        console.log("Feedback envoyé au Google Form Immobilier via iframe !");
    });

    // Gestion du bouton "Retour"
    backToStarsButton.addEventListener('click', () => { 
        feedbackLowScore.classList.add('hidden');
        initialFeedbackSection.classList.remove('hidden'); 
        starRating.classList.remove('rated'); 
        toggleStarListeners(true); 
    });

    // Gestion du bouton "Fermer"
    resetAppButton.addEventListener('click', () => { 
        window.location.href = 'https://www.google.com'; 
    });

    // Initialisation
    resetApplication(); 
});