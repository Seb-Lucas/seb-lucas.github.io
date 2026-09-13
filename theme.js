(() => {
  const root = document.documentElement;
  const storageKey = "portfolio-theme";
  const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function getInitialTheme() {
    const saved = localStorage.getItem(storageKey);
    if (saved === "dark" || saved === "light") return saved;
    return systemPreference.matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme !== "dark");
    root.style.colorScheme = theme;
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
    });
  }

  applyTheme(getInitialTheme());

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const next = root.classList.contains("dark") ? "light" : "dark";
        localStorage.setItem(storageKey, next);
        applyTheme(next);
      });
    });

    document.querySelectorAll(".profile-flip").forEach((portrait) => {
      portrait.addEventListener("click", () => {
        const isFlipped = portrait.classList.toggle("is-flipped");
        portrait.setAttribute("aria-pressed", String(isFlipped));
        portrait.setAttribute("aria-label", isFlipped
          ? "Show the front of Sebastian Lucas Tagalog's portrait"
          : "Show the back of Sebastian Lucas Tagalog's portrait");
        portrait.querySelector(".profile-back")?.setAttribute("aria-hidden", String(!isFlipped));
        portrait.querySelector(".profile-front")?.setAttribute("aria-hidden", String(isFlipped));
      });
    });

    const inspectorTrigger = document.querySelector(".inspector-trigger");
    const inspector = document.getElementById("system-inspector");
    if (inspectorTrigger && inspector) {
      const setInspectorState = (isOpen) => {
        inspector.hidden = !isOpen;
        inspectorTrigger.setAttribute("aria-expanded", String(isOpen));
        inspectorTrigger.classList.toggle("is-open", isOpen);
        inspectorTrigger.innerHTML = isOpen
          ? "Close system inspector <span aria-hidden=\"true\">×</span>"
          : "Open system inspector <span aria-hidden=\"true\">+</span>";
      };

      setInspectorState(false);
      inspectorTrigger.addEventListener("click", () => {
        setInspectorState(inspector.hidden);
      });
    }

    const domainDetails = {
      software: { label: "SOFTWARE", title: "Interface + logic", description: "Turns system behavior into usable application logic and interfaces." },
      iot: { label: "IoT", title: "Connected input", description: "Connects physical devices and captures information from the environment." },
      embedded: { label: "EMBEDDED", title: "Device control", description: "Coordinates device-side behavior where hardware and software meet." },
      automation: { label: "AUTOMATION", title: "Workflow", description: "Links sensing, decision-making, and action into a repeatable process." },
      hardware: { label: "HARDWARE", title: "Tangible layer", description: "Provides the physical components that make interaction possible." },
      data: { label: "DATA", title: "System feedback", description: "Returns system information in a form that can be reviewed and acted on." }
    };
    const systemVisual = document.querySelector("[data-system-visual]");
    if (systemVisual) {
      const readout = systemVisual.querySelector("[data-domain-readout]");
      const state = systemVisual.querySelector("[data-system-state]");
      const inspectionLabel = systemVisual.querySelector("[data-node-label]");
      const inspectionTitle = systemVisual.querySelector("[data-node-title]");
      const inspectionDescription = systemVisual.querySelector("[data-node-description]");
      let selectedDomain = "core";
      const activateDomain = (domain) => {
        const details = domainDetails[domain];
        systemVisual.querySelectorAll("[data-domain]").forEach((element) => {
          element.classList.toggle("is-selected", element.dataset.domain === domain);
          if (element.dataset.domain !== "core") element.setAttribute("aria-pressed", String(element.dataset.domain === selectedDomain));
        });
        systemVisual.querySelectorAll(".system-path").forEach((path) => {
          path.classList.toggle("is-active", path.dataset.domain === domain);
        });
        readout.textContent = details ? `${details.label} / ${details.title}` : "CORE / SYSTEM THINKING";
        state.textContent = details ? `System state: ${domain}` : "System state: ready";
        inspectionLabel.textContent = details?.label || "CORE";
        inspectionTitle.textContent = details?.title || "System thinking";
        inspectionDescription.textContent = details?.description || "Select a domain node to inspect its role in the system.";
      };
      systemVisual.querySelectorAll(".system-node[data-domain]").forEach((node) => {
        const preview = () => {
          node.classList.add("is-hovered");
          activateDomain(node.dataset.domain);
        };
        const restoreSelection = () => {
          node.classList.remove("is-hovered");
          activateDomain(selectedDomain);
        };
        node.addEventListener("pointerenter", preview);
        node.addEventListener("pointerleave", restoreSelection);
        node.addEventListener("focus", () => {
          node.classList.add("is-focused");
          activateDomain(node.dataset.domain);
        });
        node.addEventListener("blur", () => {
          node.classList.remove("is-focused");
          activateDomain(selectedDomain);
        });
        node.addEventListener("click", () => {
          selectedDomain = node.dataset.domain;
          activateDomain(selectedDomain);
        });
        node.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            selectedDomain = node.dataset.domain;
            activateDomain(selectedDomain);
          }
        });
      });

      const signalPaths = [...systemVisual.querySelectorAll(".system-path")];
      const signalDots = [...systemVisual.querySelectorAll(".signal-pulse")];
      const signalDomains = signalPaths.map((path) => path.dataset.domain);
      let lastSignalDomain = "";
      const moveSignal = (dot, previousDomain = "") => {
        if (reducedMotion || !signalPaths.length) return;
        const availablePaths = signalPaths.filter((path) => path.dataset.domain !== previousDomain && path.dataset.domain !== lastSignalDomain);
        const path = availablePaths[Math.floor(Math.random() * (availablePaths.length || signalPaths.length))] || signalPaths[0];
        const domain = path.dataset.domain;
        const length = path.getTotalLength();
        const duration = 2600 + Math.random() * 1700;
        const startTime = performance.now();
        lastSignalDomain = domain;
        const animateSignal = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const point = path.getPointAtLength(length * progress);
          dot.setAttribute("cx", point.x);
          dot.setAttribute("cy", point.y);
          path.classList.toggle("is-signaled", progress > .08 && progress < .94);
          systemVisual.querySelector(`.system-node[data-domain="${domain}"]`)?.classList.toggle("is-signaled", progress > .68 && progress < 1);
          if (progress < 1) {
            requestAnimationFrame(animateSignal);
          } else {
            path.classList.remove("is-signaled");
            systemVisual.querySelector(`.system-node[data-domain="${domain}"]`)?.classList.remove("is-signaled");
            window.setTimeout(() => moveSignal(dot, domain), 500 + Math.random() * 900);
          }
        };
        requestAnimationFrame(animateSignal);
      };
      signalDots.forEach((dot, index) => window.setTimeout(() => moveSignal(dot, signalDomains[index - 1] || ""), index * 1100));
    }

    const progress = document.querySelector(".system-progress span");
    if (progress) {
      const updateProgress = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.height = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
      };
      window.addEventListener("scroll", updateProgress, { passive: true });
      updateProgress();
    }

    const architectureDescriptions = {
      RFID: "Identifies the tangible object and passes the detected tag information to the control system.",
      ESP32: "Handles hardware-side communication and device interaction.",
      "Raspberry Pi": "Acts as the main computing console and coordinates the application workflow.",
      Dashboard: "Provides a higher-level interface for viewing and managing system information."
    };
    document.querySelectorAll("[data-architecture]").forEach((node) => {
      node.addEventListener("click", () => {
        const panel = node.closest(".architecture-panel");
        panel.querySelectorAll("[data-architecture]").forEach((item) => item.classList.toggle("is-selected", item === node));
        panel.querySelector("[data-architecture-description]").textContent = architectureDescriptions[node.dataset.architecture];
      });
    });

    // Project cards: user-triggered only. No scroll-reveal animation.
    document.querySelectorAll("[data-project]").forEach((card) => {
      const trigger = card.querySelector(".project-summary");
      const details = card.querySelector(".project-details");
      trigger.addEventListener("click", () => {
        const opening = trigger.getAttribute("aria-expanded") !== "true";
        trigger.setAttribute("aria-expanded", String(opening));
        if (opening) {
          details.hidden = false;
          if (!reducedMotion) {
            details.animate(
              [{ opacity: 0, height: "0px" }, { opacity: 1, height: `${details.scrollHeight}px` }],
              { duration: 250, easing: "ease-out" }
            );
          }
        } else {
          if (!reducedMotion) {
            const animation = details.animate(
              [{ opacity: 1, height: `${details.scrollHeight}px` }, { opacity: 0, height: "0px" }],
              { duration: 250, easing: "ease-out" }
            );
            animation.addEventListener("finish", () => { details.hidden = true; });
          } else {
            details.hidden = true;
          }
        }
      });
    });

    // Copy-to-clipboard confirmation.
    const email = "tagalogsebastian1@gmail.com";
    document.querySelectorAll("[data-copy-email]").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(email);
          const old = button.getAttribute("aria-label");
          button.setAttribute("aria-label", "Email copied");
          button.textContent = "✓";
          setTimeout(() => {
            button.textContent = "⧉";
            button.setAttribute("aria-label", old);
          }, 1200);
        } catch {
          window.location.href = `mailto:${email}`;
        }
      });
    });

    // Command palette: Ctrl+K / Cmd+K.
    const palette = document.getElementById("command-palette");
    const input = document.getElementById("palette-input");
    if (palette && typeof palette.showModal === "function") {
      const openPalette = () => {
        palette.showModal();
        input.value = "";
        requestAnimationFrame(() => input.focus());
      };
      document.addEventListener("keydown", (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
          event.preventDefault();
          if (!palette.open) openPalette();
        }
      });
      document.querySelectorAll("[data-command-target]").forEach((button) => {
        button.addEventListener("click", () => {
          palette.close();
          document.querySelector(button.dataset.commandTarget)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
        });
      });
      document.querySelector("[data-command-copy]")?.addEventListener("click", async () => {
        await navigator.clipboard?.writeText(email);
        palette.close();
      });
      input.addEventListener("input", () => {
        const q = input.value.toLowerCase().trim();
        document.querySelectorAll(".palette-options button").forEach((button) => {
          button.hidden = q && !button.textContent.toLowerCase().includes(q);
        });
      });
    }

    // If real project videos are added later, pause them off-screen.
    const videos = document.querySelectorAll("video[data-project-video]");
    if ("IntersectionObserver" in window && videos.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          if (isIntersecting) target.play().catch(() => {});
          else target.pause();
        });
      }, { threshold: 0.15 });
      videos.forEach((video) => observer.observe(video));
    }
  });

  systemPreference.addEventListener?.("change", (event) => {
    if (!localStorage.getItem(storageKey)) applyTheme(event.matches ? "dark" : "light");
  });
})();