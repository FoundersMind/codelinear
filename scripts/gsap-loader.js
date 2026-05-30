/**
 * Loads GSAP + ScrollTrigger only when needed (not on prefers-reduced-motion).
 * Defers ~115 KiB off the critical path so Lighthouse "unused JS" improves;
 * scroll/hero motion unchanged once scripts load.
 */
(function () {
  const GSAP_URL = "https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js";
  const ST_URL = "https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/ScrollTrigger.min.js";
  const MOTION_URL = "./scripts/motion.js";

  const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) {
        resolve();
        return;
      }
      var el = document.createElement("script");
      el.src = src;
      el.async = true;
      el.onload = function () {
        resolve();
      };
      el.onerror = reject;
      document.body.appendChild(el);
    });
  }

  function carouselFallback(track, index) {
    if (!track) return;
    track.style.transform = "translate3d(" + -index * 100 + "%, 0, 0)";
  }

  window.N7Motion = {
    enabled: !reducedMq.matches,
    carouselTo: carouselFallback,
  };

  var started = false;

  function boot() {
    if (started) return;
    started = true;

    if (reducedMq.matches) {
      loadScript(MOTION_URL).catch(function () {
        document.documentElement.classList.add("n7-motion-ready", "n7-motion-static");
      });
      return;
    }

    loadScript(GSAP_URL)
      .then(function () {
        return loadScript(ST_URL);
      })
      .then(function () {
        return loadScript(MOTION_URL);
      })
      .catch(function () {
        document.documentElement.classList.add("n7-motion-ready", "n7-motion-static");
      });
  }

  if (reducedMq.matches) {
    boot();
    return;
  }

  var once = { passive: true, once: true };
  window.addEventListener("scroll", boot, once);
  window.addEventListener("pointerdown", boot, once);
  window.addEventListener("keydown", boot, once);

  if ("requestIdleCallback" in window) {
    requestIdleCallback(boot, { timeout: 2000 });
  } else {
    window.addEventListener("load", function () {
      setTimeout(boot, 1200);
    }, { once: true });
  }
})();
