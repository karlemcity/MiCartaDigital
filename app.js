const $ = (id) => document.getElementById(id);

$("letterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  $("letterMessage").textContent = "💌 Tu carta quedó preparada para revisión. En la versión conectada, llegará a tu panel de administradora.";
  e.target.reset();
});

$("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  $("registerMessage").textContent = "✨ Registro de demostración completado. Para cobrar $20/mes necesitaremos conectar un sistema de pagos y una base de datos.";
  e.target.reset();
});

$("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  $("loginMessage").textContent = "💗 Inicio de sesión de demostración. La versión comercial tendrá cuentas reales.";
});

$("openLetter").addEventListener("click", () => $("modal").classList.add("show"));
$("closeModal").addEventListener("click", () => $("modal").classList.remove("show"));
$("modal").addEventListener("click", (e) => { if (e.target.id === "modal") $("modal").classList.remove("show"); });
