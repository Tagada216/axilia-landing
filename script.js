// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", function () {
  // Navigation fluide
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Gestion du formulaire Mailchimp
  const form = document.getElementById("mc-embedded-subscribe-form");
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;

  form.addEventListener("submit", function (e) {
    // Validation côté client
    const email = form.querySelector('input[name="EMAIL"]').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      e.preventDefault();
      showNotification("Veuillez entrer une adresse email valide.", "error");
      return;
    }

    // Ajouter un état de chargement
    submitButton.textContent = "Inscription en cours...";
    submitButton.disabled = true;
    submitButton.classList.add("loading");

    // Le formulaire se soumettra normalement vers Mailchimp
    setTimeout(() => {
      showNotification(
        "Merci ! Votre inscription a été enregistrée.",
        "success"
      );
      form.reset();
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      submitButton.classList.remove("loading");
    }, 2000);
  });

  // Système de notifications
  function showNotification(message, type = "info") {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach((notification) => notification.remove());

    // Créer la nouvelle notification
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Styles pour la notification
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "1rem 1.5rem",
      borderRadius: "0.75rem",
      color: "white",
      fontSize: "0.9rem",
      fontWeight: "500",
      zIndex: "1000",
      opacity: "0",
      transform: "translateX(100%)",
      transition: "all 0.3s ease",
      maxWidth: "300px",
      wordWrap: "break-word",
    });

    // Couleurs selon le type
    switch (type) {
      case "success":
        notification.style.background =
          "linear-gradient(135deg, #10b981, #059669)";
        break;
      case "error":
        notification.style.background =
          "linear-gradient(135deg, #ef4444, #dc2626)";
        break;
      default:
        notification.style.background =
          "linear-gradient(135deg, #3b82f6, #2563eb)";
    }

    document.body.appendChild(notification);

    // Animation d'entrée
    setTimeout(() => {
      notification.style.opacity = "1";
      notification.style.transform = "translateX(0)";
    }, 100);

    // Animation de sortie et suppression
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateX(100%)";
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  // Animation d'apparition des sections au scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observer toutes les sections
  const sections = document.querySelectorAll(".features, .target, .newsletter");
  sections.forEach((section) => {
    observer.observe(section);
  });

  // Parallax léger pour les formes flottantes
  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll(".shape");

    shapes.forEach((shape, index) => {
      const speed = 0.5 + index * 0.1;
      const yPos = -(scrolled * speed);
      shape.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateParallax);
    }
  }

  // Activer le parallax seulement sur les écrans larges
  if (window.innerWidth > 768) {
    window.addEventListener("scroll", requestTick);
  }

  // Gestion du redimensionnement de la fenêtre
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 768) {
      window.removeEventListener("scroll", requestTick);
    } else {
      window.addEventListener("scroll", requestTick);
    }
  });

  // Easter egg : Animation spéciale sur le titre au clic
  const heroTitle = document.querySelector(".hero-title");
  let clickCount = 0;

  heroTitle.addEventListener("click", () => {
    clickCount++;

    if (clickCount === 5) {
      heroTitle.style.animation = "none";
      setTimeout(() => {
        heroTitle.style.animation =
          "gradient 0.5s ease-in-out 3, pulse 0.3s ease-in-out 2";
      }, 10);

      showNotification("🎉 Merci de votre intérêt pour Axilia !", "success");
      clickCount = 0;
    }
  });

  // Animation pulse pour l'easter egg
  const style = document.createElement("style");
  style.textContent = `
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
    `;
  document.head.appendChild(style);

  // Détection de la préférence pour les animations réduites
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (prefersReducedMotion.matches) {
    document.body.classList.add("reduced-motion");
    window.removeEventListener("scroll", requestTick);
  }

  // Gestion du focus au clavier pour l'accessibilité
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      document.body.classList.add("keyboard-navigation");
    }
  });

  document.addEventListener("mousedown", () => {
    document.body.classList.remove("keyboard-navigation");
  });

  console.log("✨ Axilia landing page simplifiée chargée avec succès !");
});

// Styles CSS additionnels pour l'accessibilité au clavier
const keyboardStyles = document.createElement("style");
keyboardStyles.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid #3b82f6 !important;
        outline-offset: 2px !important;
    }
    
    .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    .loading {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;
document.head.appendChild(keyboardStyles);
