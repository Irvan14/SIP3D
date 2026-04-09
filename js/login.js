const API_URL = "https://script.google.com/macros/s/AKfycbziTjfC3Sh0jor3rLIeUkseqQ6EUIfNjDorS8WQsSuiVsbgH27N0VyO822ezRlz_X-RQw/exec";

// ============================
// AUTO REDIRECT JIKA SUDAH LOGIN
// ============================
if(localStorage.getItem("sip3d_user")){
  window.location.href = "index.html";
}

// ============================
// TOGGLE PASSWORD
// ============================
function togglePassword(){
  const input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
}

// ============================
// ENTER = LOGIN
// ============================
document.addEventListener("keydown", function(e){
  if(e.key === "Enter"){
    login();
  }
});

// ============================
// BUTTON CLICK
// ============================
document.getElementById("loginBtn").addEventListener("click", login);

// ============================
// LOGIN FUNCTION
// ============================
async function login(){

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const errorMsg = document.getElementById("errorMsg");
  const button = document.getElementById("loginBtn");
  const box = document.getElementById("loginBox");

  errorMsg.textContent = "";

  // VALIDASI INPUT
  if(!email || !password){
    errorMsg.textContent = "Email dan password wajib diisi";
    return;
  }

  button.disabled = true;
  button.innerHTML = "Memproses...";

  try{

    console.log("KIRIM LOGIN:", email);

    const res = await fetch(API_URL,{
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

    console.log("STATUS:", res.status);

    const text = await res.text();
    console.log("RAW RESPONSE:", text);

    const result = JSON.parse(text);

    console.log("PARSED RESULT:", result);

    if(result.status === "success"){

      localStorage.setItem("sip3d_user", JSON.stringify(result));

      button.innerHTML = "Berhasil ✓";

      setTimeout(()=>{
        window.location.href = "index.html";
      },800);

    }else{

      errorMsg.textContent = result.message || "Email atau password salah";

      box.classList.add("shake");
      setTimeout(()=> box.classList.remove("shake"), 400);

      button.disabled = false;
      button.innerHTML = "Login";
    }

  }catch(err){

    console.error("LOGIN ERROR:", err);

    errorMsg.textContent = "Server tidak merespon";

    button.disabled = false;
    button.innerHTML = "Login";
  }
}