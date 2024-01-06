import { openModal, closeModal, modalAddWork } from './Modal.js';
import { getWorks, modalRemoveWork } from './API.js';
import { modalWrapper } from './Modal.js';
import { activeButtonFilter } from './Helper.js';


// Fonction pour créer des filtres de catégories
export function createFilters(categories) {
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





// Vue pour les utilisateurs non-administrateurs
export function nonAdminView(categories, logButton, filtersContainer) {
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
export function adminView(logButton, titreAdminModif) {
    console.log(logButton);

    // activation de banniere admin
    const adminBanner = document.querySelector('.adminBanner')
    adminBanner.style.display = 'block'

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


// Fonction pour afficher les œuvres dans la galerie
export function displayData(arrayOfWorks) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; // Nettoyer la galerie avant d'afficher de nouvelles œuvres

    arrayOfWorks.forEach(work => {
        const figure = document.createElement('figure');
        figure.className = 'figure'
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.src = work.imageUrl;
        figcaption.textContent = work.title;

        figure.append(img, figcaption);
        gallery.appendChild(figure);
    });
}

// Affichage de la galerie dans la modal
export function displayModalGallery(arrayOfWorks) {
    modalWrapper.innerHTML = '';

    // Création et ajout du bouton de fermeture de la modal
    const modalCloseButton = createModalCloseButton();
    modalWrapper.appendChild(modalCloseButton);

    // Création et ajout du titre de la modal
    const modalTitle = createModalTitle('Galerie photo');
    modalWrapper.appendChild(modalTitle);

    // Création et ajout du container pour les œuvres
    const modalContainerWorks = document.createElement('div');
    modalContainerWorks.className = 'modalContainerWorks';
    modalWrapper.appendChild(modalContainerWorks);

    // Ajout de chaque œuvre dans le container
    arrayOfWorks.forEach(work => {
        const modalBoxImg = createModalBoxImg(work);
        modalContainerWorks.appendChild(modalBoxImg);
    });

    // Création et ajout d'une ligne de séparation
    const modalLine = createModalLine();
    modalWrapper.appendChild(modalLine);

    // Création et ajout du bouton ajouter
    const modalButton = createModalButton('Ajouter une photo');
    modalWrapper.appendChild(modalButton);
}


// Fonctions annexes pour créer éléments de la modal

export function createModalCloseButton() {
    const modalCloseButton = document.createElement('img');
    modalCloseButton.src = './assets/icons/close-icon.svg';
    modalCloseButton.className = 'modalCloseButton';
    modalCloseButton.addEventListener('click', closeModal);
    return modalCloseButton;
}

export function createModalTitle(titleText) {
    const modalTitle = document.createElement('h3');
    modalTitle.textContent = titleText;
    modalTitle.className = "modalTitle";
    return modalTitle;
}

export function createModalBoxImg(work) {
    const modalBoxImg = document.createElement('div');
    modalBoxImg.className = 'modalBoxImg';
    modalBoxImg.id = `work-container-${work.id}`; // Ajout de l'ID

    const modalImg = document.createElement('img');
    modalImg.src = work.imageUrl;
    modalImg.className = 'modalImg';
    modalBoxImg.appendChild(modalImg);

    //creation ajout de la corbeille de suppression
    const trashIcon = createModalTrashIcon(work.id);
    modalBoxImg.appendChild(trashIcon);

    return modalBoxImg;
}




export function createModalTrashIcon(workId) {
    const icon = document.createElement('img');
    icon.src = './assets/icons/trash-icon.svg';
    icon.className = 'modalTrashIcon';
    icon.dataset.workId = workId;
    icon.addEventListener('click', () => modalRemoveWork(workId));

    return icon;
}

export function createModalLine() {
    const line = document.createElement('div');
    line.className = 'modalLine';

    return line;
}

export function createModalButton(buttonText) {
    const modalButtonAdd = document.createElement('button');
    modalButtonAdd.textContent = buttonText;
    modalButtonAdd.className = 'modalButton';
    modalButtonAdd.addEventListener('click', () => modalAddWork())

    return modalButtonAdd;
}
