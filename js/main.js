/*  immage slider */
function initSlider() {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".s-dot");
  if (!slides.length) return;
  let cur = 0,
    timer;

  // go to slide n
  function go(n) {
    slides[cur].classList.remove("active");
    dots[cur] && dots[cur].classList.remove("active");
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add("active");
    dots[cur] && dots[cur].classList.add("active");
  }

  // auto go to next slide every 4.5s
  function start() {
    timer = setInterval(() => go(cur + 1), 4500);
  }

  // reset timer when user clicks prev/next/dot
  function reset() {
    clearInterval(timer);
    start();
  }

  // initialization
  go(0);
  start();

  // event listeners for prev/next buttons and dots
  document.querySelector(".s-btn.prev")?.addEventListener("click", () => {
    go(cur - 1);
    reset();
  });
  document.querySelector(".s-btn.next")?.addEventListener("click", () => {
    go(cur + 1);
    reset();
  });
  // add click event to dots
  dots.forEach((d, i) =>
    d.addEventListener("click", () => {
      go(i);
      reset();
    }),
  );
}

// skill bars (animate on scroll)
function initSkillBars() {
  const bars = document.querySelectorAll(".skill-fill");
  if (!bars.length) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.w;
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 },
  );
  bars.forEach((b) => obs.observe(b));
}

//  load header and footer using js
function getSiteRoot() {
  const scripts = document.querySelectorAll("script[src]");
  for (const s of scripts) {
    if (s.src.includes("main.js")) {
      return s.src.replace(/js\/main\.js[^]*$/, "");
    }
  }
  return "./";
}

async function loadHeader() {
  const res = await fetch(getSiteRoot() + "header.html");
  const html = await res.text();
  document.getElementById("header-placeholder").outerHTML = html;

  // highlight the active nav link
  const links = document.querySelectorAll(".nav-menu a");
  links.forEach((link) => {
    if (link.href === window.location.href) {
      link.classList.add("active");
    }
  });

  // hamburger toggle
  const toggle = document.getElementById("nav-toggle");
  const navEl = toggle ? toggle.closest("header").querySelector("nav") : null;
  if (toggle && navEl) {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("open");
      navEl.classList.toggle("open");
    });
    // close menu when a link is clicked
    navEl.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        toggle.classList.remove("open");
        navEl.classList.remove("open");
      });
    });
  }
}

async function loadFooter() {
  const res = await fetch(getSiteRoot() + "footer.html");
  const html = await res.text();
  document.getElementById("footer-placeholder").outerHTML = html;
}

/*  contact form validation  */
function initForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  function showErr(id, msg) {
    const el = document.getElementById(id + "-err");
    if (el) el.textContent = msg;
  }
  function clearErrs() {
    document.querySelectorAll(".err").forEach((e) => (e.textContent = ""));
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrs();
    let valid = true;

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");

    if (!name.value.trim()) {
      showErr("name", "Please enter your name.");
      valid = false;
    }
    if (!email.value.trim()) {
      showErr("email", "Please enter your email.");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showErr("email", "Please enter a valid email address.");
      valid = false;
    }
    if (!subject.value.trim()) {
      showErr("subject", "Please enter a subject.");
      valid = false;
    }
    if (!message.value.trim() || message.value.trim().length < 10) {
      showErr("message", "Message must be at least 10 characters.");
      valid = false;
    }

    if (valid) {
      form.style.display = "none";
      document.getElementById("form-success").style.display = "block";
    }
  });
}

loadHeader();
loadFooter();

/* disable nav transition during window resize to prevent animation flash */
let resizeTimer;
window.addEventListener("resize", () => {
  document.body.classList.add("no-transition");
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove("no-transition");
  }, 100);
});

/*  init all  */
document.addEventListener("DOMContentLoaded", () => {
  initSlider();
  initSkillBars();
  initForm();
});
