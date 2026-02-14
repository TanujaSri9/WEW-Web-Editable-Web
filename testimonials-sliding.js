/* ============================================================
   TESTIMONIALS MANUAL SLIDER (JARVIS CLEAN VERSION)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".testimonial-card");
    const dots = document.querySelectorAll(".pagination-dot");

    let activeIndex = 0;

    // Show the chosen testimonial
    function activateTestimonial(index) {
        activeIndex = index;

        cards.forEach((card, i) => {
            card.classList.toggle("active", i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
    }

    // Pagination click events
    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            activateTestimonial(i);
        });
    });

    // Initialize
    activateTestimonial(0);
});
