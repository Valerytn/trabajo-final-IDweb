# **Munay Bowls Saludables**

### *Proyecto Final – Desarrollo Web*

---

## **Descripción del proyecto**

Página web académica para la **venta de bowls saludables de yogurth, frutas y semillas**.
El sistema permite a los usuarios visualizar productos, personalizar pedidos, gestionar un carrito de compras y enviar mensajes a la empresa.
Además, cuenta con un ***módulo de administración*** con acceso restringido y persistencia de datos en **MySQL**.

El backend está desarrollado en **Python utilizando el framework Flask**, el cual se encarga de la gestión de rutas, la comunicación con la base de datos y el procesamiento de formularios.

---

## **Objetivo**

Desarrollar una aplicación web funcional aplicando conocimientos de
**HTML, CSS, JavaScript, Python (Flask) y MySQL**, simulando un sistema real de ventas.

---

## **Tecnologías utilizadas**

* **HTML5**
* **CSS3**
* **JavaScript**
* **Python**
* **Flask** (gestión de rutas y lógica del servidor)
* **MySQL**
* *Swiper.js*

---

## **Arquitectura del sistema**

* **Frontend:** HTML, CSS y JavaScript para la interfaz de usuario.
* **Backend:** Python con Flask para el manejo de rutas, formularios y lógica de negocio.
* **Base de datos:** MySQL para el almacenamiento persistente de usuarios y mensajes.

---

## **Páginas del sistema**

1. **index.html** – Página principal con carrusel
2. **productos.html** – Menú de productos
3. **personaliza.html** – Personalización de bowls
4. **carrito.html** – Carrito de compras
5. **nosotros.html** – Información de la empresa
6. **contacto.html** – Envío de mensajes
7. **admi.html** – Administración

---

## **Configuración de la Base de Datos**

### *Instalación de MySQL*

Asegúrese de tener MySQL instalado y en ejecución antes de iniciar la aplicación.

---

### **Datos de conexión (`servidor.py`)**

```python
DB_CONFIG = {
    'host': 'localhost',
    'port': 'colocar_puerto',
    'user': 'root',
    'password': 'colocar_contrasena',
    'database': 'munay_bowls2'
}
```

---

## **Creación de la Base de Datos**

```sql
CREATE DATABASE munay_bowls2;
USE munay_bowls2;
```

### **Tabla: formulario_contacto2**

```sql
CREATE TABLE formulario_contacto2 (
    id INT NOT NULL AUTO_INCREMENT,
    nombre_cliente VARCHAR(100) NOT NULL,
    correo_cliente VARCHAR(150) NOT NULL,
    telefono_cliente VARCHAR(20) DEFAULT NULL,
    mensaje_cliente TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
```

### **Tabla: usuarios**

```sql
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE,
    contrasena VARCHAR(50)
);
```

---

## **Ejecución del proyecto**

1. Instalar las dependencias necesarias (Flask y conector de MySQL).
2. Configurar los datos de conexión a la base de datos en `servidor.py`.
3. Ejecutar el servidor Flask.
4. Acceder a la aplicación desde el navegador web.

---

## **Autores**

Proyecto desarrollado con fines académicos para el curso de **Desarrollo Web**.
