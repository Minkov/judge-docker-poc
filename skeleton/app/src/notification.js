let ready = false;
const elements = {};

window.addEventListener('load', () => {
    Object.assign(elements, {
        info: document.getElementById('successBox'),
        error: document.getElementById('errorBox'),
        loading: document.getElementById('loadingBox')
    });

    elements.info.addEventListener('click', hideInfo);
    elements.error.addEventListener('click', hideError);

    ready = true;
});


export function showInfo(message) {
    if (ready) {
        elements.info.textContent = message;
        elements.info.style.display = 'block';

        setTimeout(hideInfo, 3000);
    }
}

export function showError(message) {
    if (ready) {
        elements.error.textContent = message;
        elements.error.style.display = 'block';
    }
}

let requests = 0;

export function beginRequest() {
    if (ready) {
        requests++;
        elements.loading.style.display = 'block';
    }
}

export function endRequest() {
    if (ready) {
        requests--;
        if (requests === 0) {
            elements.loading.style.display = 'none';
        }
    }
}

function hideInfo() {
    if (ready) {
        elements.info.style.display = 'none';
    }
}

function hideError() {
    if (ready) {
        elements.error.style.display = 'none';
    }
}