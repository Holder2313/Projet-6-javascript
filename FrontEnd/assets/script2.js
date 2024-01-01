// Dans cette première partie, nous avons la fonction principale getCategory qui récupère les catégories de l'API et appelle createFilters pour construire l'interface.La fonction createFilters est simplifiée pour se concentrer sur l'initialisation des filtres et décider de l'affichage selon le rôle de l'utilisateur.

// Fonction principale pour obtenir les catégories et initialiser l'application
async function getCategory() {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        if (!response.ok) {
            throw new Error(`Erreur http. status: ${response.status}`);
        }
        const categories = await response.json();
        createFilters(categories);
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories: ', error);
    }
}

// Fonction pour créer des filtres de catégories
function createFilters(categories) {
    const filtersContainer = document.querySelector('.filters');
    const logButton = document.querySelector('.loginLink');
    const titreAdminModif = document.querySelector('.titreAdminModif');

    const allBtn = { name: 'Tous', id: null };
    categories.unshift(allBtn);

    // Décider de l'affichage selon le statut d'admin de l'utilisateur
    if (!localStorage.getItem('adminToken')) {
        nonAdminView(categories, logButton, filtersContainer);
    } else {
        adminView(logButton, titreAdminModif);
    }

    // Charger initialement toutes les œuvres
    getWorks();
}

// Appel initial de la fonction getCategory
getCategory();


// Dans cette partie, j'ai divisé la logique de createFilters en deux fonctions distinctes : nonAdminView et adminView. Cela rend le code plus clair et plus facile à gérer. La fonction nonAdminView gère l'affichage et le comportement des boutons de filtre pour les utilisateurs non - administrateurs, tandis que adminView(qui sera détaillée plus tard) gérera l'affichage pour les administrateurs.

// Vue pour les utilisateurs non-administrateurs
function nonAdminView(categories, logButton, filtersContainer) {
    console.log(logButton);
   
    logButton.textContent = 'login'; // bouton de connexion
    logButton.setAttribute('href', "./logIn/login.html");

    categories.forEach(category => {
        const buttonFilter = document.createElement('li');
        buttonFilter.textContent = category.name;
        buttonFilter.className = 'filterButtons';

        if (!category.id) {
            buttonFilter.classList.add('active-btn');
            getWorks(category.id);
        }

        buttonFilter.addEventListener('click', () => {
            getWorks(category.id);
            activeButtonFilter(category.id);
        });

        filtersContainer.appendChild(buttonFilter);
    });

}

// Vue pour les administrateurs
function adminView(logButton, titreAdminModif) {
    console.log(logButton);
    // Modif bouton de connexion pour un bouton de déconnexion
    logButton.textContent = 'logout';
    logButton.href = "./index.html";
    logButton.addEventListener('click', () => {
        localStorage.removeItem('adminToken');
    });

    // Ajouter un bouton de modification pour ouvrir la modal d'administration
    const modifButton = document.createElement('i');
    const modifTxt = document.createElement('span');
    modifButton.className = 'fa-solid fa-pen-to-square modifBtn';
    modifTxt.textContent = 'Modifier ';
    modifTxt.className = 'modifTxt';

    modifButton.appendChild(modifTxt);
    titreAdminModif.appendChild(modifButton);

    modifButton.addEventListener('click', openModal);
}


    // Ajout d'un bouton pour créer une nouvelle catégorie (si nécessaire)
    // ...

    // Ajout d'un bouton ou d'un lien pour accéder à des fonctionnalités d'administration supplémentaires
    // ...



// Fonction pour activer le filtre sélectionné
function activeButtonFilter(categoryId) {
    const buttonsFilter = document.querySelectorAll('.filterButtons');
    buttonsFilter.forEach(btn => btn.classList.remove('active-btn'));
    buttonsFilter[categoryId ? categoryId : 0].classList.add('active-btn');
}


// Dans cette partie, getWorks est responsable de la récupération des œuvres depuis l'API et de leur affichage en utilisant displayData. La fonction displayData crée des éléments HTML pour chaque œuvre et les ajoute à la galerie.

// Dans cette version, displayModalGallery est structurée pour être claire et modulaire.Elle utilise plusieurs fonctions auxiliaires pour créer différents éléments de l'interface de la modal. Cette approche rend le code plus facile à lire et à maintenir.

// Fonction pour obtenir les œuvres depuis l'API et les afficher
async function getWorks(categoryId = null) {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        if (!response.ok) {
            throw new Error(`Erreur http. status: ${response.status}`);
        }
        const works = await response.json();

        // Filtrer les œuvres si un categoryId est fourni
        let filteredData = works
        if (categoryId) {
            filteredData = works.filter(obj => obj.categoryId === categoryId)
        }
        displayData(filteredData);
        displayModalGallery(filteredData)//envoi des oeuvres pour la modale
    } catch (error) {
        console.error('Erreur lors de la récupération des œuvres: ', error);
    }
}

// Fonction pour afficher les œuvres dans la galerie
function displayData(arrayOfWorks) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; // Nettoyer la galerie avant d'afficher de nouvelles œuvres

    arrayOfWorks.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.src = work.imageUrl;
        figcaption.textContent = work.title;

        figure.append(img, figcaption);
        gallery.appendChild(figure);
    });
}


// Dans cette section, nous avons les fonctions de base pour gérer l'ouverture et la fermeture de la modal (openModal, closeModal, stopPropagation), ainsi que displayModalGallery pour afficher les œuvres dans la modal. Les détails spécifiques de l'affichage et les écouteurs d'événements pour les actions dans la modal seront ajoutés dans cette fonction.

// Variables globales pour la modal
const modalOverlay = document.querySelector('.modal');
const modalWrapper = document.querySelector('.modal-wrapper');
let modal = null;

// Ouverture de la modal
const openModal = (e) => {
    e.preventDefault();
    modalOverlay.classList.add('modalActiv');
    modalOverlay.removeAttribute('aria-hidden');
    modalOverlay.setAttribute('aria-modal', 'true');
    modal = modalOverlay;
    modalOverlay.addEventListener('click', closeModal);
    document.querySelector('.modal-stop').addEventListener('click', stopPropagation);
};

// Fermeture de la modal
const closeModal = (e) => {
    if (modal === null) return;
    e.preventDefault();
    modal.classList.remove('modalActiv');
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    document.querySelector('.modal-stop').removeEventListener('click', stopPropagation);
    modal = null;
};

// Empêcher la propagation de l'événement de clic
const stopPropagation = (event) => {
    event.stopPropagation();
};


// Affichage de la galerie dans la modal
function displayModalGallery(arrayOfWorks) {
    modalWrapper.innerHTML = '';

    // Création et ajout du bouton de fermeture de la modal
    const modalCloseButton = createModalCloseButton();
    modalWrapper.appendChild(modalCloseButton);

    // Création et ajout du titre de la modal
    const modalTitle = createModalTitle('Galerie photo');
    modalWrapper.appendChild(modalTitle);

    // Création et ajout du conteneur pour les œuvres
    const modalContainerWorks = document.createElement('div');
    modalContainerWorks.className = 'modalContainerWorks';
    modalWrapper.appendChild(modalContainerWorks);

    // Ajout de chaque œuvre dans le conteneur
    arrayOfWorks.forEach(work => {
        const modalBoxImg = createModalBoxImg(work);
        modalContainerWorks.appendChild(modalBoxImg);
    });

    // Création et ajout d'une ligne de séparation
    const modalLine = createModalLine();
    modalWrapper.appendChild(modalLine);

    // Création et ajout du bouton pour ajouter une nouvelle œuvre
    const modalButton = createModalButton('Ajouter une photo');
    modalWrapper.appendChild(modalButton);
}

// Fonctions auxiliaires pour créer divers éléments de la modal

function createModalCloseButton() {
    const button = document.createElement('img');
    button.src = './assets/icons/close-icon.svg';
    button.className = 'modalCloseButton';
    button.addEventListener('click', closeModal);
    return button;
}

function createModalTitle(titleText) {
    const title = document.createElement('h3');
    title.textContent = titleText;
    title.className = "modalTitle";
    return title;
}

function createModalBoxImg(work) {
    const box = document.createElement('div');
    box.className = 'modalBoxImg';

    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.className = 'modalImg';
    box.appendChild(img);

    // Si l'utilisateur est administrateur, ajouter une icône de suppression
    if (localStorage.getItem('adminToken')) {
        const trashIcon = createModalTrashIcon(work.id);
        box.appendChild(trashIcon);
    }

    return box;
}

function createModalTrashIcon(workId) {
    const icon = document.createElement('img');
    icon.src = './assets/icons/trash-icon.svg';
    icon.className = 'modalTrashIcon';
    icon.dataset.workId = workId;
    icon.addEventListener('click', () => modalRemoveWork(workId));
    return icon;
}

function createModalLine() {
    const line = document.createElement('div');
    line.className = 'modalLine';
    return line;
}

function createModalButton(buttonText) {
    const modalButtonAdd = document.createElement('button');
    modalButtonAdd.textContent = buttonText;
    modalButtonAdd.className = 'modalButton';
    modalButtonAdd.addEventListener('click', modalAddWork)
    

    return modalButtonAdd;
}


// Supression et ajout des oeuvres

// Suppression d'une œuvre
async function modalRemoveWork(workId) {
    try {
        const token = localStorage.getItem('adminToken'); // Récupérer le token d'administration
        if (!token) {
            throw new Error("Erreur d'authentification");
        }

        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP. Status: ${response.status}`);
        }
        await getWorks(); // Recharger les œuvres après suppression
    } catch (error) {
        console.error('Erreur lors de la suppression: ', error);
    }
}


// Ajout d'une nouvelle œuvre
function modalAddWork() {
    modalWrapper.innerHTML = '';

    // Ajout du bouton de fermeture de la modal
    const modalCloseButton = createModalCloseButton();
    modalWrapper.appendChild(modalCloseButton);

    // Ajout du titre de la modal
    const modalTitle = createModalTitle('Ajout photo');
    modalWrapper.appendChild(modalTitle);

    // Création du formulaire pour ajouter une nouvelle œuvre
    const form = document.createElement('form');
    form.className = 'modalForm';

    // Ajout des champs du formulaire
    form.appendChild(createModalFormField('image', 'file', 'Choisir une image', 'imageInput', 'image/*'));
    form.appendChild(createModalFormField('title', 'text', 'Titre de l\'œuvre', 'titleInput'));
    form.appendChild(createModalFormField('category', 'select', 'Catégorie', 'categoryInput', null, categoriesOptions()));

    // Ajout du bouton de soumission
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Valider';
    submitButton.className = 'modalButton';
    form.appendChild(submitButton);

    // Gestion de l'envoi du formulaire
    form.onsubmit = async (event) => {
        event.preventDefault();
        const newWorkContent = {
            image: form.image.files[0],
            title: form.title.value,
            category: form.category.value
        };
        await modalSendNewWork(newWorkContent);
    };

    modalWrapper.appendChild(form);
}

// Fonction auxiliaire pour créer des champs de formulaire
function createModalFormField(name, type, placeholder, id, accept = null, options = null) {
    let field;
    if (type === 'select') {
        field = document.createElement('select');
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.label;
            field.appendChild(optionElement);
        });
    } else {
        field = document.createElement('input');
        field.type = type;
        field.placeholder = placeholder;
        if (accept) field.accept = accept;
    }
    field.name = name;
    field.id = id;
    field.className = 'modalInput';
    return field;
}

// Fonction pour fournir les options de catégorie
function categoriesOptions() {
    // Remplacer cette partie par la récupération des catégories depuis votre API ou une liste prédéfinie
    return [
        { value: '1', label: 'Catégorie 1' },
        { value: '2', label: 'Catégorie 2' },
        // Autres catégories...
    ];
}


// Fonction pour envoyer les détails de la nouvelle œuvre à l'API
async function modalSendNewWork(newWorkContent) {
    try {
        const formData = new FormData();
        formData.append('image', newWorkContent.image);
        formData.append('title', newWorkContent.title);
        formData.append('category', newWorkContent.category);

        const token = localStorage.getItem('adminToken');
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP. Status: ${response.status}`);
        }

        await getWorks(); // Recharger les œuvres après ajout
    } catch (error) {
        console.error("Erreur lors de l'envoi des données': ", error);
    }
}