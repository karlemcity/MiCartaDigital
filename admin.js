const app=document.getElementById('adminApp');
const OWNER_EMAIL='kimiozmi@gmail.com';
const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

function loginScreen(message=''){
 app.innerHTML=`<div class="login-wrap"><div class="login-card"><div class="crown">👑</div><div class="eyebrow">MI CARTA DIGITAL · ÁREA PRIVADA</div><h1>Panel Administrativo</h1><p class="muted">Esta entrada es únicamente para la administradora.</p>${message?`<div class="notice">${esc(message)}</div>`:''}<form id="adminLogin"><label>Correo de administradora</label><input id="adminEmail" type="email" value="${esc(OWNER_EMAIL)}" autocomplete="username" readonly><label>Contraseña</label><input id="adminPass" type="password" autocomplete="current-password" required placeholder="Tu contraseña"><button class="btn primary" type="submit">🔐 Entrar al panel</button></form><p class="tiny">La cuenta debe estar autenticada y tener el rol <b>admin</b> en Supabase.</p></div></div>`;
 document.getElementById('adminLogin').addEventListener('submit',adminLogin);
}

async function adminLogin(e){
 e.preventDefault();
 const pass=document.getElementById('adminPass').value;
 const btn=e.currentTarget.querySelector('button'); btn.disabled=true; btn.textContent='Verificando…';
 const {error}=await supabaseClient.auth.signInWithPassword({email:OWNER_EMAIL,password:pass});
 if(error){loginScreen('No se pudo iniciar sesión. Revisa tu contraseña.');return;}
 await boot();
}

async function boot(){
 const {data:{user}}=await supabaseClient.auth.getUser();
 if(!user){loginScreen();return;}
 if((user.email||'').toLowerCase()!==OWNER_EMAIL){await supabaseClient.auth.signOut();loginScreen('⛔ Esta cuenta no tiene permiso para entrar.');return;}
 const {data:profile,error}=await supabaseClient.from('profiles').select('name,role').eq('id',user.id).maybeSingle();
 if(error){loginScreen('⚠️ No se pudo verificar tu perfil administrativo. Recarga la página e inténtalo de nuevo.');return;}
 if((user.email||'').toLowerCase()===OWNER_EMAIL && profile?.role==='admin'){
   // Owner verified by Auth email + database role.
 } else {await supabaseClient.auth.signOut();loginScreen('⛔ Esta cuenta no tiene acceso al Panel Administrativo.');return;}
 app.innerHTML=`<div class="top"><div><div class="eyebrow">MI CARTA DIGITAL · PRIVADO</div><h1>👑 Panel administrativo</h1><p class="muted">Bienvenida, ${esc(profile.name||'Administradora')}. Solo tu cuenta puede ver esta información.</p></div><button class="btn danger" id="logout">🚪 Salir</button></div><section class="grid"><div class="card stat"><span>👥 Usuarios</span><b id="users">—</b></div><div class="card stat"><span>👀 Visitas</span><b id="visits">—</b></div><div class="card stat"><span>💳 Compras</span><b id="purchases">—</b></div><div class="card stat"><span>🚨 Seguridad</span><b id="security">—</b></div></section><section class="card summary"><h2>🔎 Centro de actividad</h2><p class="muted">Aquí puedes revisar registros, entradas, compras y señales reportadas por la página.</p><div class="chips"><span>🔐 Acceso protegido</span><span>🛡️ RLS activo</span><span>👑 Solo administradora</span></div></section><section class="layout"><div class="card"><h2>👥 Personas registradas</h2><div id="usersList" class="list">Cargando…</div></div><div class="card"><h2>🛡️ Actividad y seguridad</h2><div id="events" class="list">Cargando…</div></div></section>`;
 document.getElementById('logout').onclick=async()=>{await supabaseClient.auth.signOut();loginScreen('Sesión cerrada.');};
 await loadDashboard();
}

async function loadDashboard(){
 const [{data:users,error:usersError},{data:events,error:eventsError}]=await Promise.all([
  supabaseClient.from('profiles').select('id,name,role,created_at').order('created_at',{ascending:false}),
  supabaseClient.from('site_events').select('*').order('created_at',{ascending:false}).limit(300)
 ]);
 if(usersError||eventsError){document.getElementById('events').innerHTML='<div class="empty">No se pudo cargar toda la actividad. Revisa las políticas de Supabase.</div>';return;}
 const ev=events||[];
 document.getElementById('users').textContent=(users||[]).length;
 document.getElementById('visits').textContent=ev.filter(x=>x.event_type==='page_view').length;
 document.getElementById('purchases').textContent=ev.filter(x=>x.event_type==='purchase').length;
 document.getElementById('security').textContent=ev.filter(x=>x.event_type==='security_signal').length;
 document.getElementById('usersList').innerHTML=(users||[]).map(u=>`<div class="row"><div class="row-title"><b>👤 ${esc(u.name||'Sin nombre')}</b><span class="pill">${esc(u.role||'member')}</span></div><div class="muted">Registro: ${new Date(u.created_at).toLocaleString()}</div><div class="muted mono">ID: ${esc(u.id)}</div></div>`).join('')||'<div class="empty">No hay usuarios.</div>';
 document.getElementById('events').innerHTML=ev.map(e=>`<div class="event"><div><span class="pill">${esc(e.event_type)}</span> <b>${esc(e.email||'Visitante')}</b></div><div class="muted">${new Date(e.created_at).toLocaleString()}</div><div class="muted">🌐 IP: ${esc(e.ip_address||'No disponible')}</div><div class="muted">🖥️ Host: ${esc(e.host||'No disponible')}</div><div class="muted agent">${esc(e.user_agent||'')}</div></div>`).join('')||'<div class="empty">No hay actividad registrada.</div>';
}
boot();
