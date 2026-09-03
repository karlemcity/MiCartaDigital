 // ==========================================
// MI CARTA DIGITAL 💌
// APP.JS - REGISTRO Y LOGIN
// ==========================================

const modal = document.getElementById("modal");
const content = document.getElementById("modalContent");
const toast = document.getElementById("toast");
const particles = document.getElementById("particles");

// ==========================================
// PARTÍCULAS BONITAS
// ==========================================

if (particles) {
  const symbols = ["💗", "✦", "✧", "🌸", "🦋", "♡", "✨"];

  symbols.forEach((symbol) => {
    for (let i = 0; i < 3; i++) {
      const item = document.createElement("span");

      item.textContent = symbol;
      item.style.left = Math.random() * 100 + "vw";
      item.style.fontSize = 10 + Math.random() * 18 + "px";
      item.style.animationDuration = 12 + Math.random() * 15 + "s";
      item.style.animationDelay = -Math.random() * 20 + "s";

      particles.appendChild(item);
    }
  });
}


// ==========================================
// ABRIR MODAL
// ==========================================

function openModal(type) {

  if (!modal || !content) {
    console.error("No se encontró el modal.");
    return;
  }

  // IMPORTANTE:
  // Primero ponemos el contenido y DESPUÉS mostramos el modal.
  modal.classList.remove("show");

  if (type === "register") {

    content.innerHTML = `
      <div class="auth-card">

        <div style="text-align:center;font-size:42px;">
          💌
        </div>

        <h2 style="text-align:center;">
          Crear mi cuenta
        </h2>

        <p style="text-align:center;">
          Comienza tu historia en Mi Carta Digital. 💗
        </p>

        <form id="registerForm" class="form">

          <label>Tu nombre</label>

          <input
            id="name"
            type="text"
            placeholder="Escribe tu nombre"
            autocomplete="name"
            required
          >

          <label>Correo electrónico</label>

          <input
            id="email"
            type="email"
            placeholder="ejemplo@gmail.com"
            autocomplete="email"
            required
          >

          <label>Contraseña</label>

          <input
            id="pass"
            type="password"
            placeholder="Mínimo 6 caracteres"
            minlength="6"
            autocomplete="new-password"
            required
          >

          <button
            type="submit"
            class="primary"
            id="registerButton"
          >
            ✨ Crear mi cuenta
          </button>

        </form>

        <p style="text-align:center;font-size:13px;margin-top:15px;">
          Al registrarte recibirás un correo para confirmar tu cuenta. 💗
        </p>

        <p style="text-align:center;font-size:13px;">
          ¿Ya tienes una cuenta?
          <a href="#" id="goLogin">
            Entrar
          </a>
        </p>

      </div>
    `;

    // Mostrar modal DESPUÉS de crear el contenido
    setTimeout(() => {
      modal.classList.add("show");

      const form = document.getElementById("registerForm");

      if (form) {
        form.addEventListener("submit", register);
      }

      const loginLink = document.getElementById("goLogin");

      if (loginLink) {
        loginLink.addEventListener("click", (event) => {
          event.preventDefault();
          openModal("login");
        });
      }

    }, 50);

    return;
  }


  // ==========================================
  // LOGIN
  // ==========================================

  if (type === "login") {

    content.innerHTML = `
      <div class="auth-card">

        <div style="text-align:center;font-size:42px;">
          💗
        </div>

        <h2 style="text-align:center;">
          Bienvenido de vuelta
        </h2>

        <p style="text-align:center;">
          Entra a tu espacio de cartas.
        </p>

        <form id="loginForm" class="form">

          <label>Correo electrónico</label>

          <input
            id="email"
            type="email"
            placeholder="ejemplo@gmail.com"
            autocomplete="email"
            required
          >

          <label>Contraseña</label>

          <input
            id="pass"
            type="password"
            placeholder="Tu contraseña"
            autocomplete="current-password"
            required
          >

          <button
            type="submit"
            class="primary"
            id="loginButton"
          >
            💌 Entrar
          </button>

        </form>

        <p style="text-align:center;font-size:13px;margin-top:15px;">
          ¿No tienes cuenta?
          <a href="#" id="goRegister">
            Regístrate
          </a>
        </p>

      </div>
    `;

    setTimeout(() => {

      modal.classList.add("show");

      const form = document.getElementById("loginForm");

      if (form) {
        form.addEventListener("submit", login);
      }

      const registerLink = document.getElementById("goRegister");

      if (registerLink) {
        registerLink.addEventListener("click", (event) => {
          event.preventDefault();
          openModal("register");
        });
      }

    }, 50);

    return;
  }


  // ==========================================
  // PANEL ADMINISTRATIVO
  // ==========================================

  if (type === "admin") {

    content.innerHTML = `
      <div class="auth-card">

        <div style="text-align:center;font-size:42px;">
          👑
        </div>

        <h2 style="text-align:center;">
          Panel Administrativo
        </h2>

        <p style="text-align:center;">
          Mi Carta Digital
        </p>

        <div class="admin-list">

          <div class="admin-row">
            <span>👥 Usuarios registrados</span>
            <b id="usersCount">...</b>
          </div>

          <div class="admin-row">
            <span>💌 Cartas</span>
            <b>0</b>
          </div>

          <div class="admin-row">
            <span>⭐ Reviews</span>
            <b>3</b>
          </div>

          <div class="admin-row">
            <span>👑 Membresías</span>
            <b>0</b>
          </div>

        </div>

      </div>
    `;

    setTimeout(() => {
      modal.classList.add("show");
      loadAdminStats();
    }, 50);

    return;
  }
}


// ==========================================
// CERRAR MODAL
// ==========================================

function closeModal() {

  if (!modal) return;

  modal.classList.remove("show");
}


// ==========================================
// CERRAR AL HACER CLICK AFUERA
// ==========================================

if (modal) {

  modal.addEventListener("click", function(event) {

    if (event.target === modal) {
      closeModal();
    }

  });

}


// ==========================================
// MEMBRESÍA STRIPE 💳👑
// ==========================================

async function startMembershipCheckout(){
  try {
    if (!window.supabase || !supabaseClient) {
      showToast("❌ Supabase no está conectado.");
      return;
    }

    const { data: { session } } = await supabaseClient.auth.getSession();

    if (!session?.user) {
      sessionStorage.setItem("MCD_AFTER_LOGIN", "membership");
      openModal("login");
      showToast("💗 Inicia sesión para activar tu membresía.");
      return;
    }

    showToast("💳 Preparando tu checkout de $20/mes...");

    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
          "apikey": SUPABASE_PUBLISHABLE_KEY
        },
        body: JSON.stringify({})
      }
    );

    const data = await response.json();

    if (!response.ok || !data.url) {
      console.error("CHECKOUT ERROR:", data);
      showToast("❌ No pudimos abrir el pago. Revisa la configuración de Stripe.");
      return;
    }

    window.location.href = data.url;
  } catch (error) {
    console.error("CHECKOUT ERROR:", error);
    showToast("❌ Ocurrió un error al abrir Stripe.");
  }
}

// ==========================================
// REGISTRO REAL CON SUPABASE
// ==========================================

async function register(event) {

  event.preventDefault();

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("pass");
  const button = document.getElementById("registerButton");

  if (!nameInput || !emailInput || !passwordInput) {
    showToast("❌ No se pudieron encontrar los campos.");
    return;
  }

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!name) {
    showToast("💗 Escribe tu nombre.");
    nameInput.focus();
    return;
  }

  if (!email) {
    showToast("💗 Escribe tu correo.");
    emailInput.focus();
    return;
  }

  if (password.length < 6) {
    showToast("🔐 La contraseña debe tener mínimo 6 caracteres.");
    passwordInput.focus();
    return;
  }

  if (!window.supabase || !supabaseClient) {
    showToast("❌ Supabase no está conectado.");
    return;
  }

  // Evita doble clic
  if (button) {
    button.disabled = true;
    button.textContent = "💌 Creando cuenta...";
  }

  showToast("💌 Creando tu cuenta...");

  try {

    const { data, error } =
      await supabaseClient.auth.signUp({

        email: email,

        password: password,

        options: {
          data: {
            name: name
          }
        }

      });


    if (error) {

      console.error("SUPABASE SIGNUP ERROR:", error);

      if (button) {
        button.disabled = false;
        button.textContent = "✨ Crear mi cuenta";
      }

      showToast("❌ " + error.message);

      return;
    }


    console.log("Usuario creado:", data);

    closeModal();

    showToast(
      "💌 ¡Cuenta creada! Revisa tu correo para confirmar tu email."
    );

  } catch (error) {

    console.error("ERROR:", error);

    if (button) {
      button.disabled = false;
      button.textContent = "✨ Crear mi cuenta";
    }

    showToast(
      "❌ Ocurrió un error. Inténtalo nuevamente."
    );
  }
}


// ==========================================
// LOGIN REAL CON SUPABASE
// ==========================================

async function login(event) {

  event.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("pass");
  const button = document.getElementById("loginButton");

  if (!emailInput || !passwordInput) {
    showToast("❌ No se encontraron los campos.");
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email) {
    showToast("💗 Escribe tu correo.");
    emailInput.focus();
    return;
  }

  if (!password) {
    showToast("🔐 Escribe tu contraseña.");
    passwordInput.focus();
    return;
  }

  if (!window.supabase || !supabaseClient) {
    showToast("❌ Supabase no está conectado.");
    return;
  }

  if (button) {
    button.disabled = true;
    button.textContent = "💗 Entrando...";
  }

  showToast("💗 Iniciando sesión...");

  try {

    const { data, error } =
      await supabaseClient.auth.signInWithPassword({

        email: email,
        password: password

      });


    if (error) {

      console.error("LOGIN ERROR:", error);

      if (button) {
        button.disabled = false;
        button.textContent = "💌 Entrar";
      }

      showToast("❌ " + error.message);

      return;
    }


    const user = data.user;

    const name =
      user?.user_metadata?.name ||
      user?.email?.split("@")[0] ||
      "amigo/a";

    closeModal();

    showToast(
      `💗 ¡Hola ${name}! Tu espacio está listo.`
    );

    setTimeout(async () => {
      const next = sessionStorage.getItem("MCD_AFTER_LOGIN");
      if (next === "membership") {
        sessionStorage.removeItem("MCD_AFTER_LOGIN");
        await startMembershipCheckout();
      } else {
        window.location.href = "dashboard.html";
      }
    }, 700);

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    if (button) {
      button.disabled = false;
      button.textContent = "💌 Entrar";
    }

    showToast(
      "❌ No se pudo iniciar sesión."
    );
  }
}


// ==========================================
// ESTADÍSTICAS DEL ADMIN
// ==========================================

async function loadAdminStats() {

  const usersCount =
    document.getElementById("usersCount");

  if (!usersCount) return;

  try {

    if (!supabaseClient) {
      usersCount.textContent = "—";
      return;
    }

    // Por seguridad, Supabase no permite contar
    // usuarios de Auth directamente desde el navegador.
    // Dejamos el panel preparado.
    usersCount.textContent = "—";

  } catch (error) {

    console.error(error);

    usersCount.textContent = "—";
  }
}


// ==========================================
// MENSAJES
// ==========================================

function showToast(message) {

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {

    toast.classList.remove("show");

  }, 4000);
}


// ==========================================
// SCROLL
// ==========================================

function scrollToSection(id) {

  const section = document.getElementById(id);

  if (!section) return;

  section.scrollIntoView({
    behavior: "smooth"
  });
}


// ==========================================
// SOBRE
// ==========================================

function openLetter() {

  showToast(
    "💌 Hay palabras que llegan justo cuando el corazón las necesita."
  );
}


// ==========================================
// TECLA ESC
// ==========================================

window.addEventListener("keydown", function(event) {

  if (event.key === "Escape") {
    closeModal();
  }

});

// ==========================================
// EXPERIENCIA VISUAL ✨ — movimiento + efectos
// ==========================================
(function enhanceExperience(){
  const root = document.body;
  if (!root) return;

  const particlesBox = document.getElementById('particles');
  if (particlesBox) {
    const symbols = ['💗','💖','💕','✨','🌸','🦋','🌷','⭐','♡','✦'];
    for(let i=0;i<24;i++){
      const el=document.createElement('span');
      el.textContent=symbols[i%symbols.length];
      el.style.left=(Math.random()*100)+'vw';
      el.style.fontSize=(9+Math.random()*18)+'px';
      el.style.animationDuration=(12+Math.random()*18)+'s';
      el.style.animationDelay=(-Math.random()*25)+'s';
      particlesBox.appendChild(el);
    }
  }

  // Aparición suave de las secciones al hacer scroll.
  const revealItems = document.querySelectorAll('section, .grid article, .review-grid article, .membership-card');
  revealItems.forEach((el,i)=>{
    el.classList.add('reveal');
    el.style.transitionDelay = Math.min((i%4)*70,210)+'ms';
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){ entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }),{threshold:.12});
    revealItems.forEach(el=>observer.observe(el));
  } else revealItems.forEach(el=>el.classList.add('visible'));

  // Efecto de inclinación ligero en tarjetas.
  document.querySelectorAll('.grid article,.review-grid article,.quote-card,.membership-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      if(window.matchMedia('(max-width: 900px)').matches) return;
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(900px) rotateX(${y*-2}deg) rotateY(${x*2}deg) translateY(-5px)`;
    });
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });

  // Onda al pulsar botones.
  document.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',e=>{
    const rect=btn.getBoundingClientRect();
    const ripple=document.createElement('span');
    ripple.style.cssText=`position:absolute;width:12px;height:12px;border-radius:50%;background:#fff9;left:${e.clientX-rect.left-6}px;top:${e.clientY-rect.top-6}px;pointer-events:none;transform:scale(1);opacity:1;transition:.55s`;
    btn.appendChild(ripple);
    requestAnimationFrame(()=>{ripple.style.transform='scale(18)';ripple.style.opacity='0'});
    setTimeout(()=>ripple.remove(),600);
  }));
})();


window.startMembershipCheckout = startMembershipCheckout;
window.openModal = openModal;
window.closeModal = closeModal;
