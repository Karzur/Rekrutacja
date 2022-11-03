// Komentarz przed każdym segmentem oznacza nazwę pliku, w którm ten segment powinien się znajdować.
// Na potrzeby zadania cały Javascript został umieszczony w jednym pliku.

// CONSTS.JS
const HEAD_ID = 'head';
const FORM_WRAPPER_ID = 'form_wrapper';

const NAME_INPUT_NAME = 'name';
const EMAIL_INPUT_NAME = 'e_mail';
const PHONENUMBER_INPUT_NAME = 'phone_number';
const COMPANYNAME_INPUT_NAME = 'company_name';
const MESSAGE_INPUT_NAME = 'message';
const CONSENT_INPUT_NAME = 'consent';

const INPUT_NAMES = [NAME_INPUT_NAME, EMAIL_INPUT_NAME, PHONENUMBER_INPUT_NAME, COMPANYNAME_INPUT_NAME, MESSAGE_INPUT_NAME, CONSENT_INPUT_NAME];

const ENDPOINT = "https://eo8n2osmov1xcik.m.pipedream.net";

const SEND_OPTIONS = {
    method: "POST",
    headers: {
        "x-api-key": "1IWkt23gdi3rByid3xSa",
        "Content-Type": "application/json"
    },
}


// VALIDATION/VALIDATE.JS
function validate() {
    const inputObjects = INPUT_NAMES.map(name => getInputObject(name));
    let isValid = true;
    inputObjects.forEach(inputObject => {
        isValid = validateInput(inputObject) && isValid;
    });
    return isValid;
}

function getInputObject(name) {
    return {
        name,
        element: document.getElementById(name),
        error_element: document.getElementById(`wrong_${name}`)
    }
}

function validateInput(inputObject) {
    let validateCallback = null;
    switch (inputObject.name) {
        case NAME_INPUT_NAME:
            validateCallback = validateName;
            break;
        case EMAIL_INPUT_NAME:
            validateCallback = validateEmail;
            break;
        case PHONENUMBER_INPUT_NAME:
            validateCallback = validatePhoneNumber;
            break;
        case COMPANYNAME_INPUT_NAME:
            validateCallback = validateCompanyName;
            break;
        case MESSAGE_INPUT_NAME:
            validateCallback = validateMessage;
            break;
        case CONSENT_INPUT_NAME:
            validateCallback = validateConsent;
            break;
    }
    if (!validateCallback) {
        return false;
    }

    const inputValid = validateCallback(inputObject);
    if (inputValid) {
        hideElement(inputObject.error_element);
    } else {
        showElement(inputObject.error_element);
    }
    
    return inputValid;
}


// VALIDATION/INPUTS_VALIDATION.JS 
function validateName(nameInputObject) {
    return nameInputObject.element.value != '';
}

function validateEmail(emailInputObject) {
    const emailRegExp = /^\S+@\S+\.\S{2,}$/;
    return emailInputObject.element.value != '' && emailRegExp.test(emailInputObject.element.value);
}

function validatePhoneNumber(phoneNumberInputObject) {
    const phoneNumberRegExp = /^\+\d{11}$/;
    return phoneNumberInputObject.element.value != '' && phoneNumberRegExp.test(phoneNumberInputObject.element.value);
}

function validateCompanyName(companyNameInputObject) {
    return companyNameInputObject.element.value != '';
}

function validateMessage(messageInputObject) {
    return messageInputObject.element.value != '' && messageInputObject.element.value.length <= 10;
}

function validateConsent(consentInputObject) {
    return consentInputObject.element.checked;
}


//SEND_DATA.JS
function readyToSend() {
    if(validate()){
        fetch(ENDPOINT, {
            SEND_OPTIONS,
            body: JSON.stringify(createJson)
        }).then(res => handleResponse(res));
    }
}

function handleResponse(res) {
    
    const headInfo = document.getElementById(HEAD_ID);
    const formWrapper = document.getElementById(FORM_WRAPPER_ID);
    switch (res.status) {
        case 200:
            headInfo.innerHTML='Dziękujemy';
            hideElement(formWrapper);
            break;
        case 400:
        case 401:
            headInfo.innerHTML='Błąd serwera';
            hideElement(formWrapper);
            break;
        default:
            headInfo.innerHTML='Coś poszło nie tak!';
    }
}


function createJson() {
    const form = document.getElementById('form');
    const formData = new FormData(form);
    var object = {};
        formData.forEach(function(value, key){
        object[key] = value;
        });
        return object;
}


//UTILS.JS
function showElement(element) {
    element.style.display = 'block';
}

function hideElement(element) {
    element.style.display = 'none';
}