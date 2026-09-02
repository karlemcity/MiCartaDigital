MI CARTA DIGITAL — VERSIÓN PRO COMPLETA
======================================

IMPORTANTE
-----------
GitHub Pages solo sirve la parte visual. Para que el flujo REAL sea:
REGISTRO → PAGO DE $20/mes → ACTIVACIÓN → EMAIL AUTOMÁTICO → ÁREA PRIVADA

hay que conectar un backend. Esta carpeta ya trae un backend de ejemplo para Stripe + Resend.

ARCHIVOS
--------
index.html       Página pública
dashboard.html   Área privada que se abre después del pago
styles.css       Diseño, brillo, animaciones y responsive
app.js           Botones, registro, cartas y reflexiones
dashboard.js     Área privada
server/          Backend para Stripe y email

CÓMO PUBLICAR LA PARTE VISUAL
-----------------------------
1. Descomprime el ZIP.
2. En GitHub abre tu repositorio MiCartaDigital.
3. Sube index.html, dashboard.html, styles.css y los .js a la raíz.
4. En Settings > Pages selecciona main y /(root).
5. Guarda y abre tu enlace de GitHub Pages.

PARA HACER EL PAGO REAL
-----------------------
1. Crea una cuenta de Stripe.
2. Crea un producto "Membresía Mi Carta Digital" con precio recurrente de $20 USD.
3. Copia el Price ID.
4. Configura el backend en server/.env usando server/.env.example.
5. Publica el backend en un servicio que soporte Node.js (por ejemplo Render, Railway o similar).
6. Coloca la URL del backend en el navegador antes de probar, por ejemplo:
   localStorage.setItem("MCD_API_URL","https://TU-API.com")
   (Luego conviene reemplazar esto por una configuración fija en app.js.)
7. En Stripe crea el webhook hacia:
   https://TU-API.com/stripe-webhook
8. Configura el endpoint para validar la firma de Stripe antes de usarlo en producción.

EMAIL
-----
Después del evento de pago confirmado, el backend envía el email de bienvenida usando Resend.
El email incluye el nombre y correo, explica los pasos y lleva al área privada.

SEGURIDAD
---------
NO se debe enviar la contraseña real por correo. El backend de producción debe guardar contraseñas con hash (bcrypt/Argon2), nunca como texto plano, y ofrecer recuperación por enlace seguro.

ÁREA PRIVADA
------------
dashboard.html es una maqueta funcional del área privada. Para producción real debe protegerse con autenticación del servidor y una base de datos. No confíes solamente en sessionStorage o en una página de GitHub Pages para controlar acceso.

DISEÑO
------
La interfaz está pensada para verse como la referencia: fondo oscuro elegante, rosa/neón, sobre grande completo, brillo, corazones, tarjetas, botones animados y diseño móvil.
