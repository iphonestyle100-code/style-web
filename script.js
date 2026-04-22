// --- BASE DE DATOS Y CARRITO ---
let productos = JSON.parse(localStorage.getItem('db_iphones')) || [];
let carrito = JSON.parse(localStorage.getItem('cart_iphones')) || [];

// --- FUNCIÓN PARA SUBIR PRODUCTOS ---
function subirProducto() {
    const nombre = document.getElementById('p-nombre').value;
    const precio = document.getElementById('p-precio').value;
    const img = document.getElementById('p-img').value;
    const cat = document.getElementById('p-cat').value;
    const mods = document.getElementById('p-mods').value;

    if(!nombre || !precio || !img) {
        return alert("Por favor, completa los campos principales (Nombre, Precio e Imagen)");
    }

    // Crear objeto del producto
    const nuevoProducto = {
        id: Date.now(),
        nombre: nombre,
        precio: parseInt(precio),
        img: img,
        cat: cat,
        mods: mods
    };

    // Guardar en el array y en LocalStorage
    productos.push(nuevoProducto);
    localStorage.setItem('db_iphones', JSON.stringify(productos));
    
    alert("¡Producto subido con éxito a IPHONE STYLE!");
    location.reload(); // Recarga para actualizar las listas
}

// --- FUNCIÓN PARA MOSTRAR PRODUCTOS EN EL PANEL ADMIN (PARA BORRAR) ---
function mostrarProductosParaBorrar() {
    const contenedor = document.getElementById('lista-gestion-admin');
    if (!contenedor) return;

    if (productos.length === 0) {
        contenedor.innerHTML = "<p style='text-align:center; padding:20px;'>No tienes productos cargados actualmente.</p>";
        return;
    }

    contenedor.innerHTML = productos.map((p, index) => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:15px; border-bottom:1px solid #eee;">
            <div style="display:flex; align-items:center; gap:15px;">
                <img src="${p.img}" style="width:40px; height:40px; object-fit:contain; border-radius:4px;">
                <div>
                    <strong style="display:block;">${p.nombre}</strong>
                    <small style="color: #888;">$${p.precio.toLocaleString()} - ${p.cat}</small>
                </div>
            </div>
            <button onclick="eliminarProductoDelSistema(${index})" 
                    style="background:#ff4444; color:white; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; font-weight:bold;">
                Eliminar
            </button>
        </div>
    `).join('');
}

// --- FUNCIÓN PARA ELIMINAR PRODUCTO DEL SISTEMA ---
function eliminarProductoDelSistema(index) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.")) {
        // Eliminar del array
        productos.splice(index, 1);
        // Actualizar LocalStorage
        localStorage.setItem('db_iphones', JSON.stringify(productos));
        // Actualizar la lista en pantalla
        mostrarProductosParaBorrar();
        alert("Producto eliminado del catálogo.");
    }
}

// --- LÓGICA DEL CATÁLOGO (CLIENTE) ---
function renderizar(filtro = '') {
    const grid = document.getElementById('grid-productos');
    if(!grid) return;

    grid.innerHTML = productos
        .filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase()))
        .map(p => `
            <div class="card">
                <img src="${p.img}" class="product-img">
                <h3>${p.nombre}</h3>
                <p><strong>$${p.precio.toLocaleString()}</strong></p>
                <small>Compatibilidad: ${p.mods}</small>
                <button class="btn-primary" onclick="agregar(${p.id})">Agregar al carrito</button>
            </div>
        `).join('');
}

// --- LÓGICA DEL CARRITO ---
function agregar(id) {
    const p = productos.find(x => x.id === id);
    carrito.push(p);
    localStorage.setItem('cart_iphones', JSON.stringify(carrito));
    alert("Agregado al carrito");
}

function borrarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem('cart_iphones', JSON.stringify(carrito));
    location.reload();
}

function finalizarWhatsApp() {
    if(carrito.length === 0) return alert("Tu carrito está vacío");
    
    let texto = "¡Hola IPHONE STYLE! 👋 Quiero realizar este pedido:\n\n";
    let total = 0;
    carrito.forEach(p => {
        texto += `- ${p.nombre} ($${p.precio.toLocaleString()})\n`;
        total += p.precio;
    });
    texto += `\n*Total a pagar: $${total.toLocaleString()}*`;
    
    window.open(`https://wa.me/5493735583063?text=${encodeURIComponent(texto)}`);
}