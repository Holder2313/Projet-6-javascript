import { AuthStatus, displayModalGallery, displayData } from './UI.js';


// appel API generique methode GET
export async function fetchGETApi(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur HTTP. Statut : ${response.status}`);

        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des données : ', error);

    }
}

// Fonction principale pour initialiser l'application et obtenir les catégories
export async function getCategoryInit() {
    const categories = await fetchGETApi('http://localhost:5678/api/categories');
    AuthStatus(categories);

    return categories
}

// Fonction pour obtenir les categories dans la modale
export async function getCategoriesModal() {
    return await fetchGETApi(('http://localhost:5678/api/categories'))
}



// Fonction pour obtenir les travaux depuis l'API et les filtrer/afficher
export async function getWorks(categoryId) {
        const works = await fetchGETApi('http://localhost:5678/api/works');
        
        // Filtrer les œuvres si un categoryId est fourni
        let filteredData = works
        if (categoryId) {
            filteredData = works.filter(obj => obj.categoryId === categoryId)
        }

        displayData(filteredData);//envoi des oeuvres pour la gallerie
        displayModalGallery(filteredData)//envoi des oeuvres pour la modale
   
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