async function loadComponent(id,file){

  const el = document.getElementById(id)

  if(!el) return

  const res = await fetch(file)
  const html = await res.text()

  el.innerHTML = html

}

async function initLayout(){

  await loadComponent("sidebar","components/sidebar.html")
  await loadComponent("topbar","components/topbar.html")
  await loadComponent("bottomnav","components/bottomnav.html")

  // setelah layout siap baru jalankan auth
  if(typeof applyRoleAccess === "function"){
    applyRoleAccess()
  }

}

document.addEventListener("DOMContentLoaded",initLayout)
