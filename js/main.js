// main.js

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functions
  initializeAOS();
  initializeDarkMode();
  initializeHeaderScroll();
  initializeMobileMenu();
  initializeBackToTop();
  initializeSearchFunction();
  initializeQuestionsFilter();
  initializeNotifications();
  loadStats();
});

// AOS (Animate On Scroll) Initialization
function initializeAOS() {
  AOS.init({
    duration: 800,
    offset: 100,
    once: true,
    easing: "ease-in-out",
    delay: 100,
    disable: "mobile",
  });
}

// Dark Mode Implementation
const initializeDarkMode = () => {
  const themeToggle = document.getElementById("themeToggle");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // Check for saved theme preference or use system preference
  const getCurrentTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }
    return prefersDarkScheme.matches ? "dark" : "light";
  };

  // Apply theme
  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateThemeIcon(theme);
  };

  // Update theme toggle icon
  const updateThemeIcon = (theme) => {
    if (themeToggle) {
      themeToggle.innerHTML =
        theme === "dark"
          ? '<i class="fas fa-sun"></i>'
          : '<i class="fas fa-moon"></i>';
    }
  };

  // Initialize theme
  applyTheme(getCurrentTheme());

  // Theme toggle event listener
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = getCurrentTheme();
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(newTheme);
    });
  }

  // Listen for system theme changes
  prefersDarkScheme.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });
};

// Header Scroll Behavior
const initializeHeaderScroll = () => {
  const header = document.querySelector(".header");
  let lastScroll = 0;
  const scrollThreshold = 100;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= scrollThreshold) {
      header.classList.remove("header-hidden");
      return;
    }

    if (
      currentScroll > lastScroll &&
      !header.classList.contains("header-hidden")
    ) {
      // Scrolling down
      header.classList.add("header-hidden");
    } else if (
      currentScroll < lastScroll &&
      header.classList.contains("header-hidden")
    ) {
      // Scrolling up
      header.classList.remove("header-hidden");
    }

    lastScroll = currentScroll;
  });
};

// Mobile Menu Implementation
const initializeMobileMenu = () => {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.querySelector(".nav-menu");
  let isMenuOpen = false;

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      isMenuOpen = !isMenuOpen;
      navMenu.classList.toggle("active");
      mobileMenuBtn.setAttribute("aria-expanded", isMenuOpen);
      mobileMenuBtn.innerHTML = isMenuOpen
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        isMenuOpen &&
        !navMenu.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)
      ) {
        navMenu.classList.remove("active");
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        isMenuOpen = false;
      }
    });
  }
};

// Back to Top Button
const initializeBackToTop = () => {
  const backToTopBtn = document.getElementById("backToTop");
  const scrollTrigger = 300;

  const toggleBackToTopBtn = () => {
    if (window.scrollY > scrollTrigger) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  };

  window.addEventListener("scroll", toggleBackToTopBtn);

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
};

// Search Implementation
const initializeSearchFunction = () => {
  const searchInput = document.getElementById("searchInput");
  const questionsContainer = document.getElementById("questionsContainer");

  if (searchInput && questionsContainer) {
    let debounceTimer;

    searchInput.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const searchTerm = searchInput.value.toLowerCase();
        filterQuestions(searchTerm);
      }, 300);
    });
  }
};

// Questions Filter
const initializeQuestionsFilter = () => {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      button.classList.add("active");
      // Filter questions based on button data attribute
      const filter = button.dataset.filter;
      filterQuestionsByCategory(filter);
    });
  });
};

// Notification System
const initializeNotifications = () => {
  window.showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type} animate-slide-in`;
    notification.innerHTML = `
          <div class="notification-content">
              <i class="fas ${getNotificationIcon(type)}"></i>
              <span>${message}</span>
          </div>
          <button class="notification-close">
              <i class="fas fa-times"></i>
          </button>
      `;

    document.getElementById("notification-container").appendChild(notification);

    // Auto-remove notification
    setTimeout(() => {
      notification.classList.add("animate-slide-out");
      setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button functionality
    notification
      .querySelector(".notification-close")
      .addEventListener("click", () => {
        notification.classList.add("animate-slide-out");
        setTimeout(() => notification.remove(), 300);
      });
  };
};

// Helper function for notification icons
const getNotificationIcon = (type) => {
  switch (type) {
    case "success":
      return "fa-check-circle";
    case "error":
      return "fa-exclamation-circle";
    case "warning":
      return "fa-exclamation-triangle";
    case "info":
      return "fa-info-circle";
    default:
      return "fa-info-circle";
  }
};

// Load and Display Stats
const loadStats = async () => {
  try {
    // In a real application, this would be an API call
    const stats = {
      users: 10500,
      questions: 25000,
      answers: 75000,
      solved: 20000,
    };

    // Animate counting for each stat
    Object.keys(stats).forEach((key) => {
      animateCounter(`${key}Count`, stats[key]);
    });
  } catch (error) {
    console.error("Error loading stats:", error);
  }
};

// Counter Animation Helper
const animateCounter = (elementId, finalValue) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const duration = 2000;
  const steps = 50;
  const stepValue = finalValue / steps;
  let currentStep = 0;
  let currentValue = 0;

  const interval = setInterval(() => {
    currentStep++;
    currentValue += stepValue;

    if (currentStep === steps) {
      currentValue = finalValue;
      clearInterval(interval);
    }

    element.textContent = Math.floor(currentValue).toLocaleString();
  }, duration / steps);
};

// Export functions for use in other modules
export { showNotification, animateCounter, initializeDarkMode, initializeAOS };
