document.addEventListener("DOMContentLoaded", () => {
  const productModal = document.getElementById("productModal");
  const quoteModal = document.getElementById("quoteModal");
  const modalBody = document.getElementById("modalBody");
  const closeButtons = document.querySelectorAll(".close");

  let currentIndex = 0;
  let images = [];
  let activeCard = null;

  // 🔹 Default modal with full details
  window.openModal = function (card) {
    activeCard = card;
    const prefix = card.getAttribute("data-prefix");
    const folder = card.getAttribute("data-folder");

    if (!prefix || !folder) return;

    images = [];
    currentIndex = 0;
    modalBody.innerHTML = "";

    let i = 1;
    function tryLoadNext() {
      const testImg = new Image();
      let path = `${folder}/${prefix}${i}.jpg`;
      testImg.src = path;
      testImg.onload = () => {
        images.push(path);
        i++;
        tryLoadNext();
      };
      testImg.onerror = () => {
        renderSlideshow(activeCard);
      };
    }
    tryLoadNext();

    productModal.style.display = "block";
  };

  // 🔹 Render full slideshow with details
  function renderSlideshow(card) {
    if (images.length === 0) {
      modalBody.innerHTML = "<p>No images found.</p>";
      return;
    }

    const title = card.getAttribute("data-title");
    const description = card.getAttribute("data-description");
    const dimensions = card.getAttribute("data-dimensions");
    const material = card.getAttribute("data-material");
    const finish = card.getAttribute("data-finish");
    const weight = card.getAttribute("data-weight");

    modalBody.innerHTML = `
      <div class="slideshow">
        <button class="nav-btn prev">&lt;</button>
        <img id="slideshow-img" src="${images[currentIndex]}" class="modal-image"/>
        <button class="nav-btn next">&gt;</button>
      </div>
      <h2 class="modal-title">${title}</h2>
      <p class="modal-description">${description}</p>
      <div class="specifications">
        <h4>Specifications</h4>
        <div class="spec-grid">
          <div class="spec-item"><span class="spec-label">Dimensions</span><span class="spec-value">${dimensions}</span></div>
          <div class="spec-item"><span class="spec-label">Material</span><span class="spec-value">${material}</span></div>
          <div class="spec-item"><span class="spec-label">Finish</span><span class="spec-value">${finish}</span></div>
          <div class="spec-item"><span class="spec-label">Weight</span><span class="spec-value">${weight}</span></div>
        </div>
      </div>
    `;

    modalBody.querySelector(".prev").onclick = () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateImage();
    };
    modalBody.querySelector(".next").onclick = () => {
      currentIndex = (currentIndex + 1) % images.length;
      updateImage();
    };
  }

  function updateImage() {
    const img = modalBody.querySelector("#slideshow-img");
    img.src = images[currentIndex];
  }

  // 🔹 Image-only modal (for New Launch section)
  window.openImageOnly = function(card) {
    const prefix = card.getAttribute("data-prefix");
    const folder = card.getAttribute("data-folder");

    let imgs = [];
    let i = 1;

    function tryLoadNext() {
      const testImg = new Image();
      let path = `${folder}/${prefix}${i}.jpg`;
      testImg.src = path;
      testImg.onload = () => {
        imgs.push(path);
        i++;
        tryLoadNext();
      };
      testImg.onerror = () => {
        renderImageOnly();
      };
    }
    tryLoadNext();

    function renderImageOnly() {
      if (imgs.length === 0) {
        modalBody.innerHTML = "<p>No images found.</p>";
        productModal.style.display = "block";
        return;
      }

      modalBody.innerHTML = `
        <div class="slideshow">
          <button class="nav-btn prev">&lt;</button>
          <img id="slideshow-img" src="${imgs[0]}" class="modal-image"/>
          <button class="nav-btn next">&gt;</button>
        </div>
      `;

      let currentIndex = 0;
      modalBody.querySelector(".prev").onclick = () => {
        currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
        updateImageOnly();
      };
      modalBody.querySelector(".next").onclick = () => {
        currentIndex = (currentIndex + 1) % imgs.length;
        updateImageOnly();
      };
      function updateImageOnly() {
        const img = modalBody.querySelector("#slideshow-img");
        img.src = imgs[currentIndex];
      }
    }

    productModal.style.display = "block";
  };

  // 🔹 Close modals when clicking the close button
  closeButtons.forEach(button => {
    button.onclick = () => {
      productModal.style.display = "none";
      quoteModal.style.display = "none";
    };
  });

  // 🔹 Close modals when clicking outside
  window.onclick = e => {
    if (e.target === productModal) productModal.style.display = "none";
    if (e.target === quoteModal) quoteModal.style.display = "none";
  };

  // 🔹 Fade-in observer
  const sections = document.querySelectorAll(".fade-section");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.18 });
  sections.forEach(section => observer.observe(section));

  // 🔹 Hamburger toggle
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      hamburger.classList.toggle("active");
    });
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
      });
    });
  }

  // 🔹 Open quote modal
  window.openQuoteModal = function() {
    quoteModal.style.display = "block";
  };

  // 🔹 Handle form submission (corrected)
  document.getElementById("quoteForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const payload = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      request: document.getElementById("request").value.trim(),
    };
  
    // Basic front-end validation
    if (!payload.name || !payload.email || !payload.request) {
      alert("Please fill Name, Email and Request fields.");
      return;
    }
  
    const WEB_APP_URL =
      "https://script.google.com/macros/s/AKfycbw_7ZMIvDaWZwRbBxWn7pFB1EE4Tfkk0abuMXfP5APt9miOmO2plfQsCP7cx1imFq1O/exec";
  
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
  
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
  
    try {
      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(payload),
      });
  
      // Use text() instead of json() to avoid CORS errors
      const text = await res.text();
  
      if (text === "success") {
        alert("Thanks — your request has been sent!");
        this.reset();
        document.querySelector("#quoteModal .close").click();
      } else {
        alert("There was an error submitting your request.");
      }
  
    } catch (err) {
      alert("Network error: " + err.message);
    }
  
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  });
});