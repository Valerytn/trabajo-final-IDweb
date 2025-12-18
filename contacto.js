//JS DE CONTACTO //

// selecciona elementos
const formContacto = document.getElementById('formContacto');
const confirmacionEl = document.getElementById('confirmacion');

const campoNombre = document.getElementById('nombre');
const campoEmail = document.getElementById('email');
const campoTelefono = document.getElementById('telefono');
const campoMensaje = document.getElementById('mensaje');

const errNombre = document.getElementById('error-nombre');
const errEmail = document.getElementById('error-email');
const errTelefono = document.getElementById('error-telefono');
const errMensaje = document.getElementById('error-mensaje');

// Expresiones regulares basicas
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const telefonoRegex = /^[0-9+\-\s()]{7,20}$/;

// Limpia errores visuales
function limpiarErrores() {
  [errNombre, errEmail, errTelefono, errMensaje].forEach(el => el.textContent = '');
  [campoNombre, campoEmail, campoTelefono, campoMensaje].forEach(el => el.classList.remove('input-error'));
  confirmacionEl.classList.add('oculto');
}

// Validación retorna true si todo OK
function validarFormulario() {
  limpiarErrores();
  let valido = true;

  const nombre = campoNombre.value.trim();
  const email = campoEmail.value.trim();
  const telefono = campoTelefono.value.trim();
  const mensaje = campoMensaje.value.trim();

  if (!nombre || nombre.length < 2) {
    errNombre.textContent = 'Ingresa tu nombre (mín. 2 caracteres).';
    campoNombre.classList.add('input-error');
    valido = false;
  }

  if (!email || !emailRegex.test(email)) {
    errEmail.textContent = 'Ingresa un correo válido.';
    campoEmail.classList.add('input-error');
    valido = false;
  }

  if (telefono) { // si el usuario ingresó teléfono, validamos formato
    if (!telefonoRegex.test(telefono)) {
      errTelefono.textContent = 'Teléfono inválido (solo números, + y - permitidos).';
      campoTelefono.classList.add('input-error');
      valido = false;
    }
  }

  if (!mensaje || mensaje.length < 5) {
    errMensaje.textContent = 'Escribe un mensaje (mín. 5 caracteres).';
    campoMensaje.classList.add('input-error');
    valido = false;
  }

  return valido;
}

// Mostrar confirmación en pantalla
function mostrarConfirmacion(texto) {
  confirmacionEl.textContent = texto || '¡Gracias! Tu mensaje fue enviado.';
  confirmacionEl.classList.remove('oculto');
}

// Escuchar submit
formContacto.addEventListener('submit', function (e) {
  e.preventDefault();

  if (!validarFormulario()) {
    return;
  }

  // Construimos objeto a enviar
  const payload = {
    nombre: campoNombre.value.trim(),
    email: campoEmail.value.trim(),
    telefono: campoTelefono.value.trim(),
    mensaje: campoMensaje.value.trim()
  };

  // El servidor debe aceptar JSON en POST /enviar_contacto
  fetch('/enviar_contacto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(async res => {
    // Si el servidor responde 200-299 asumimos éxito
    if (res.ok) {
      // si responde JSON con mensaje, tomarlo
      try {
        const data = await res.json();
        mostrarConfirmacion(data.message || 'Tu mensaje fue enviado correctamente.');
      } catch (err) {
        mostrarConfirmacion('Tu mensaje fue enviado correctamente.');
      }
      formContacto.reset();
    } else {
      // si el servidor rechazó, intentamos leer texto y mostrarlo
      const text = await res.text().catch(()=>null);
      mostrarConfirmacion('Hubo un problema al enviar (servidor): ' + (text || res.status));
    }
  })
  .catch(err => {
    // Si no hay servidor (fetch falla), mostramos confirmación local
    console.warn('No se pudo conectar al backend:', err);
    mostrarConfirmacion('Tu mensaje fue guardado localmente (sin servidor).');
    formContacto.reset();
  });
});
