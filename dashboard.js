 <!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mi Carta Digital — Mi espacio 💌</title>
<link rel="stylesheet" href="dashboard.css">
</head>

<body>

<div class="aurora"></div>
<div id="particles"></div>

<aside class="sidebar">

  <a class="brand" href="index.html">
    💌 <b>Mi Carta</b><span>Digital</span>
  </a>

  <div class="profile-mini">
    <div class="avatar" id="miniAvatar">💗</div>

    <div>
      <b id="miniName">Mi corazón</b>
      <small>Mi espacio</small>
    </div>
  </div>

  <nav>

    <a class="active" href="#inicio">
      🏠 <span>Inicio</span>
    </a>

    <a href="#buzon">
      📬 <span>Mi Buzón</span>
    </a>

    <a href="#crear">
      ✍️ <span>Crear Carta</span>
    </a>

    <a href="#reflexiones">
      ✨ <span>Reflexiones</span>
    </a>

    <a href="#grupos">
      👥 <span>Grupos</span>
    </a>

    <a href="#membresia">
      👑 <span>Membresía</span>
    </a>

    <a href="#cuenta">
      👤 <span>Mi Perfil</span>
    </a>

  </nav>

  <button type="button" class="logout" onclick="logout()">
    🚪 Salir
  </button>

  <a class="admin" href="#admin" onclick="showAdmin()">
    👑 Panel administrativo
  </a>

</aside>


<main class="main">

<header class="top">

  <div>

    <span class="eyebrow">
      MI ESPACIO · CARTA DIGITAL
    </span>

    <h1>
      Bienvenida,
      <span id="welcomeName">corazón</span>
      💗
    </h1>

  </div>

  <button
    type="button"
    class="soft"
    onclick="toggleTheme()">

    ✨ Cambiar ambiente

  </button>

</header>


<!-- =====================================
     INICIO
===================================== -->

<section id="inicio" class="hero-card">

  <div>

    <div class="badge">
      ✨ REFLEXIÓN DE HOY
    </div>

    <h2>
      Siempre sé tú,
      <br>
      <em>sin importar los demás.</em>
    </h2>

    <p>
      No cambies tu esencia para encajar.
      Hay algo hermoso en seguir siendo tú,
      incluso cuando el mundo intenta decirte
      quién debes ser.
    </p>

    <button
      type="button"
      class="pink-btn"
      onclick="goToCreate()">

      Escribir una carta 💌

    </button>

  </div>

  <div class="floating-heart">
    💗
  </div>

</section>


<!-- =====================================
     BUZÓN
===================================== -->

<section id="buzon" class="section">

  <div class="heading">

    <div>

      <span class="eyebrow">
        📬 MI BUZÓN
      </span>

      <h2>
        Tus cartas
      </h2>

    </div>

    <span class="count">
      0 nuevas
    </span>

  </div>


  <div class="cards">

    <article class="letter-card unread">

      <span class="card-icon">
        💌
      </span>

      <div>

        <b>
          Tu buzón te espera
        </b>

        <p>
          Cuando recibas una carta,
          aparecerá aquí con una
          animación especial.
        </p>

      </div>

      <span>✨</span>

    </article>


    <article class="letter-card">

      <span class="card-icon">
        🌷
      </span>

      <div>

        <b>
          Un espacio para guardar
        </b>

        <p>
          Conserva tus mensajes
          importantes y vuelve a ellos
          cuando quieras.
        </p>

      </div>

      <span>♡</span>

    </article>

  </div>

</section>


<!-- =====================================
     CREAR CARTA
===================================== -->

<section id="crear" class="section">

  <div class="heading">

    <div>

      <span class="eyebrow">
        ✍️ CREAR CARTA
      </span>

      <h2>
        Escribe desde el corazón
      </h2>

    </div>

  </div>


  <div class="composer">


    <!-- VISTA PREVIA -->

    <div class="preview-envelope">

      <div class="seal">
        ❤
      </div>

      <div class="paper">

        <small id="previewRecipient">
          Para alguien especial
        </small>

        <b id="previewTitle">
          Una carta para ti
        </b>

        <div
          id="previewText"
          class="letter-preview-text">

          Tus palabras pueden iluminar un día.

        </div>

      </div>

    </div>


    <!-- FORMULARIO -->

    <div class="form">

      <label>

        Para

        <input
          id="recipient"
          type="email"
          placeholder="Correo del destinatario"
        >

      </label>


      <label>

        Tu mensaje

        <textarea
          id="message"
          rows="7"
          placeholder="Escribe aquí lo que tu corazón quiere decir..."
        ></textarea>

      </label>


      <!-- DECORACIÓN -->

      <div class="decor-title">
        ✨ Decora tu carta
      </div>


      <div class="decor-row">

        <button
          type="button"
          onclick="addEmoji('💗')">
          💗
        </button>

        <button
          type="button"
          onclick="addEmoji('❤️')">
          ❤️
        </button>

        <button
          type="button"
          onclick="addEmoji('💕')">
          💕
        </button>

        <button
          type="button"
          onclick="addEmoji('🌸')">
          🌸
        </button>

        <button
          type="button"
          onclick="addEmoji('🦋')">
          🦋
        </button>

        <button
          type="button"
          onclick="addEmoji('✨')">
          ✨
        </button>

        <button
          type="button"
          onclick="addEmoji('🌷')">
          🌷
        </button>

        <button
          type="button"
          onclick="addEmoji('💌')">
          💌
        </button>

      </div>


      <button
        type="button"
        class="pink-btn"
        onclick="submitLetter()">

        Enviar a revisión 💌

      </button>


      <small class="notice">

        🛡️ Por seguridad, las cartas pasan
        primero por revisión del administrador.

      </small>

    </div>

  </div>

</section>


<!-- =====================================
     REFLEXIONES
===================================== -->

<section id="reflexiones" class="section">

  <div class="heading">

    <div>

      <span class="eyebrow">
        ✨ REFLEXIONES
      </span>

      <h2>
        Palabras para el alma
      </h2>

    </div>

  </div>


  <div class="reflection-grid">

    <article>

      <span>🌷</span>

      <h3>
        Tu valor
      </h3>

      <p>
        No necesitas demostrarle a nadie
        que eres suficiente. Ya lo eres.
      </p>

    </article>


    <article>

      <span>🦋</span>

      <h3>
        Nuevos comienzos
      </h3>

      <p>
        A veces cerrar una puerta es
        la manera más bonita de abrir otra.
      </p>

    </article>


    <article>

      <span>⭐</span>

      <h3>
        Un día a la vez
      </h3>

      <p>
        No tienes que tener todas
        las respuestas hoy.
        Respira y continúa.
      </p>

    </article>

  </div>

</section>


<!-- =====================================
     GRUPOS
===================================== -->

<section id="grupos" class="section">

  <div class="heading">

    <div>

      <span class="eyebrow">
        👥 COMUNIDAD
      </span>

      <h2>
        Grupos
      </h2>

    </div>

  </div>


  <div class="group-card">

    <div class="group-icon">
      💞
    </div>

    <div>

      <h3>
        Palabras de esperanza
      </h3>

      <p>
        Personas que creen que una carta
        puede cambiar un momento.
      </p>

      <span>
        10 miembros · Comunidad inicial
      </span>

    </div>

    <button
      type="button"
      class="soft"
      onclick="viewGroup()">

      Ver grupo

    </button>

  </div>

</section>


<!-- =====================================
     MEMBRESÍA
===================================== -->

<section id="membresia" class="section">

  <div class="membership">

    <div>

      <span class="eyebrow">
        👑 MEMBRESÍA
      </span>

      <h2>
        Carta Digital
        <em>Premium</em>
      </h2>

      <p>
        Tu espacio para conectar,
        escribir y recibir momentos especiales.
      </p>


      <div class="benefits">

        <span>💌 Cartas</span>
        <span>✨ Diseños premium</span>
        <span>🦋 Stickers</span>
        <span>👥 Grupos</span>
        <span>🌷 Reflexiones</span>

      </div>

    </div>


    <div class="price">

      <b>$20</b>

      <small>
        / mes
      </small>

      <button
        type="button"
        class="pink-btn"
        onclick="joinMembership()">

        Quiero ser miembro

      </button>

    </div>

  </div>

</section>


<!-- =====================================
     CUENTA
===================================== -->

<section id="cuenta" class="section">

  <div class="heading">

    <div>

      <span class="eyebrow">
        👤 MI PERFIL
      </span>

      <h2>
        Tu cuenta
      </h2>

    </div>

  </div>


  <div class="account">

    <div
      class="big-avatar"
      id="bigAvatar">

      💗

    </div>


    <div>

      <h3 id="profileName">
        Mi corazón
      </h3>

      <p id="profileEmail">
        correo@ejemplo.com
      </p>

      <span class="status">
        ● Cuenta activa
      </span>

    </div>


    <button
      type="button"
      class="soft"
      onclick="editProfile()">

      Editar perfil

    </button>

  </div>

</section>


<!-- =====================================
     ADMIN
===================================== -->

<section id="admin" class="section admin-panel">

  <div class="heading">

    <div>

      <span class="eyebrow">
        👑 ADMINISTRACIÓN
      </span>

      <h2>
        Panel administrativo
      </h2>

    </div>

    <span class="secure">
      🔒 Privado
    </span>

  </div>


  <div class="stats">

    <div>
      <b id="users">—</b>
      <span>👥 Usuarios</span>
    </div>

    <div>
      <b id="pendingLetters">—</b>
      <span>💌 Pendientes</span>
    </div>

    <div>
      <b id="reviews">3</b>
      <span>⭐ Reviews</span>
    </div>

    <div>
      <b id="memberships">—</b>
      <span>👑 Membresías</span>
    </div>

  </div>


  <div class="admin-tools">

    <button
      type="button"
      onclick="loadPendingLetters()">

      <b>💌 Moderación</b>

      <p>
        Revisar y aprobar cartas.
      </p>

    </button>


    <button
      type="button"
      onclick="loadReviews()">

      <b>⭐ Reviews</b>

      <p>
        Administrar opiniones.
      </p>

    </button>


    <button
      type="button"
      onclick="loadUsers()">

      <b>👥 Usuarios</b>

      <p>
        Ver miembros registrados.
      </p>

    </button>


    <button
      type="button"
      onclick="loadMemberships()">

      <b>👑 Membresías</b>

      <p>
        Ver miembros Premium.
      </p>

    </button>

  </div>


  <div id="adminResults"></div>

</section>


<footer>

  💌 Carta Digital ·
  Palabras que conectan corazones ·

  <a href="index.html">
    Volver a portada
  </a>

</footer>

</main>


<div id="toast"></div>


<!-- SUPABASE -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- TU CONEXIÓN -->
<script src="supabase-config.js"></script>

<!-- DASHBOARD -->
<script src="dashboard.js"></script>

</body>
</html>
