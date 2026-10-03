const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("active");

    hamburger.setAttribute("aria-expanded", isOpen);
    hamburger.textContent = isOpen ? "×" : "☰";
});

const mobileLinks = mobileMenu.querySelectorAll("a");

mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.textContent = "☰";
    });
});