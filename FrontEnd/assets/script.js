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


// Fonction pour activer le filtre sélectionné
function activeButtonFilter(categoryId) {
    const buttonsFilter = document.querySelectorAll('.filterButtons');
    buttonsFilter.forEach(btn => btn.classList.remove('active-btn'));
    buttonsFilter[categoryId ? categoryId : 0].classList.add('active-btn');
}



// Fonction pour obtenir les œuvres depuis l'API et les afficher
async function getWorks(categoryId) {
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
        figure.className = 'figure'
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.src = work.imageUrl;
        figcaption.textContent = work.title;

        figure.append(img, figcaption);
        gallery.appendChild(figure);
    });
}


// Variables globales pour la modal
const modalOverlay = document.querySelector('.modal');
const modalWrapper = document.querySelector('.modal-wrapper');

// Ouverture de la modal
const openModal = (e) => {
    e.preventDefault();
    modalOverlay.classList.add('modalActiv');
    modalOverlay.addEventListener('click', closeModal);
    document.querySelector('.modal-stop').addEventListener('click', stopPropagation);
};

// Fermeture de la modal
const closeModal = (e) => {
    e.preventDefault();
    modal.classList.remove('modalActiv');
    // modal.removeEventListener('click', closeModal);
    document.querySelector('.modal-stop').removeEventListener('click', stopPropagation);
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

function createModalCloseButton() {
    const modalCloseButton = document.createElement('img');
    modalCloseButton.src = './assets/icons/close-icon.svg';
    modalCloseButton.className = 'modalCloseButton';
    modalCloseButton.addEventListener('click', closeModal);
    return modalCloseButton;
}

function createModalTitle(titleText) {
    const modalTitle = document.createElement('h3');
    modalTitle.textContent = titleText;
    modalTitle.className = "modalTitle";
    return modalTitle;
}

function createModalBoxImg(work) {
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
    modalButtonAdd.addEventListener('click', () => modalAddWork())

    return modalButtonAdd;
}


// Supression et ajout des oeuvres

// Suppression d'une œuvre
async function modalRemoveWork(workId) {

    try {
        const token = localStorage.getItem('adminToken'); // Récup token admin
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

        // effacer l'element du DOM
        const workElement = document.querySelector(`#work-container-${workId}`);
        if (workElement) {
            workElement.remove(); 
        }
        getWorks()

    } catch (error) { 
        console.error('Erreur lors de la suppression: ', error);
    }
}

// verification validité des inputs
function updateButtonState() {
    const fileImg = document.getElementById('imageInput').files[0];
    const titre = document.getElementById('inputTitre').value;
    const category = document.getElementById('inputCategory').value;
    const modalButton = document.querySelector('.modalButton');

    if (fileImg && titre && category) {
        modalButton.classList.remove('noActiveBtn');
        modalButton.disabled = false;
    } else {
        modalButton.classList.add('noActiveBtn');
        modalButton.disabled = true;
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

    // creation/ajout Input Categories
    const modalInputCategory = createModalInputCategory()
    modalWrapper.appendChild(modalInputCategory)

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
function createModalPhotoContainer() {
    const modalPhotoContainer = document.createElement('div')
    modalPhotoContainer.className = 'modalPhotoContainer'

    return modalPhotoContainer
}

// icone Add Photo
function createModalAddPhotoIcon() {
    const modalAddPhotoIcon = document.createElement('img')
    modalAddPhotoIcon.src = './assets/icons/add-photo-icon.svg'
    modalAddPhotoIcon.classList = 'modalAddPhotoIcon'

    return modalAddPhotoIcon
}

// Label bouton Add Photo
function createModalLabelAddPhoto(textLabel) {
    const modalLabelAddPhoto = document.createElement('label')
    modalLabelAddPhoto.className = 'modalLabelAddPhoto'
    modalLabelAddPhoto.textContent = textLabel
    modalLabelAddPhoto.setAttribute('for', 'imageInput')

    return modalLabelAddPhoto
}

// bouton pour recuperer une photo locale
function createModalAddPhotoButton(modalLabelAddPhoto, modalImageDisplay, modalTxtFormat) {
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
function createModalImageDisplay() {
    const modalImageDisplay = document.createElement('img');
    modalImageDisplay.id = 'displayImage';
    modalImageDisplay.className = 'modalImageDisplay'

    return modalImageDisplay
}

// texte info (format img)
function createModalTxtFormat(textInfoFormat) {
    const modalTxtFormat = document.createElement('p')
    modalTxtFormat.textContent = textInfoFormat
    modalTxtFormat.className = 'modalTxtFormat'

    return modalTxtFormat
}

// Label Input Titre
function createModalLabelTitre(textLabelTitre) {
    const modalLabelTitre = document.createElement('label')
    modalLabelTitre.className = 'modalLabel'
    modalLabelTitre.setAttribute('for', 'inputTitre')
    modalLabelTitre.textContent = textLabelTitre

    return modalLabelTitre
}

// Input Titre
function createModalInputTitre() {
    const modalInputTitre = document.createElement('input')
    modalInputTitre.className = 'modalInput'
    modalInputTitre.id = 'inputTitre'
    modalInputTitre.addEventListener('input', updateButtonState)

    return modalInputTitre
}

// Label Input Categories
function createModalLabelCategory(textLabelCategory) {
    const modalLabelCategory = document.createElement('label')
    modalLabelCategory.className = 'modalLabel'
    modalLabelCategory.setAttribute('for', 'inputCategory')
    modalLabelCategory.textContent = textLabelCategory

    return modalLabelCategory
}

// Input Categories
function createModalInputCategory() {

    const modalInputCategory = document.createElement('select')
    modalInputCategory.className = 'modalInput'
    modalInputCategory.id = 'inputCategory'
    modalInputCategory.innerHTML = `<option value=""></option>
        <option value=1>Objets</option>
        <option value=2>Appartements</option>
        <option value=3>Hôtel & restaurants</option>`
    modalWrapper.appendChild(modalInputCategory)
    modalInputCategory.addEventListener('change', updateButtonState)

    return modalInputCategory
}

// bouton ajouter
function createModalValidButton() {
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

// Fonction pour envoyer les détails de la nouvelle œuvre à l'API
async function modalSendNewWork(newWorkContent) {
    try {
        console.log(newWorkContent)
        const formData = new FormData();
        formData.append('image', newWorkContent.fileImg);
        formData.append('title', newWorkContent.titre);
        formData.append('category', (newWorkContent.category));

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