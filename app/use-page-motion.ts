"use client";

import { useEffect, useRef } from "react";

export function usePageMotion(paused: boolean) {
  const rootRef = useRef<HTMLElement>(null);
  const revealed = useRef(new WeakSet<Element>());

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    let frame = 0;
    const sections = Array.from(root.querySelectorAll<HTMLElement>("#services, #why-bcm, #how-it-works, #contact"));
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>(".nav-links a"));

    const updateScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty("--scroll-progress", String(height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0));
      root.dataset.scrolled = String(window.scrollY > 350);
      let active = "";
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= window.innerHeight * .4) active = `#${section.id}`;
      }
      for (const link of links) {
        if (link.getAttribute("href") === active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateScroll); };
    const onPreference = () => {
      root.dataset.motionReduced = String(preference.matches);
      if (preference.matches) animations.forEach(animation => animation.cancel());
    };

    // Content stays visible without JavaScript; animate only on entering the viewport.
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        element.dataset.inView = String(entry.isIntersecting);
        if (!entry.isIntersecting || !element.hasAttribute("data-reveal") || revealed.current.has(element)) continue;
        revealed.current.add(element);
        if (paused || preference.matches) continue;
        const animation = element.animate(
          [{ opacity: 0, translate: "0 30px" }, { opacity: 1, translate: "0 0" }],
          { duration: 720, delay: Number(element.dataset.delay || 0), easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" },
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { threshold: .12 });

    root.querySelectorAll<HTMLElement>("[data-reveal], [data-motion-scene]").forEach(element => observer.observe(element));
    const resizeObserver = new ResizeObserver(onScroll);
    resizeObserver.observe(root);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    preference.addEventListener("change", onPreference);
    onPreference();
    updateScroll();

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      cancelAnimationFrame(frame);
      animations.forEach(animation => animation.cancel());
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      preference.removeEventListener("change", onPreference);
    };
  }, [paused]);

  return rootRef;
}
