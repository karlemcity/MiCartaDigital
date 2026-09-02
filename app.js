 const modal = document.getElementById('modal');
const content = document.getElementById('modalContent');
const toast = document.getElementById('toast');
const particles = document.getElementById('particles');

['💗','✦','✧','🌸','🦋','♡','✨','·'].forEach((s) => {
  for (let j = 0; j < 4; j++) {
    const x = document.createElement('span');
    x.textContent = s;
    x.style.left = Math.random() * 100 + 'vw';
    x.style.fontSize = (10 + Math.random() * 18) + 'px';
    x.style.animationDuration = (12 + Math.random() * 15) + 's';
    x.style.animationDelay = (-Math.random() * 20) + 's';
    particles.appendChild(x);
  }
});

function openModal(type) {
  modal.classList.add('show');

  if (type === 'register') {
    content.innerHTML = `
      <h2>Crear mi cuenta 💌</h2>
      <p>Comienza tu historia en Carta Digital.</p>

      <form class="form" onsubmit="register(event)">
        <input id="name" placeholder="Tu nombre" required>

        <input
          id="email"
          type="email"
          placeholder="Correo electrónico"
          required
        >

        <input
          id="pass"
          type="password"
          placeholder="Contraseña"
          minlength="6"
          required
        >

        <button class="primary">
          ✨ Crear mi cuenta
        </button>
      </form>

      <p style="font-size:12px">
        Recibirás un correo para confirmar tu cuenta. 💗
      </p>
    `;
  }

  if (type === 'login') {
    content.innerHTML = `
      <h2>Bienvenido de vuelta 💗</h2>
      <p>Entra a tu espacio de cartas.</p>

      <form class="form" onsubmit="login(event)">
        <input
          id="email"
          type="email"
          placeholder="Correo electrónico"
          required
        >

        <input
          id="pass"
          type="password"
          placeholder="Contraseña"
          required
        >

        <button class="primary">
          💌 Entrar
        </button>
      </form>

      <p style="font-size:13px">
        ¿No tienes cuenta?
        <a href="#" onclick="openModal('register'); return false;">
          Regístrate
        </a>
      </p>
    `;
  }

  if (type === 'admin') {
    content.innerHTML = `
      <h2>Panel Administrativo 👑</h2>
      <p>Panel de administración de Carta Digital.</p>

      <div class="admin-list">
        <div class="admin-row">
          <span>👥 Usuarios registrados</span>
          <b id="usersCount">0</b>
        </div>

        <div class="admin-row">
          <span>💌 Cartas pendientes</span>
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
    `;
  }
}

function closeModal() {
  modal.classList.remove('show');
}

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});


/* ================================
   REGISTRO REAL CON SUPABASE
================================ */

async function register(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('pass').value;

  if (!supabaseClient) {
    showToast('❌ Supabase no está conectado.');
    return;
  }

  showToast('💌 Creando tu cuenta...');

  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        name: name
      }
    }
  });

  if (error) {
    console.error(error);
    showToast('❌ ' + error.message);
    return;
  }

  closeModal();

  showToast(
    `💌 ¡Bienvenido/a ${name}! Revisa tu correo para confirmar tu cuenta.`
  );
}


/* ================================
   LOGIN REAL CON SUPABASE
================================ */

async function login(e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('pass').value;

  if (!supabaseClient) {
    showToast('❌ Supabase no está conectado.');
    return;
  }

  showToast('💗 Iniciando sesión...');

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    console.error(error);
    showToast('❌ ' + error.message);
    return;
  }

  const user = data.user;

  closeModal();

  const name =
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'amigo/a';

  showToast(`¡Hola ${name}! Tu espacio está listo 💗`);

  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1200);
}


/* ================================
   FUNCIONES DE LA PÁGINA
================================ */

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({
    behavior: 'smooth'
  });
}

function openLetter() {
  showToast(
    '💌 Imagina tu carta abriéndose y llegando al corazón de alguien especial.'
  );
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});
