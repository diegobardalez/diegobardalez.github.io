(function () {
  "use strict";

  // Mobile menu toggle
  var menuBtn = document.getElementById("menu-toggle");
  var navLinks = document.getElementById("nav-links");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
      });
    });
  }

  // Nav background + scroll progress
  var nav = document.getElementById("nav");
  var progressBar = document.getElementById("scroll-progress");

  function onScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle("scrolled", scrollTop > 10);
    if (progressBar) {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Cursor spotlight (desktop only, respects prefers-reduced-motion)
  var spotlight = document.getElementById("spotlight");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (spotlight && !reduceMotion && window.matchMedia("(hover: hover)").matches) {
    window.addEventListener(
      "mousemove",
      function (e) {
        spotlight.style.setProperty("--x", e.clientX + "px");
        spotlight.style.setProperty("--y", e.clientY + "px");
      },
      { passive: true }
    );
  }

  // Active nav link via IntersectionObserver
  var navAnchors = document.querySelectorAll("[data-nav]");
  var sections = Array.prototype.map.call(navAnchors, function (a) {
    return document.querySelector(a.getAttribute("href"));
  });
  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = "#" + entry.target.id;
            navAnchors.forEach(function (a) {
              a.classList.toggle("active", a.getAttribute("href") === id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) {
      if (s) navObserver.observe(s);
    });
  }

  // Typing effect for hero role
  var target = document.getElementById("type-target");
  var phrases = [
    "Offensive Security Engineer",
    "Red Team Operator",
    "Pentester",
    "AI / LLM Security Researcher"
  ];

  if (target) {
    var phraseIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function tick() {
      var phrase = phrases[phraseIndex];
      if (!deleting) {
        charIndex++;
        target.textContent = phrase.slice(0, charIndex);
        if (charIndex === phrase.length) {
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
      } else {
        charIndex--;
        target.textContent = phrase.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(tick, deleting ? 30 : 60);
    }
    tick();
  }

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Reveal-on-scroll
  var revealTargets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("in-view");
    });
  }
})();
