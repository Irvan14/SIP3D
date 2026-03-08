const routes = {

  "index.html": initDashboard,
  "kegiatan.html": initKegiatan,
  "input.html": initInput,
  "dokumen.html": initDokumen

}

async function initRouter(){

  const page = window.location.pathname.split("/").pop()

  const route = routes[page]

  if(route){
    await route()
  }

}

document.addEventListener("DOMContentLoaded", initRouter)