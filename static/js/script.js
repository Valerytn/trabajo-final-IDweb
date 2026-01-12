//  VARIABLES GLOBALES 
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let contadorCarrito = 0;

//  INICIALIZACION 
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
});

function inicializarApp() {
    // Inicializar menú hamburguesa
    inicializarMenuHamburguesa();
    
    // Actualizar contador del carrito
    actualizarContadorCarrito();
    
    // Cargar carrito si estamos en la página del carrito
    if (window.location.pathname.includes('/carrito')) {
        cargarCarrito();
    }
    
    // Inicializar personalización si estamos en esa página
    if (window.location.pathname.includes('/personaliza')) {
        inicializarPersonalizacion();
    }
    
    // Inicializar validaciones de formularios
    inicializarValidaciones();
}

//  MENÚ HAMBURGUESA 
function inicializarMenuHamburguesa() {
    const hamburguesa = document.getElementById('nav-hamburguesa');
    const menu = document.getElementById('nav-menu');
    
    if (hamburguesa && menu) {
        hamburguesa.addEventListener('click', function() {
            menu.classList.toggle('activo');
            hamburguesa.classList.toggle('activo');
        });
        
        // Cerrar menú al hacer clic en un enlace
        const enlaces = menu.querySelectorAll('.nav-enlace');
        enlaces.forEach(enlace => {
            enlace.addEventListener('click', function() {
                menu.classList.remove('activo');
                hamburguesa.classList.remove('activo');
            });
        });
    }
}

//  FUNCIONES DEL CARRITO 
function agregarAlCarrito(id, nombre, precio, ingredientes = []) {
    // Verificar si el producto ya existe en el carrito
    const productoExistente = carrito.find(item => item.id === id);
    
    if (productoExistente) {
        // Si existe, incrementar la cantidad
        productoExistente.cantidad += 1;
    } else {
        // Si no existe, agregar nuevo producto
        const nuevoProducto = {
            id: id,
            nombre: nombre,
            precio: parseFloat(precio),
            cantidad: 1,
            ingredientes: ingredientes,
            timestamp: Date.now()
        };
        carrito.push(nuevoProducto);
    }
    
    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Actualizar contador
    actualizarContadorCarrito();
    
    // Animar contador
    animarContadorCarrito();
    
    // Mostrar notificación
    mostrarNotificacion(`${nombre} agregado al carrito`);
    
    // Si estamos en la página del carrito, recargar
    if (window.location.pathname.includes('/carrito')) {
        cargarCarrito();
    }
}

function actualizarContadorCarrito() {
    contadorCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);
    const contador = document.getElementById('carrito-contador');
    if (contador) {
        contador.textContent = contadorCarrito;
    }
}

function animarContadorCarrito() {
    const contador = document.getElementById('carrito-contador');
    if (contador) {
        contador.classList.add('animar');
        setTimeout(() => {
            contador.classList.remove('animar');
        }, 300);
    }
}

function mostrarNotificacion(mensaje) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.innerHTML = `
        <div class="notificacion-contenido">
            <span class="notificacion-icono">✅</span>
            <span class="notificacion-texto">${mensaje}</span>
        </div>
    `;
    
    // Estilos de la notificacion
    notificacion.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #FFFF;
        color: black;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--sombra-media);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Agregar al DOM
    document.body.appendChild(notificacion);
    
    // Animar entrada
    setTimeout(() => {
        notificacion.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notificacion.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

//  CARGAR CARRITO 
function cargarCarrito() {
    const carritoLista = document.getElementById('carrito-lista');
    const carritoVacio = document.getElementById('carrito-vacio');
    const seccionRecomendaciones = document.getElementById('seccion-recomendaciones');
    
    if (carrito.length === 0) {
        if (carritoLista) carritoLista.innerHTML = '';
        if (carritoVacio) carritoVacio.style.display = 'block';
        if (seccionRecomendaciones) seccionRecomendaciones.style.display = 'none';
        actualizarResumenCarrito();
        return;
    }
    
    if (carritoVacio) carritoVacio.style.display = 'none';
    if (seccionRecomendaciones) seccionRecomendaciones.style.display = 'block';
    
    if (carritoLista) {
        carritoLista.innerHTML = carrito.map(item => `
            <div class="carrito-item">
                <div class="carrito-item-imagen bowl-${item.id}"></div>
                <div class="carrito-item-info">
                    <div class="carrito-item-nombre">${item.nombre}</div>
                    <div class="carrito-item-precio">S/ ${item.precio.toFixed(2)}</div>
                </div>
                <div class="carrito-item-controls">
                    <div class="cantidad-control">
                        <button class="cantidad-btn" onclick="cambiarCantidad('${item.id}', -1)">-</button>
                        <span class="cantidad-numero">${item.cantidad}</span>
                        <button class="cantidad-btn" onclick="cambiarCantidad('${item.id}', 1)">+</button>
                    </div>
                    <button class="eliminar-btn" onclick="eliminarDelCarrito('${item.id}')">Eliminar</button>
                </div>
            </div>
        `).join('');
    }
    
    actualizarResumenCarrito();
}

function cambiarCantidad(id, cambio) {
    const item = carrito.find(item => item.id === id);
    if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) {
            eliminarDelCarrito(id);
        } else {
            localStorage.setItem('carrito', JSON.stringify(carrito));
            cargarCarrito();
            actualizarContadorCarrito();
        }
    }
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarrito();
    actualizarContadorCarrito();
    mostrarNotificacion('Producto eliminado del carrito');
}

function limpiarCarrito() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        cargarCarrito();
        actualizarContadorCarrito();
        mostrarNotificacion('Carrito vaciado');
    }
}

function actualizarResumenCarrito() {
    const subtotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    const delivery = subtotal >= 30 ? 0 : 5;
    const total = subtotal + delivery;
    
    const subtotalElement = document.getElementById('subtotal');
    const deliveryElement = document.getElementById('delivery');
    const totalElement = document.getElementById('total');
    const botonProcesar = document.getElementById('boton-procesar');
    
    if (subtotalElement) subtotalElement.textContent = `S/ ${subtotal.toFixed(2)}`;
    if (deliveryElement) {
        deliveryElement.textContent = delivery === 0 ? 'Gratis' : `S/ ${delivery.toFixed(2)}`;
    }
    if (totalElement) totalElement.textContent = `S/ ${total.toFixed(2)}`;
    if (botonProcesar) {
        botonProcesar.disabled = carrito.length === 0;
    }
}

//  PROCESAR PEDIDO 
function procesarPedido() {
    // Validar formulario
    const nombre = document.getElementById('nombre-cliente').value.trim();
    const telefono = document.getElementById('telefono-cliente').value.trim();
    const direccion = document.getElementById('direccion-cliente').value.trim();
    
    if (!nombre || !telefono || !direccion) {
        mostrarNotificacion('Por favor completa todos los campos obligatorios');
        return;
    }
    
    if (carrito.length === 0) {
        mostrarNotificacion('Tu carrito está vacío');
        return;
    }
    
    // Generar numero de pedido
    const numeroPedido = 'MB' + Date.now().toString().slice(-6);
    
    // Mostrar modal de confirmación
    mostrarModalConfirmacion(numeroPedido);
    
    // Limpiar carrito después de procesar
    carrito = [];
    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarrito();
    actualizarContadorCarrito();
}

function mostrarModalConfirmacion(numeroPedido) {
    const modal = document.getElementById('modal-confirmacion');
    const numeroPedidoElement = document.getElementById('numero-pedido');
    
    if (numeroPedidoElement) {
        numeroPedidoElement.textContent = numeroPedido;
    }
    
    if (modal) {
        modal.style.display = 'flex';
    }
}

function cerrarModal() {
    const modal = document.getElementById('modal-confirmacion');
    if (modal) {
        modal.style.display = 'none';
    }
}

//  PERSONALIZACION 
function inicializarPersonalizacion() {
    const formulario = document.getElementById('formulario-personalizacion');
    const opciones = document.querySelectorAll('.opcion-bowl input');
    
    // Agregar event listeners a todas las opciones
    opciones.forEach(opcion => {
        opcion.addEventListener('change', actualizarVistaPrevia);
    });
    
    // Configurar envío del formulario
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            procesarPersonalizacion();
        });
    }
}

function actualizarVistaPrevia() {
    const baseSeleccionada = document.querySelector('input[name="base"]:checked');
    const frutasSeleccionadas = document.querySelectorAll('input[name="frutas"]:checked');
    const semillasSeleccionadas = document.querySelectorAll('input[name="semillas"]:checked');
    const endulzanteSeleccionado = document.querySelector('input[name="endulzante"]:checked');
    
    const ingredientesPreview = document.getElementById('bowl-ingredientes-preview');
    const precioTotal = document.getElementById('precio-total');
    
    if (!ingredientesPreview || !precioTotal) return;
    
    let ingredientes = [];
    let precio = 3; // Precio base
    
    // Agregar base
    if (baseSeleccionada) {
        const precioBase = parseFloat(baseSeleccionada.closest('.opcion-bowl').dataset.precio);
        precio += precioBase;
        ingredientes.push(baseSeleccionada.value.replace('-', ' '));
    }
    
    // Agregar frutas
    frutasSeleccionadas.forEach(fruta => {
        const precioFruta = parseFloat(fruta.closest('.opcion-bowl').dataset.precio);
        precio += precioFruta;
        ingredientes.push(fruta.value);
    });
    
    // Agregar semillas
    semillasSeleccionadas.forEach(semilla => {
        const precioSemilla = parseFloat(semilla.closest('.opcion-bowl').dataset.precio);
        precio += precioSemilla;
        ingredientes.push(semilla.value);
    });
    
    // Agregar endulzante
    if (endulzanteSeleccionado) {
        const precioEndulzante = parseFloat(endulzanteSeleccionado.closest('.opcion-bowl').dataset.precio);
        precio += precioEndulzante;
        ingredientes.push(endulzanteSeleccionado.value.replace('-', ' '));
    }
    
    // Actualizar vista previa
    if (ingredientes.length === 0) {
        ingredientesPreview.innerHTML = '<p class="bowl-vacio">Selecciona tus ingredientes</p>';
    } else {
        ingredientesPreview.innerHTML = ingredientes.map(ing => 
            `<span class="ingrediente-preview">${ing}</span>`
        ).join('');
    }
    
    // Actualizar precio
    precioTotal.textContent = `S/ ${precio.toFixed(2)}`;
}

function procesarPersonalizacion() {
    const baseSeleccionada = document.querySelector('input[name="base"]:checked');
    const frutasSeleccionadas = document.querySelectorAll('input[name="frutas"]:checked');
    const semillasSeleccionadas = document.querySelectorAll('input[name="semillas"]:checked');
    const endulzanteSeleccionado = document.querySelector('input[name="endulzante"]:checked');
    const notas = document.getElementById('notas-especiales').value.trim();
    
    if (!baseSeleccionada) {
        mostrarNotificacion('Por favor selecciona una base para tu bowl');
        return;
    }
    
    // Construir nombre del bowl personalizado
    let nombreBowl = 'Bowl Personalizado';
    let ingredientes = [];
    
    // Agregar ingredientes a la lista
    ingredientes.push(baseSeleccionada.value.replace('-', ' '));
    frutasSeleccionadas.forEach(fruta => ingredientes.push(fruta.value));
    semillasSeleccionadas.forEach(semilla => ingredientes.push(semilla.value));
    if (endulzanteSeleccionado) {
        ingredientes.push(endulzanteSeleccionado.value.replace('-', ' '));
    }
    
    // Calcular precio
    let precio = 15; // Precio base
    precio += parseFloat(baseSeleccionada.closest('.opcion-bowl').dataset.precio);
    frutasSeleccionadas.forEach(fruta => {
        precio += parseFloat(fruta.closest('.opcion-bowl').dataset.precio);
    });
    semillasSeleccionadas.forEach(semilla => {
        precio += parseFloat(semilla.closest('.opcion-bowl').dataset.precio);
    });
    if (endulzanteSeleccionado) {
        precio += parseFloat(endulzanteSeleccionado.closest('.opcion-bowl').dataset.precio);
    }
    
    // Agregar al carrito
    const idPersonalizado = 'personalizado-' + Date.now();
    agregarAlCarrito(idPersonalizado, nombreBowl, precio, ingredientes);
    
    // Limpiar formulario
    limpiarSeleccion();
}

function limpiarSeleccion() {
    const formulario = document.getElementById('formulario-personalizacion');
    if (formulario) {
        formulario.reset();
        actualizarVistaPrevia();
    }
}

//  VALIDACIONES 
function inicializarValidaciones() {
    // Validar formularios de contacto/entrega
    const formularios = document.querySelectorAll('form');
    formularios.forEach(formulario => {
        formulario.addEventListener('submit', function(e) {
            if (!validarFormulario(this)) {
                e.preventDefault();
            }
        });
    });
    
    // Validación en tiempo real para campos de texto
    const camposTexto = document.querySelectorAll('input[type="text"], input[type="tel"], textarea');
    camposTexto.forEach(campo => {
        campo.addEventListener('blur', function() {
            validarCampo(this);
        });
    });
}

function validarFormulario(formulario) {
    const camposRequeridos = formulario.querySelectorAll('[required]');
    let esValido = true;
    
    camposRequeridos.forEach(campo => {
        if (!validarCampo(campo)) {
            esValido = false;
        }
    });
    
    return esValido;
}

function validarCampo(campo) {
    const valor = campo.value.trim();
    const tipo = campo.type;
    let esValido = true;
    let mensaje = '';
    
    // Limpiar mensajes de error anteriores
    limpiarMensajeError(campo);
    
    // Validar campo requerido
    if (campo.hasAttribute('required') && !valor) {
        esValido = false;
        mensaje = 'Este campo es obligatorio';
    }
    
    // Validaciones específicas por tipo
    if (valor && tipo === 'tel') {
        const regexTelefono = /^[0-9+\-\s()]{9,15}$/;
        if (!regexTelefono.test(valor)) {
            esValido = false;
            mensaje = 'Ingresa un número de teléfono válido';
        }
    }
    
    if (valor && tipo === 'email') {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(valor)) {
            esValido = false;
            mensaje = 'Ingresa un email válido';
        }
    }
    
    // Mostrar error si no es válido
    if (!esValido) {
        mostrarMensajeError(campo, mensaje);
    }
    
    return esValido;
}

function mostrarMensajeError(campo, mensaje) {
    const mensajeError = document.createElement('div');
    mensajeError.className = 'mensaje-error';
    mensajeError.textContent = mensaje;
    mensajeError.style.cssText = `
        color: #ff4757;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: block;
    `;
    
    campo.parentNode.appendChild(mensajeError);
    campo.style.borderColor = '#ff4757';
}

function limpiarMensajeError(campo) {
    const mensajeError = campo.parentNode.querySelector('.mensaje-error');
    if (mensajeError) {
        mensajeError.remove();
    }
    campo.style.borderColor = '';
}


//  UTILIDADES 
function scrollSuave(elemento) {
    if (elemento) {
        elemento.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

//  ANIMACIONES AL SCROLL 
function inicializarAnimacionesScroll() {
    const elementos = document.querySelectorAll('.tarjeta-bowl, .producto-detallado, .seccion');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, {
        threshold: 0.1
    });
    
    elementos.forEach(elemento => {
        observer.observe(elemento);
    });
}



// Inicializar animaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarAnimacionesScroll();
});

//  MANEJO DE ERRORES 
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
    // En un entorno de producción, aquí podrías enviar el error a un servicio de monitoreo
});

//  EXPORTAR FUNCIONES PARA USO GLOBAL 
window.agregarAlCarrito = agregarAlCarrito;
window.cambiarCantidad = cambiarCantidad;
window.eliminarDelCarrito = eliminarDelCarrito;
window.limpiarCarrito = limpiarCarrito;
window.procesarPedido = procesarPedido;
window.cerrarModal = cerrarModal;
window.limpiarSeleccion = limpiarSeleccion;

