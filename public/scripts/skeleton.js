/**
 * Function which loads the navbar and footer into the elements with the id "navbarPlaceholder" 
 * and "footerPlaceholder".
 */
function loadSkeleton(){
    console.log($('#navbarPlaceholder').load('/text/nav.html'));
    console.log($('#footerPlaceholder').load('/text/footer.html'));
}
loadSkeleton();  

/**
 * Function which allows the hamburger menu to be expanded to display the navbar links.
 */
function expand() {
  var nav = document.getElementById("navLinks");
  if (nav.style.display === "block") {
    nav.style.display = "none";
  } else {
    nav.style.display = "block";
  }
}