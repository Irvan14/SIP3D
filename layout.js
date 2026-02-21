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
