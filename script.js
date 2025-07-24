document.addEventListener('DOMContentLoaded', () => {
    const initialFeedbackSection = document.getElementById('initial-feedback-section'); 
    const companyLogo = document.getElementById('company-logo'); // Nouveau
    const companyNameSpan = document.getElementById('company-name'); // Nouveau
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
    const company = urlParams.get('nomEntreprise') || 'votre expérience'; // Valeur par défaut si non fourni
    const logo = urlParams.get('logoUrl');
    const googleReviewUrlFromParam = urlParams.get('googleUrl') || 'https://www.google.com'; // Redirection par défaut si non fourni

    // Mettre à jour le texte du titre
    companyNameSpan.textContent = company;

    // Afficher le logo si l'URL est fournie
    if (logo) {
        companyLogo.src = logo;
        companyLogo.classList.remove('hidden');
    } else {
        companyLogo.classList.add('hidden'); // S'assurer qu'il est caché s'il n'y a pas de logo
    }

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
            // Utilise l'URL Google récupérée des paramètres
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

    // Gestion de la soumission des commentaires pour les notes basses
    submitLowScoreButton.addEventListener('click', () => {
        const comments = otherFeedbackTextarea.value.trim();

        console.log("--- Feedback client (Note basse) ---");
        console.log("Note : " + selectedRating + " étoiles");
        console.log("Options d'amélioration sélectionnées : " + (selectedOptions.size > 0 ? Array.from(selectedOptions).join(', ') : "Aucune"));
        console.log("Commentaire : " + (comments ? comments : "Aucun commentaire"));
        // Ajout des informations de l'entreprise pour un feedback plus complet si tu stockes cela
        console.log("Entreprise : " + company);
        console.log("URL Logo : " + (logo || "Non fourni"));
        console.log("URL Google : " + googleReviewUrlFromParam);
        console.log("------------------------------------");
        
        feedbackLowScore.classList.add('hidden');
        thankYouMessage.classList.remove('hidden');

        initialFeedbackSection.classList.add('hidden');
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
        // Redirige vers google.com
        window.location.href = 'https://www.google.com'; 
    });

    // Initialisation
    resetApplication(); 
});