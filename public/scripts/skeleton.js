/**
 * Dynamically loads the navbar and footer into every web page for consistency of user experience.
 */
function loadSkeleton(){
    console.log($('#navbarPlaceholder').load('/text/nav.html'));
    console.log($('#footerPlaceholder').load('/text/footer.html'));
}
loadSkeleton();  

/**
 * Expands the hamburger menu options or hides them depending on current state.
 */
function expand() {
  var nav = document.getElementById("navLinks");
  if (nav.style.display === "block") {
    nav.style.display = "none";
  } else {
    nav.style.display = "block";
  }
}