

// Fonction pour activer le filtre sélectionné
export function activeButtonFilter(categoryId) {
    const buttonsFilter = document.querySelectorAll('.filterButtons');
    buttonsFilter.forEach(btn => btn.classList.remove('active-btn'));
    buttonsFilter[categoryId ? categoryId : 0].classList.add('active-btn');
}


// verification validité des inputs
export function updateButtonState() {
    const titre = document.getElementById('inputTitre').value;
    const fileImg = document.getElementById('imageInput').files[0];
    const category = document.getElementById('inputCategory').value;
    const modalButton = document.querySelector('.modalButton');

    if (titre && fileImg && category) {
        modalButton.classList.remove('noActiveBtn');
        modalButton.disabled = false;
    } else {
        modalButton.classList.add('noActiveBtn');
        modalButton.disabled = true;
        
    }
}
