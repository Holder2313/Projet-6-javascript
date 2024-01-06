import { createFilters, displayModalGallery, displayData } from './UI.js';



// Fonction principale pour obtenir les catégories et initialiser l'application
export async function getCategory() {
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


// Fonction pour obtenir les œuvres depuis l'API et les afficher
export async function getWorks(categoryId) {
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

// Suppression d'une œuvre
export async function modalRemoveWork(workId) {

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

// Fonction pour envoyer les détails de la nouvelle œuvre à l'API
export async function modalSendNewWork(newWorkContent) {
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