// recuperation elements formulaire
const loginFormulaire = document.querySelector('.loginForm');
const mailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const infoMsg = document.querySelector('.infoMsg');

// evenement validation formulaire
loginFormulaire.addEventListener('submit', handleSubmit);

// creation objet des valeurs input mail et password
function getFormData() {
    return { email: mailInput.value, password: passwordInput.value };
}

// verification de la validité des inputs
function validateFormData(formData) {
    return formData.email !== '' && formData.password !== ''; // verification validité
}

// POST des données 
async function postLoginData(formData) {
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });

    return response.json();
}

// gestion de la reponse: message authentification, localStorage
function handleResponse(data) {
    if (data.token) {
        infoMsg.textContent = 'Authentification réussie';
        infoMsg.style.color = 'green';
        localStorage.setItem('adminToken', data.token);
        window.location.href = '../index.html'
    } else {
        infoMsg.textContent = 'E-mail ou Mot de passe incorrect';
    }
}


async function handleSubmit(event) {
    event.preventDefault();
    const formData = getFormData();

    if (validateFormData(formData)) {
        try {
            const data = await postLoginData(formData);
            console.log(data);
            handleResponse(data);
        } catch (error) {
            console.error('une erreur est survenue: ', error);
        }
    } else {
        infoMsg.textContent = 'Veuillez saisir tous les champs!';
    }
}

