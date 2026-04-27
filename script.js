// 1. IMPORTAR FUNCIONES DE FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 2. CONFIGURACIÓN
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
let carrito = JSON.parse(localStorage.getItem('cart_iphones')) || [];

// 3. LEER DE LA NUBE
onValue(ref(database, 'productos/'), (snapshot) => {
    const data = snapshot.val();
    productos = data ? Object.keys(data).map(key => ({ 
        id_firebase: key, 
        ...data[key] 
    })) : [];

    if (document.getElementById('grid-productos')) renderizar();
    if (document.getElementById('lista-gestion-admin')) mostrarProductosParaBorrar();
});

// 4. SUBIR PRODUCTO
window.subirProducto = function() {
    const nombre = document.getElementById('p-nombre').value;
    const precio = document.getElementById('p-precio').value;
    const img = document.getElementById('p-img').value;
    const cat = document.getElementById('p-cat').value;
    const mods = document.getElementById('p-mods').value;

    if(!nombre || !precio || !img) return alert("Completa los campos principales");

    push(ref(database, 'productos/'), {
        id: Date.now(),
        nombre, precio: parseInt(precio), img, cat, mods
    }).then(() => {
        alert("Producto subido!");
        document.getElementById('p-nombre').value = "";
        document.getElementById('p-precio').value = "";
        document.getElementById('p-img').value = "";
    });
}

// 5. RENDERIZAR (VISTA CLIENTE)
window.renderizar = function(filtro = '') {
    const grid = document.getElementById('grid-productos');
    if(!grid) return;
    grid.innerHTML = productos
        .filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase()))
        .map(p => `
            <div class="card">
                <img src="${p.img}" class="product-img" style="width:100%; border-radius:8px;">
                <h3>${p.nombre}</h3>
                <p><strong>$${p.precio.toLocaleString()}</strong></p>
                <button class="btn-primary" onclick="agregar(${p.id})">Agregar al carrito</button>
            </div>
        `).join('');
}

// 6. GESTIÓN ADMIN
window.mostrarProductosParaBorrar = function() {
    const contenedor = document.getElementById('lista-gestion-admin');
    if (!contenedor) return;
    contenedor.innerHTML = productos.map(p => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #444;">
            <span>${p.nombre}</span>
            <button onclick="eliminarProductoDelSistema('${p.id_firebase}')" style="background:red; color:white; border:none; padding:5px; border-radius:4px;">Eliminar</button>
        </div>
    `).join('');
}

window.eliminarProductoDelSistema = function(id) {
    if (confirm("¿Borrar producto?")) remove(ref(database, 'productos/' + id));
}

window.agregar = function(id) {
    const p = productos.find(x => x.id === id);
    if(p) {
        carrito.push(p);
        localStorage.setItem('cart_iphones', JSON.stringify(carrito));
        alert("Agregado!");
    }
}