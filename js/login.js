const API_URL = "https://script.google.com/macros/s/AKfycbziTjfC3Sh0jor3rLIeUkseqQ6EUIfNjDorS8WQsSuiVsbgH27N0VyO822ezRlz_X-RQw/exec";

const button = document.getElementById("loginBtn");

if(localStorage.getItem("sip3d_user")){
  window.location.href="index.html";
}

function togglePassword(){
  const input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
}

document.addEventListener("keydown",function(e){
  if(e.key==="Enter"){
    login();
  }
});

button.addEventListener("click",login);

async function login(){

  const email=document.getElementById("email").value.trim();
  const password=document.getElementById("password").value.trim();
  const errorMsg=document.getElementById("errorMsg");
  const box=document.getElementById("loginBox");

  errorMsg.textContent="";

  button.disabled=true;
  button.innerHTML="Memproses...";

  try{

    const res=await fetch(API_URL,{
      method:"POST",
      headers:{
        "Content-Type":"text/plain"
      },
      body:JSON.stringify({
        mode:"login",
        email:email,
        password:password
      })
    });

    const result=await res.json();

    if(result.status==="success"){

      localStorage.setItem("sip3d_user",JSON.stringify(result));

      button.innerHTML="Berhasil ✓";

      setTimeout(()=>{
        window.location.href="index.html";
      },800);

    }else{

      errorMsg.textContent="Email atau password salah";
      box.classList.add("shake");

      setTimeout(()=>{
        box.classList.remove("shake");
      },400);

      button.disabled=false;
      button.innerHTML="Login";
    }

  }catch(err){

    console.error(err);

    errorMsg.textContent="Server tidak merespon";
    button.disabled=false;
    button.innerHTML="Login";

  }

}