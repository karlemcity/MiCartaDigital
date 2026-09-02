const modal=document.getElementById('modal'), content=document.getElementById('modalContent'), toast=document.getElementById('toast');
const particles=document.getElementById('particles');
['💗','✦','✧','🌸','🦋','♡','✨','·'].forEach((s,i)=>{for(let j=0;j<4;j++){const x=document.createElement('span');x.textContent=s;x.style.left=Math.random()*100+'vw';x.style.fontSize=(10+Math.random()*18)+'px';x.style.animationDuration=(12+Math.random()*15)+'s';x.style.animationDelay=(-Math.random()*20)+'s';particles.appendChild(x)}});

function openModal(type){
 modal.classList.add('show');
 if(type==='register') content.innerHTML=`<h2>Crear mi cuenta 💌</h2><p>Comienza tu historia en Carta Digital.</p><form class="form" onsubmit="register(event)"><input id="name" placeholder="Tu nombre" required><input id="email" type="email" placeholder="Correo electrónico" required><input id="pass" type="password" placeholder="Contraseña" required><button class="primary">✨ Crear mi cuenta</button></form><p style="font-size:12px">Al registrarte recibirás tu email de bienvenida (modo demo).</p>`;
 if(type==='login') content.innerHTML=`<h2>Bienvenido de vuelta 💗</h2><p>Entra a tu espacio de cartas.</p><form class="form" onsubmit="login(event)"><input id="email" type="email" placeholder="Correo electrónico" required><input id="pass" type="password" placeholder="Contraseña" required><button class="primary">💌 Entrar</button></form><p style="font-size:13px">¿No tienes cuenta? <a href="#" onclick="openModal('register')">Regístrate</a></p>`;
 if(type==='admin') content.innerHTML=`<h2>Panel Administrativo 👑</h2><p>Vista de demostración para tu prototipo.</p><div class="admin-list"><div class="admin-row"><span>👥 Usuarios registrados</span><b id="usersCount">0</b></div><div class="admin-row"><span>💌 Cartas pendientes</span><b>0</b></div><div class="admin-row"><span>⭐ Reviews</span><b>3</b></div><div class="admin-row"><span>👑 Membresías</span><b>0</b></div></div><button class="glass" style="margin-top:20px" onclick="showToast('Panel listo para conectar a una base de datos 💫')">Configurar sistema</button>`;
}
function closeModal(){modal.classList.remove('show')}
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
function register(e){e.preventDefault();const name=document.getElementById('name').value,email=document.getElementById('email').value;localStorage.setItem('cd_user',JSON.stringify({name,email}));closeModal();showToast(`¡Bienvenido/a ${name}! 💌 Registro creado. Email de bienvenida preparado (demo).`);setTimeout(()=>openModal('login'),800)}
function login(e){e.preventDefault();const u=JSON.parse(localStorage.getItem('cd_user')||'null');closeModal();showToast(u?`¡Hola ${u.name}! Tu espacio está listo 💗`:'Demo: inicia sesión conectando tu backend.');}
function showToast(msg){toast.textContent=msg;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3500)}
function scrollToSection(id){document.getElementById(id).scrollIntoView({behavior:'smooth'})}
function openLetter(){showToast('💌 Imagina tu carta abriéndose y llegando al corazón de alguien especial.')}
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
