import { createModalCloseButton, createModalTitle, createModalLine, createModalArrow } from "./UI.js";
import { modalSendNewWork, getCategoriesModal } from "./API.js";
import { updateButtonState } from "./Helper.js";



// Variables globales pour la modal
export const modalOverlay = document.querySelector('.modal');
export const modalWrapper = document.querySelector('.modal-wrapper');

// Ouverture de la modal
export const openModal = (e) => {
    e.preventDefault();
    modalOverlay.classList.add('modalActiv');
    modalOverlay.addEventListener('click', closeModal);
    document.querySelector('.modal-stop').addEventListener('click', stopPropagation);
};

// Fermeture de la modal
export const closeModal = (e) => {
    e.preventDefault();
    modal.classList.remove('modalActiv');
    document.querySelector('.modal-stop').removeEventListener('click', stopPropagation);
};

// Empêcher la propagation de l'événement de clic
export const stopPropagation = (event) => {
    event.stopPropagation();
};


// Ajout d'une nouvelle œuvre
export async function modalAddWork() {
    modalWrapper.innerHTML = '';



    // Ajout du bouton de fermeture de la modal
    const modalCloseButton = createModalCloseButton();
    modalWrapper.appendChild(modalCloseButton);

    // Ajout du titre de la modal
    const modalTitle = createModalTitle('Ajout photo');
    modalWrapper.appendChild(modalTitle);

    // Ajout fe la fleche retour
    const modalArrow = createModalArrow()
    modalWrapper.appendChild(modalArrow);

    // creation/ajout du container photo
    const modalPhotoContainer = createModalPhotoContainer()
    modalWrapper.appendChild(modalPhotoContainer)

    // creation/ajout icone Add Photo
    const modalAddPhotoIcon = createModalAddPhotoIcon()
    modalPhotoContainer.appendChild(modalAddPhotoIcon)

    // creation/ajout Label bouton Add Photo
    const modalLabelAddPhoto = createModalLabelAddPhoto('Ajouter photo')
    modalPhotoContainer.appendChild(modalLabelAddPhoto)

    // creation/ajout image selectionnée
    const modalImageDisplay = createModalImageDisplay()
    modalPhotoContainer.appendChild(modalImageDisplay)

    // creation/ajout texte info (format img)
    const modalTxtFormat = createModalTxtFormat('jpg, png: 4mo max')
    modalPhotoContainer.appendChild(modalTxtFormat)

    // creation/ajout buton pour recuperer une photo locale
    const modalAddPhotoButton = createModalAddPhotoButton(modalLabelAddPhoto, modalImageDisplay, modalTxtFormat)
    modalPhotoContainer.appendChild(modalAddPhotoButton)

    // creation/ajout Label Input Titre
    const modalLabelTitre = createModalLabelTitre('titre')
    modalWrapper.appendChild(modalLabelTitre);

    // creation/ajout Input Titre
    const modalInputTitre = createModalInputTitre()
    modalWrapper.appendChild(modalInputTitre)

    // creation/ajout Label Input Categories
    const modalLabelCategory = createModalLabelCategory('Catégories')
    modalWrapper.appendChild(modalLabelCategory)

    // Ajout Input Categories
    const modalInputCategory = document.createElement('select');
    modalInputCategory.className = 'modalInput';
    modalInputCategory.id = 'inputCategory';
    modalInputCategory.addEventListener('change', updateButtonState);
    modalWrapper.appendChild(modalInputCategory);

    // Ajout d'une option vide par défaut
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '';
    modalInputCategory.appendChild(defaultOption);

    // Récupérer les catégories depuis l'API 
    async function displayInputCategories() {
        const categories = await getCategoriesModal();

        categories.forEach((category) => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            modalInputCategory.appendChild(option);
        });
    }
    displayInputCategories();

    // ajout d'une ligne de séparation
    const modalLine = createModalLine();
    modalWrapper.appendChild(modalLine);

    // ajout du bouton ajouter
    const modalButton = createModalValidButton(modalImageDisplay, modalInputTitre, modalInputCategory);
    modalWrapper.appendChild(modalButton);

    updateButtonState()
}


//----- fonctions annexes pour l'ajout de nouveaux travaux ----//


// container photo
export function createModalPhotoContainer() {
    const modalPhotoContainer = document.createElement('div')
    modalPhotoContainer.className = 'modalPhotoContainer'

    return modalPhotoContainer
}

// icone Add Photo
export function createModalAddPhotoIcon() {
    const modalAddPhotoIcon = document.createElement('img')
    modalAddPhotoIcon.src = './assets/icons/add-photo-icon.svg'
    modalAddPhotoIcon.classList = 'modalAddPhotoIcon'

    return modalAddPhotoIcon
}

// Label bouton Add Photo
export function createModalLabelAddPhoto(textLabel) {
    const modalLabelAddPhoto = document.createElement('label')
    modalLabelAddPhoto.className = 'modalLabelAddPhoto'
    modalLabelAddPhoto.textContent = textLabel
    modalLabelAddPhoto.setAttribute('for', 'imageInput')

    return modalLabelAddPhoto
}

// bouton pour recuperer une photo locale
export function createModalAddPhotoButton(modalLabelAddPhoto, modalImageDisplay, modalTxtFormat) {
    const modalAddPhotoButton = document.createElement('input')
    modalAddPhotoButton.type = "file"
    modalAddPhotoButton.id = 'imageInput'
    modalAddPhotoButton.accept = 'image/*'
    modalAddPhotoButton.className = 'modalAddPhotoButton'

    //selection fichier local
    let fileImg;
    modalAddPhotoButton.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                modalImageDisplay.src = e.target.result;
                modalLabelAddPhoto.style.display = 'none'
                modalTxtFormat.style.display = 'none'
                updateButtonState()
            };
            reader.readAsDataURL(file);
            fileImg = file
            console.log(fileImg);
        }
    });

    return modalAddPhotoButton
}

// image selectionnée
export function createModalImageDisplay() {
    const modalImageDisplay = document.createElement('img');
    modalImageDisplay.id = 'displayImage';
    modalImageDisplay.className = 'modalImageDisplay'

    return modalImageDisplay
}

// texte info (format img)
export function createModalTxtFormat(textInfoFormat) {
    const modalTxtFormat = document.createElement('p')
    modalTxtFormat.textContent = textInfoFormat
    modalTxtFormat.className = 'modalTxtFormat'

    return modalTxtFormat
}

// Label Input Titre
export function createModalLabelTitre(textLabelTitre) {
    const modalLabelTitre = document.createElement('label')
    modalLabelTitre.className = 'modalLabel'
    modalLabelTitre.setAttribute('for', 'inputTitre')
    modalLabelTitre.textContent = textLabelTitre

    return modalLabelTitre
}

// Input Titre
export function createModalInputTitre() {
    const modalInputTitre = document.createElement('input')
    modalInputTitre.className = 'modalInput'
    modalInputTitre.id = 'inputTitre'
    modalInputTitre.addEventListener('input', updateButtonState)

    return modalInputTitre
}

// Label Input Categories
export function createModalLabelCategory(textLabelCategory) {
    const modalLabelCategory = document.createElement('label')
    modalLabelCategory.className = 'modalLabel'
    modalLabelCategory.setAttribute('for', 'inputCategory')
    modalLabelCategory.textContent = textLabelCategory

    return modalLabelCategory
}


// bouton ajouter
export function createModalValidButton() {
    const modalButton = document.createElement('button');
    modalButton.textContent = 'Valider';
    modalButton.className = 'modalButton noActiveBtn';
    modalButton.disabled = true; // Désactiver le bouton par défaut

    modalButton.addEventListener('click', () => {
        const fileImg = document.getElementById('imageInput').files[0];
        const titre = document.getElementById('inputTitre').value;
        const category = document.getElementById('inputCategory').value;

        const currentNewWorkContent = { fileImg, titre, category };
        console.log(currentNewWorkContent);
        modalSendNewWork(currentNewWorkContent);
    });

    return modalButton;

}