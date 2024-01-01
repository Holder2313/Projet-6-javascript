// fetch("chemin de la ressource", { /* Objet de configuration */ });

// Objet de configuration 3 proprietes:
//  -protocole http => method: verbe http('POST')
//  -charge utile => body: valeur(donnee string)
//  -format charge utile => headers: type


const loginFormulaire = document.querySelector('.loginForm')
loginFormulaire.addEventListener('submit', postData)



async function postData(event) {
    event.preventDefault()

    const mailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    const infoMsg = document.querySelector('.infoMsg')

    const logData = { email: mailInput.value, password: passwordInput.value }
    const login = JSON.stringify(logData)


    try {
        if (mailInput.value != '' && passwordInput.value != '') {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "content-Type": "application/json" },
                body: login
            })
            const data = await response.json()

            console.log(data);

            if (data.userId === 1) {
                infoMsg.textContent = 'Authentification réussie'
                infoMsg.style.color = 'green'

                localStorage.setItem('adminToken', data.token)
                console.log(localStorage);
                // window.location.href = '../index.html'
            }
            else {
                infoMsg.textContent = 'E-mail ou Mot de passe incorect'

            }
        }
        else {
            infoMsg.textContent = 'Veuillez saisir tous le champs!'
        }


    } catch (error) {
        console.error('erreur', error);
    }

}



