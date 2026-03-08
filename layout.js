function toggleSidebar(){

  if(window.innerWidth <= 992){

    document.body.classList.toggle("sidebar-open")

    const overlay = document.getElementById("overlay")
    if(overlay){
      overlay.classList.toggle("active")
    }

  }else{

    document.body.classList.toggle("sidebar-collapsed")

  }

}

function closeSidebarMobile(){

  document.body.classList.remove("sidebar-open")

  const overlay = document.getElementById("overlay")
  if(overlay){
    overlay.classList.remove("active")
  }

}

function toggleProfile(e){

  e.stopPropagation()

  const menu = document.getElementById("profileMenu")

  if(menu){
    menu.classList.toggle("active")
  }

}

document.addEventListener("click",function(){

  const menu = document.getElementById("profileMenu")

  if(menu){
    menu.classList.remove("active")
  }

})