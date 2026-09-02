const toastEl=document.getElementById('toast');
function getUser(){try{return JSON.parse(localStorage.getItem('cd_user')||'null')}catch(e){return null}}
const user=getUser();
if(user){
 document.getElementById('welcomeName').textContent=user.name;
 document.getElementById('miniName').textContent=user.name;
 document.getElementById('profileName').textContent=user.name;
 document.getElementById('profileEmail').textContent=user.email;
}
document.getElementById('users').textContent=user?'1':'0';
function toast(msg){toastEl.textContent=msg;toastEl.classList.add('show');setTimeout(()=>toastEl.classList.remove('show'),3200)}
function logout(){localStorage.removeItem('cd_user');toast('Has salido de tu espacio. 💌');setTimeout(()=>location.href='index.html',900)}
function preview(){const r=document.getElementById('recipient').value.trim();const m=document.getElementById('message').value.trim();document.getElementById('previewTitle').textContent=r?`Una carta para ${r}`:'Una carta para ti';document.getElementById('previewText').textContent=m||'Tus palabras pueden iluminar un día.'}
function addEmoji(e){const t=document.getElementById('message');t.value+=(t.value?' ':'')+e;preview();t.focus()}
function submitLetter(){const r=document.getElementById('recipient').value.trim(),m=document.getElementById('message').value.trim();if(!r||!m){toast('Completa el destinatario y el mensaje primero. 💗');return}toast('💌 Tu carta quedó enviada a revisión. ¡Gracias por compartir tus palabras!');document.getElementById('message').value='';preview()}
function showAdmin(){setTimeout(()=>document.getElementById('admin').scrollIntoView({behavior:'smooth'}),50)}
function editProfile(){toast('Aquí conectaremos tu editor de perfil y avatar. 👤')}
function toggleTheme(){document.body.classList.toggle('dream');toast('✨ Ambiente cambiado');}
window.addEventListener('scroll',()=>{document.querySelectorAll('.sidebar nav a').forEach(a=>{const id=a.getAttribute('href');if(id&&id.startsWith('#')){const el=document.querySelector(id);if(el){const r=el.getBoundingClientRect();a.classList.toggle('active',r.top<180&&r.bottom>180)}}})}) 
const p=document.getElementById('particles');['💗','✦','✧','🦋','🌸','✨'].forEach(s=>{for(let i=0;i<5;i++){let x=document.createElement('span');x.textContent=s;x.style.position='fixed';x.style.left=Math.random()*100+'vw';x.style.bottom='-30px';x.style.opacity='.35';x.style.fontSize=10+Math.random()*18+'px';x.style.animation=`rise ${12+Math.random()*14}s linear ${-Math.random()*15}s infinite`;p.appendChild(x)}});const st=document.createElement('style');st.textContent='@keyframes rise{to{transform:translateY(-115vh) rotate(360deg);opacity:0}}';document.head.appendChild(st);