const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");

hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
});

const blurs = document.querySelectorAll(".blur");

window.addEventListener("scroll", () => {

    const scrollY = window.pageYOffset;

    blurs.forEach((blur, index) => {

        const speed = 0.3 + (index * 0.05);

        blur.style.transform =
            `translateY(${-scrollY * speed}px)`;

    });

});