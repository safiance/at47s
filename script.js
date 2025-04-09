const dateNaissanceInput = document.getElementById('dateNaissance');
const ageActuelSpan = document.getElementById('ageActuel');
const anneesRetraiteSpan = document.getElementById('anneesRetraite');
const inputs = document.querySelectorAll('input');

function formatNombre(valeur) {
    return valeur.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function formatNombreAffichage(valeur) {
    return Math.round(valeur).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function nettoieValeur(champ) {
    return parseFloat(champ.value.replace(/\D/g, '')) || 0;
}

function appliqueFormatChamp(champ) {
    const previousLength = champ.value.length;
    const previousCursor = champ.selectionStart;

    const valeur = nettoieValeur(champ);
    const nouvelleValeur = valeur ? formatNombre(valeur) : '';

    champ.value = nouvelleValeur;

    const newLength = nouvelleValeur.length;
    const diff = newLength - previousLength;
    champ.setSelectionRange(previousCursor + diff, previousCursor + diff);
}

function calculerAgeEtRetraite() {
    const today = new Date();
    const naissance = new Date(dateNaissanceInput.value);
    if (isNaN(naissance)) return;

    let age = today.getFullYear() - naissance.getFullYear();
    const m = today.getMonth() - naissance.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < naissance.getDate())) {
        age--;
    }
    ageActuelSpan.textContent = age;
    anneesRetraiteSpan.textContent = Math.max(64 - age, 0);
    calculFinal();
}

function calculerCotisationsObligatoires() {
    const remunerationNette = nettoieValeur(document.getElementById('remunerationNette'));
    const valeurInput = document.getElementById('cotisationsObligatoiresValeur');




}

function calculerTotalRessources() {
    calculerCotisationsObligatoires();

    const total = ['resultatNet', 'is', 'remunerationNette', 'cotisationsObligatoiresValeur', 'cotisationsFacultatives', 'revenusLocatifs']
        .map(id => nettoieValeur(document.getElementById(id)))
        .reduce((acc, val) => acc + val, 0);

    document.getElementById('totalRessources').textContent = formatNombreAffichage(total);
    return total;
}

function calculerTotalPatrimoine() {
    const total = ['valeurImmobilier', 'valeurEpargne']
        .map(id => nettoieValeur(document.getElementById(id)))
        .reduce((acc, val) => acc + val, 0);

    document.getElementById('totalPatrimoine').textContent = formatNombreAffichage(total);
    return total;
}

function calculFinal() {
    const totalRessources = calculerTotalRessources();
    const totalPatrimoine = calculerTotalPatrimoine();
    const ageActuel = parseInt(ageActuelSpan.textContent) || 0;
    const anneesRetraite = Math.max(64 - ageActuel, 0);

    let montant = Math.round(totalRessources * anneesRetraite * 0.15);
    if (ageActuel >= 49) {
        montant += Math.round(totalPatrimoine * 0.10);
    }

    // Récupérer le prénom
    const prenom = document.getElementById('prenom').value.trim();

    // Mettre à jour le titre
    const titreGain = document.getElementById('titreGain');
    if (prenom) {
        titreGain.textContent = `${prenom}, votre gain potentiel est :`;
    } else {
        titreGain.textContent = 'Votre gain potentiel';
    }

    // Mettre à jour le montant avec un + devant
    document.getElementById('montantFinal').textContent = '+' + formatNombreAffichage(montant) + ' €';
}

function ouvrirFormulaireContact() {
    alert('Notre équipe vous contactera rapidement pour fixer un rendez-vous.');
}

// Appliquer le format lors de la saisie
inputs.forEach(input => {
    if (input.type === 'text') {
        input.addEventListener('input', () => {
            appliqueFormatChamp(input);
            calculFinal();
        });
        input.addEventListener('blur', () => {
            appliqueFormatChamp(input);
        });
    } else {
        input.addEventListener('input', calculFinal);
    }
});

dateNaissanceInput.addEventListener('input', calculerAgeEtRetraite);
