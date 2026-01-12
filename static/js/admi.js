function login() {
  const usuario = document.getElementById("usuario").value.trim();
  const contrasena = document.getElementById("contrasena").value.trim();
  const error = document.getElementById("error");

  error.innerText = "";

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      usuario: usuario,
      contrasena: contrasena
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      // Login correcto
      document.getElementById("login").style.display = "none";
      document.getElementById("panel").style.display = "block";
      cargarMensajes();
    } else {
      error.innerText = "Usuario o contraseña incorrecta";
    }
  })
  .catch(err => {
    console.error(err);
    error.innerText = "Error de conexión";
  });
}


// Cargar mensajes del panel
function cargarMensajes() {
  fetch("/ver_contactos")
    .then(res => res.json())
    .then(datos => {
      const tbody = document.querySelector("#tabla tbody");
      tbody.innerHTML = "";

      datos.forEach(fila => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${fila.id}</td>
          <td>${fila.nombre_cliente}</td>
          <td>${fila.correo_cliente}</td>
          <td>${fila.telefono_cliente}</td>
          <td>${fila.mensaje_cliente}</td>
          <td>${fila.fecha_envio}</td>
        `;

        tbody.appendChild(tr);
      });
    });
}
