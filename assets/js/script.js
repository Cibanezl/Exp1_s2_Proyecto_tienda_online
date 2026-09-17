let carrito = [];
let productosGlobales = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarProductosJSON();
    configurarBuscador();
});

// Carga de datos desde JSON local usando Fetch API
function cargarProductosJSON() {
    fetch('assets/data/productos.json')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar datos localmente');
            return response.json();
        })
        .then(productos => {
            productosGlobales = productos;
            renderizarProductos(productosGlobales);
        })
        .catch(error => {
            console.error(error);
            document.getElementById('contenedor-productos').innerHTML = `
                <div class="alert alert-danger w-100">No se pudieron cargar los productos del JSON.</div>
            `;
        });
}

// Renderiza productos en el DOM
function renderizarProductos(productos) {
    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = '';

    if (productos.length === 0) {
        contenedor.innerHTML = '<p class="text-muted">No se encontraron productos.</p>';
        return;
    }

    productos.forEach(producto => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6';
        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text fw-bold text-success">$${producto.precio.toLocaleString('es-CL')}</p>
                    <button class="btn btn-primary mt-auto" onclick="agregarAlCarrito(${producto.id})">
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        `;
        contenedor.appendChild(col);
    });
}

// Evento Click: Agregar al carrito y actualizar DOM
function agregarAlCarrito(idProducto) {
    const producto = productosGlobales.find(p => p.id === idProducto);
    if (producto) {
        carrito.push(producto);
        actualizarCarritoDOM();
    }
}

function actualizarCarritoDOM() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    listaCarrito.innerHTML = '';

    let total = 0;
    carrito.forEach((item) => {
        total += item.precio;
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.textContent = item.nombre;

        const span = document.createElement('span');
        span.className = 'badge bg-primary rounded-pill';
        span.textContent = `$${item.precio.toLocaleString('es-CL')}`;

        li.appendChild(span);
        listaCarrito.appendChild(li);
    });

    totalCarrito.textContent = `$${total.toLocaleString('es-CL')}`;
}

// Evento Submit: Buscador de productos
function configurarBuscador() {
    const formBusqueda = document.getElementById('form-busqueda');
    formBusqueda.addEventListener('submit', (e) => {
        e.preventDefault();
        const termino = document.getElementById('input-busqueda').value.toLowerCase().trim();
        const filtrados = productosGlobales.filter(p => p.nombre.toLowerCase().includes(termino));
        renderizarProductos(filtrados);
    });
}