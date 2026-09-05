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
          <div class="admin-row"><span>👥 Usuarios registrados</span><b id="usersCount">—</b></div>
          <div class="admin-row"><span>💌 Cartas</span><b>—</b></div>
          <div class="admin-row"><span>⭐ Reviews</span><b>3</b></div>
          <div class="admin-row"><span>💬 Soporte</span><button class="primary" onclick="openSupportAdmin()">Abrir bandeja</button></div>
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
      showToast("❌ " + (data?.error || "No pudimos abrir el pago de Stripe."));
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

    if (data.user) await ensureProfile(data.user);

    sessionStorage.setItem("MCD_PENDING_MEMBERSHIP", "1");
    sessionStorage.setItem("MCD_FLOW", "membership-first");
    closeModal();

    if (data.session?.user) {
      showToast("💳 Cuenta creada. Abriendo el pago de $20/mes...");
      setTimeout(() => startMembershipCheckout(), 700);
    } else {
      showToast("💌 Cuenta creada. Confirma tu correo y pulsa Entrar para continuar al pago de $20/mes.");
      sessionStorage.setItem("MCD_AFTER_LOGIN", "membership");
    }

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

    await ensureProfile(user);

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



// ==========================================
// SESIÓN PÚBLICA Y ANALÍTICA
// ==========================================
async function logoutPublic(){
  try{ if(supabaseClient) await supabaseClient.auth.signOut(); } finally {
    showToast('👋 Sesión cerrada.');
    setTimeout(()=>location.reload(),300);
  }
}
window.logoutPublic=logoutPublic;

async function trackSiteEvent(eventType, metadata={}){
  try{
    if(!supabaseClient) return;
    const {data:{user}}=await supabaseClient.auth.getUser();
    let ip=null;
    try{ const r=await fetch('https://api64.ipify.org?format=json',{cache:'no-store'}); if(r.ok) ip=(await r.json()).ip||null; }catch(_){}
    await supabaseClient.from('site_events').insert({
      event_type:eventType, user_id:user?.id||null, email:user?.email||null,
      ip_address:ip, host:location.hostname, user_agent:navigator.userAgent,
      referrer:document.referrer||null, metadata
    });
  }catch(e){ console.debug('Analytics:',e.message); }
}
trackSiteEvent('page_view');

// ==========================================
// CHAT REAL CON KAMILA — SUPABASE REALTIME
// ==========================================
let mcdConversationId = null;
let mcdChatChannel = null;
let mcdAdminConversationId = null;
let mcdAdminChannel = null;

async function ensureProfile(user){
  if(!user || !supabaseClient) return;
  const name = user.user_metadata?.name || user.email?.split('@')[0] || 'Miembro';
  const { error } = await supabaseClient.from('profiles').upsert({
    id:user.id, name, avatar:'💗'
  }, { onConflict:'id' });
  if(error) console.warn('Perfil:', error.message);
}

function openSupport(){
  trackSiteEvent('support_open');
  const overlay=document.getElementById('chatOverlay');
  if(!overlay) return;
  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden','false');
  const input=document.getElementById('chatInput');
  if(input) setTimeout(()=>input.focus(),150);
  initCustomerChat();
}
window.openSupport=openSupport;

function closeSupport(){
  const overlay=document.getElementById('chatOverlay');
  if(overlay){ overlay.classList.remove('show'); overlay.setAttribute('aria-hidden','true'); }
  if(mcdChatChannel && supabaseClient){ supabaseClient.removeChannel(mcdChatChannel); mcdChatChannel=null; }
}
window.closeSupport=closeSupport;

async function initCustomerChat(){
  const messagesBox=document.getElementById('chatMessages');
  if(!messagesBox || !supabaseClient) return;
  const {data:{session}}=await supabaseClient.auth.getSession();
  if(!session?.user){
    messagesBox.innerHTML='<div class="chat-system">🔐 Para hablar conmigo, primero entra a tu cuenta. 💗</div><button class="primary" onclick="closeSupport();openModal(\'login\')">Entrar a mi cuenta</button>';
    return;
  }
  await ensureProfile(session.user);
  let {data:conv,error}=await supabaseClient.from('support_conversations').select('*').eq('user_id',session.user.id).order('updated_at',{ascending:false}).limit(1).maybeSingle();
  if(error){ console.error(error); messagesBox.innerHTML='<div class="chat-system">❌ No pude conectar el chat. Inténtalo de nuevo.</div>'; return; }
  if(!conv){
    const created=await supabaseClient.from('support_conversations').insert({user_id:session.user.id,status:'open'}).select().single();
    if(created.error){ console.error(created.error); messagesBox.innerHTML='<div class="chat-system">❌ No pude abrir tu conversación.</div>'; return; }
    conv=created.data;
  }
  mcdConversationId=conv.id;
  await loadCustomerMessages();
  if(mcdChatChannel) supabaseClient.removeChannel(mcdChatChannel);
  mcdChatChannel=supabaseClient.channel('mcd-customer-'+conv.id)
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'support_messages',filter:'conversation_id=eq.'+conv.id},payload=>renderChatMessage(payload.new,session.user.id))
    .subscribe();
}

async function loadCustomerMessages(){
  const box=document.getElementById('chatMessages'); if(!box||!mcdConversationId) return;
  const {data,error}=await supabaseClient.from('support_messages').select('*').eq('conversation_id',mcdConversationId).order('created_at',{ascending:true});
  if(error){console.error(error);return;}
  box.innerHTML='<div class="chat-system">💌 Hola, soy Kamila. Estoy aquí para ayudarte.</div>';
  const {data:{user}}=await supabaseClient.auth.getUser();
  (data||[]).forEach(m=>renderChatMessage(m,user?.id));
  box.scrollTop=box.scrollHeight;
}

function renderChatMessage(m,currentUserId){
  const box=document.getElementById('chatMessages'); if(!box||!m) return;
  if(box.querySelector('[data-message-id="'+m.id+'"]')) return;
  const el=document.createElement('div');
  el.dataset.messageId=m.id;
  el.className='chat-bubble '+(m.sender_id===currentUserId?'mine':'them');
  el.textContent=m.body;
  const t=document.createElement('span'); t.className='chat-time'; t.textContent=new Date(m.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  el.appendChild(t); box.appendChild(el); box.scrollTop=box.scrollHeight;
}

async function sendCustomerMessage(event){
  event.preventDefault();
  const input=document.getElementById('chatInput'); if(!input||!mcdConversationId) return;
  const body=input.value.trim(); if(!body) return;
  const {data:{user}}=await supabaseClient.auth.getUser();
  if(!user){showToast('🔐 Entra a tu cuenta para enviar mensajes.');return;}
  input.disabled=true;
  const {error}=await supabaseClient.from('support_messages').insert({conversation_id:mcdConversationId,sender_id:user.id,body});
  input.disabled=false;
  if(error){console.error(error);showToast('❌ No se pudo enviar el mensaje.');return;}
  input.value='';
  await supabaseClient.from('support_conversations').update({updated_at:new Date().toISOString(),status:'open'}).eq('id',mcdConversationId).eq('user_id',user.id);
}

document.getElementById('chatForm')?.addEventListener('submit',sendCustomerMessage);
document.getElementById('chatOverlay')?.addEventListener('click',e=>{if(e.target.id==='chatOverlay')closeSupport();});

async function openSupportAdmin(){
  if(!supabaseClient) return;
  const {data:{user}}=await supabaseClient.auth.getUser();
  if(!user){closeModal();openModal('login');showToast('🔐 Entra con tu cuenta de administradora.');return;}
  const {data:profile}=await supabaseClient.from('profiles').select('role,name').eq('id',user.id).maybeSingle();
  if(profile?.role!=='admin'){showToast('⛔ Esta bandeja es solo para administradores.');return;}
  content.innerHTML=`<div class="auth-card"><button class="close" onclick="openModal('admin')">←</button><h2>💬 Bandeja de Kamila</h2><p>Conversaciones de clientes en tiempo real.</p><div id="adminConversations" class="admin-list">Cargando...</div><div id="adminReplyBox"></div></div>`;
  modal.classList.add('show');
  await loadAdminConversations();
}
window.openSupportAdmin=openSupportAdmin;

async function loadAdminConversations(){
  const box=document.getElementById('adminConversations'); if(!box) return;
  const {data,error}=await supabaseClient.from('support_conversations').select('*').order('updated_at',{ascending:false});
  if(error){box.innerHTML='<div class="admin-row">❌ '+escapeHtml(error.message)+'</div>';return;}
  if(!data?.length){box.innerHTML='<div class="admin-row">💗 Todavía no hay conversaciones.</div>';return;}
  box.innerHTML=data.map(c=>`<button class="admin-row" style="text-align:left;cursor:pointer" onclick="selectAdminConversation('${c.id}')"><span>💌 Cliente ${c.user_id.slice(0,8)}…<small style="display:block;color:#9b8193">${new Date(c.updated_at).toLocaleString()}</small></span><b>${c.status==='open'?'🟢':'⚪'}</b></button>`).join('');
}
window.loadAdminConversations=loadAdminConversations;

async function selectAdminConversation(id){
  mcdAdminConversationId=id;
  const box=document.getElementById('adminReplyBox'); if(!box)return;
  box.innerHTML=`<div class="chat-body" id="adminMessages" style="height:300px;margin-top:15px;border-radius:18px"></div><form class="chat-form" id="adminForm"><input id="adminInput" maxlength="1000" placeholder="Responder como Kamila..." required><button>➤</button></form>`;
  await loadAdminMessages();
  document.getElementById('adminForm')?.addEventListener('submit',sendAdminMessage);
  if(mcdAdminChannel) supabaseClient.removeChannel(mcdAdminChannel);
  mcdAdminChannel=supabaseClient.channel('mcd-admin-'+id).on('postgres_changes',{event:'INSERT',schema:'public',table:'support_messages',filter:'conversation_id=eq.'+id},async()=>loadAdminMessages()).subscribe();
}
window.selectAdminConversation=selectAdminConversation;

async function loadAdminMessages(){
  const box=document.getElementById('adminMessages');if(!box||!mcdAdminConversationId)return;
  const {data,error}=await supabaseClient.from('support_messages').select('*').eq('conversation_id',mcdAdminConversationId).order('created_at',{ascending:true});
  if(error){box.textContent=error.message;return;}
  box.innerHTML='';
  const {data:{user}}=await supabaseClient.auth.getUser();
  (data||[]).forEach(m=>{const el=document.createElement('div');el.className='chat-bubble '+(m.sender_id===user?.id?'mine':'them');el.textContent=m.body;box.appendChild(el)});
  box.scrollTop=box.scrollHeight;
}

async function sendAdminMessage(e){
  e.preventDefault();const input=document.getElementById('adminInput');if(!input||!mcdAdminConversationId)return;
  const body=input.value.trim();if(!body)return;
  const {data:{user}}=await supabaseClient.auth.getUser();if(!user)return;
  const {error}=await supabaseClient.from('support_messages').insert({conversation_id:mcdAdminConversationId,sender_id:user.id,body});
  if(error){showToast('❌ '+error.message);return;}
  await supabaseClient.from('support_conversations').update({updated_at:new Date().toISOString()}).eq('id',mcdAdminConversationId);
  input.value='';await loadAdminMessages();
}

function escapeHtml(value){const d=document.createElement('div');d.textContent=value;return d.innerHTML;}

const reflections=[
  '🍂 Soltar también es una forma de quererte. No todo lo que termina es una pérdida.',
  '💗 No tienes que perseguir un lugar donde tu corazón nunca se sintió en casa.',
  '🌙 Hay noches en las que sanar significa simplemente descansar y volver a intentarlo mañana.',
  '🥀 Extrañar a alguien no obliga a volver; a veces solo confirma que fue importante.',
  '🦋 Tu nueva versión también merece celebrar todo lo que sobreviviste.',
  '☕ A veces una carta no cambia el pasado, pero sí cambia la forma en que lo llevas.'
];
let reflectionIndex=0;
function nextReflection(){reflectionIndex=(reflectionIndex+1)%reflections.length;const cards=document.querySelectorAll('.reflection-mini');cards.forEach((c,i)=>{if(i===reflectionIndex%cards.length)c.querySelector('p').textContent=reflections[reflectionIndex];});showToast('✨ Nueva reflexión para ti.');}
window.nextReflection=nextReflection;
function copyTikTok(text){navigator.clipboard?.writeText(text).then(()=>showToast('📋 Caption copiado para TikTok.')).catch(()=>showToast(text));}
window.copyTikTok=copyTikTok;


function showAthNumber(){
  content.innerHTML=`<div class="auth-card" style="text-align:center"><div style="font-size:55px">📱💗</div><h2>ATH Móvil</h2><p>Envía tu pago al siguiente número:</p><div style="font-size:30px;font-weight:900;letter-spacing:2px;margin:20px 0">939-450-6563</div><button class="primary" onclick="copyAth()">📋 Copiar número</button><p style="font-size:12px;margin-top:14px">Después del pago, escríbeme por el chat para continuar con tu carta. 💌</p></div>`;modal.classList.add('show');
}
window.showAthNumber=showAthNumber;
function copyAth(){navigator.clipboard?.writeText('9394506563').then(()=>showToast('📋 Número de ATH Móvil copiado.')).catch(()=>showToast('939-450-6563'));}
window.copyAth=copyAth;

window.startMembershipCheckout = startMembershipCheckout;
window.openModal = openModal;
window.closeModal = closeModal;

// Feedback global para el botón de membresía.
window.__mcdMembershipBusy = false;
