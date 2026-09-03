\// ==========================================
// MI CARTA DIGITAL 💌
// DASHBOARD.JS
// ==========================================

let currentUser = null;


// ==========================================
// INICIAR DASHBOARD
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {

  await checkUser();

  createParticles();

});


// ==========================================
// COMPROBAR USUARIO
// ==========================================

async function checkUser() {

  try {

    if (!supabaseClient) {
      toast("❌ Supabase no está conectado.");
      return;
    }

    const { data, error } =
      await supabaseClient.auth.getUser();

    if (error) {
      console.error(error);
      return;
    }

    currentUser = data.user;

    if (!currentUser) {

      toast("💗 Debes iniciar sesión.");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);

      return;
    }

    loadProfile();

  } catch (error) {

    console.error(error);

  }

}


// ==========================================
// CARGAR PERFIL
// ==========================================

function loadProfile() {

  if (!currentUser) return;

  const metadata =
    currentUser.user_metadata || {};

  const name =
    metadata.name ||
    currentUser.email?.split("@")[0] ||
    "Corazón";

  const email =
    currentUser.email ||
    "Sin correo";


  const welcomeName =
    document.getElementById("welcomeName");

  const miniName =
    document.getElementById("miniName");

  const profileName =
    document.getElementById("profileName");

  const profileEmail =
    document.getElementById("profileEmail");


  if (welcomeName) {
    welcomeName.textContent = name;
  }

  if (miniName) {
    miniName.textContent = name;
  }

  if (profileName) {
    profileName.textContent = name;
  }

  if (profileEmail) {
    profileEmail.textContent = email;
  }

}


// ==========================================
// CERRAR SESIÓN
// ==========================================

async function logout() {

  try {

    if (!supabaseClient) {
      window.location.href = "index.html";
      return;
    }

    await supabaseClient.auth.signOut();

    toast("💗 Cerrando sesión...");

    setTimeout(() => {

      window.location.href = "index.html";

    }, 800);

  } catch (error) {

    console.error(error);

    window.location.href = "index.html";

  }

}


// ==========================================
// CAMBIAR AMBIENTE
// ==========================================

function toggleTheme() {

  document.body.classList.toggle("dream-mode");

  if (
    document.body.classList.contains("dream-mode")
  ) {

    toast("✨ Ambiente mágico activado.");

  } else {

    toast("🌷 Ambiente original restaurado.");

  }

}


// ==========================================
// PREVISUALIZAR CARTA
// ==========================================

function preview() {

  const recipient =
    document.getElementById("recipient");

  const message =
    document.getElementById("message");

  const title =
    document.getElementById("previewTitle");

  const text =
    document.getElementById("previewText");


  if (!recipient || !message) return;


  if (title) {

    title.textContent =
      recipient.value.trim()
        ? `Una carta para ${recipient.value.trim()}`
        : "Una carta para ti";

  }


  if (text) {

    text.textContent =
      message.value.trim()
        ? message.value.trim()
        : "Tus palabras pueden iluminar un día.";

  }

}


// ==========================================
// AGREGAR EMOJI
// ==========================================

function addEmoji(emoji) {

  const message =
    document.getElementById("message");

  if (!message) return;

  const start =
    message.selectionStart;

  const end =
    message.selectionEnd;

  const before =
    message.value.substring(0, start);

  const after =
    message.value.substring(end);

  message.value =
    before + emoji + after;

  message.focus();

  message.selectionStart =
    message.selectionEnd =
      start + emoji.length;

  preview();

}


// ==========================================
// ENVIAR CARTA A REVISIÓN
// ==========================================

async function submitLetter() {

  const recipient =
    document.getElementById("recipient");

  const message =
    document.getElementById("message");


  if (!recipient || !message) return;


  const recipientEmail =
    recipient.value.trim();

  const letterMessage =
    message.value.trim();


  if (!recipientEmail) {

    toast("💌 Escribe el correo del destinatario.");

    recipient.focus();

    return;

  }


  if (!letterMessage) {

    toast("💗 Escribe tu mensaje.");

    message.focus();

    return;

  }


  if (!currentUser) {

    toast("❌ Debes iniciar sesión.");

    return;

  }


  try {

    toast("💌 Enviando carta a revisión...");


    /*
      IMPORTANTE:

      Esta función está preparada para la tabla
      "letters".

      Si todavía no existe esa tabla en Supabase,
      no pasa nada: te mostrará el error y luego
      crearemos la tabla.
    */


    const { data, error } =
      await supabaseClient
        .from("letters")
        .insert({

          sender_id: currentUser.id,

          recipient_email:
            recipientEmail,

          message:
            letterMessage,

          status:
            "pending"

        })
        .select()
        .single();


    if (error) {

      console.error(
        "ERROR CARTA:",
        error
      );

      toast(
        "❌ La carta todavía necesita configurarse en la base de datos."
      );

      return;

    }


    message.value = "";

    recipient.value = "";

    preview();


    toast(
      "💌 ¡Carta enviada! Quedó pendiente de revisión."
    );


  } catch (error) {

    console.error(error);

    toast(
      "❌ No se pudo enviar la carta."
    );

  }

}


// ==========================================
// EDITAR PERFIL
// ==========================================

async function editProfile() {

  if (!currentUser) {

    toast("❌ No hay usuario conectado.");

    return;

  }


  const currentName =
    currentUser.user_metadata?.name ||
    "";


  const newName =
    prompt(
      "💗 Escribe tu nuevo nombre:",
      currentName
    );


  if (newName === null) return;


  const name =
    newName.trim();


  if (!name) {

    toast("❌ El nombre no puede estar vacío.");

    return;

  }


  try {

    const { data, error } =
      await supabaseClient.auth.updateUser({

        data: {
          name: name
        }

      });


    if (error) {

      console.error(error);

      toast(
        "❌ No se pudo actualizar el perfil."
      );

      return;

    }


    currentUser = data.user;

    loadProfile();

    toast(
      "✨ Tu perfil fue actualizado."
    );


  } catch (error) {

    console.error(error);

    toast(
      "❌ Ocurrió un error."
    );

  }

}


// ==========================================
// PANEL ADMINISTRATIVO
// ==========================================

function showAdmin() {

  const admin =
    document.getElementById("admin");

  if (!admin) return;

  admin.scrollIntoView({
    behavior: "smooth"
  });

  loadAdminStats();

}


// ==========================================
// ESTADÍSTICAS ADMIN
// ==========================================

async function loadAdminStats() {

  const users =
    document.getElementById("users");

  const pending =
    document.getElementById("pendingLetters");

  const reviews =
    document.getElementById("reviews");

  const memberships =
    document.getElementById("memberships");


  /*
    Todavía no mostramos datos falsos.

    Cuando creemos las tablas correspondientes
    conectaremos estos números a Supabase.
  */


  if (users) {
    users.textContent = "—";
  }

  if (pending) {
    pending.textContent = "—";
  }

  if (reviews) {
    reviews.textContent = "—";
  }

  if (memberships) {
    memberships.textContent = "—";
  }

}


// ==========================================
// CARTAS PENDIENTES
// ==========================================

async function loadPendingLetters() {

  const results =
    document.getElementById("adminResults");


  if (!results) return;


  results.innerHTML = `
    <div class="admin-result-card">
      <h3>💌 Cartas pendientes</h3>

      <p>
        Aquí aparecerán las cartas que
        necesitan aprobación.
      </p>

      <p>
        🛡️ Primero debemos terminar
        de conectar la tabla de cartas
        con Supabase.
      </p>
    </div>
  `;


  toast(
    "💌 Preparando moderación..."
  );

}


// ==========================================
// USUARIOS
// ==========================================

async function loadUsers() {

  const results =
    document.getElementById("adminResults");


  if (!results) return;


  results.innerHTML = `
    <div class="admin-result-card">

      <h3>
        👥 Usuarios
      </h3>

      <p>
        El panel mostrará aquí los
        miembros de Carta Digital.
      </p>

      <p>
        🔐 La información administrativa
        se conectará mediante las reglas
        de seguridad de Supabase.
      </p>

    </div>
  `;


  toast(
    "👥 Sección de usuarios preparada."
  );

}


// ==========================================
// REVIEWS
// ==========================================

async function loadReviews() {

  const results =
    document.getElementById("adminResults");


  if (!results) return;


  results.innerHTML = `
    <div class="admin-result-card">

      <h3>
        ⭐ Reviews
      </h3>

      <p>
        Aquí podrás revisar las opiniones
        de la comunidad.
      </p>

    </div>
  `;


  toast(
    "⭐ Sección de reviews preparada."
  );

}


// ==========================================
// MEMBRESÍAS
// ==========================================

async function loadMemberships() {

  const results =
    document.getElementById("adminResults");


  if (!results) return;


  results.innerHTML = `
    <div class="admin-result-card">

      <h3>
        👑 Membresías
      </h3>

      <p>
        Aquí aparecerán los miembros
        Premium y sus estados.
      </p>

      <p>
        💳 El sistema de pagos se conectará
        posteriormente.
      </p>

    </div>
  `;


  toast(
    "👑 Sección de membresías preparada."
  );

}


// ==========================================
// PARTÍCULAS
// ==========================================

function createParticles() {

  const container =
    document.getElementById("particles");

  if (!container) return;


  const symbols = [
    "💗",
    "✦",
    "✧",
    "🌸",
    "🦋",
    "♡",
    "✨"
  ];


  symbols.forEach((symbol) => {

    for (let i = 0; i < 3; i++) {

      const item =
        document.createElement("span");

      item.textContent =
        symbol;

      item.style.left =
        Math.random() * 100 + "vw";

      item.style.fontSize =
        10 + Math.random() * 18 + "px";

      item.style.animationDuration =
        12 + Math.random() * 15 + "s";

      item.style.animationDelay =
        -Math.random() * 20 + "s";

      container.appendChild(item);

    }

  });

}


// ==========================================
// TOAST
// ==========================================

function toast(message) {

  const element =
    document.getElementById("toast");

  if (!element) return;


  element.textContent =
    message;

  element.classList.add("show");


  setTimeout(() => {

    element.classList.remove("show");

  }, 4000);

}


// ==========================================
// HACER TOAST DISPONIBLE EN HTML
// ==========================================

window.toast = toast;

window.logout = logout;
window.toggleTheme = toggleTheme;
window.preview = preview;
window.addEmoji = addEmoji;
window.submitLetter = submitLetter;
window.editProfile = editProfile;
window.showAdmin = showAdmin;
window.loadPendingLetters = loadPendingLetters;
window.loadUsers = loadUsers;
window.loadReviews = loadReviews;
window.loadMemberships = loadMemberships;
