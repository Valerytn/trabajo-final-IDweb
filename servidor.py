# servidor.py
import json
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
import pymysql  # pip install pymysql

# --- CONFIGURACIÓN ---
DB_CONFIG = {
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': 'Munay2026>',  # tu contraseña MySQL
    'database': 'munay_bowls2'  # nueva base de datos
}

PORT = 8000
# ---------------------

class MiHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == "/login":
            length = int(self.headers.get('Content-Length', 0))
            payload = json.loads(self.rfile.read(length))

            usuario = payload.get("usuario")
            contrasena = payload.get("contrasena")

            conn = pymysql.connect(**DB_CONFIG)
            cursor = conn.cursor()

            cursor.execute(
                "SELECT contrasena FROM usuarios WHERE usuario=%s",
                (usuario,)
            )
            fila = cursor.fetchone()

            ok = False
            if fila and fila[0] == contrasena:
                ok = True

            cursor.close()
            conn.close()

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"ok": ok}).encode())
            return

        if self.path != '/enviar_contacto':
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Ruta no encontrada')
            return

        # Leer contenido
        length = int(self.headers.get('Content-Length', 0))
        raw = self.rfile.read(length) if length > 0 else b''

        # Decodificar JSON
        try:
            payload = json.loads(raw.decode('utf-8'))
        except json.JSONDecodeError:
            self.send_response(400)
            self.send_header('Content-Type','text/plain; charset=utf-8')
            self.end_headers()
            self.wfile.write('Body inválido: no es JSON'.encode('utf-8'))
            return

        # Obtener campos
        nombre_cliente = payload.get('nombre', '').strip()
        correo_cliente = payload.get('email', '').strip()
        telefono_cliente = payload.get('telefono', '').strip()
        mensaje_cliente = payload.get('mensaje', '').strip()

        # Validación mínima
        if not nombre_cliente or not correo_cliente or not mensaje_cliente:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b'Faltan campos obligatorios')
            return

        # Guardar en MySQL
        try:
            conn = pymysql.connect(**DB_CONFIG)
            cursor = conn.cursor()
            sql = """
                INSERT INTO formulario_contacto2
                (nombre_cliente, correo_cliente, telefono_cliente, mensaje_cliente)
                VALUES (%s, %s, %s, %s)
            """
            cursor.execute(sql, (nombre_cliente, correo_cliente, telefono_cliente, mensaje_cliente))
            conn.commit()
            cursor.close()
            conn.close()

            # Responder JSON
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            resp = {'status':'ok', 'message':'Mensaje recibido y guardado.'}
            self.wfile.write(json.dumps(resp).encode('utf-8'))

        except Exception as e:
            print("Error BD:", e)
            self.send_response(500)
            self.end_headers()
            self.wfile.write(f'Error al guardar mensaje: {e}'.encode('utf-8'))



    # Obtener datos de la tabla
    def do_GET(self):
        # Servir admi.html si se pide
        if self.path == '/admi.html':
            return super().do_GET()

        # Ruta para obtener contactos como JSON
        if self.path == '/ver_contactos':
            try:
                conn = pymysql.connect(**DB_CONFIG)
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM formulario_contacto2")
                resultados = cursor.fetchall()
                cursor.close()
                conn.close()

                datos = []
                for fila in resultados:
                    datos.append({
                        "id": fila[0],
                        "nombre_cliente": fila[1],
                        "correo_cliente": fila[2],
                        "telefono_cliente": fila[3],
                        "mensaje_cliente": fila[4],
                        "fecha_envio": str(fila[5])
                    })

                self.send_response(200)
                self.send_header('Content-Type','application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps(datos).encode('utf-8'))

            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f'Error: {e}'.encode('utf-8'))

        else:
            super().do_GET()


if __name__ == '__main__':
    os.chdir('.')  # Servir archivos desde la carpeta actual
    print(f"Servidor corriendo en http://localhost:{PORT} (Ctrl+C para detener)")
    server = HTTPServer(('0.0.0.0', PORT), MiHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("Deteniendo servidor...")
        server.server_close()

