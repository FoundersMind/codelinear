(function () {
  const toggle = document.querySelector("[data-n7-nav-toggle]");
  const nav = document.querySelector(".n7-nav");
  const DESKTOP_BREAKPOINT = 992;

  if (!toggle || !nav) return;

  function setMenuOpen(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("n7-nav-menu-open", open);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  toggle.addEventListener("click", () => {
    setMenuOpen(!nav.classList.contains("is-open"));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) closeMenu();
    },
    { passive: true }
  );

  nav.querySelectorAll(".n7-nav__link, .n7-nav__cta a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < DESKTOP_BREAKPOINT) closeMenu();
    });
  });
})();
