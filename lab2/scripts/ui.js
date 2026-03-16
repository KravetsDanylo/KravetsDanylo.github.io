// UI module - handles UI effects and interactions

export function highlightEvenProducts() {
  const titles = document.querySelectorAll('.product-card h3');

  for (let i = 0; i < titles.length; i++) {
    if (i % 2 === 0) {
      titles[i].style.color = 'var(--primary-color)';

      if (!titles[i].textContent.includes('[Sale]')) {
        titles[i].textContent = '[Sale] ' + titles[i].textContent;
      }
    } else {
      titles[i].style.color = 'var(--text-dark)';
    }
  }
}

export function setupEventHandlers() {
  const toggleBtn = document.getElementById('toggle-mission-btn');
  const missionParagraphs = document.querySelectorAll('.company-desc p');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      for (let i = 0; i < missionParagraphs.length; i++) {
        const p = missionParagraphs[i];

        if (p.style.display === 'none') {
          p.style.display = 'block';
        } else {
          p.style.display = 'none';
        }
      }
    });
  }

  const navLinks = document.querySelectorAll('.main-nav a');
  for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', function() {
      console.log('Ви клікнули на пункт меню: ' + this.textContent);
    });
  }

  const productCards = document.querySelectorAll('.product-card');
  for (let i = 0; i < productCards.length; i++) {
    productCards[i].addEventListener('mouseenter', function() {
      this.style.backgroundColor = '#f0f9ff';
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    productCards[i].addEventListener('mouseleave', function() {
      this.style.backgroundColor = 'white';
      this.style.transform = '';
    });
  }
}

export function setupReviewForm() {
  const form = document.getElementById('review-form');
  const nameInput = document.getElementById('reviewer-name');
  const textInput = document.getElementById('review-text');
  const errorMsg = document.getElementById('review-error');
  const reviewsContainer = document.getElementById('reviews-container');

  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      const nameValue = nameInput.value.trim();
      const textValue = textInput.value.trim();

      if (nameValue === '' || textValue === '') {
        errorMsg.style.display = 'block';
      } else {
        errorMsg.style.display = 'none';

        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-item';

        reviewCard.style.padding = '1.5rem';
        reviewCard.style.backgroundColor = 'white';
        reviewCard.style.borderRadius = '8px';
        reviewCard.style.boxShadow = 'var(--card-shadow)';
        reviewCard.style.borderLeft = '4px solid var(--success)';

        const authorHeader = document.createElement('h4');
        authorHeader.textContent = nameValue;
        authorHeader.style.marginBottom = '0.5rem';

        const reviewParagraph = document.createElement('p');
        reviewParagraph.textContent = textValue;
        reviewParagraph.style.color = 'var(--text-light)';

        reviewCard.appendChild(authorHeader);
        reviewCard.appendChild(reviewParagraph);

        reviewsContainer.prepend(reviewCard);

        form.reset();
      }
    });
  }
}

export function initUI() {
  highlightEvenProducts();
  setupEventHandlers();
  setupReviewForm();
}
