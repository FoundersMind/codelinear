/**
 * N7 landing — GSAP motion without shifting Figma/CSS layout.
 * Hero: right media load-in only.
 * Scroll: one-shot entrance tweens (fixed duration) — scroll only triggers play, never scrubs progress.
 * Transforms cleared after tweens so Figma/CSS positions stay intact.
 */
(function () {
  const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const layoutDesktopMq = window.matchMedia("(min-width: 992px)");

  function isLayoutDesktop() {
    return layoutDesktopMq.matches;
  }

  function markReady() {
    document.documentElement.classList.add("n7-motion-ready");
  }

  if (!window.gsap) {
    markReady();
    document.documentElement.classList.add("n7-motion-static");
    return;
  }

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ limitCallbacks: true });
  }

  const enabled = !reducedMq.matches;
  const revealed = new WeakSet();
  const revealRegistry = [];
  const EASE_OUT = "power2.out";
  const EASE_SMOOTH = "power3.out";
  const EASE_UI = "power3.out";

  /** Let tweens finish fully, then hand layout back to CSS (no mid-stagger snap) */
  function motionClear(opacity) {
    return opacity !== false
      ? "opacity,visibility,transform,x,y,scale,xPercent,yPercent"
      : "transform,x,y,scale,xPercent,yPercent";
  }

  /** Nav/chrome — never leave GSAP opacity (keeps link & CTA colors from navbar.css) */
  const NAV_CHROME =
    ".n7-brand, .n7-brand__text, .n7-nav__link, .n7-nav__label, .n7-nav__chevron, .n7-nav__cta .n7-btn";

  /** Page CTAs — no scroll-hide; stay full opacity (Request demo / Contact us) */
  const PAGE_CTAS =
    ".n7-hero__actions .n7-btn, .n7-solutions__cta, .n7-core-banking__cta, " +
    ".n7-paperless__btn-contact, .n7-paperless__btn-demo, .n7-digital__request, .n7-digital__learn, " +
    ".n7-paperless-cta__btn-contact, .n7-paperless-cta__btn-demo";

  function clearTransform(targets) {
    gsap.set(gsap.utils.toArray(targets), { clearProps: "transform" });
  }

  function clearInlineMotion(targets) {
    gsap.set(gsap.utils.toArray(targets), {
      clearProps: "opacity,transform,scale,x,y,xPercent,yPercent",
    });
  }

  /** Drop GSAP inline styles right after each beat so layout/CSS opacity settle instantly */
  function snapMotion(el, opts) {
    const list = gsap.utils.toArray(el).filter(Boolean);
    if (!list.length) return;
    const parts = [];
    if (opts?.transform !== false) {
      parts.push("transform", "x", "y", "scale", "xPercent", "yPercent");
    }
    if (opts?.opacity) {
      parts.push("opacity", "visibility");
    }
    if (parts.length) {
      gsap.set(list, { clearProps: parts.join(",") });
    }
  }

  function resetNavChrome() {
    clearInlineMotion(NAV_CHROME);
  }

  function resetPageCTAs() {
    clearInlineMotion(PAGE_CTAS);
  }

  /** Digital uses absolute Figma coords — never leave transforms on layout nodes */
  const DIGITAL_LAYOUT =
    ".n7-digital__intro, .n7-digital__pairs, .n7-digital__pair, .n7-digital__phone-wrap, .n7-digital__aside, .n7-digital__phone, .n7-digital__stage > .n7-paperless--in-digital";

  function resetDigitalLayout() {
    gsap.utils.toArray(DIGITAL_LAYOUT).forEach((el) => {
      gsap.set(el, { clearProps: "transform,x,y,scale,xPercent,yPercent" });
    });
  }

  function initDigitalMotion() {
    const stage = document.querySelector(".n7-digital__stage");
    const section = document.querySelector(".n7-digital");
    if (!stage || !section || !ScrollTrigger) return;

    const EASE_SMOOTH = "power3.out";
    const EASE_SOFT = "power2.out";
    const useLateral = isLayoutDesktop();

    resetDigitalLayout();
    resetPageCTAs();
    gsap.set(gsap.utils.toArray(DIGITAL_LAYOUT), { opacity: 1 });

    function finishDigital(targets) {
      snapMotion(targets, { transform: true, opacity: true });
      resetDigitalLayout();
      resetPageCTAs();
    }

    /* Section watermarks — N7, swirl vector, decorative 7 */
    [
      { el: stage.querySelector(".n7-digital__marks"), start: "top 94%" },
      { el: stage.querySelector(".n7-digital__vector"), start: "top 90%" },
      { el: stage.querySelector(".n7-digital__seven"), start: "top 88%" },
    ]
      .filter((d) => d.el)
      .forEach(({ el, start }) => {
        const from = { scale: 0.9, autoAlpha: 0 };
        const to = {
          scale: 1,
          autoAlpha: 1,
          duration: 1.05,
          ease: EASE_SMOOTH,
          force3D: true,
          clearProps: motionClear(true),
          onComplete: resetPageCTAs,
        };
        gsap.set(el, { transformOrigin: "50% 50%", force3D: true });
        gsap.set(el, from);
        const tween = gsap.fromTo(el, from, { ...to, paused: true });
        registerScrollReveal(section, el, tween, { start, opts: { opacity: true } });
      });

    const intro = stage.querySelector(".n7-digital__intro");
    if (intro) {
      const introTitle = intro.querySelector(".n7-digital__title");
      const introSub = intro.querySelector(".n7-digital__sub");
      const introLearn = intro.querySelector(".n7-digital__learn");

      gsap.set(intro, { opacity: 1 });
      if (introLearn) {
        gsap.set(introLearn, { opacity: 1, visibility: "visible", clearProps: motionClear(true) });
      }
      if (introTitle) {
        gsap.set(introTitle, { opacity: 1, visibility: "visible", clearProps: motionClear(true) });
      }
      if (introSub) {
        gsap.set(introSub, { opacity: 1, visibility: "visible", clearProps: motionClear(true) });
      }
    }

    gsap.utils.toArray(".n7-digital__pair", stage).forEach((pair) => {
      const phone = pair.querySelector(".n7-digital__phone-wrap");
      const aside = pair.querySelector(".n7-digital__aside");
      if (!phone || !aside) return;

      const title = aside.querySelector(".n7-digital__aside-title");
      const text = aside.querySelector(".n7-digital__aside-text");
      const checks = gsap.utils.toArray(".n7-digital__check-item", aside);
      const isReversed = pair.classList.contains("n7-digital__pair--2");
      const targets = [phone, aside, title, text, ...checks].filter(Boolean);

      if (title) {
        gsap.set(title, { opacity: 1, visibility: "visible", clearProps: motionClear(true) });
      }
      if (text) {
        gsap.set(text, { opacity: 1, visibility: "visible", clearProps: motionClear(true) });
      }
      if (checks.length) {
        gsap.set(checks, { opacity: 1, visibility: "visible", clearProps: motionClear(true) });
      }

      const phoneX = useLateral ? (isReversed ? 56 : -56) : 0;

      const phoneFrom = {
        x: phoneX,
        y: useLateral ? 36 : 52,
        scale: 0.9,
        autoAlpha: 0,
      };
      const phoneTo = {
        x: 0,
        y: 0,
        scale: 1,
        autoAlpha: 1,
        duration: 1.1,
        ease: EASE_SMOOTH,
        force3D: true,
        clearProps: motionClear(true),
        onComplete: () => finishDigital(targets),
      };

      gsap.set(phone, phoneFrom);
      const phoneTween = gsap.fromTo(phone, phoneFrom, { ...phoneTo, paused: true });
      registerScrollReveal(pair, phone, phoneTween, {
        start: "top 88%",
        opts: { opacity: true },
        onSnap: () => finishDigital(targets),
      });
    });

    const inDigitalPaperless = stage.querySelector(".n7-paperless--in-digital");
    if (inDigitalPaperless) {
      const paperRow = inDigitalPaperless.querySelector(".n7-paperless__row");
      const paperTitle = inDigitalPaperless.querySelector(".n7-paperless__title");
      const paperSub = inDigitalPaperless.querySelector(".n7-paperless__sub");
      const paperActions = inDigitalPaperless.querySelector(".n7-paperless__actions");
      const trigger = paperRow || inDigitalPaperless;

      if (paperTitle) {
        gsap.set(paperTitle, { opacity: 1, visibility: "visible", clearProps: motionClear(true) });
      }

    }
  }

  /** Hero right only: photo + both cards in together; left copy & nav static */
  function initHeroMotion() {
    const hero = document.querySelector(".n7-hero");
    if (!hero) return;

    const EASE_CALM = "power2.inOut";
    const lateral = isLayoutDesktop();

    const leftCopy = gsap.utils.toArray(
      ".n7-hero__title, .n7-hero__sub, .n7-hero__actions .n7-btn",
      hero
    );
    const trustedLabel = hero.querySelector(".n7-trusted__label");
    const trustedLogos = gsap.utils.toArray(".n7-trusted__logo", hero);
    const glow = hero.querySelector(".n7-hero__media-glow");
    const photoWrap = hero.querySelector(".n7-hero__photo-wrap");
    const activity = hero.querySelector(".n7-activity-card");
    const balance = hero.querySelector(".n7-balance-card");

    function clearCardInners(card, selectors) {
      if (!card) return;
      const inners = gsap.utils.toArray(selectors, card);
      if (inners.length) {
        gsap.set(inners, { clearProps: "transform,opacity,visibility,x,y,scale" });
      }
    }

    clearCardInners(
      activity,
      ".n7-activity-card__title, .n7-activity-card__tab, .n7-activity-card__row"
    );
    clearCardInners(
      balance,
      ".n7-balance-card__header, .n7-balance-card__body, .n7-balance-card__divider, .n7-balance-card__actions"
    );

    function startHeroAmbient() {
      if (reducedMq.matches || !glow) return;
      gsap.to(glow, {
        opacity: 0.88,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    resetPageCTAs();
    resetNavChrome();
    gsap.set(NAV_CHROME, { opacity: 1, visibility: "visible", clearProps: "transform,opacity,visibility" });
    if (leftCopy.length) {
      gsap.set(leftCopy, { opacity: 1, visibility: "visible", clearProps: motionClear(true) });
    }
    const tl = gsap.timeline({
      onComplete: () => {
        resetPageCTAs();
        resetNavChrome();
        gsap.delayedCall(2.5, startHeroAmbient);
      },
    });

    tl.addLabel("heroRight", 0);

    if (glow) {
      tl.from(
        glow,
        {
          scale: 0.9,
          duration: 1.25,
          ease: EASE_CALM,
          transformOrigin: "50% 50%",
          clearProps: motionClear(false),
        },
        "heroRight"
      );
    }

    if (photoWrap) {
      tl.from(
        photoWrap,
        {
          scale: 0.94,
          y: lateral ? 14 : 20,
          autoAlpha: 0,
          duration: 1.15,
          ease: EASE_CALM,
          transformOrigin: "50% 72%",
          force3D: true,
          immediateRender: false,
          clearProps: motionClear(true),
        },
        "heroRight"
      );
    }

    if (activity) {
      tl.from(
        activity,
        {
          x: lateral ? -32 : 0,
          y: lateral ? 16 : 24,
          autoAlpha: 0,
          duration: 1.15,
          ease: EASE_CALM,
          transformOrigin: "left center",
          force3D: true,
          immediateRender: false,
          clearProps: motionClear(true),
        },
        "heroRight"
      );
    }

    if (balance) {
      tl.from(
        balance,
        {
          x: lateral ? 32 : 0,
          y: lateral ? 16 : 24,
          autoAlpha: 0,
          duration: 1.15,
          ease: EASE_CALM,
          transformOrigin: "right center",
          force3D: true,
          immediateRender: false,
          clearProps: motionClear(true),
        },
        "heroRight"
      );
    }

    if (trustedLabel) {
      tl.from(
        trustedLabel,
        {
          y: 12,
          autoAlpha: 0,
          duration: 0.75,
          ease: EASE_CALM,
          force3D: true,
          immediateRender: false,
          clearProps: motionClear(true),
        },
        "-=0.35"
      );
    }
    if (trustedLogos.length) {
      tl.from(
        trustedLogos,
        {
          y: 10,
          autoAlpha: 0,
          duration: 0.65,
          stagger: 0.06,
          ease: EASE_CALM,
          force3D: true,
          immediateRender: false,
          clearProps: motionClear(true),
        },
        trustedLabel ? "-=0.55" : "-=0.35"
      );
    }

    return tl;
  }

  const N7Motion = {
    enabled,
    carouselTo(track, index) {
      if (!track) return;
      if (!enabled) {
        track.style.transform = "translate3d(" + -index * 100 + "%, 0, 0)";
        return;
      }
      gsap.to(track, {
        xPercent: -100 * index,
        duration: 0.55,
        ease: EASE_UI,
        overwrite: "auto",
        force3D: true,
      });
    },
  };

  window.N7Motion = N7Motion;
  markReady();

  if (!enabled) {
    document.documentElement.classList.add("n7-motion-static");
    return;
  }

  document.documentElement.classList.add("n7-motion-enabled");
  resetNavChrome();
  resetPageCTAs();

  function isPageCTA(el) {
    return el?.matches?.(
      ".n7-btn, .n7-solutions__cta, .n7-core-banking__cta, .n7-digital__request, .n7-digital__learn, " +
        ".n7-paperless__btn-contact, .n7-paperless__btn-demo, .n7-paperless-cta__btn-contact, .n7-paperless-cta__btn-demo"
    );
  }

  function getRevealFrom(opts) {
    const from = { force3D: true };
    if (opts.x != null) from.x = opts.x;
    from.y = opts.y != null ? opts.y : opts.x != null ? 16 : 40;
    if (opts.transformOrigin) from.transformOrigin = opts.transformOrigin;
    if (opts.opacity !== false) from.autoAlpha = 0;
    return from;
  }

  function getRevealTo(opts) {
    const to = {
      x: 0,
      y: 0,
      duration: opts.duration ?? 0.7,
      ease: opts.ease ?? EASE_OUT,
      force3D: true,
      clearProps: motionClear(opts.opacity !== false),
      onComplete: resetPageCTAs,
    };
    if (opts.opacity !== false) to.autoAlpha = 1;
    return to;
  }

  function parseRevealStartLine(start) {
    const match = /^top\s+(\d+(?:\.\d+)?)%\s*$/.exec(String(start).trim());
    if (!match) return null;
    return window.innerHeight * (parseFloat(match[1]) / 100);
  }

  /** True only if the user scrolled past the element (missed trigger while flicking). */
  function isScrolledPastReveal(el) {
    return el.getBoundingClientRect().bottom < 0;
  }

  /** In viewport and at/past the reveal line — safe to play if onEnter was skipped. */
  function shouldPlayReveal(el, start) {
    const line = parseRevealStartLine(start);
    if (line == null) return false;
    const rect = el.getBoundingClientRect();
    return rect.top <= line && rect.bottom > 0;
  }

  function snapRevealComplete(el, opts, onSnap) {
    if (revealed.has(el)) return;
    revealed.add(el);
    gsap.killTweensOf(el);
    gsap.set(el, {
      x: 0,
      y: 0,
      scale: 1,
      ...(opts.opacity !== false ? { autoAlpha: 1, visibility: "visible" } : {}),
      clearProps: motionClear(opts.opacity !== false),
    });
    resetPageCTAs();
    onSnap?.();
  }

  /**
   * Scroll is only a trigger — a paused tween always plays at full duration (never scrubbed).
   */
  function registerScrollReveal(triggerEl, animEl, tween, cfg) {
    const start = cfg.start || "top 88%";
    const opts = cfg.opts || {};
    const onSnap = cfg.onSnap;

    revealRegistry.push({ el: animEl, opts, start, onSnap, tween });

    ScrollTrigger.create({
      trigger: triggerEl,
      start,
      once: true,
      fastScrollEnd: true,
      invalidateOnRefresh: false,
      toggleActions: "play none none none",
      animation: tween,
      onEnter: () => {
        revealed.add(animEl);
      },
      onRefresh(self) {
        if (revealed.has(animEl)) return;
        if (isScrolledPastReveal(animEl)) {
          tween.progress(1).pause();
          snapRevealComplete(animEl, opts, onSnap);
        }
      },
    });
  }

  function flushMissedReveals() {
    revealRegistry.forEach(({ el, opts, start, onSnap, tween }) => {
      if (revealed.has(el)) return;
      if (isScrolledPastReveal(el)) {
        snapRevealComplete(el, opts, onSnap);
        return;
      }
      if (tween && shouldPlayReveal(el, start) && tween.progress() === 0) {
        revealed.add(el);
        tween.play(0);
      }
    });
  }

  /** Watermark — 3D depth toward viewer, then settle (CB7 / N7) */
  function registerWatermarkDepthReveal({
    marksEl,
    perspectiveEl,
    triggerEl,
    onSettle,
    cfg,
    start = "top 78%",
    initialTransform,
    after,
  }) {
    if (!marksEl || !perspectiveEl || !ScrollTrigger) return;

    gsap.set(perspectiveEl, { transformStyle: "preserve-3d" });
    gsap.set(marksEl, {
      transformPerspective: cfg.perspective,
      transformOrigin: cfg.origin,
      force3D: true,
      ...(initialTransform || {}),
    });

    const from = {
      scale: cfg.scaleFrom,
      z: cfg.zFrom,
      rotationX: cfg.rotFrom,
      y: cfg.yFrom,
      autoAlpha: 0,
      filter: "blur(14px)",
    };
    const to = {
      scale: 1,
      z: 0,
      rotationX: 0,
      y: 0,
      autoAlpha: 1,
      filter: "blur(0px)",
      duration: cfg.duration,
      ease: EASE_SMOOTH,
      force3D: true,
      clearProps: "scale,z,rotationX,y,filter",
      onComplete: () => {
        onSettle(cfg);
        resetPageCTAs();
        after?.();
      },
    };

    gsap.set(marksEl, from);
    const tween = gsap.fromTo(marksEl, from, { ...to, paused: true });
    registerScrollReveal(triggerEl, marksEl, tween, {
      start,
      opts: { opacity: true },
      onSnap: () => {
        onSettle(cfg);
        after?.();
      },
    });
  }

  /**
   * One-shot reveal per target — fixed-duration tween; scroll speed does not drive progress.
   */
  function scrollRevealUp(targets, opts) {
    opts = opts || {};
    const scope =
      typeof opts.scope === "string"
        ? document.querySelector(opts.scope)
        : opts.scope || document;
    const els = gsap.utils.toArray(targets, scope || document).filter(Boolean);
    if (!els.length || !ScrollTrigger) return;

    const start = opts.start || "top 88%";
    const stagger = opts.stagger ?? 0;
    const from = getRevealFrom(opts);
    const to = getRevealTo(opts);

    gsap.set(els, from);

    const playBatch = (batch, delayBase) => {
      batch.forEach((el, i) => {
        if (revealed.has(el)) return;
        revealed.add(el);
        gsap.fromTo(el, from, {
          ...to,
          delay: delayBase + (stagger ? i * stagger : 0),
          overwrite: "auto",
        });
      });
    };

    if (stagger > 0 && els.length > 1) {
      ScrollTrigger.batch(els, {
        start,
        once: true,
        fastScrollEnd: true,
        interval: 0.12,
        invalidateOnRefresh: false,
        onEnter: (batch) => playBatch(batch, 0),
        onRefresh() {
          els.forEach((el) => {
            if (revealed.has(el)) return;
            if (isScrolledPastReveal(el)) snapRevealComplete(el, opts);
          });
        },
      });
      els.forEach((el) => revealRegistry.push({ el, opts, start }));
      return;
    }

    els.forEach((el) => {
      const tween = gsap.fromTo(el, from, { ...to, paused: true });
      registerScrollReveal(el, el, tween, { start, opts });
    });
  }

  function scrollReveal(targets, scopeOrOpts, opts) {
    if (typeof scopeOrOpts === "string") {
      scrollRevealUp(targets, { scope: scopeOrOpts, ...(opts || {}) });
      return;
    }
    scrollRevealUp(targets, scopeOrOpts);
  }

  function scrollFade(targets, opts) {
    scrollRevealUp(targets, opts);
  }

  /** Fintech Insights — section below Digital; glow watermark + cards */
  function initInsightsMotion() {
    const section = document.querySelector(".n7-insights");
    if (!section || !ScrollTrigger) return;

    function settleInsightsGlow(el, peakOpacity) {
      gsap.set(el, { opacity: peakOpacity, scale: 0.88, transformOrigin: "50% 50%", force3D: true });
    }

    function pulseInsightsGlow(el, peakOpacity) {
      settleInsightsGlow(el, peakOpacity);
      if (!isLayoutDesktop()) return;
      gsap.fromTo(
        el,
        { opacity: peakOpacity * 0.85, scale: 0.86 },
        {
          opacity: peakOpacity * 1.15,
          scale: 0.92,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          transformOrigin: "50% 50%",
          force3D: true,
        }
      );
    }

    const glow = section.querySelector(".n7-insights__glow-orbit");
    if (glow) {
      const glowPeakOpacity = 0.1;
      const glowFrom = { scale: 0.72, opacity: 0 };
      const glowTo = {
        scale: 0.88,
        opacity: glowPeakOpacity,
        duration: 1.1,
        ease: EASE_SMOOTH,
        force3D: true,
        clearProps: "transform,x,y,scale,xPercent,yPercent",
        onComplete: () => {
          pulseInsightsGlow(glow, glowPeakOpacity);
          resetPageCTAs();
        },
      };
      gsap.set(glow, { transformOrigin: "50% 50%", force3D: true });
      gsap.set(glow, glowFrom);
      const tween = gsap.fromTo(glow, glowFrom, { ...glowTo, paused: true });
      registerScrollReveal(section, glow, tween, {
        start: "top 92%",
        opts: { opacity: false },
        onSnap: () => pulseInsightsGlow(glow, glowPeakOpacity),
      });
    }

    scrollRevealUp(".n7-insights__card-meta", {
      scope: section,
      start: "top 88%",
      stagger: 0.07,
    });

    scrollRevealUp(".n7-insights__card-kicker", {
      scope: section,
      start: "top 90%",
      opacity: false,
      y: 24,
      stagger: 0.05,
    });

    scrollRevealUp(".n7-insights__cta", {
      scope: section,
      start: "top 90%",
      opacity: false,
      y: 20,
    });

    scrollRevealUp(".n7-insights__all-link", {
      scope: section,
      start: "top 92%",
      opacity: false,
      y: 20,
    });

    mm.add("(min-width: 992px)", () => {
      const ctx = gsap.context(() => {
        scrollRevealUp(".n7-insights__card--featured .n7-insights__sitare", {
          scope: section,
          start: "top 88%",
          x: 64,
          y: 24,
          duration: 0.9,
          opacity: false,
          transformOrigin: "right center",
        });

        scrollRevealUp(".n7-insights__card--compact", {
          scope: section,
          start: "top 88%",
          y: 48,
          duration: 0.85,
          stagger: 0.12,
        });
      }, section);
      return () => ctx.revert();
    });

    mm.add("(max-width: 991px)", () => {
      const ctx = gsap.context(() => {
        scrollRevealUp(".n7-insights__card--featured .n7-insights__sitare", {
          scope: section,
          start: "top 88%",
          y: 40,
          duration: 0.85,
          opacity: false,
        });

        scrollRevealUp(".n7-insights__card--compact", {
          scope: section,
          start: "top 88%",
          y: 44,
          duration: 0.85,
          stagger: 0.12,
        });
      }, section);
      return () => ctx.revert();
    });
  }

  function bindHoverLift(selector) {
    gsap.utils.toArray(selector).forEach((el) => {
      el.addEventListener("mouseenter", () => {
        if (isLayoutDesktop()) {
          gsap.to(el, { opacity: 0.92, duration: 0.2, ease: EASE_OUT, overwrite: "auto" });
          return;
        }
        gsap.to(el, {
          y: -5,
          duration: 0.22,
          ease: EASE_OUT,
          overwrite: "auto",
          force3D: true,
        });
      });
      el.addEventListener("mouseleave", () => {
        if (isLayoutDesktop()) {
          gsap.to(el, { opacity: 1, duration: 0.25, ease: EASE_OUT, overwrite: "auto" });
          return;
        }
        gsap.to(el, { y: 0, duration: 0.28, ease: "power2.inOut", overwrite: "auto", force3D: true });
        clearTransform(el);
      });
    });
  }

  function bindPressable(selector) {
    gsap.utils.toArray(selector).forEach((el) => {
      if (isPageCTA(el)) return;

      el.addEventListener("mouseenter", () => {
        if (!isLayoutDesktop()) {
          gsap.to(el, { y: -2, duration: 0.15, ease: EASE_OUT, overwrite: "auto", force3D: true });
        }
      });
      el.addEventListener("mouseleave", () => {
        if (!isLayoutDesktop()) {
          gsap.to(el, { y: 0, duration: 0.18, ease: "power2.inOut", overwrite: "auto", force3D: true });
        }
        clearInlineMotion(el);
      });
    });
  }

  function bindLinkArrow(links, arrowSel) {
    gsap.utils.toArray(links).forEach((link) => {
      const arrow = link.querySelector(arrowSel);
      if (!arrow) return;
      link.addEventListener("mouseenter", () => {
        if (isLayoutDesktop()) {
          gsap.to(arrow, { opacity: 0.75, duration: 0.2, ease: EASE_OUT });
          return;
        }
        gsap.to(arrow, { x: 4, duration: 0.22, ease: EASE_OUT, force3D: true });
      });
      link.addEventListener("mouseleave", () => {
        if (isLayoutDesktop()) {
          gsap.to(arrow, { opacity: 1, duration: 0.22, ease: EASE_OUT });
          return;
        }
        gsap.to(arrow, { x: 0, duration: 0.22, ease: EASE_OUT, force3D: true });
        clearTransform(arrow);
      });
    });
  }

  const mm = gsap.matchMedia();

  initHeroMotion();

  /* ---- Section 2 — Solutions card descriptions ---- */
  scrollRevealUp(".n7-solution-card__desc", { scope: ".n7-solutions", stagger: 0.08 });

  /* ---- Section 3 — Core Banking (CB7 watermark — 3D toward viewer, then settle) ---- */
  function initCoreBankingMarksMotion() {
    const section = document.querySelector(".n7-core-banking");
    const layout = section?.querySelector(".n7-core-banking__layout");
    const marks = section?.querySelector(".n7-core-banking__marks");
    if (!section || !layout || !marks || !ScrollTrigger) return;

    function settleCb7Marks(cfg) {
      const clear = cfg.desktop
        ? "scale,z,rotationX,y,filter"
        : "opacity,visibility,scale,z,rotationX,y,filter";
      gsap.set(marks, {
        xPercent: -50,
        yPercent: cfg.yPercent,
        x: 0,
        y: 0,
        z: 0,
        scale: 1,
        rotationX: 0,
        filter: "none",
        clearProps: clear,
        ...(cfg.desktop ? { autoAlpha: 1 } : {}),
      });
      resetPageCTAs();
    }

    mm.add("(min-width: 992px)", () => {
      const ctx = gsap.context(() => {
        registerWatermarkDepthReveal({
          marksEl: marks,
          perspectiveEl: layout,
          triggerEl: marks,
          onSettle: settleCb7Marks,
          initialTransform: { xPercent: -50, yPercent: 0 },
          cfg: {
            desktop: true,
            yPercent: 0,
            perspective: 1600,
            origin: "50% 88%",
            scaleFrom: 0.38,
            zFrom: -320,
            rotFrom: 24,
            yFrom: 110,
            duration: 1.45,
          },
        });
      }, section);
      return () => ctx.revert();
    });

    mm.add("(max-width: 991px)", () => {
      const ctx = gsap.context(() => {
        if (window.matchMedia("(max-width: 479px)").matches) return;

        registerWatermarkDepthReveal({
          marksEl: marks,
          perspectiveEl: layout,
          triggerEl: marks,
          onSettle: settleCb7Marks,
          initialTransform: { xPercent: -50, yPercent: -50 },
          cfg: {
            desktop: false,
            yPercent: -50,
            perspective: 1200,
            origin: "50% 50%",
            scaleFrom: 0.44,
            zFrom: -200,
            rotFrom: 18,
            yFrom: 72,
            duration: 1.25,
          },
        });
      }, section);
      return () => ctx.revert();
    });
  }

  /** Digital paperless card — N7 watermark first, then subtitle + buttons */
  function initPaperlessN7MarksMotion() {
    const card = document.querySelector(".n7-paperless--in-digital");
    const canvas = card?.querySelector(".n7-paperless__canvas");
    const marksInner = card?.querySelector(".n7-paperless__marks-inner");
    const sub = card?.querySelector(".n7-paperless__sub");
    const actions = card?.querySelector(".n7-paperless__actions");
    if (!card || !canvas || !marksInner || !ScrollTrigger) return;

    function settleN7Marks(cfg) {
      const clear = cfg.desktop
        ? "scale,z,rotationX,y,filter"
        : "opacity,visibility,scale,z,rotationX,y,filter";
      gsap.set(marksInner, {
        x: 0,
        y: 0,
        z: 0,
        scale: 1,
        rotationX: 0,
        filter: "none",
        clearProps: clear,
        ...(cfg.desktop ? { autoAlpha: 1 } : {}),
      });
    }

    function snapPaperlessN7(cfg) {
      settleN7Marks(cfg);
      if (sub) {
        gsap.set(sub, { y: 0, autoAlpha: 1, clearProps: motionClear(true) });
      }
      if (actions) {
        gsap.set(actions, { y: 0, autoAlpha: 1, clearProps: motionClear(true) });
      }
      resetPageCTAs();
    }

    function registerPaperlessN7Sequence(cfg) {
      gsap.set(canvas, { transformStyle: "preserve-3d" });
      gsap.set(marksInner, {
        transformPerspective: cfg.perspective,
        transformOrigin: cfg.origin,
        force3D: true,
      });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: EASE_SMOOTH, force3D: true },
        onComplete: resetPageCTAs,
      });

      const n7From = {
        scale: cfg.scaleFrom,
        z: cfg.zFrom,
        rotationX: cfg.rotFrom,
        y: cfg.yFrom,
        autoAlpha: 0,
        filter: "blur(14px)",
      };
      tl.fromTo(marksInner, n7From, {
        scale: 1,
        z: 0,
        rotationX: 0,
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: cfg.duration,
        clearProps: "scale,z,rotationX,y,filter",
        onComplete: () => settleN7Marks(cfg),
      });

      if (sub) {
        const subFrom = { y: 28, autoAlpha: 0 };
        const subTo = {
          y: 0,
          autoAlpha: 1,
          duration: 0.75,
          clearProps: motionClear(true),
        };
        gsap.set(sub, subFrom);
        tl.fromTo(sub, subFrom, subTo, "+=0.14");
      }

      if (actions) {
        const actFrom = { y: 24, autoAlpha: 0 };
        const actTo = {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          clearProps: motionClear(true),
        };
        gsap.set(actions, actFrom);
        tl.fromTo(actions, actFrom, actTo, "+=0.12");
      }

      registerScrollReveal(marksInner, marksInner, tl, {
        start: "top 78%",
        opts: { opacity: true },
        onSnap: () => snapPaperlessN7(cfg),
      });
    }

    mm.add("(min-width: 992px)", () => {
      const ctx = gsap.context(() => {
        registerPaperlessN7Sequence({
          desktop: true,
          perspective: 1400,
          origin: "50% 72%",
          scaleFrom: 0.4,
          zFrom: -280,
          rotFrom: 22,
          yFrom: 88,
          duration: 1.4,
        });
      }, card);
      return () => ctx.revert();
    });

    mm.add("(max-width: 991px)", () => {
      const ctx = gsap.context(() => {
        registerPaperlessN7Sequence({
          desktop: false,
          perspective: 1100,
          origin: "50% 68%",
          scaleFrom: 0.46,
          zFrom: -190,
          rotFrom: 16,
          yFrom: 56,
          duration: 1.2,
        });
      }, card);
      return () => ctx.revert();
    });
  }

  initCoreBankingMarksMotion();

  scrollRevealUp(".n7-core-banking__sub", {
    scope: ".n7-core-banking",
    opacity: false,
    start: "top 92%",
  });

  mm.add("(min-width: 992px)", () => {
    const ctx = gsap.context(() => {
      scrollRevealUp(".n7-core-banking__media img", {
        scope: ".n7-core-banking",
        start: "top 90%",
        x: 80,
        y: 20,
        duration: 0.9,
        transformOrigin: "right center",
      });
    });
    return () => ctx.revert();
  });

  mm.add("(max-width: 991px)", () => {
    const ctx = gsap.context(() => {
      scrollRevealUp(".n7-core-banking__media img", {
        scope: ".n7-core-banking",
        start: "top 88%",
        y: 48,
        duration: 0.85,
      });
    });
    return () => ctx.revert();
  });

  /* ---- Section 4 — Efficient Core (checklist + subtitle move together; dashboard from left) ---- */
  scrollRevealUp(".n7-efficient-core__checklist", {
    scope: ".n7-efficient-core",
    start: "top 90%",
    opacity: false,
    y: 32,
    duration: 0.75,
  });

  mm.add("(min-width: 992px)", () => {
    const ctx = gsap.context(() => {
      scrollRevealUp(".n7-efficient-core__media img", {
        scope: ".n7-efficient-core",
        start: "top 88%",
        x: -80,
        y: 20,
        duration: 0.9,
        transformOrigin: "left center",
      });
    });
    return () => ctx.revert();
  });

  mm.add("(max-width: 991px)", () => {
    const ctx = gsap.context(() => {
      scrollRevealUp(".n7-efficient-core__media img", {
        scope: ".n7-efficient-core",
        start: "top 88%",
        y: 48,
        duration: 0.85,
      });
    });
    return () => ctx.revert();
  });

  /* ---- Section 5 — Paperless (subtitle + CB7 mark; title & CTAs static) ---- */
  const paperlessSection = "section.n7-paperless--after-dashboard";

  scrollRevealUp(".n7-paperless__sub", {
    scope: paperlessSection,
    opacity: false,
    start: "top 90%",
  });

  mm.add("(min-width: 992px)", () => {
    const ctx = gsap.context(() => {
      scrollRevealUp(".n7-paperless__marks-svg", {
        scope: paperlessSection,
        start: "top 88%",
        x: -72,
        y: 20,
        duration: 0.9,
        opacity: false,
        transformOrigin: "left center",
      });
    });
    return () => ctx.revert();
  });

  mm.add("(max-width: 991px)", () => {
    const ctx = gsap.context(() => {
      scrollRevealUp(".n7-paperless__marks-svg", {
        scope: paperlessSection,
        start: "top 88%",
        y: 48,
        duration: 0.85,
        opacity: false,
      });
    });
    return () => ctx.revert();
  });

  initDigitalMotion();
  initPaperlessN7MarksMotion();
  initInsightsMotion();

  /* ---- Section 9 — Case studies (section + card titles static) ---- */
  scrollRevealUp(".n7-cases__card-copy", {
    scope: ".n7-cases",
    start: "top 88%",
    stagger: 0.08,
  });

  scrollRevealUp(".n7-cases__view-all", {
    scope: ".n7-cases",
    start: "top 92%",
    opacity: false,
    y: 20,
  });

  mm.add("(min-width: 992px)", () => {
    const ctx = gsap.context(() => {
      scrollRevealUp(".n7-cases__viewport", {
        scope: ".n7-cases",
        start: "top 86%",
        y: 56,
        duration: 0.95,
      });
    });
    return () => ctx.revert();
  });

  mm.add("(max-width: 991px)", () => {
    const ctx = gsap.context(() => {
      scrollRevealUp(".n7-cases__viewport", {
        scope: ".n7-cases",
        start: "top 88%",
        y: 44,
        duration: 0.85,
      });
    });
    return () => ctx.revert();
  });

  /* ---- Section 10 — Paperless CTA bar (title static) ---- */
  function initPaperlessCtaMotion() {
    const section = document.querySelector(".n7-paperless-cta");
    if (!section || !ScrollTrigger) return;

    scrollRevealUp(".n7-paperless-cta__sub", {
      scope: section,
      start: "top 88%",
      y: 28,
      duration: 0.75,
    });

    mm.add("(min-width: 992px)", () => {
      const ctx = gsap.context(() => {
        scrollRevealUp(".n7-paperless-cta__actions", {
          scope: section,
          start: "top 88%",
          x: 40,
          y: 16,
          duration: 0.85,
          opacity: false,
          transformOrigin: "right center",
        });
      }, section);
      return () => ctx.revert();
    });

    mm.add("(max-width: 991px)", () => {
      const ctx = gsap.context(() => {
        scrollRevealUp(".n7-paperless-cta__actions", {
          scope: section,
          start: "top 88%",
          y: 32,
          duration: 0.85,
        });
      }, section);
      return () => ctx.revert();
    });
  }

  initPaperlessCtaMotion();

  /* ---- Section 11 — Site footer (blocks move together; N7 logo animated) ---- */
  function initFooterMotion() {
    const footer = document.querySelector(".n7-site-footer");
    if (!footer || !ScrollTrigger) return;

    const stage = footer.querySelector(".n7-site-footer__stage");
    const trigger = stage || footer;
    const logo = footer.querySelector(".n7-site-footer__logo");
    const glow = footer.querySelector(".n7-site-footer__glow-orbit");

    if (glow) {
      const glowPeakOpacity = 0.05;
      const glowFrom = { scale: 0.72, opacity: 0 };
      const glowTo = {
        scale: 0.88,
        opacity: glowPeakOpacity,
        duration: 1.15,
        ease: EASE_SMOOTH,
        force3D: true,
        clearProps: "transform,x,y,scale,xPercent,yPercent",
        onComplete: () => {
          gsap.set(glow, { opacity: glowPeakOpacity });
          resetPageCTAs();
        },
      };
      gsap.set(glow, { transformOrigin: "50% 50%", force3D: true });
      gsap.set(glow, glowFrom);
      const glowTween = gsap.fromTo(glow, glowFrom, { ...glowTo, paused: true });
      registerScrollReveal(footer, glow, glowTween, {
        start: "top 92%",
        opts: { opacity: false },
        onSnap: () => gsap.set(glow, { opacity: glowPeakOpacity, scale: 0.88 }),
      });
    }

    if (logo) {
      const logoFrom = { scale: 0.9, autoAlpha: 0, y: 28 };
      const logoTo = {
        x: 0,
        y: 0,
        scale: 1,
        autoAlpha: 1,
        duration: 1,
        ease: EASE_SMOOTH,
        force3D: true,
        clearProps: motionClear(true),
        onComplete: resetPageCTAs,
      };
      gsap.set(logo, { transformOrigin: "left top", force3D: true });
      gsap.set(logo, logoFrom);
      const logoTween = gsap.fromTo(logo, logoFrom, { ...logoTo, paused: true });
      registerScrollReveal(trigger, logo, logoTween, { start: "top 88%", opts: { opacity: true } });
    }

    scrollRevealUp(".n7-site-footer__grid", {
      scope: footer,
      start: "top 90%",
      opacity: false,
      y: 32,
      duration: 0.75,
    });

    scrollRevealUp(".n7-site-footer__copy", {
      scope: footer,
      start: "top 92%",
      opacity: false,
      y: 20,
      duration: 0.7,
    });
  }

  initFooterMotion();

  const casesTrack = document.querySelector(".n7-cases__track");
  if (casesTrack) gsap.set(casesTrack, { xPercent: 0, force3D: true });

  resetPageCTAs();

  ScrollTrigger.refresh();
  flushMissedReveals();

  let revealFlushTimer;
  window.addEventListener(
    "scroll",
    () => {
      clearTimeout(revealFlushTimer);
      revealFlushTimer = setTimeout(flushMissedReveals, 120);
    },
    { passive: true }
  );

  mm.add("(min-width: 992px)", () => {
    const glow = gsap.fromTo(
      ".n7-site-footer__glow-orbit",
      { opacity: 0.04, scale: 0.88 },
      {
        opacity: 0.065,
        scale: 0.9,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "50% 50%",
        force3D: true,
      }
    );
    return () => glow.kill();
  });

  /* ---- Hover (no positional shift on desktop; exclude nav CTA) ---- */
  bindPressable(".n7-btn:not(.n7-btn--nav-cta)");
  bindHoverLift(".n7-solution-card");
  bindHoverLift(".n7-insights__card");
  bindHoverLift(".n7-cases__card--active, .n7-cases__panel");

  bindLinkArrow(".n7-core-banking__link", ".n7-core-banking__link-arrow");
  bindLinkArrow(".n7-site-footer__link", ".n7-site-footer__link-arrow");

  gsap.utils.toArray(".n7-insights__all-link, .n7-cases__view-all").forEach((link) => {
    link.addEventListener("mouseenter", () => {
      if (isLayoutDesktop()) {
        gsap.to(link, { opacity: 0.8, duration: 0.2, ease: EASE_OUT });
        return;
      }
      gsap.to(link, { x: 5, duration: 0.22, ease: EASE_OUT, force3D: true });
    });
    link.addEventListener("mouseleave", () => {
      if (isLayoutDesktop()) {
        gsap.to(link, { opacity: 1, duration: 0.22, ease: EASE_OUT });
        return;
      }
      gsap.to(link, { x: 0, duration: 0.22, ease: EASE_OUT, force3D: true });
      clearTransform(link);
    });
  });

  gsap.utils.toArray(".n7-cases__arrow").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      gsap.to(btn, { scale: 1.06, duration: 0.2, ease: EASE_OUT, force3D: true });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { scale: 1, duration: 0.22, ease: EASE_OUT, force3D: true });
      clearTransform(btn);
    });
  });

  /* ---- Mobile nav only ---- */
  const nav = document.querySelector(".n7-nav");
  const navToggle = document.querySelector("[data-n7-nav-toggle]");
  const navItems = nav ? gsap.utils.toArray(".n7-nav__link, .n7-nav__cta .n7-btn", nav) : [];

  navToggle?.addEventListener("click", () => {
    if (isLayoutDesktop()) return;

    requestAnimationFrame(() => {
      if (!nav?.classList.contains("is-open")) {
        resetNavChrome();
        return;
      }
      gsap.from(navItems, {
        x: -12,
        duration: 0.35,
        stagger: 0.05,
        ease: EASE_OUT,
        force3D: true,
        overwrite: "auto",
        onComplete: () => resetNavChrome(),
      });
    });
  });

  layoutDesktopMq.addEventListener("change", () => {
    ScrollTrigger?.refresh();
    flushMissedReveals();
    clearTransform(
      [
        ".n7-hero__title",
        ".n7-hero__sub",
        ".n7-hero__photo-wrap",
        ".n7-activity-card",
        ".n7-balance-card",
        ".n7-solution-card",
        ".n7-insights__glow-orbit",
        ".n7-insights__card--compact",
        ".n7-insights__card--featured .n7-insights__sitare",
        ".n7-insights__card-kicker",
        ".n7-insights__card-meta",
        ".n7-digital__marks",
        ".n7-digital__vector",
        ".n7-digital__seven",
        ".n7-paperless--in-digital .n7-paperless__marks-inner",
        ".n7-paperless--in-digital .n7-paperless__sub",
        ".n7-paperless--in-digital .n7-paperless__actions",
        "section.n7-paperless--after-dashboard .n7-paperless__marks-svg",
        "section.n7-paperless--after-dashboard .n7-paperless__sub",
        ".n7-cases__viewport",
        ".n7-cases__card-copy",
        ".n7-paperless-cta__sub",
        ".n7-paperless-cta__actions",
        ".n7-site-footer__glow-orbit",
        ".n7-site-footer__logo",
        ".n7-site-footer__grid",
        ".n7-site-footer__copy",
        ".n7-core-banking__marks",
        ".n7-core-banking__sub",
        ".n7-core-banking__media img",
        ".n7-core-banking__media",
      ].join(", ")
    );
    resetDigitalLayout();
    resetNavChrome();
  });

  reducedMq.addEventListener("change", () => {
    if (reducedMq.matches) window.location.reload();
  });

  window.addEventListener(
    "load",
    () => {
      ScrollTrigger?.refresh();
      flushMissedReveals();
      resetDigitalLayout();
      resetNavChrome();
      resetPageCTAs();
      clearTransform(".n7-activity-card, .n7-balance-card, .n7-hero__photo-wrap");
      if (isLayoutDesktop()) {
        clearTransform(".n7-hero__photo-wrap, .n7-activity-card, .n7-balance-card");
      }
    },
    { once: true }
  );
})();
