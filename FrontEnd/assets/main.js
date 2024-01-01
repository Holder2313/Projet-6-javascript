//module API
const api = {
    baseUrl: 'http://localhost:5678/api',

    // Fonction générique pour effectuer des requêtes API
    async fetchApi(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseUrl}/${endpoint}`, options);
            if (!response.ok) {
                // Gère les cas où la réponse n'est pas OK (ex. erreur 404, 500, etc.)
                throw new Error(`Erreur HTTP. Status: ${response.status}`);
            }
            return response.json(); // Renvoie la réponse en format JSON
        } catch (error) {
            console.error('Erreur lors de l’appel API: ', error);
            throw error; // Propage l'erreur pour la gérer plus loin
        }
    },

    // Fonctions spécifiques pour interagir avec des endpoints particuliers
    getCategories() {
        return this.fetchApi('categories');
    },

    getWorks() {
        return this.fetchApi('works');
    },

    deleteWork(workId, token) {
        return this.fetchApi(`works/${workId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
    },

    // Ajoutez ici d'autres interactions avec l'API...
};


// module utilitaire du DOM
//Ce module contient des fonctions réutilisables pour manipuler le DOM.


const domUtils = {
    // Crée un élément DOM avec des attributs spécifiés
    createElement(type, attributes = {}) {
        const element = document.createElement(type);
        for (const key in attributes) {
            element[key] = attributes[key];
        }
        return element;
    },

    // Sélectionne un élément unique dans le DOM
    select(selector) {
        return document.querySelector(selector);
    },

    // Sélectionne plusieurs éléments dans le DOM
    selectAll(selector) {
        return document.querySelectorAll(selector);
    }
};


//Logique Principale
//Utilisation des modules API et DOM pour la logique de l'application.

// Fonction d'initialisation pour charger les données au démarrage
async function initialize() {
    try {
        const categories = await api.getCategories(); // Récupère les catégories
        createFilters(categories);                   // Crée les filtres
        await displayWorks();                        // Affiche les travaux
    } catch (error) {
        console.error('Erreur lors de l’initialisation: ', error);
    }
}

// Crée des filtres à partir des catégories et les ajoute au DOM
function createFilters(categories) {
    const filtersContainer = domUtils.select('.filters');
    categories.unshift({ name: 'Tous', id: null }); // Ajoute un filtre 'Tous'

    categories.forEach(category => {
        const buttonFilter = domUtils.createElement('li', {
            textContent: category.name,
            className: 'filterButtons'
        });

        // Ajoute un gestionnaire d'événements pour chaque filtre
        buttonFilter.addEventListener('click', () => {
            displayWorks(category.id);
            activeButtonFilter(category.id);
        });

        filtersContainer.appendChild(buttonFilter);
    });
}

// Affiche les travaux en fonction de la catégorie sélectionnée
async function displayWorks(categoryId = null) {
    try {
        const works = await api.getWorks(); // Récupère les travaux
        const filteredWorks = categoryId ? works.filter(work => work.categoryId === categoryId) : works;
        updateGallery(filteredWorks);       // Met à jour la galerie
        updateModalGallery(filteredWorks);  // Met à jour la galerie dans la modale
    } catch (error) {
        console.error('Erreur lors de l’affichage des travaux: ', error);
    }
}

// Met à jour la galerie avec les travaux fournis
function updateGallery(works) {
    const gallery = domUtils.select('.gallery');
    gallery.innerHTML = '';

    works.forEach(work => {
        const figure = domUtils.createElement('figure');
        const img = domUtils.createElement('img', { src: work.imageUrl });
        const caption = domUtils.createElement('figcaption', { textContent: work.title });

        figure.append(img, caption);
        gallery.appendChild(figure);
    });
}

// Autres fonctions (updateModalGallery, activeButtonFilter, etc.)...

// Initialisation de l'application
initialize();