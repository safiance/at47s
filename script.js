// Sélecteurs principaux
const dateNaissanceInput = document.getElementById('dateNaissance');
const ageActuelSpan = document.getElementById('ageActuel');
const inputs = document.querySelectorAll('input');

// Formatage des nombres avec espaces pour les milliers (affichage uniquement)
function formatNombre(valeur) {
    return valeur.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Nettoyage des valeurs dans les champs pour ne garder que des chiffres
function nettoieValeur(champ) {
    return parseFloat(champ.value.replace(/\D/g, '')) || 0;
}

// Calcul de l'âge actuel et des années restantes avant la retraite
function calculerAgeEtRetraite() {
    const today = new Date();
    const naissance = new Date(dateNaissanceInput.value);

    if (isNaN(naissance)) {
        ageActuelSpan.textContent = '-';
        return;
    }

    let age = today.getFullYear() - naissance.getFullYear();
    const m = today.getMonth() - naissance.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < naissance.getDate())) {
        age--;
    }

    ageActuelSpan.textContent = age;

    calculFinal();
}

// Calcul du total des ressources générées
function calculerTotalRessources() {
    const total = [
        'resultatNet',
        'is',
        'remunerationNette',
        'cotisationsObligatoiresValeur',
        'cotisationsFacultatives'
    ]
        .map(id => nettoieValeur(document.getElementById(id)))
        .reduce((acc, val) => acc + val, 0);

    document.getElementById('totalRessources').textContent = formatNombre(total) + ' €';
    return total;
}

// Calcul du total du patrimoine
function calculerTotalPatrimoine() {
    const total = [
        'valeurImmobilier',
        'valeurSctes',
        'valeurEpargne'
    ]
        .map(id => nettoieValeur(document.getElementById(id)))
        .reduce((acc, val) => acc + val, 0);

    document.getElementById('totalPatrimoine').textContent = formatNombre(total) + ' €';
    return total;
}

// Calcul final du montant estimé
function calculFinal() {
    const montantFinalElement = document.getElementById('montantFinal');

    // Vérification : si la date de naissance n'est pas remplie, on bloque le calcul et affiche un message
    if (!dateNaissanceInput.value) {
        montantFinalElement.textContent = 'Renseignez votre date de naissance';
        return;
    }

    const totalRessources = calculerTotalRessources();
    const totalPatrimoine = calculerTotalPatrimoine();

    const ageActuel = parseInt(ageActuelSpan.textContent) || 0;
    const anneesRestantes = Math.max(64 - ageActuel, 0);

    let montant = Math.round(totalRessources * anneesRestantes * 0.15);

    if (ageActuel >= 50) {
        montant += Math.round(totalPatrimoine * 0.10);
    }

    montantFinalElement.textContent = '+' + formatNombre(montant) + ' €';
}


// Application dynamique du calcul lors de la saisie
inputs.forEach(input => {
    input.addEventListener('input', calculFinal);
});

// Mise à jour dynamique de l'âge à la sélection de la date
dateNaissanceInput.addEventListener('input', calculerAgeEtRetraite);

// Initialisation au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    calculerAgeEtRetraite();
    calculFinal();
});
