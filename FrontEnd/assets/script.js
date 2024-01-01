
async function getCategory() {
    try {
        const response = await fetch('http://localhost:5678/api/categories')
        if (!response.ok) {
            throw new Error(`Erreur http. status: ${response.status}`);
        }
        const categories = await response.json();
        createFilters(categories)
    }
    catch (error) {
        console.error('erreur: ', error)
    }
}
getCategory()

function createFilters(categories) {
    const filtersContainer = document.querySelector('.filters');
    const logButton = document.querySelector('.loginLink')

    const AllBtn = { name: 'Tous', id: null }
    categories.unshift(AllBtn)


    if (!localStorage.getItem('adminToken')) {
        
        categories.forEach(category => {
            logButton.textContent = 'login';
            const buttonFilter = document.createElement('li');
            buttonFilter.textContent = category.name;
            buttonFilter.className = 'filterButtons'

            if (!category.id) {
                buttonFilter.classList.add('active-btn')
                getWorks(category.id)
            }
            buttonFilter.addEventListener('click', () => {
                getWorks(category.id)
                activeButtonFilter(category.id)
            });

            filtersContainer.appendChild(buttonFilter);

            logButton.textContent = 'login'
            logButton.setAttribute('href', "./logIn/login.html")
        });
    }
    else {
        const titreAdmin = document.querySelector('.titreAdmin')
        const modifButton = document.createElement('i')
        const modifTxt = document.createElement('span')

        modifButton.className = 'fa-solid fa-pen-to-square modifBtn'
        modifTxt.textContent = 'Modifier '
        modifTxt.className = 'modifTxt'

        modifButton.appendChild(modifTxt)
        titreAdmin.appendChild(modifButton)

        logButton.textContent = 'logout'//bouton logout navigation
        logButton.addEventListener('click', () => {
            localStorage.removeItem('adminToken')
            logButton.setAttribute('href', "./index.html")
        } )

        modifButton.addEventListener('click', openModal)
    }

    getWorks()

}


function activeButtonFilter(categoryId) {
    const buttonsFilter = document.querySelectorAll('.filterButtons')
    buttonsFilter.forEach(btn => btn.classList.remove('active-btn'))

    buttonsFilter[categoryId ? categoryId : 0].classList.add('active-btn')
}


async function getWorks(categoryId) {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        if (!response.ok) {
            throw new Error(`Erreur http. status: ${response.status}`);
        }
        const works = await response.json();

        let filteredData = works
        if (categoryId) {
            filteredData = works.filter(obj => obj.categoryId === categoryId)
        }
        displayData(filteredData);
        displayModalGallery(filteredData)

    } catch (error) {
        console.error('Erreur fetch data: ', error);
    }
}

function displayData(arrayOfWorks) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';

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


//---------- modal-----------------//


const modalOverlay = document.querySelector('.modal')
const modalWrapper = document.querySelector('.modal-wrapper')
let modal = null

//creation de la modale
const openModal = (e) => {
    e.preventDefault()
    modalOverlay.classList.add('modalActiv')
    modalOverlay.removeAttribute('aria-hidden')
    modalOverlay.setAttribute('aria-modal', 'true')
    modal = modalOverlay
    modalOverlay.addEventListener('click', closeModal)
    document.querySelector('.modal-stop').addEventListener('click', stopPropagation)


}

// fermeture de lamodale
const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.classList.remove('modalActiv')
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    document.querySelector('.modal-stop').removeEventListener('click', stopPropagation)
    modal = null

}

const stopPropagation = function (event) {
    event.stopPropagation()
}



// affichage de la gallerie dans la modale
function displayModalGallery(arrayOfWorks) {
    modalWrapper.innerHTML = '';
    // bouton close
    const modalCloseButton = document.createElement('img')
    modalCloseButton.src = './assets/icons/close-icon.svg'
    modalCloseButton.className = 'modalCloseButton'
    modalCloseButton.addEventListener('click', closeModal)
    modalWrapper.appendChild(modalCloseButton)

    // titre
    const modalTitle = document.createElement('h3')
    modalTitle.textContent = 'Galerie photo'
    modalTitle.className = "modalTitle"
    modalWrapper.appendChild(modalTitle)


    // container galerie
    const modalContainerWorks = document.createElement('div')
    modalContainerWorks.className = 'modalContainerWorks'

    modalWrapper.appendChild(modalContainerWorks)

    if (arrayOfWorks) {
        arrayOfWorks.map(work => {
            // box image
            const modalBoxImg = document.createElement('div')
            modalBoxImg.className = 'modalBoxImg'
            // image
            const modalImg = document.createElement('img')
            modalImg.src = work.imageUrl
            modalImg.className = 'modalImg'

            // corbeille
            const modalTrashIcon = document.createElement('img')
            modalTrashIcon.src = './assets/icons/trash-icon.svg'
            modalTrashIcon.className = 'modalTrashIcon'
            modalTrashIcon.dataset.workId = work.id

            modalTrashIcon.addEventListener('click', () => modalRemoveWork(work.id))


            modalBoxImg.append(modalImg, modalTrashIcon)
            modalContainerWorks.appendChild(modalBoxImg)

        })
    }

    // ligne
    const modalLine = document.createElement('div')
    modalLine.className = 'modalLine'
    modalWrapper.appendChild(modalLine)

    // bouton ajouter
    const modalButton = document.createElement('button')
    modalButton.textContent = 'Ajouter une photo'
    modalButton.className = 'modalButton'
    modalButton.addEventListener('click', modalAddWork)
    modalWrapper.appendChild(modalButton)

}


// supression des travaux
async function modalRemoveWork(workId) {
    try {
        const token = localStorage.getItem('adminToken'); // Récupérer le token d'administration
        if (!token) {
            throw new Error("erreur authentification");
        }

        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Erreur http. Status: ${response.status}`)
        }
        await getWorks()
    } catch (error) {
        console.error('Erreur lors de la suppression: ', error);
    }

}

function modalAddWork() {
    modalWrapper.innerHTML = '';
    // bouton close
    const modalCloseButton = document.createElement('img')
    modalCloseButton.src = './assets/icons/close-icon.svg'
    modalCloseButton.className = 'modalCloseButton'
    modalCloseButton.addEventListener('click', closeModal)
    modalWrapper.appendChild(modalCloseButton)

    // titre
    const modalTitle = document.createElement('h3')
    modalTitle.textContent = 'Ajout photo'
    modalTitle.className = "modalTitle"
    modalWrapper.appendChild(modalTitle)

    //container photo
    const modalPhotoContainer = document.createElement('div')
    modalPhotoContainer.className = 'modalPhotoContainer'
    modalWrapper.appendChild(modalPhotoContainer)

    //add photo icone
    const modalAddPhotoIcon = document.createElement('img')
    modalAddPhotoIcon.src = './assets/icons/add-photo-icon.svg'
    modalAddPhotoIcon.classList = 'modalAddPhotoIcon'
    modalPhotoContainer.appendChild(modalAddPhotoIcon)

    //label bouton add photo
    const modalLabelAddPhoto = document.createElement('label')
    modalLabelAddPhoto.className = 'modalLabelAddPhoto'
    modalLabelAddPhoto.textContent = '+ Ajouter photo '
    modalLabelAddPhoto.setAttribute('for', 'imageInput')
    modalPhotoContainer.appendChild(modalLabelAddPhoto)

    //bouton add photo
    const modalAddPhotoButton = document.createElement('input')
    modalAddPhotoButton.type = "file"
    modalAddPhotoButton.id = 'imageInput'
    modalAddPhotoButton.accept = 'image/*'
    modalAddPhotoButton.textContent = '+ Ajouter photo'
    modalAddPhotoButton.className = 'modalAddPhotoButton'
    modalPhotoContainer.appendChild(modalAddPhotoButton)

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
                valideNewWork('img')
            };
            reader.readAsDataURL(file);
            fileImg = file
            console.log(fileImg);
        }
    });

    //image selectionnée
    const modalImageDisplay = document.createElement('img');
    modalImageDisplay.id = 'displayImage';
    modalImageDisplay.className = 'modalImageDisplay'
    modalPhotoContainer.appendChild(modalImageDisplay)



    // texte taille format image
    const modalTxtFormat = document.createElement('p')
    modalTxtFormat.textContent = 'jpg, png: 4mo max'
    modalTxtFormat.className = 'modalTxtFormat'
    modalPhotoContainer.appendChild(modalTxtFormat)

    // label input titre
    const modalLabelTitre = document.createElement('label')
    modalLabelTitre.className = 'modalLabel'
    modalLabelTitre.setAttribute('for', 'inputTitre')
    modalLabelTitre.textContent = 'Titre'
    modalWrapper.appendChild(modalLabelTitre)


    // input Titre
    const modalInputTitre = document.createElement('input')
    modalInputTitre.className = 'modalInput'
    modalInputTitre.id = 'inputTitre'
    modalWrapper.appendChild(modalInputTitre)
    modalInputTitre.addEventListener('input', (e) => valideNewWork(e.target.value))

    // label input Categories
    const modalLabelCategory = document.createElement('label')
    modalLabelCategory.className = 'modalLabel'
    modalLabelCategory.setAttribute('for', 'inputCategory')
    modalLabelCategory.textContent = 'Catégories'
    modalWrapper.appendChild(modalLabelCategory)

    // input Categories
    const modalInputCategory = document.createElement('select')
    modalInputCategory.className = 'modalInput'
    modalInputCategory.id = 'inputCategory'
    modalInputCategory.innerHTML = `<option value=""></option>
        <option value=1>Objets</option>
        <option value=2>Appartements</option>
        <option value=3>Hôtel & restaurants</option>`
    modalWrapper.appendChild(modalInputCategory)
    modalInputCategory.addEventListener('change', (e)=> valideNewWork(e.target.value))

    // ligne
    const modalLine = document.createElement('div')
    modalLine.className = 'modalLine'
    modalWrapper.appendChild(modalLine)


    // bouton ajouter
    const modalButton = document.createElement('button')
    modalButton.textContent = 'Valider'
    modalButton.className = 'modalButton noActiveBtn'
    modalWrapper.appendChild(modalButton)

    function valideNewWork() {
        if (fileImg && modalInputTitre.value && modalInputCategory.value) {
            modalButton.classList.remove('noActiveBtn')
            modalButton.addEventListener('click', () => {
                const currentFileImg = fileImg;
                const currentValueInputTitre = modalInputTitre.value;
                const currentValueInputCategory = modalInputCategory.value;
                const currentNewWorkContent = { currentFileImg, currentValueInputTitre, currentValueInputCategory };
                modalSendNewWork(currentNewWorkContent);
            })
        }
        else {
            console.log('erreur');
        }
    }

}


async function modalSendNewWork(newWorkContent) {
    try {
        console.log(newWorkContent);
        const { currentFileImg, currentValueInputTitre, currentValueInputCategory } = newWorkContent;

        const formData = new FormData();
        formData.append('image', currentFileImg);
        formData.append('title', currentValueInputTitre);
        formData.append('category', currentValueInputCategory);


        const token = localStorage.getItem('adminToken'); // Récupérer le token admin
        const response = await fetch(`http://localhost:5678/api/works`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: formData

        });
        if (!response.ok) {
            throw new Error(`Erreur http. Status: ${response.status}`)
        }
        await getWorks()
    } catch (error) {
        console.error("Erreur lors de l'envoi des données': ", error);
    }

}