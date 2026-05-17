/* ==========================================================================
   FRONTEND CONTROLLER - MADEBYAUSTYN
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Global States
  let projectsData = [];
  let skillsData = [];

  // Initialize Core Services
  initCursorGlow();
  initTypewriter();
  initHeaderScroll();
  initMobileMenu();
  initScrollReveal();
  
  // API Core Services
  fetchProjects();
  fetchSkills();
  initEstimator();
  initContactForm();
});

/* ==========================================================================
   1. CUSTOM GLOWING POINTER CURSOR
   ========================================================================== */
function initCursorGlow() {
  const cursorGlow = document.getElementById('cursorGlow');
  if (!cursorGlow) return;

  // Track coordinates
  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  });

  // Scale cursor glow on interactive hover states
  const interactives = document.querySelectorAll('a, button, input, select, textarea, .complexity-card, .feature-item');
  interactives.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      cursorGlow.style.width = '550px';
      cursorGlow.style.height = '550px';
    });
    elem.addEventListener('mouseleave', () => {
      cursorGlow.style.width = '400px';
      cursorGlow.style.height = '400px';
    });
  });
}

/* ==========================================================================
   2. HERO CYCLING TYPEWRITER ANIMATION
   ========================================================================== */
function initTypewriter() {
  const element = document.getElementById('typewriter');
  if (!element) return;

  const roles = [
    "Full-Stack Architect",
    "Desktop Systems Architect",
    "Creative UX Engineer",
    "Custom IDE Architect"
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      // Deleting characters
      element.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Speed up deleting
    } else {
      // Adding characters
      element.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Standard typing speed
    }

    // Role typed completely
    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2000; // Hold at the end of word
      isDeleting = true;
    } 
    // Role deleted completely
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Short pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  // Start sequence
  setTimeout(type, 1000);
}

/* ==========================================================================
   3. STICKY GLASS HEADER & SCROLL HIGH-HIGHLIGHTER
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.glass-header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Add scroll overlay state
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Sync active nav links based on section positions
    let currentSectionId = '';
    
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      const scrollPos = window.scrollY;

      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   4. MOBILE HEADER MENU ANIMATIONS
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobileNavToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Animate mobile toggle button bars
    const bars = toggle.querySelectorAll('.bar');
    if (toggle.classList.contains('active')) {
      bars[0].style.transform = 'translateY(8px) rotate(45deg)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
      bars[0].style.transform = 'none';
      bars[1].style.opacity = '1';
      bars[2].style.transform = 'none';
    }
  });

  // Close menu drawer on clicking options
  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('active');
      
      const bars = toggle.querySelectorAll('.bar');
      bars[0].style.transform = 'none';
      bars[1].style.opacity = '1';
      bars[2].style.transform = 'none';
    });
  });
}

/* ==========================================================================
   5. VIEWPORT SCROLL REVEAL TIMINGS
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.scroll-reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        // Stop observing once active
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. PORTFOLIO SHOWROOM LOADER & FILTERS (REST API)
   ========================================================================== */
async function fetchProjects() {
  const container = document.getElementById('projectsContainer');
  if (!container) return;

  try {
    const res = await fetch('/api/projects');
    const json = await res.json();

    if (json.success && json.data) {
      projectsData = json.data;
      renderProjects(projectsData);
      initProjectFilters();
    } else {
      container.innerHTML = `<div class="skill-loader">Failed to load projects.</div>`;
    }
  } catch (error) {
    console.error("Projects API error:", error);
    container.innerHTML = `<div class="skill-loader">Error connecting to Projects API.</div>`;
  }
}

function renderProjects(projects) {
  const container = document.getElementById('projectsContainer');
  if (!container) return;

  container.innerHTML = '';

  projects.forEach((proj, idx) => {
    const card = document.createElement('div');
    card.className = 'project-card glass-panel scroll-reveal';
    card.setAttribute('data-category', proj.category.toLowerCase());
    
    // Add brief animation stagger index
    card.style.transitionDelay = `${idx * 0.1}s`;

    card.innerHTML = `
      <div class="project-img-wrapper">
        <span class="project-badge">${proj.badge}</span>
        <img src="${proj.image}" alt="${proj.title}" class="project-img">
      </div>
      <div class="project-content">
        <div class="project-tags">
          ${proj.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
        </div>
        <h3 class="project-card-title">${proj.title}</h3>
        <p class="project-card-desc">${proj.description}</p>
        <a href="${proj.link}" class="project-link">Explore Integration <i class="fas fa-arrow-right"></i></a>
      </div>
    `;

    container.appendChild(card);
    
    // Observe dynamic elements for scroll reveal
    setTimeout(() => {
      card.classList.add('reveal-active');
    }, 50);
  });
}

function initProjectFilters() {
  const filterBtns = document.querySelectorAll('#projectFilters .filter-btn');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const filterVal = e.target.getAttribute('data-filter').toLowerCase();
      const cards = document.querySelectorAll('.project-card');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   7. SKILLS MATRIX LOADER & CATEGORIES (REST API)
   ========================================================================== */
async function fetchSkills() {
  const container = document.getElementById('skillsContainer');
  if (!container) return;

  try {
    const res = await fetch('/api/skills');
    const json = await res.json();

    if (json.success && json.data) {
      skillsData = json.data;
      renderSkills(skillsData);
      initSkillsFilters();
      animateSkillBars();
    } else {
      container.innerHTML = `<div class="skill-loader">Failed to load expertise data.</div>`;
    }
  } catch (error) {
    console.error("Skills API error:", error);
    container.innerHTML = `<div class="skill-loader">Error connecting to Skills API.</div>`;
  }
}

function renderSkills(skills) {
  const container = document.getElementById('skillsContainer');
  if (!container) return;

  container.innerHTML = '';

  skills.forEach((skill) => {
    const card = document.createElement('div');
    card.className = 'skill-card glass-panel';
    card.setAttribute('data-category', skill.category.toLowerCase());

    card.innerHTML = `
      <div class="skill-header">
        <div class="skill-icon-box">
          <i class="${skill.icon}"></i>
        </div>
        <h4 class="skill-title">${skill.name}</h4>
      </div>
      <div class="skill-body">
        <div class="skill-progress-meta">
          <span class="skill-prof-label">Proficiency</span>
          <span class="skill-percent">${skill.proficiency}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-bar" data-width="${skill.proficiency}%"></div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function initSkillsFilters() {
  const categoryBtns = document.querySelectorAll('.skill-category-btn');

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      const activeBtn = e.target.closest('.skill-category-btn');
      activeBtn.classList.add('active');

      const catVal = activeBtn.getAttribute('data-category').toLowerCase();
      const cards = document.querySelectorAll('.skill-card');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (catVal === 'all' || cat === catVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
      
      // Re-trigger animation fills
      setTimeout(animateSkillBars, 100);
    });
  });
}

function animateSkillBars() {
  const bars = document.querySelectorAll('.progress-bar');
  
  // Fill bars using IntersectionObserver
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute('data-width');
        bar.style.width = targetWidth;
        obs.unobserve(bar);
      }
    });
  }, { threshold: 0.1 });

  bars.forEach(bar => obs.observe(bar));
}

/* ==========================================================================
   8. INTERACTIVE HIRE ME COST ESTIMATOR (POST ESTIMATION ENGINE)
   ========================================================================== */
function initEstimator() {
  const slider = document.getElementById('weeksSlider');
  const valueDisplay = document.getElementById('weeksValue');
  
  const complexityCards = document.querySelectorAll('.complexity-card');
  const checkboxes = document.querySelectorAll('.feature-checkbox');
  
  if (!slider || !valueDisplay) return;

  // Track state changes and run update quotes
  slider.addEventListener('input', (e) => {
    const val = e.target.value;
    valueDisplay.textContent = `${val} Week${val > 1 ? 's' : ''}`;
    updateCostEstimate();
  });

  complexityCards.forEach(card => {
    card.addEventListener('click', () => {
      complexityCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      // Wait briefly for check state
      setTimeout(updateCostEstimate, 50);
    });
  });

  checkboxes.forEach(box => {
    box.addEventListener('change', updateCostEstimate);
  });

  // Run initial estimate rendering
  updateCostEstimate();
}

async function updateCostEstimate() {
  const duration = document.getElementById('weeksSlider').value;
  
  const selectedCompRadio = document.querySelector('input[name="complexity"]:checked');
  const complexity = selectedCompRadio ? selectedCompRadio.value : 'standard';
  
  const selectedFeatures = [];
  document.querySelectorAll('.feature-checkbox:checked').forEach(box => {
    selectedFeatures.push(box.value);
  });

  // DOM elements to update
  const receiptBase = document.getElementById('receiptBase');
  const receiptMult = document.getElementById('receiptMult');
  const receiptFeatures = document.getElementById('receiptFeatures');
  const receiptSubtotal = document.getElementById('receiptSubtotal');
  const receiptDiscount = document.getElementById('receiptDiscount');
  const receiptTotal = document.getElementById('receiptTotal');
  const receiptTimeline = document.getElementById('receiptTimeline');

  try {
    const res = await fetch('/api/estimate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        duration: parseInt(duration),
        complexity: complexity,
        features: selectedFeatures
      })
    });
    
    const json = await res.json();

    if (json.success && json.data) {
      const data = json.data;
      
      // Update DOM with dynamic formats
      receiptBase.textContent = `$${(data.weeklyRate * data.weeks).toLocaleString()}`;
      receiptMult.textContent = `${data.complexityMultiplier.toFixed(1)}x`;
      receiptFeatures.textContent = `$${data.featuresTotal.toLocaleString()}`;
      receiptSubtotal.textContent = `$${data.subtotal.toLocaleString()}`;
      
      if (data.discountPercentage > 0) {
        receiptDiscount.closest('.receipt-discount-row').style.display = 'flex';
        receiptDiscount.textContent = `-$${data.discountAmount.toLocaleString()} (${data.discountPercentage}%)`;
      } else {
        receiptDiscount.closest('.receipt-discount-row').style.display = 'none';
      }
      
      receiptTotal.textContent = `$${data.total.toLocaleString()}`;
      receiptTimeline.textContent = data.timeline;
    }
  } catch (error) {
    console.error("Estimator computation failed:", error);
  }
}

/* ==========================================================================
   9. CLIENT-SIDE VALIDATION & CONTACT SUBMIT (REST API)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');
  
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  const spinner = document.getElementById('formSpinner');
  const submitBtn = document.getElementById('formSubmitBtn');
  const alertContainer = document.getElementById('formStatusAlert');
  const alertIcon = document.getElementById('statusAlertIcon');
  const alertText = document.getElementById('statusAlertText');

  // Input Listeners for live validation clearing
  nameInput.addEventListener('input', () => {
    validateName();
  });
  emailInput.addEventListener('input', () => {
    validateEmail();
  });
  messageInput.addEventListener('input', () => {
    validateMessage();
  });

  // Validation functions
  function validateName() {
    const val = nameInput.value.trim();
    if (val.length < 2) {
      nameInput.classList.add('is-invalid');
      nameInput.classList.remove('is-valid');
      nameError.textContent = "Name must be at least 2 characters.";
      return false;
    } else {
      nameInput.classList.remove('is-invalid');
      nameInput.classList.add('is-valid');
      nameError.textContent = "";
      return true;
    }
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      emailInput.classList.add('is-invalid');
      emailInput.classList.remove('is-valid');
      emailError.textContent = "Please enter a valid email address.";
      return false;
    } else {
      emailInput.classList.remove('is-invalid');
      emailInput.classList.add('is-valid');
      emailError.textContent = "";
      return true;
    }
  }

  function validateMessage() {
    const val = messageInput.value.trim();
    if (val.length < 10) {
      messageInput.classList.add('is-invalid');
      messageInput.classList.remove('is-valid');
      messageError.textContent = "Please write a comprehensive message (min 10 chars).";
      return false;
    } else {
      messageInput.classList.remove('is-invalid');
      messageInput.classList.add('is-valid');
      messageError.textContent = "";
      return true;
    }
  }

  // Bind Estimate Quote request button to auto-fill contact field subject line
  const quoteCTA = document.getElementById('quoteCTA');
  if (quoteCTA) {
    quoteCTA.addEventListener('click', () => {
      const duration = document.getElementById('weeksSlider').value;
      const selectedCompRadio = document.querySelector('input[name="complexity"]:checked');
      const complexity = selectedCompRadio ? selectedCompRadio.value : 'standard';
      const totalAmount = document.getElementById('receiptTotal').textContent;
      
      const subjectInput = document.getElementById('contactSubject');
      if (subjectInput) {
        subjectInput.value = `Quote Request: ${complexity.toUpperCase()} Tier (${duration} Wks)`;
        // Floating label trigger
        subjectInput.focus();
        setTimeout(() => subjectInput.blur(), 100);
      }
      
      const messageField = document.getElementById('contactMessage');
      if (messageField) {
        messageField.value = `Hi Austyn, I completed your dynamic calculator and got an estimated quote of ${totalAmount} for a ${duration}-week project on the ${complexity} tier. Let's arrange details!`;
        validateMessage();
      }
    });
  }

  // Handle AJAX submissions
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMsgValid = validateMessage();

    if (!isNameValid || !isEmailValid || !isMsgValid) {
      return; // Stop submission on validation failures
    }

    // Capture inputs
    const name = nameInput.value;
    const email = emailInput.value;
    const company = document.getElementById('contactCompany').value;
    const subject = document.getElementById('contactSubject').value;
    const message = messageInput.value;

    // Display submitting loaders
    submitBtn.setAttribute('disabled', 'true');
    spinner.style.display = 'inline-block';
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, company, subject, message })
      });
      
      const json = await res.json();

      if (res.ok && json.success) {
        // Success display
        alertIcon.className = "fas fa-check-circle success-icon";
        alertIcon.style.color = "var(--color-success)";
        alertText.textContent = json.message;
        alertContainer.classList.add('active');

        // Reset forms
        form.reset();
        document.querySelectorAll('.form-input').forEach(inp => {
          inp.classList.remove('is-valid');
          inp.classList.remove('is-invalid');
        });

        // Hide notification overlay after 6 seconds
        setTimeout(() => {
          alertContainer.classList.remove('active');
        }, 6000);
      } else {
        // Failed response
        alertIcon.className = "fas fa-exclamation-triangle success-icon";
        alertIcon.style.color = "var(--color-danger)";
        alertText.textContent = json.message || "An unexpected error occurred.";
        alertContainer.classList.add('active');
        
        setTimeout(() => {
          alertContainer.classList.remove('active');
        }, 5000);
      }
    } catch (error) {
      console.error("AJAX form submission error:", error);
      alertIcon.className = "fas fa-exclamation-triangle success-icon";
      alertIcon.style.color = "var(--color-danger)";
      alertText.textContent = "Failed to sync connection with Express server. Please check your local connection.";
      alertContainer.classList.add('active');
      
      setTimeout(() => {
        alertContainer.classList.remove('active');
      }, 5000);
    } finally {
      // Clear spin loaders
      submitBtn.removeAttribute('disabled');
      spinner.style.display = 'none';
    }
  });
}
