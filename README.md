# **Munay Bowls Saludables**
### *Proyecto Final – Desarrollo Web*

---

##  **Descripción del proyecto**

Aplicación web académica para la **venta de bowls saludables de yogurth, frutas y semillas**.  
El sistema permite a los usuarios visualizar productos, personalizar pedidos, gestionar un carrito de compras y enviar mensajes a la empresa.  
Además, cuenta con un ***módulo de administración*** con acceso restringido y persistencia de datos en **MySQL**.

---

##  **Objetivo**

Desarrollar una aplicación web funcional aplicando conocimientos de  
**HTML, CSS, JavaScript, Python y MySQL**, simulando un sistema real de ventas.

---

##  **Tecnologías utilizadas**

- **HTML5**
- **CSS3**
- **JavaScript**
- **Python**
- **MySQL**
- *Swiper.js*

---

##  **Páginas del sistema**

1. **index.html** – Página principal con carrusel  
2. **productos.html** – Menú de productos  
3. **personaliza.html** – Personalización de bowls  
4. **carrito.html** – Carrito de compras  
5. **nosotros.html** – Información de la empresa  
6. **contacto.html** – Envío de mensajes  
7. **admi.html** – Administración  

---

##  **Configuración de la Base de Datos**

### *Descargar MySQL 

###  *Datos de conexión (`servidor.py`)*

```python
DB_CONFIG = {
    'host': 'localhost',
    'port': "colocar puerto",
    'user': 'root',
    'password': 'colocar contrasenia',
    'database': 'munay_bowls2'
}

# **Creacion de base de datos**

CREATE DATABASE munay_bowls2;
USE munay_bowls2;

## Tabla: formulario_contacto2
CREATE TABLE formulario_contacto2 (
    id INT NOT NULL AUTO_INCREMENT,
    nombre_cliente VARCHAR(100) NOT NULL,
    correo_cliente VARCHAR(150) NOT NULL,
    telefono_cliente VARCHAR(20) DEFAULT NULL,
    mensaje_cliente TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

## Tabla: usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE,
    contrasena VARCHAR(50)
);
