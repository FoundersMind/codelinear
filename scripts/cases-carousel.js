(function () {
  const root = document.querySelector("[data-n7-cases-carousel]");
  if (!root) return;

  const viewport = root.querySelector(".n7-cases__viewport");
  const track = root.querySelector(".n7-cases__track");
  const slides = Array.from(root.querySelectorAll(".n7-cases__slide"));
  const dots = Array.from(root.querySelectorAll(".n7-cases__dot"));
  const prevBtn = root.querySelector(".n7-cases__arrow--prev");
  const nextBtn = root.querySelector(".n7-cases__arrow--next");
  const mobileMq = window.matchMedia("(max-width: 991px)");

  if (!viewport || !track || slides.length === 0) return;

  let index = slides.findIndex((slide) => slide.classList.contains("is-active"));
  if (index < 0) index = 0;

  function clearViewportHeight() {
    viewport.style.height = "";
    viewport.style.minHeight = "";
  }

  function syncViewportHeight() {
    if (!mobileMq.matches) {
      clearViewportHeight();
      return;
    }
    clearViewportHeight();
  }

  function goTo(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;

    if (window.N7Motion?.enabled && window.N7Motion.carouselTo) {
      window.N7Motion.carouselTo(track, index);
    } else {
      track.style.transform = "translate3d(" + -index * 100 + "%, 0, 0)";
    }

    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
    });

    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle("n7-cases__dot--active", active);
      dot.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => goTo(index + 1));

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => goTo(i));
  });

  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    }
  });

  const onResize = () => {
    syncViewportHeight();
    goTo(index);
  };

  window.addEventListener("resize", onResize);
  mobileMq.addEventListener("change", onResize);

  goTo(index);
  syncViewportHeight();
})();
