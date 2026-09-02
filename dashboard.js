const pending=JSON.parse(sessionStorage.getItem("mcd_pending_user")||"null");
if(pending) document.querySelector("#userName").textContent=pending.name.split(" ")[0];
document.querySelector("#logout").onclick=()=>{sessionStorage.clear();location.href="index.html"};
