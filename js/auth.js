const user = JSON.parse(localStorage.getItem("sip3d_user"));

// Kalau belum login
if (!user) {
  window.location.href = "login.html";
}

// Inject nama user
document.addEventListener("DOMContentLoaded", () => {

  const userNameElement = document.getElementById("loggedUser");
  if (userNameElement) {
    userNameElement.textContent = user.nama + " (" + user.role + ")";
  }

  applyRoleAccess();
});

function logout() {
  localStorage.removeItem("sip3d_user");
  window.location.href = "login.html";
}

// ================= ROLE CONTROL =================

function applyRoleAccess() {

  const role = user.role;
  // Hide menu berdasarkan role
  const menuData = document.querySelector('a[href="kegiatan.html"]')?.parentElement;
  const menuInput = document.querySelector('a[href="input.html"]')?.parentElement;

    if (role === "viewer") {
    if (menuData) menuData.style.display = "none";
    if (menuInput) menuInput.style.display = "none";
    }

    if (role === "operator") {
    if (menuData) menuData.style.display = "none";
    }
  // Viewer hanya boleh dashboard
  if (role === "viewer") {

    if (window.location.pathname.includes("input.html") ||
        window.location.pathname.includes("kegiatan.html")) {

      alert("Anda tidak memiliki akses ke halaman ini.");
      window.location.href = "index.html";
    }
  }

  // Operator tidak boleh akses Data Kegiatan
  if (role === "operator") {

    if (window.location.pathname.includes("kegiatan.html")) {

      alert("Anda tidak memiliki akses ke halaman ini.");
      window.location.href = "index.html";
    }
  }
}