const $=s=>document.querySelector(s);
const auth=$("#authDialog"), login=$("#loginDialog"), letterDlg=$("#letterDialog");
function openRegister(){auth.showModal()} function openLogin(){login.showModal()}
$("#registerBtn").onclick=openRegister; $("#startBtn").onclick=openRegister; $("#membershipBtn").onclick=openRegister;
$("#loginBtn").onclick=openLogin; $("#closeDialog").onclick=()=>auth.close(); $("#closeLogin").onclick=()=>login.close(); $("#closeLetter").onclick=()=>letterDlg.close();
$("#writeBtn").onclick=()=>document.querySelector("#crear").scrollIntoView({behavior:"smooth"});
$("#registerForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const user={name:$("#fullName").value.trim(),email:$("#email").value.trim()};
 sessionStorage.setItem("mcd_pending_user",JSON.stringify(user));
 // The secure production version should send these fields to your backend,
 // create the Stripe Checkout Session, and return its URL.
 const api = localStorage.getItem("MCD_API_URL");
 if(api){
   try{
    const r=await fetch(api+"/create-checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:user.name,email:user.email})});
    const data=await r.json(); if(data.url){location.href=data.url;return;}
   }catch(err){console.warn(err)}
 }
 alert("La cuenta está preparada. Para activar el pago real hay que conectar el backend de Stripe. Te dejo todo preparado en la carpeta /server del ZIP.");
 auth.close();
});
$("#loginForm").addEventListener("submit",e=>{e.preventDefault();location.href="dashboard.html"});
const quotes=["“A veces lo que más necesitamos es que alguien nos recuerde que no estamos solos.”","“Una palabra bonita puede convertirse en luz para alguien que está teniendo un día difícil.”","“No guardes para mañana ese mensaje que hoy podría alegrarle el corazón a alguien.”","“Tus palabras tienen un valor que quizá todavía no alcanzas a imaginar.”"];
let qi=0; $("#nextQuote").onclick=()=>{$("#dailyQuote").textContent=quotes[++qi%quotes.length]};
$("#previewLetter").onclick=()=>{ $("#previewTo").textContent="Para: "+($("#letterTo").value||"Alguien especial"); $("#previewMood").textContent=$("#letterMood").value; $("#previewBody").textContent=$("#letterText").value||"Escribe aquí las palabras que llevas en el corazón."; letterDlg.showModal(); };
document.querySelector(".menu-btn").onclick=()=>{document.querySelector(".nav").classList.toggle("mobile-open")};
