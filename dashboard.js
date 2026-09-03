 // ==========================================
// MI CARTA DIGITAL 💌
// DASHBOARD.JS
// ==========================================

let currentUser = null;


// ==========================================
// INICIAR
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {
  createParticles();
  await checkUser();
});


// ==========================================
// USUARIO
// ==========================================

async function checkUser() {
  try {
    if (!window.supabaseClient) {
      console.error("Supabase no conectado");
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
      }, 1000);

      return;
    }

    loadProfile();

  } catch (error) {
    console.error(error);
  }
}


// ==========================================
// PERFIL
// ==========================================

function loadProfile() {
  if (!currentUser) return;

  const metadata = currentUser.user_metadata || {};

  const name =
    metadata.name ||
    currentUser.email?.split("@")[0] ||
    "Corazón";

  const email =
    currentUser.email ||
    "";


  const elements = {
    welcomeName: name,
    miniName: name,
    profileName: name,
    profileEmail: email
  };


  Object.keys(elements).forEach(id => {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = elements[id];
    }
  });
}


// ==========================================
// SALIR
// ==========================================

async function logout() {
  try {

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

  if (document.body.classList.contains("dream-mode")) {
    toast("✨ Ambiente mágico activado.");
  } else {
    toast("🌷 Ambiente original restaurado.");
  }
}


// ==========================================
// PREVISUALIZACIÓN DE CARTA
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


  if (!message) return;


  if (title) {

    if (recipient && recipient.value.trim()) {

      title.textContent =
        "Una carta para " +
        recipient.value.trim();

    } else {

      title.textContent =
        "Una carta para ti";

    }

  }


  if (text) {

    text.innerHTML =
      message.value.trim()
        ? formatLetter(message.value)
        : "Tus palabras pueden iluminar un día.";

  }

}


// ==========================================
// EMOJIS 💗🌸🦋✨
// ==========================================

function addEmoji(emoji) {

  const message =
    document.getElementById("message");

  if (!message) return;


  const start =
    message.selectionStart ?? message.value.length;

  const end =
    message.selectionEnd ?? message.value.length;


  const before =
    message.value.substring(0, start);

  const after =
    message.value.substring(end);


  message.value =
    before + emoji + after;


  message.focus();


  const newPosition =
    start + emoji.length;

  message.selectionStart =
    newPosition;

  message.selectionEnd =
    newPosition;


  preview();


  // Animación de corazón al agregar decoración
  createFloatingDecoration(emoji);
}


// ==========================================
// FORMATO DE LA CARTA
// ==========================================

function formatLetter(text) {

  return escapeHTML(text)
    .replace(/\n/g, "<br>")
    .replace(/💗/g, "<span class='letter-heart'>💗</span>")
    .replace(/❤️/g, "<span class='letter-heart'>❤️</span>")
    .replace(/💕/g, "<span class='letter-heart'>💕</span>")
    .replace(/🌸/g, "<span class='letter-flower'>🌸</span>")
    .replace(/🦋/g, "<span class='letter-butterfly'>🦋</span>")
    .replace(/✨/g, "<span class='letter-sparkle'>✨</span>")
    .replace(/🌷/g, "<span class='letter-flower'>🌷</span>");
}


// ==========================================
// SEGURIDAD HTML
// ==========================================

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}


// ==========================================
// DECORACIÓN FLOTANTE
// ==========================================

function createFloatingDecoration(symbol) {

  const decoration =
    document.createElement("div");

  decoration.textContent =
    symbol;

  decoration.style.position =
    "fixed";

  decoration.style.left =
    "50%";

  decoration.style.top =
    "55%";

  decoration.style.fontSize =
    "30px";

  decoration.style.zIndex =
    "9999";

  decoration.style.pointerEvents =
    "none";

  decoration.style.transition =
    "all 1.2s ease";

  document.body.appendChild(decoration);


  setTimeout(() => {

    decoration.style.transform =
      `translate(
        ${(Math.random() - 0.5) * 300}px,
        -180px
      ) scale(1.5)`;

    decoration.style.opacity =
      "0";

  }, 50);


  setTimeout(() => {
    decoration.remove();
  }, 1300);
}


// ==========================================
// ENVIAR CARTA
// ==========================================

async function submitLetter() {

  const recipient =
    document.getElementById("recipient");

  const message =
    document.getElementById("message");


  if (!recipient || !message) {
    toast("❌ No se encontró el formulario.");
    return;
  }


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

    toast("❌ Tu sesión no está activa.");

    return;
  }


  toast("💌 Preparando tu carta...");


  /*
   * Intentamos guardar la carta.
   * Si la tabla todavía no existe,
   * mostramos un mensaje claro.
   */

  try {

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
        .select();


    if (error) {

      console.error(
        "Error guardando carta:",
        error
      );


      toast(
        "💌 Tu carta está lista, pero todavía falta conectar la tabla de cartas."
      );

      return;
    }


    recipient.value = "";
    message.value = "";

    preview();


    toast(
      "💌 ¡Carta enviada a revisión!"
    );


  } catch (error) {

    console.error(error);

    toast(
      "❌ No se pudo guardar la carta."
    );

  }
}


// ==========================================
// EDITAR PERFIL
// ==========================================

async function editProfile() {

  if (!currentUser) {
    toast("❌ No hay una cuenta activa.");
    return;
  }


  const oldName =
    currentUser.user_metadata?.name || "";


  const newName =
    prompt(
      "💗 Escribe tu nuevo nombre:",
      oldName
    );


  if (newName === null) return;


  const name =
    newName.trim();


  if (!name) {

    toast("❌ Escribe un nombre.");

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
        "❌ No se pudo actualizar tu nombre."
      );

      return;
    }


    currentUser =
      data.user;

    loadProfile();


    toast(
      "✨ Perfil actualizado."
    );


  } catch (error) {

    console.error(error);

    toast(
      "❌ Ocurrió un error."
    );

  }
}


// ==========================================
// PANEL ADMIN
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
// ESTADÍSTICAS
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


  if (users)
    users.textContent = "—";

  if (pending)
    pending.textContent = "—";

  if (reviews)
    reviews.textContent = "—";

  if (memberships)
    memberships.textContent = "—";
}


// ==========================================
// ADMIN - CARTAS
// ==========================================

async function loadPendingLetters() {

  const results =
    document.getElementById("adminResults");


  if (!results) return;


  results.innerHTML = `

    <div class="admin-result-card">

      <h3>💌 Cartas pendientes</h3>

      <p>
        Aquí aparecerán las cartas
        enviadas por los miembros.
      </p>

      <p>
        🛡️ Podrás revisarlas antes
        de aprobarlas.
      </p>

    </div>

  `;


  toast(
    "💌 Sección de cartas preparada."
  );
}


// ==========================================
// ADMIN - USUARIOS
// ==========================================

async function loadUsers() {

  const results =
    document.getElementById("adminResults");


  if (!results) return;


  results.innerHTML = `

    <div class="admin-result-card">

      <h3>👥 Usuarios registrados</h3>

      <p>
        Aquí aparecerán los miembros
        de Mi Carta Digital.
      </p>

    </div>

  `;


  toast(
    "👥 Sección de usuarios."
  );
}


// ==========================================
// ADMIN - REVIEWS
// ==========================================

async function loadReviews() {

  const results =
    document.getElementById("adminResults");


  if (!results) return;


  results.innerHTML = `

    <div class="admin-result-card">

      <h3>⭐ Reviews</h3>

      <p>
        Aquí podrás administrar
        las opiniones de la comunidad.
      </p>

    </div>

  `;


  toast(
    "⭐ Sección de reviews."
  );
}


// ==========================================
// ADMIN - MEMBRESÍAS
// ==========================================

async function loadMemberships() {

  const results =
    document.getElementById("adminResults");


  if (!results) return;


  results.innerHTML = `

    <div class="admin-result-card">

      <h3>👑 Membresías</h3>

      <p>
        Aquí aparecerán los miembros
        Premium.
      </p>

    </div>

  `;


  toast(
    "👑 Sección de membresías."
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


  symbols.forEach(symbol => {

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
// MENSAJES
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
// FUNCIONES GLOBALES
// ==========================================

window.logout =
  logout;

window.toggleTheme =
  toggleTheme;

window.preview =
  preview;

window.addEmoji =
  addEmoji;

window.submitLetter =
  submitLetter;

window.editProfile =
  editProfile;

window.showAdmin =
  showAdmin;

window.loadPendingLetters =
  loadPendingLetters;

window.loadUsers =
  loadUsers;

window.loadReviews =
  loadReviews;

window.loadMemberships =
  loadMemberships;

window.toast =
  toast;
