/**
 * TyresCart Middle East - Pure JavaScript Interactive Controller
 * Features:
 * 1. 3D Spatial Tilt physics on Country Cards
 * 2. Bi-directional Hover Sync between GCC Map Pins and Country Cards
 * 3. Smooth Country Selector & Language Interaction Toast
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const countryCards = document.querySelectorAll('.country-card[data-country]');
  const mapPins = document.querySelectorAll('.map-pin[data-country]');
  const langButtons = document.querySelectorAll('.btn-lang');

  // 1. Bi-directional Hover & Click Synchronization
  // Map Pin -> Country Card
  mapPins.forEach(pin => {
    const countryKey = pin.getAttribute('data-country');
    const targetCard = document.querySelector(`.country-card[data-country="${countryKey}"]`);

    pin.addEventListener('mouseenter', () => {
      pin.classList.add('active');
      if (targetCard) {
        targetCard.classList.add('highlighted');
      }
    });

    pin.addEventListener('mouseleave', () => {
      pin.classList.remove('active');
      if (targetCard) {
        targetCard.classList.remove('highlighted');
      }
    });

    pin.addEventListener('click', () => {
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetCard.classList.add('highlighted');
        setTimeout(() => {
          targetCard.classList.remove('highlighted');
        }, 1800);
      }
    });
  });

  // Country Card -> Map Pin
  countryCards.forEach(card => {
    const countryKey = card.getAttribute('data-country');
    const matchingPin = document.querySelector(`.map-pin[data-country="${countryKey}"]`);

    card.addEventListener('mouseenter', () => {
      if (matchingPin) {
        matchingPin.classList.add('active');
      }
    });

    card.addEventListener('mouseleave', () => {
      if (matchingPin) {
        matchingPin.classList.remove('active');
      }
    });

    // 2. Spatial 3D Perspective Tilt on Mouse Movement
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
      const rotateY = ((x - centerX) / centerX) * 6;  // max 6 deg

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // 3. Language Action Handler (Toast notification)
  langButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parentCard = btn.closest('.country-card');
      const countryName = parentCard ? parentCard.querySelector('.country-name')?.textContent.trim() : 'Region';
      const lang = btn.classList.contains('btn-ar') ? 'Arabic (العربية)' : 'English';
      
      showToast(`Redirecting to TyresCart ${countryName} (${lang})...`);
    });
  });

  // Simple High-Performance Toast Notification
  function showToast(message) {
    let existingToast = document.querySelector('.tc-toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'tc-toast';
    toast.innerHTML = `
      <div class="tc-toast-inner">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#008744" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
});
