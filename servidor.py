from flask import Flask, request, jsonify, render_template
import pymysql

app = Flask(__name__)

# --- CONFIGURACIÓN ---
DB_CONFIG = {
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': 'Munay2026>',   # tu contraseña MySQL
    'database': 'munay_bowls2',
    'cursorclass': pymysql.cursors.DictCursor
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/personaliza')
def personaliza():
    return render_template('personaliza.html')

@app.route('/nosotros')
def nosotros():
    return render_template('nosotros.html')

@app.route('/productos')
def productos():
    return render_template('productos.html')

@app.route('/carrito')
def carrito():
    return render_template('carrito.html')

@app.route('/contacto')
def contacto():
    return render_template('contacto.html')

@app.route('/admi')
def admin():
    return render_template('admi.html')


# -------------------------------------------------
# LOGIN ADMIN
# -------------------------------------------------

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    usuario = data.get("usuario")
    contrasena = data.get("contrasena")

    conn = pymysql.connect(**DB_CONFIG)
    cursor = conn.cursor()

    cursor.execute(
        "SELECT contrasena FROM usuarios WHERE usuario=%s",
        (usuario,)
    )
    fila = cursor.fetchone()

    ok = False
    if fila and fila["contrasena"] == contrasena:
        ok = True

    cursor.close()
    conn.close()

    return jsonify({"ok": ok})

# -------------------------------------------------
# ENVIAR CONTACTO
# -------------------------------------------------

@app.route("/enviar_contacto", methods=["POST"])
def enviar_contacto():
    data = request.get_json()

    nombre_cliente = data.get("nombre", "").strip()
    correo_cliente = data.get("email", "").strip()
    telefono_cliente = data.get("telefono", "").strip()
    mensaje_cliente = data.get("mensaje", "").strip()

    if not nombre_cliente or not correo_cliente or not mensaje_cliente:
        return "Faltan campos obligatorios", 400

    try:
        conn = pymysql.connect(**DB_CONFIG)
        cursor = conn.cursor()

        sql = """
            INSERT INTO formulario_contacto2
            (nombre_cliente, correo_cliente, telefono_cliente, mensaje_cliente)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(sql, (
            nombre_cliente,
            correo_cliente,
            telefono_cliente,
            mensaje_cliente
        ))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            "status": "ok",
            "message": "Mensaje recibido y guardado."
        })

    except Exception as e:
        print("Error BD:", e)
        return f"Error al guardar mensaje: {e}", 500

# -------------------------------------------------
# VER CONTACTOS (ADMIN)
# -------------------------------------------------

@app.route("/ver_contactos")
def ver_contactos():
    try:
        conn = pymysql.connect(**DB_CONFIG)
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM formulario_contacto2")
        resultados = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(resultados)

    except Exception as e:
        return f"Error: {e}", 500

# -------------------------------------------------

if __name__ == "__main__":
    print("Servidor Flask corriendo en http://localhost:8000")
    app.run(host="0.0.0.0", port=8000, debug=True)
