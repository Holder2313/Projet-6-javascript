

// Fonction pour activer le filtre sélectionné
export function activeButtonFilter(categoryId) {
    const buttonsFilter = document.querySelectorAll('.filterButtons');
    buttonsFilter.forEach(btn => btn.classList.remove('active-btn'));
    buttonsFilter[categoryId ? categoryId : 0].classList.add('active-btn');
}


// verification validité des inputs
export function updateButtonState() {
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
