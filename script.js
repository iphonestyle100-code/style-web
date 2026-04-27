import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA3NrlF7b1h9vCP-AcpwRiMs4f0IC3jPfM",
  authDomain: "base-dato-mi-web-iphone-style.firebaseapp.com",
  databaseURL: "https://base-dato-mi-web-iphone-style-default-rtdb.firebaseio.com",
  projectId: "base-dato-mi-web-iphone-style",
  storageBucket: "base-dato-mi-web-iphone-style.firebasestorage.app",
  messagingSenderId: "293724705936",
  appId: "1:293724705936:web:5bcff580d5a6821e2f3415",
  measurementId: "G-ZBKR9Z62KF"
};

// Inicializar Firebase y Firestore (Base de Datos)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- 1. LÓGICA DE LOGIN Y ACCESO ADMIN ---
window.validaAdmin = () => {
    const passInput = document.getElementById('admin-pass-input').value;
    const claveCorrecta = "123456Aa!"; 
    
    if (passInput === claveCorrecta) {
        window.location.href = "admin.html";
    } else {
        alert("Clave de administrador incorrecta");
    }
};

// --- 2. GESTIÓN DE PRODUCTOS (ADMIN.HTML) ---
const productForm = document.getElementById('product-form');
if (productForm) {
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btn-upload');
        const name = document.getElementById('prod-name').value;
        const price = document.getElementById('prod-price').value;
        // Ahora usamos el input de tipo texto para la URL de la imagen
        const imageUrl = document.getElementById('prod-image-url').value;

        try {
            btn.innerText = "Guardando...";
            btn.disabled = true;

            // Guardamos directamente en Firestore (Esto es gratis y no pide tarjeta)
            await addDoc(collection(db, "productos"), {
                nombre: name,
                precio: price,
                imagen: imageUrl,
                timestamp: new Date()
            });

            alert("Producto guardado con éxito en IPHONE STYLE");
            productForm.reset();
        } catch (error) {
            console.error("Error:", error);
            alert("Error al guardar. Verifica que las Reglas de Firestore estén en 'true'.");
        } finally {
            btn.innerText = "Subir Producto";
            btn.disabled = false;
        }
    });
}

// --- 3. MOSTRAR Y ELIMINAR EN PANEL ADMIN ---
const inventoryBody = document.getElementById('inventory-body');
if (inventoryBody) {
    const q = query(collection(db, "productos"), orderBy("timestamp", "desc"));
    onSnapshot(q, (snapshot) => {
        inventoryBody.innerHTML = "";
        snapshot.forEach((docSnap) => {
            const prod = docSnap.data();
            inventoryBody.innerHTML += `
                <tr>
                    <td><img src="${prod.imagen}" width="50" style="border-radius:4px; height:50px; object-fit:cover;"></td>
                    <td>${prod.nombre}</td>
                    <td>$${prod.precio}</td>
                    <td>
                        <button onclick="borrarProducto('${docSnap.id}')" style="background:#ff4d4d; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });
    });
}

window.borrarProducto = async (id) => {
    if (confirm("¿Seguro que quieres eliminar este producto?")) {
        try {
            await deleteDoc(doc(db, "productos", id));
        } catch (error) {
            alert("No se pudo eliminar.");
        }
    }
};

// --- 4. MOSTRAR EN INICIO.HTML (VISTA CLIENTE) ---
const featuredContainer = document.getElementById('featured-products');
if (featuredContainer) {
    const q = query(collection(db, "productos"), orderBy("timestamp", "desc"));
    onSnapshot(q, (snapshot) => {
        featuredContainer.innerHTML = "";
        snapshot.forEach((docSnap) => {
            const prod = docSnap.data();
            featuredContainer.innerHTML += `
                <div class="product-card" style="background:white; padding:15px; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.1); text-align:center;">
                    <img src="${prod.imagen}" alt="${prod.nombre}" style="max-width:100%; height:150px; object-fit:contain;">
                    <h3 style="font-size:18px; margin:10px 0; color:#333;">${prod.nombre}</h3>
                    <p style="font-weight:bold; color:#000; font-size:20px;">$${prod.precio}</p>
                    <button style="width:100%; background:black; color:white; border:none; padding:10px; border-radius:5px; cursor:pointer;">Ver detalles</button>
                </div>
            `;
        });
    });
}