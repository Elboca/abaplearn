const introContainer = document.getElementById('intro-container');
const loginContainer = document.getElementById('login-container');
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

const medicalSymbols = [
 'ABAP', 'SAP', 'OO', 'BOPF', 'CDS', 'RAP', 
    'FIORI', 'HANA', 'BTP', 'S/4', 'UI5', 'API',
    'RFC', 'ALE', 'IDOC', 'BAPI', 'FPM', 'WDA'
];

class Symbol {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 12 + 10; // Slightly larger symbols
        this.text = medicalSymbols[Math.floor(Math.random() * medicalSymbols.length)];
        this.speed = {
            x: (Math.random() - 0.5) * 1.2,
            y: (Math.random() - 0.5) * 1.2
        };
        this.opacity = Math.random() * 0.5 + 0.3;
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        const colors = [
            'rgba(255, 0, 0, ', // Red (for blood, heart)
            'rgba(0, 255, 0, ', // Green (for growth, health)
            'rgba(0, 0, 255, ', // Blue (for veins, calmness)
            'rgba(255, 255, 0, ', // Yellow (for nervous system)
            'rgba(255, 165, 0, ', // Orange (for energy)
            'rgba(128, 0, 128, ' // Purple (for healing)
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        ctx.font = `${this.size}px Arial`;
        ctx.fillStyle = this.color + this.opacity + ')';
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
    const symbolCount = Math.min(40, Math.floor((canvas.width * canvas.height) / 10000));
    for (let i = 0; i < symbolCount; i++) {
        symbolObjects.push(new Symbol());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(26, 71, 49, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    symbolObjects.forEach(symbol => {
        symbol.update();
        symbol.draw();
    });
    requestAnimationFrame(animate);
}

function startMainAnimation() {
    loginContainer.style.opacity = '1';
    createSymbols();
    animate();
}

introAnimation();

// ... rest of the code remains the same ...


document.addEventListener('DOMContentLoaded', function() {
    const signInForm = document.getElementById('signIn');
    const signInButton = document.getElementById("GoogleButton");
    const signUpForm = document.getElementById('signup');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const showSignUpButton = document.getElementById('signUpButton');
    const showSignInButton = document.getElementById('signInButton');
    const resetPasswordLink = document.getElementById('resetPasswordLink');
    const backToSignInButton = document.getElementById('backToSignIn');
    const icons = document.querySelector('.icons');

    // Encontrar os links relevantes
    const createAccountLink = Array.from(signInForm.querySelectorAll('.links p')).find(p => p.textContent.includes('Dont have an account?'));
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
       // icons.style.display = 'none';
        if (showSignUpButton) showSignUpButton.style.display = 'none';
        if (showSignInButton) showSignInButton.style.display = 'none';
    }

    function styleAsTextLink(element) {
        if (element) {
            element.style.all = 'unset'; // Reseta todos os estilos
            element.style.cursor = 'pointer';
            element.style.color = 'inherit'; // Usa a cor do texto padrão
            element.style.display = 'inline';
            element.style.fontFamily = 'inherit';
            element.style.fontSize = 'inherit';
            element.style.margin = '0';
            element.style.padding = '0';
            element.style.textDecoration = 'none';
        }
    }

    // Configurar o link "Criar conta"
    if (createAccountLink) {
        createAccountLink.style.cursor = 'pointer';
        createAccountLink.addEventListener('click', function(e) {
            e.preventDefault();
            showOnly(signUpForm);
        });
    }

    // Configurar o link "Já tem uma conta?"
    if (alreadyHaveAccountLink) {
        alreadyHaveAccountLink.style.cursor = 'pointer';
        alreadyHaveAccountLink.addEventListener('click', function(e) {
            e.preventDefault();
            showOnly(signInForm);
        });
    }

    // Estilizar o botão "Voltar para Login" como texto simples
    styleAsTextLink(backToSignInButton);
    if (backToSignInButton) {
        backToSignInButton.textContent = 'Voltar para Login';
    }

    // Remover eventos de clique dos botões originais e ocultá-los
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


 // signInButton.addEventListener('click', userSignIn);
 // signOutButton.addEventListener('click', userSignOut);

 window.addEventListener('resize', () => {
            resizeCanvas();
            symbolObjects.length = 0;
            createSymbols();
        });
