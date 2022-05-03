function loadSkeleton(){
    console.log($('#navbarPlaceholder').load('../text/nav.html'));
    console.log($('#footerPlaceholder').load('../text/footer.html'));
}
loadSkeleton();  

function expand() {
    var x = document.getElementById("navLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }