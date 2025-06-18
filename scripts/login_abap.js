const introContainer = document.getElementById('intro-container');
const loginContainer = document.getElementById('login-container');
const tagline = document.getElementById('tagline');
const canvas = document.getElementById('animation-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
    resizeCanvas();
    createSymbols();
});
resizeCanvas();

function introAnimation() {
    const elements = document.querySelectorAll('.intro-element');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 80);
    });

    setTimeout(() => {
        introContainer.style.opacity = '0';
        setTimeout(() => {
            introContainer.style.display = 'none';
            startMainAnimation();
        }, 600);
    }, elements.length * 200 + 300);
}

const symbols = [
    'ABAP', 'SAP', 'OO', 'BOPF', 'CDS', 'RAP', 
    'FIORI', 'HANA', 'BTP', 'S/4', 'UI5', 'API',
    'RFC', 'ALE', 'IDOC', 'BAPI', 'FPM', 'WDA'
];

class Symbol {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 10 + 8;
        this.text = symbols[Math.floor(Math.random() * symbols.length)];
        this.speed = {
            x: (Math.random() - 0.5) * 1.5,
            y: (Math.random() - 0.5) * 1.5
        };
        this.opacity = Math.random() * 0.5 + 0.3;
        this.color = Math.random() < 0.5 ? '#42b2f9' : '#fb8291';
    }

    draw() {
        ctx.font = `${this.size}px Arial`;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);
    }

    update() {
        this.x += this.speed.x;
        this.y += this.speed.y;

        if (this.x < 0 || this.x > canvas.width) this.speed.x *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speed.y *= -1;
    }
}

const symbolObjects = [];
function createSymbols() {
    symbolObjects.length = 0;
    const symbolCount = Math.min(30, Math.floor((canvas.width * canvas.height) / 10000));
    for (let i = 0; i < symbolCount; i++) {
        symbolObjects.push(new Symbol());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    symbolObjects.forEach(symbol => {
        symbol.update();
        symbol.draw();
    });
    requestAnimationFrame(animate);
}

function startMainAnimation() {
    loginContainer.style.opacity = '1';
    tagline.style.opacity = '1';
    createSymbols();
    animate();
}

introAnimation();

document.addEventListener('DOMContentLoaded', function() {
    const signInForm = document.getElementById('signIn');
    const signUpForm = document.getElementById('signup');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const showSignUpButton = document.getElementById('signUpButton');
    const showSignInButton = document.getElementById('signInButton');
    const resetPasswordLink = document.getElementById('resetPasswordLink');
    const backToSignInButton = document.getElementById('backToSignIn');

    const createAccountLink = Array.from(signInForm.querySelectorAll('.links p')).find(p => p.textContent.includes("Don't have an account?"));
    const alreadyHaveAccountLink = Array.from(signUpForm.querySelectorAll('.links p')).find(p => p.textContent.includes('Already have an account?'));

    function showOnly(elementToShow) {
        [signInForm, signUpForm, resetPasswordForm].forEach(el => {
            if (el) el.style.display = 'none';
        });
        if (elementToShow) elementToShow.style.display = 'block';
    }

    function initializeVisibility() {
        signInForm.style.display = 'block';
        signUpForm.style.display = 'none';
        resetPasswordForm.style.display = 'none';
        if (showSignUpButton) showSignUpButton.style.display = 'none';
        if (showSignInButton) showSignInButton.style.display = 'none';
    }

    function styleAsTextLink(element) {
        if (element) {
            element.style.all = 'unset';
            element.style.cursor = 'pointer';
            element.style.color = 'inherit';
            element.style.display = 'inline';
            element.style.fontFamily = 'inherit';
            element.style.fontSize = 'inherit';
            element.style.margin = '0';
            element.style.padding = '0';
            element.style.textDecoration = 'none';
        }
    }

    if (createAccountLink) {
        createAccountLink.style.cursor = 'pointer';
        createAccountLink.addEventListener('click', function(e) {
            e.preventDefault();
            showOnly(signUpForm);
        });
    }

    if (alreadyHaveAccountLink) {
        alreadyHaveAccountLink.style.cursor = 'pointer';
        alreadyHaveAccountLink.addEventListener('click', function(e) {
            e.preventDefault();
            showOnly(signInForm);
        });
    }

    styleAsTextLink(backToSignInButton);
    if (backToSignInButton) {
        backToSignInButton.textContent = 'Back to Login';
    }

    if (showSignUpButton) {
        showSignUpButton.style.display = 'none';
        showSignUpButton.removeEventListener('click', showOnly);
    }
    if (showSignInButton) {
        showSignInButton.style.display = 'none';
        showSignInButton.removeEventListener('click', showOnly);
    }

    resetPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        showOnly(resetPasswordForm);
    });
    backToSignInButton.addEventListener('click', () => showOnly(signInForm));

    initializeVisibility();
});

window.addEventListener('resize', () => {
    resizeCanvas();
    symbolObjects.length = 0;
    createSymbols();
});