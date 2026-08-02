(() => {
  const body = document.body;
  const reveal = () => body.classList.add("ready");
  const timeout = body.dataset.page === "main" ? 1600 : 1200;
  const images = [...document.images];

  Promise.allSettled(images.map((image) => (image.decode ? image.decode() : Promise.resolve()))).then(reveal);
  window.addEventListener("load", reveal, { once: true });
  window.setTimeout(reveal, timeout);

  const toggle = document.querySelector(".nav-toggle");
  toggle?.addEventListener("click", () => {
    const open = !body.classList.contains("nav-open");
    body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => body.classList.remove("nav-open"));
  });

  document.querySelectorAll("[data-placeholder]").forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
  });

  const currentPath = location.pathname.replace(/index\.html$/, "").replace(/\/$/, "");
  document.querySelectorAll(".nav-links a[data-path]").forEach((link) => {
    const target = new URL(link.href, location.href).pathname.replace(/index\.html$/, "").replace(/\/$/, "");
    if (target === currentPath) link.setAttribute("aria-current", "page");
  });

  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12 })
    : null;

  document.querySelectorAll("[data-reveal]").forEach((element) => {
    element.classList.add("wait-reveal");
    if (revealObserver) revealObserver.observe(element);
    else element.classList.add("is-visible");
  });

  document.querySelectorAll("[data-tab-group]").forEach((group) => {
    const buttons = [...group.querySelectorAll("[data-tab-target]")];
    const panels = [...group.querySelectorAll("[data-tab-panel]")];
    const activate = (name) => {
      buttons.forEach((button) => {
        const selected = button.dataset.tabTarget === name;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-selected", String(selected));
      });
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.tabPanel !== name;
      });
    };
    buttons.forEach((button) => button.addEventListener("click", () => activate(button.dataset.tabTarget)));
    const initial = buttons.find((button) => button.classList.contains("is-active"))?.dataset.tabTarget || buttons[0]?.dataset.tabTarget;
    if (initial) activate(initial);
  });

  document.querySelectorAll("[data-search-target]").forEach((input) => {
    const selector = input.dataset.searchTarget;
    const items = selector ? [...document.querySelectorAll(selector)] : [];
    const update = () => {
      const query = input.value.trim().toLocaleLowerCase("ko");
      items.forEach((item) => {
        item.hidden = query.length > 0 && !item.textContent.toLocaleLowerCase("ko").includes(query);
      });
    };
    input.addEventListener("input", update);
  });

  document.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      const modal = document.querySelector(button.dataset.openModal);
      if (!modal) return;
      modal.hidden = false;
      modal.querySelector("button, a, input")?.focus();
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest("[data-modal]");
      if (modal) modal.hidden = true;
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    body.classList.remove("nav-open");
    document.querySelectorAll("[data-modal]:not([hidden])").forEach((modal) => {
      modal.hidden = true;
    });
  });
})();
