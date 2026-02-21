function toggleSidebar() {
  document.body.classList.toggle("sidebar-collapsed");

  localStorage.setItem(
    "sidebarState",
    document.body.classList.contains("sidebar-collapsed")
  );
}

document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("sidebarState") === "true") {
    document.body.classList.add("sidebar-collapsed");
  }
});

function toggleProfile(e) {
  e.stopPropagation();
  document.getElementById("profileMenu")
    .classList.toggle("active");
}

document.addEventListener("click", function () {
  document.getElementById("profileMenu")
    ?.classList.remove("active");
});

// Close dropdown when click outside
document.addEventListener("click", function (e) {
  const dropdown = document.querySelector(".profile-dropdown");
  if (!dropdown.contains(e.target)) {
    document.getElementById("profileMenu")?.classList.remove("active");
  }
});