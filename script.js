import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyA3NrlF7b1h9vCP-AcpwRiMs4f0IC3jPfM",
    authDomain: "base-dato-mi-web-iphone-style.firebaseapp.com",
    databaseURL: "https://base-dato-mi-web-iphone-style-default-rtdb.firebaseio.com",
    projectId: "base-dato-mi-web-iphone-style",
    storageBucket: "base-dato-mi-web-iphone-style.firebasestorage.app",
    messagingSenderId: "293724705936",
    appId: "1:293724705936:web:5bcff580d5a6821e2f3415"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let productos = [];

// LEER PRODUCTOS
onValue(ref(database, 'productos/'), (snapshot) => {
    const data = snapshot.val();
    productos = data ? Object.keys(data).map(key => ({ id_firebase: key, ...data[key] })) : [];
    
    if (document.getElementById('grid-productos')) window.renderizar();
    if (document.getElementById('lista-gestion-admin')) window.mostrarProductosParaBorrar();
});

// SUBIR PRODUCTO
window.subirProducto = function() {
    const nombre = document.getElementById('p-nombre').value;
    const precio = document.getElementById('p-precio').value;
    const img = document.getElementById('p-img').value;

    if(!nombre || !precio || !img) return alert("Completa los campos principales");

    push(ref(database, 'productos/'), {
        id: Date.now(),
        nombre, 
        precio: parseInt(precio), 
        img
    }).then(() => {
        alert("¡Producto subido!");
        document.getElementById('p-nombre').value = "";
        document.getElementById('p-precio').value = "";
        document.getElementById('p-img').value = "";
    }).catch(() => alert("Error al subir. Revisa las Reglas en Firebase."));
};

// RENDERIZAR VISTA CLIENTE
window.renderizar = function(filtro = '') {
    const grid = document.getElementById('grid-productos');
    if(!grid) return;
    grid.innerHTML = productos
        .filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase()))
        .map(p => `
            <div class="card-ml">
                <img src="${p.img}" class="img-ml">
                <div class="info-ml">
                    <p class="precio-ml">$ ${Number(p.precio).toLocaleString()}</p>
                    <h3 class="nombre-ml">${p.nombre}</h3>
                    <button class="btn-ml">Ver detalles</button>
                </div>
            </div>
        `).join('');
};

// GESTIÓN ADMIN (Borrar)
window.mostrarProductosParaBorrar = function() {
    const contenedor = document.getElementById('lista-gestion-admin');
    if (!contenedor) return;
    contenedor.innerHTML = productos.map(p => `
        <div class="item-gestion">
            <span>${p.nombre}</span>
            <button onclick="window.eliminarProducto('${p.id_firebase}')">Eliminar</button>
        </div>
    `).join('');
};

window.eliminarProducto = function(id) {
    if (confirm("¿Borrar?")) remove(ref(database, 'productos/' + id));
};