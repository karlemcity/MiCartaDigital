// ==========================================
// MI CARTA DIGITAL 💌 — DASHBOARD
// Cartas + decoraciones + deshacer + Supabase
// ==========================================

const toastEl = document.getElementById('toast');
const DRAFT_KEY = 'mcd_letter_draft_v2';

let decorationHistory = [];
let decorations = [];

const $ = (id) => document.getElementById(id);

function toast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(window.__mcdToastTimer);
  window.__mcdToastTimer = setTimeout(() => toastEl.classList.remove('show'), 3500);
}

function saveDraft() {
  const draft = {
    recipient: $('recipient')?.value || '',
    message: $('message')?.value || '',
    decorations: [...decorations]
  };
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

function restoreDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
    if (!draft) return;
    if ($('recipient')) $('recipient').value = draft.recipient || '';
    if ($('message')) $('message').value = draft.message || '';
    decorations = Array.isArray(draft.decorations) ? draft.decorations : [];
    decorationHistory = [];
    renderDecorations();
    preview();
  } catch (error) {
    console.warn('No se pudo recuperar el borrador:', error);
  }
}

function pushDecorationState() {
  decorationHistory.push([...decorations]);
  if (decorationHistory.length > 30) decorationHistory.shift();
}

function addEmoji(emoji) {
  pushDecorationState();
  decorations.push(emoji);
  renderDecorations();
  preview();
  saveDraft();
}

function undoDecoration() {
  if (!decorationHistory.length) {
    toast('↩️ No hay ninguna decoración para deshacer.');
    return;
  }
  decorations = decorationHistory.pop();
  renderDecorations();
  preview();
  saveDraft();
}

function clearDecorations() {
  if (!decorations.length) return;
  pushDecorationState();
  decorations = [];
  renderDecorations();
  preview();
  saveDraft();
}

function renderDecorations() {
  const box = $('decorationsPreview');
  if (box) {
    box.innerHTML = decorations.length
      ? decorations.map((emoji, i) => `<span class="chosen-decoration" title="Decoración ${i + 1}">${emoji}</span>`).join('')
      : '<span class="decor-empty">Todavía no has elegido decoraciones 💗</span>';
  }

  document.querySelectorAll('.decor-row button').forEach((button) => {
    const emoji = button.dataset.emoji || button.textContent.trim();
    button.classList.toggle('selected', decorations.includes(emoji));
  });

  const undo = $('undoDecoration');
  if (undo) undo.disabled = decorationHistory.length === 0;
}

function preview() {
  const recipient = $('recipient')?.value.trim() || 'alguien especial';
  const message = $('message')?.value.trim() || 'Tus palabras pueden iluminar un día.';

  const recipientPreview = $('previewRecipient');
  const textPreview = $('previewText');
  if (recipientPreview) recipientPreview.textContent = `Para: ${recipient}`;
  if (textPreview) textPreview.textContent = message;

  const previewDecor = $('previewDecorations');
  if (previewDecor) {
    previewDecor.innerHTML = decorations
      .map((emoji, i) => `<span style="--i:${i}">${emoji}</span>`)
      .join('');
  }

  saveDraft();
}

async function submitLetter() {
  const recipient = $('recipient')?.value.trim();
  const message = $('message')?.value.trim();

  if (!recipient || !message) {
    toast('💗 Escribe el correo y el mensaje antes de enviar.');
    return;
  }

  if (!window.supabase || typeof supabaseClient === 'undefined' || !supabaseClient) {
    toast('❌ Supabase no está conectado.');
    return;
  }

  const { data: authData, error: authError } = await supabaseClient.auth.getUser();
  if (authError || !authData?.user) {
    toast('❌ Tu sesión no está activa.');
    return;
  }

  const user = authData.user;
  const subject = message.split(/\s+/).slice(0, 7).join(' ') || 'Una carta especial';

  const payload = {
    sender_id: user.id,
    sender_email: user.email,
    recipient_email: recipient,
    subject,
    body: message,
    status: 'pending',
    decorations
  };

  const { error } = await supabaseClient.from('letters').insert(payload);

  if (error) {
    console.error('LETTER INSERT ERROR:', error);
    toast(`❌ No se pudo enviar: ${error.message}`);
    return;
  }

  localStorage.removeItem(DRAFT_KEY);
  decorations = [];
  decorationHistory = [];
  renderDecorations();
  if ($('recipient')) $('recipient').value = '';
  if ($('message')) $('message').value = '';
  preview();
  toast('💌 ¡Carta enviada a revisión con sus corazones y decoraciones!');
  loadPendingLetters();
}

async function loadPendingLetters() {
  const results = $('adminResults');
  if (!results || typeof supabaseClient === 'undefined') return;

  const { data, error } = await supabaseClient
    .from('letters')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    results.innerHTML = `<p>❌ ${escapeHtml(error.message)}</p>`;
    return;
  }

  if (!data?.length) {
    results.innerHTML = '<p>💌 No hay cartas pendientes de revisión.</p>';
    return;
  }

  results.innerHTML = data.map((letter) => {
    const decos = Array.isArray(letter.decorations) ? letter.decorations.join(' ') : '';
    return `
      <article class="admin-letter" data-id="${escapeHtml(letter.id)}">
        <div class="admin-letter-head">
          <b>💌 ${escapeHtml(letter.sender_email)}</b>
          <span>Para: ${escapeHtml(letter.recipient_email)}</span>
        </div>
        <p>${escapeHtml(letter.body)}</p>
        ${decos ? `<div class="admin-decorations">${escapeHtml(decos)}</div>` : ''}
        <div class="admin-actions">
          <button class="pink-btn" type="button" onclick="reviewLetter('${escapeJs(letter.id)}','approved')">✅ Aprobar</button>
          <button class="soft" type="button" onclick="reviewLetter('${escapeJs(letter.id)}','rejected')">❌ Rechazar</button>
        </div>
      </article>`;
  }).join('');
}

async function reviewLetter(id, status) {
  const { data: authData } = await supabaseClient.auth.getUser();
  if (!authData?.user) return toast('❌ Sesión no activa.');

  const { error } = await supabaseClient
    .from('letters')
    .update({ status, reviewed_by: authData.user.id, reviewed_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    toast(`❌ ${error.message}`);
    return;
  }

  toast(status === 'approved' ? '💗 Carta aprobada.' : 'Carta rechazada.');
  loadPendingLetters();
}

async function showAdmin() {
  const results = $('adminResults');
  if (!results) return;
  results.innerHTML = '<p>⏳ Cargando cartas pendientes...</p>';
  await loadPendingLetters();
  $('admin')?.scrollIntoView({ behavior: 'smooth' });
}

function goToCreate() {
  $('crear')?.scrollIntoView({ behavior: 'smooth' });
}

function toggleTheme() {
  document.body.classList.toggle('soft-mode');
}

function viewGroup() {
  toast('👥 El grupo inicial tendrá 10 miembros.');
}

function joinMembership() {
  toast('👑 La membresía quedará conectada al sistema de pago.');
}

function editProfile() {
  toast('👤 El editor de perfil está preparado para conectarse.');
}

async function logout() {
  try {
    if (typeof supabaseClient !== 'undefined' && supabaseClient) await supabaseClient.auth.signOut();
  } finally {
    window.location.href = 'index.html';
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
}

function escapeJs(value) {
  return String(value ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function loadProfile() {
  if (typeof supabaseClient === 'undefined' || !supabaseClient) return;
  const { data } = await supabaseClient.auth.getUser();
  const user = data?.user;
  if (!user) return;

  const name = user.user_metadata?.name || user.email?.split('@')[0] || 'corazón';
  ['welcomeName','miniName','profileName'].forEach((id) => { if ($(id)) $(id).textContent = name; });
  ['profileEmail'].forEach((id) => { if ($(id)) $(id).textContent = user.email || ''; });

  const isAdmin = await supabaseClient.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (isAdmin?.data?.role === 'admin') loadPendingLetters();
}

// Marcar botones de decoración con su emoji exacto.
document.querySelectorAll('.decor-row button').forEach((button) => {
  button.dataset.emoji = button.textContent.trim();
});

['recipient','message'].forEach((id) => $(id)?.addEventListener('input', preview));

restoreDraft();
renderDecorations();
loadProfile();

window.addEmoji = addEmoji;
window.undoDecoration = undoDecoration;
window.clearDecorations = clearDecorations;
window.preview = preview;
window.submitLetter = submitLetter;
window.showAdmin = showAdmin;
window.reviewLetter = reviewLetter;
window.goToCreate = goToCreate;
window.toggleTheme = toggleTheme;
window.loadUsers = loadUsers;
window.loadReviews = loadReviews;
window.loadMemberships = loadMemberships;
window.startMembershipCheckout = startMembershipCheckout;
window.viewGroup = viewGroup;
window.editProfile = editProfile;
window.viewGroup = viewGroup;
window.joinMembership = joinMembership;
window.editProfile = editProfile;
window.logout = logout;

// ==========================================
// EXPERIENCIA PREMIUM ✨ — movimiento + UX
// ==========================================
(function dashboardExperience(){
  const particles = document.getElementById('particles');
  if(particles){
    const symbols=['💗','💖','💕','✨','🌸','🦋','🌷','⭐','♡','✦'];
    for(let i=0;i<22;i++){
      const el=document.createElement('span');
      el.className='ambient-particle';
      el.textContent=symbols[i%symbols.length];
      el.style.left=(Math.random()*100)+'vw';
      el.style.fontSize=(9+Math.random()*18)+'px';
      el.style.animationDuration=(14+Math.random()*18)+'s';
      el.style.animationDelay=(-Math.random()*25)+'s';
      particles.appendChild(el);
    }
  }

  // Secciones que aparecen con movimiento.
  const items=document.querySelectorAll('.section,.hero-card,.stats>div,.admin-tools>div');
  items.forEach((el,i)=>{el.classList.add('reveal');el.style.transitionDelay=Math.min((i%4)*60,180)+'ms'});
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target)}
    }),{threshold:.1});
    items.forEach(el=>io.observe(el));
  }else items.forEach(el=>el.classList.add('visible'));

  // Menú lateral activo según la sección visible.
  const links=[...document.querySelectorAll('.sidebar nav a[href^="#"]')];
  const sections=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if('IntersectionObserver' in window && sections.length){
    const navIO=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){
        links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));
      }
    }),{rootMargin:'-35% 0px -55% 0px',threshold:0});
    sections.forEach(s=>navIO.observe(s));
  }

  // Contador visual de caracteres para el mensaje.
  const message=document.getElementById('message');
  if(message){
    const counter=document.createElement('small');
    counter.id='messageCounter';
    counter.style.cssText='display:block;text-align:right;color:#9b7c93;font-size:11px;margin-top:-10px;margin-bottom:12px';
    message.parentNode.insertBefore(counter,message.nextSibling);
    const update=()=>counter.textContent=`${message.value.length} caracteres · ${message.value.trim().split(/\\s+/).filter(Boolean).length} palabras`;
    message.addEventListener('input',update);update();
  }

  // Efecto 3D del papel al mover el mouse.
  const paper=document.querySelector('.paper');
  if(paper){
    paper.addEventListener('pointermove',e=>{
      const r=paper.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      paper.style.transform=`perspective(700px) rotateX(${y*-3}deg) rotateY(${x*3}deg) translateY(-5px)`;
    });
    paper.addEventListener('pointerleave',()=>paper.style.transform='');
  }
})();


async function loadUsers() {
  const box = $('adminResults');
  if (!box || typeof supabaseClient === 'undefined' || !supabaseClient) return toast('❌ Supabase no está conectado.');
  box.innerHTML = '<p>⏳ Cargando usuarios...</p>';
  const { data, error } = await supabaseClient.from('profiles').select('id,name,role,created_at').order('created_at',{ascending:false});
  if (error) return box.innerHTML = `<p>❌ ${escapeHtml(error.message)}</p>`;
  box.innerHTML = data?.length ? data.map(u=>`<article class="admin-letter"><div class="admin-letter-head"><b>👤 ${escapeHtml(u.name||'Sin nombre')}</b><span>${escapeHtml(u.role||'member')}</span></div><p>ID: ${escapeHtml(u.id)}</p></article>`).join('') : '<p>👥 No hay usuarios.</p>';
}

async function loadReviews() {
  const box = $('adminResults');
  if (!box || typeof supabaseClient === 'undefined' || !supabaseClient) return toast('❌ Supabase no está conectado.');
  box.innerHTML = '<p>⏳ Cargando reviews...</p>';
  const { data, error } = await supabaseClient.from('reviews').select('*').order('created_at',{ascending:false});
  if (error) return box.innerHTML = `<p>❌ ${escapeHtml(error.message)}</p>`;
  box.innerHTML = data?.length ? data.map(r=>`<article class="admin-letter"><div class="admin-letter-head"><b>⭐ ${escapeHtml(r.rating)}/5</b><span>${escapeHtml(r.created_at||'')}</span></div><p>${escapeHtml(r.comment||'Sin comentario')}</p></article>`).join('') : '<p>⭐ No hay reviews todavía.</p>';
}

async function loadMemberships() {
  const box = $('adminResults');
  if (!box || typeof supabaseClient === 'undefined' || !supabaseClient) return toast('❌ Supabase no está conectado.');
  box.innerHTML = '<p>⏳ Cargando membresías...</p>';
  const { data, error } = await supabaseClient.from('memberships').select('*').order('created_at',{ascending:false});
  if (error) return box.innerHTML = `<p>❌ ${escapeHtml(error.message)}</p>`;
  box.innerHTML = data?.length ? data.map(m=>`<article class="admin-letter"><div class="admin-letter-head"><b>👑 ${escapeHtml(m.status||'inactive')}</b><span>$${escapeHtml(m.price||'20.00')} / mes</span></div><p>Usuario: ${escapeHtml(m.user_id||'')}</p></article>`).join('') : '<p>👑 No hay membresías.</p>';
}

async function startMembershipCheckout() {
  if (typeof supabaseClient === 'undefined' || !supabaseClient) return toast('❌ Supabase no está conectado.');
  const { data:{session} } = await supabaseClient.auth.getSession();
  if (!session?.user) return toast('🔐 Primero inicia sesión para activar tu membresía.');
  toast('💳 Preparando tu pago de $20/mes...');
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout-session`, {method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${session.access_token}`,'apikey':SUPABASE_PUBLISHABLE_KEY},body:'{}'});
    const data = await response.json();
    if (!response.ok || !data.url) { console.error(data); return toast('❌ No pudimos abrir Stripe.'); }
    window.location.href=data.url;
  } catch(e) { console.error(e); toast('❌ Error conectando con Stripe.'); }
}

function viewGroup() {
  $('grupos')?.scrollIntoView({behavior:'smooth'});
}

async function editProfile() {
  if (typeof supabaseClient === 'undefined' || !supabaseClient) return toast('❌ Supabase no está conectado.');
  const {data:{user}} = await supabaseClient.auth.getUser();
  if (!user) return toast('🔐 Inicia sesión primero.');
  const current = user.user_metadata?.name || '';
  const name = window.prompt('¿Qué nombre quieres mostrar?', current);
  if (name === null) return;
  if (!name.trim()) return toast('💗 El nombre no puede estar vacío.');
  const {error}=await supabaseClient.auth.updateUser({data:{name:name.trim()}});
  if(error) return toast(`❌ ${error.message}`);
  await supabaseClient.from('profiles').update({name:name.trim()}).eq('id',user.id);
  await loadProfile();
  toast('✅ Perfil actualizado.');
}
