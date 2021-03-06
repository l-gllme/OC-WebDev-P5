// ----- Résumé du panier ----- //

// initialisation de variables et constantes
const nameBasket = document.getElementById("name--basket");
const colorBasket = document.getElementById("color--basket");
const priceBasket = document.getElementById("price--basket");

let totalPrice = document.getElementById("total-price");
let sumPrice = 0;
let addPrice = 0;
let idArray = [];
totalPrice.innerHTML = "Cout Total: "+sumPrice+" €";

//boucle dans le local storage pour récuperer les éléments qui s'y trouvent
for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);

    // Désérialisation de l'objet JSON
    let myproduct = JSON.parse(localStorage.getItem(key));

    // Implémentation de l'objet dans l'HTML
    const newName = document.createElement("p");
    newName.innerHTML = myproduct.productName
    const newPrice = document.createElement("p");
    newPrice.innerHTML = myproduct.price + "€"
    const newColor = document.createElement("p");
    newColor.innerHTML = myproduct.color

    nameBasket.appendChild(newName);
    priceBasket.appendChild(newPrice);
    colorBasket.appendChild(newColor); 
    
    idArray[i] = myproduct._id;

    // Calcul de la somme totale
    addPrice = myproduct.price
    sumPrice =  sumPrice + addPrice;
    totalPrice.innerHTML = "Cout Total: "+sumPrice+" €";
}

// ----- Informations de commande ----- //

submitBtn = document.getElementById("btn-submit");

// Btn pour vider le panier
clearBtn = document.getElementById("clear--basket");

clearBtn.addEventListener('click',() =>{
    localStorage.clear();
    document.location.reload();
    alert("Panié vidé");
});

// ----- Validations ------ //

let form = document.querySelector('#formUserInfo');
let nameIsValid = false;
let lastNameIsValid = false;
let cityIsValid = false;
let adressIsValid = false;
let emailIsValid = false;

// Validation Email  
form.email.addEventListener('change', function(){
    validEmail(this);
});
// Validation premon
form.name.addEventListener('change', function(){
    validName(this);
});
// Validation nom 
form.nom.addEventListener('change', function(){
    validLastName(this);
});
// Validation ville 
form.city.addEventListener('change', function(){
    validCity(this);
});
// Validation adresse 
form.adress.addEventListener('change', function(){
    validAdress(this);
});

// Fonction validation email
const validEmail = function(inputEmail){
    // RegEx Email
    let emailRegEx = new RegExp(
        '^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$',
        'g'
    );
    let testEmail = emailRegEx.test(inputEmail.value);
    let small = document.getElementById("small-email")
    validation(small,"Email ",testEmail);
    if (testEmail) {
        emailIsValid = true;
    }else{
        emailIsValid = false;
    }
};

// Fonction validation Prénom
const validName = function(inputName){
    // RegEx Prenom
    let nameRegEx = new RegExp(
        "^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$",
        'g'
    );
    let testName = nameRegEx.test(inputName.value);
    let smallName = document.getElementById("small-name");
    validation(smallName,"Prénom ",testName);
    if (testName) {
        nameIsValid = true;
    }else{
        nameIsValid = false;
    }
};
// Fonction validation Nom 
const validLastName = function(inputlastname){
    // RegEx 
    let lastnameRegEx = new RegExp(
        "^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$",
        'g'
    );
    let testlastname = lastnameRegEx.test(inputlastname.value);
    let smalllastname = document.getElementById("small-lastname")
    validation(smalllastname,"Nom ",testlastname);
    if (testlastname) {
        lastNameIsValid = true;
    }else{
        lastNameIsValid = false;
    }
};
// Fonction validation Ville 
const validCity = function(inputCity){
    // RegEx Ville
    let CityRegEx = new RegExp(
        "^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$",
        'g'
    );
    let testCity = CityRegEx.test(inputCity.value);
    let smallCity = document.getElementById("small-city")
    validation(smallCity,"Ville ",testCity);
    if (testCity) {
        cityIsValid = true;
    } else {
        cityIsValid = false;
    };

};

// Fonction validation Adresse
const validAdress = function(inputAdress){
    // RegEx Adresse 
    let AdressRegEx = new RegExp(
        "[^A-Za-z0-9]+",
        'g'
    );
    let testAdress = AdressRegEx.test(inputAdress.value);
    let smallAdress = document.getElementById("small-adress")
    validation(smallAdress,"Adresse ",testAdress);
    if (testAdress) {
        adressIsValid = true;
    }else{
        adressIsValid = false;
    }
};

//Fonction de validations des champs
const validation = function(small,texte,isvalid){
    texte+= isvalid? "valide" : "non valide";
    small.innerHTML = texte;
    if (isvalid) {
        small.classList.add('right');
        small.classList.remove('wrong');
    } else {
        small.classList.add('wrong');
        small.classList.remove('right');
    }
}
// Création dun object contennat les données au moment du click sur le button "passer la commande"
submitBtn.addEventListener('click',() =>{
    //vérifiaction des données
    if (adressIsValid && cityIsValid && lastNameIsValid && emailIsValid && nameIsValid && idArray != 0){
        const clientData ={
            contact: {
                firstName: form.name.value,
                lastName: form.nom.value,
                address: form.adress.value,
                city: form.city.value,
                email: form.email.value 
            },
            products: idArray
        };
        //envoie des données a lapi
        fetch("http://localhost:5000/api/teddies/order", {
            method :"POST",
            headers:{
                'Accept': 'application/json', 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(clientData)
        })
        //recuperation de la reponse et envoie de celle ci a la page confirmation par l'url
        .then(res => {
            if (res.ok) {
                res.json().then(data =>{
                    localStorage.clear();
                    document.location.href="../HTML/confirmation.html?id="+data.orderId+"&price="+sumPrice+"&name="+form.name.value; 
                });
            }else {
                console.log("error");
            }
        });
    }else {
        alert("Les champs ne sont pas valides ou vous n'avez pas commander de produits !");
    };
});