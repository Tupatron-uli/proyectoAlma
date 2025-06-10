document.addEventListener("DOMContentLoaded", function() {

    // 📌 Mostrar y ocultar modales de registro e inicio de sesión
    const registerModal = document.getElementById('register-modal');
    const loginModal = document.getElementById('login-modal');
    const registerBtn = document.getElementById('register-btn');
    const loginBtn = document.getElementById('login-btn');
    const closeButtons = document.querySelectorAll('.close');

    registerBtn.addEventListener('click', () => {
        registerModal.style.display = 'block';
    });

    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            registerModal.style.display = 'none';
            loginModal.style.display = 'none';
        });
    });

    // 📌 Registro de usuario en localStorage
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();

            let email = document.querySelector('#registerForm input[type="email"]').value;
            let username = document.querySelector('#registerForm input[type="text"]').value;
            let password = document.querySelectorAll('#registerForm input[type="password"]')[0].value;
            let confirmPassword = document.querySelectorAll('#registerForm input[type="password"]')[1].value;

            if (password !== confirmPassword) {
                alert('❌ Las contraseñas no coinciden.');
                return;
            }

            if (localStorage.getItem(email)) {
                alert('❌ Este correo ya está registrado.');
                return;
            }

            let userData = { email, username, password };
            localStorage.setItem(email, JSON.stringify(userData));

            alert('✅ Registro exitoso.');
            registerModal.style.display = 'none';
        });
    }

    // 🔑 Inicio de sesión
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            let inputEmailOrUser = document.querySelector('#loginForm input[type="text"]').value;
            let inputPassword = document.querySelector('#loginForm input[type="password"]').value;

            let storedUser = localStorage.getItem(inputEmailOrUser);

            if (!storedUser) {
                alert('❌ Usuario o correo incorrecto.');
                return;
            }

            let userData = JSON.parse(storedUser);

            if (inputPassword === userData.password) {
                localStorage.setItem('userLoggedIn', 'true');
                alert('✅ Inicio de sesión exitoso.');
                loginModal.style.display = 'none';
            } else {
                alert('❌ Contraseña incorrecta.');
            }
        });
    }

    // 🛒 Agregar productos al carrito
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (localStorage.getItem('userLoggedIn') === 'true') {
                let productName = button.parentElement.querySelector('h2').textContent;
                let productPrice = button.parentElement.querySelector('.price').textContent;

                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart.push({ name: productName, price: productPrice });

                localStorage.setItem('cart', JSON.stringify(cart));
                alert(`🛒 ${productName} agregado al carrito.`);
            } else {
                alert('⚠️ Debes iniciar sesión para comprar.');
            }
        });
    });

    // 📜 Generar nota de remisión
    const generateReceipt = () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) {
            alert('⚠️ No hay productos en el carrito.');
            return;
        }

        let receiptContent = 'Nota de Remisión\n';
        receiptContent += '----------------------\n';
        let total = 0;

        cart.forEach(item => {
            receiptContent += `${item.name} - ${item.price}\n`;
            total += parseFloat(item.price.replace('$', ''));
        });

        receiptContent += '----------------------\n';
        receiptContent += `Total a pagar: $${total.toFixed(2)} MXN\n`;
        receiptContent += `Fecha y hora: ${new Date().toLocaleString()}`;

        let receiptBlob = new Blob([receiptContent], { type: 'text/plain' });
        let receiptUrl = URL.createObjectURL(receiptBlob);

        let downloadLink = document.createElement('a');
        downloadLink.href = receiptUrl;
        downloadLink.download = 'nota_de_remision.txt';
        downloadLink.click();

        alert('✅ Nota de remisión generada.');
        localStorage.removeItem('cart'); // Vaciar carrito después de la compra
    };

    // 📌 Botón para generar nota de remisión
    let cartButton = document.getElementById('cart');
    if (cartButton) {
        cartButton.addEventListener('click', generateReceipt);
    }
});

