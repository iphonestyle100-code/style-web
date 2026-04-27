// 1. IMPORTAR FUNCIONES DE FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 2. CONFIGURACIÓN (Tu configuración actual)
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

// 3. LEER DE LA NUBE (Sincronización en tiempo real)
// Esto soluciona que los productos desaparezcan, ya que mantiene la lista actualizada.
onValue(ref(database, 'productos/'), (snapshot) => {
    const data = snapshot.val();
    // Convertimos el objeto de Firebase en un Array manejable
    productos = data ? Object.keys(data).map(key => ({ 
        id_firebase: key, 
        ...data[key] 
    })) : [];

    // Detecta automáticamente en qué página estamos y ejecuta la función necesaria
    if (document.getElementById('grid-productos')) {
        window.renderizar();
    }
    if (document.getElementById('lista-gestion-admin')) {
        window.mostrarProductosParaBorrar();
    }
});

// 4. SUBIR PRODUCTO (Desde admin.html)
window.subirProducto = function() {
    const nombre = document.getElementById('p-nombre').value;
    const precio = document.getElementById('p-precio').value;
    const img = document.getElementById('p-img').value;
    const cat = document.getElementById('p-cat').value;
    const mods = document.getElementById('p-mods').value;

    if(!nombre || !precio || !img) {
        return alert("Por favor, completa nombre, precio e imagen.");
    }

    push(ref(database, 'productos/'), {
        id: Date.now(), // ID numérico para el carrito
        nombre, 
        precio: parseInt(precio), 
        img, 
        cat, 
        mods
    }).then(() => {
        alert("¡Producto subido con éxito!");
        // Limpiar formulario
        document.getElementById('p-nombre').value = "";
        document.getElementById('p-precio').value = "";
        document.getElementById('p-img').value = "";
    }).catch(error => {
        console.error("Error al subir:", error);
        alert("Error al subir el producto.");
    });
}

// 5. RENDERIZAR VISTA CLIENTE (Estilo Mercado Libre)
window.renderizar = function(filtro = '') {
    const grid = document.getElementById('grid-productos');
    if(!grid) return;

    const productosFiltrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    grid.innerHTML = productosFiltrados.map(p => `
        <div class="card">
            <img src="${p.img}" class="product-img" onerror="this.src='img/placeholder.png'">
            <div class="info-container" style="padding: 15px;">
                <p class="precio" style="font-size: 22px; margin: 0;">$${Number(p.precio).toLocaleString('es-AR')}</p>
                <h3 class="nombre" style="font-size: 14px; color: #666; font-weight: normal;">${p.nombre}</h3>
                <button class="btn-primary" onclick="window.agregar(${p.id})" style="width:100%; background:#3483fa; color:white; border:none; padding:10px; border-radius:4px; cursor:pointer;">
                    Agregar al carrito
                </button>
            </div>
        </div>
    `).join('');
}

// 6. GESTIÓN ADMIN (Para borrar productos existentes)
window.mostrarProductosParaBorrar = function() {
    const contenedor = document.getElementById('lista-gestion-admin');
    if (!contenedor) return;

    if (productos.length === 0) {
        contenedor.innerHTML = "<p style='color:white;'>No hay productos cargados.</p>";
        return;
    }

    contenedor.innerHTML = productos.map(p => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:15px; border-bottom:1px solid #444; background: #222; margin-bottom: 5px; border-radius: 4px;">
            <div style="display:flex; align-items:center;">
                <img src="${p.img}" style="width:40px; height:40px; object-fit:cover; margin-right:10px; border-radius:4px;">
                <span style="color:white;">${p.nombre}</span>
            </div>
            <button onclick="window.eliminarProductoDelSistema('${p.id_firebase}')" 
                    style="background:#ff4444; color:white; border:none; padding:8px 12px; border-radius:4px; cursor:pointer;">
                Eliminar
            </button>
        </div>
    `).join('');
}

// 7. ELIMINAR DE FIREBASE
window.eliminarProductoDelSistema = function(idFirebase) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto definitivamente?")) {
        remove(ref(database, 'productos/' + idFirebase))
            .then(() => alert("Producto eliminado."))
            .catch(err => alert("Error al eliminar: " + err));
    }
}

// 8. CARRITO
window.agregar = function(id) {
    const p = productos.find(x => x.id === id);
    if(p) {
        carrito.push(p);
        localStorage.setItem('cart_iphones', JSON.stringify(carrito));
        alert("¡Agregado al carrito!");
    }
}