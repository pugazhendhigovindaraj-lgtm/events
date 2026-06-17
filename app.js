/* =========================================================
   CampusEvents — App Helpers & Auth
   ========================================================= */

/* ---------- AUTH ---------- */
const Auth = {
  ADMIN_USER: "admin",
  ADMIN_PASS: "campus2026",
  SESSION_KEY: "campusEvents_adminSession",

  login(username, password) {
    if (username === this.ADMIN_USER && password === this.ADMIN_PASS) {
      sessionStorage.setItem(this.SESSION_KEY, "true");
      return true;
    }
    return false;
  },

  logout() {
    sessionStorage.removeItem(this.SESSION_KEY);
    window.location.href = "admin-login.html";
  },

  isLoggedIn() {
    return sessionStorage.getItem(this.SESSION_KEY) === "true";
  },

  requireLogin() {
    if (!this.isLoggedIn()) {
      return true;
    }
  }
};

/* ---------- HELPERS ---------- */

// Format an ISO date string (YYYY-MM-DD) as "10 Jul 2026"
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

// Read a query string parameter, e.g. getParam("id")
function getParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Map an event category to its themed tag color class
function tagClass(category) {
  return "tag tag-" + String(category).toLowerCase();
}

/* ---------- MOBILE NAVIGATION ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });

    // Close the mobile menu after a link is clicked
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("show");
      });
    });
  }

  // Update Admin nav link label/href based on login state
  const adminLinks = document.querySelectorAll('.nav-links a[href="admin.html"], .nav-links a[href="admin-login.html"]');
  adminLinks.forEach(link => {
    if (Auth.isLoggedIn()) {
      link.setAttribute("href", "admin.html");
    } else if (link.classList.contains("active") || link.getAttribute("href") === "admin.html") {
      // leave admin.html links pointing to admin.html; requireLogin() on that
      // page will redirect unauthenticated users to admin-login.html
    }
  });
});
