document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("productModal");
  const modalBody = document.getElementById("modalBody");
  const closeBtn = document.querySelector(".close");

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

    modal.style.display = "block";
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
    modalBody.querySelector(".caption").innerText =
      `Image ${currentIndex + 1} of ${images.length}`;
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
        modal.style.display = "block";
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
        modalBody.querySelector(".caption").innerText =
          `Image ${currentIndex + 1} of ${imgs.length}`;
      }
    }

    modal.style.display = "block";
  };

  // 🔹 Close modal
  closeBtn.onclick = () => (modal.style.display = "none");
  window.onclick = e => {
    if (e.target === modal) modal.style.display = "none";
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
});

// 🔹 New function to open the quote modal
window.openQuoteModal = function() {
  const quoteModal = document.getElementById("quoteModal");
  quoteModal.style.display = "block";
};

// 🔹 New function to handle form submission
document.getElementById("quoteForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevents the form from submitting in the traditional way

  // Here you would typically send the form data to a server
  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    request: document.getElementById("request").value
  };

  console.log("Form Submitted:", formData);
  alert("Your request has been sent! We will contact you shortly.");

  // Close the modal and reset the form
  document.getElementById("quoteModal").style.display = "none";
  this.reset();
});