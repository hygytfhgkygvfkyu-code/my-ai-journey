// Main: render page content from data.js
(function () {
  const d = siteData;

  // Hero
  document.querySelector('.hero-name').textContent = d.hero.name;
  document.querySelector('.hero-title').textContent = d.hero.title;
  document.querySelector('.hero-dedication').textContent = d.hero.dedication;

  // Avatar
  const avatarEl = document.querySelector('.hero-avatar');
  if (d.hero.avatar) {
    const img = document.createElement('img');
    img.src = d.hero.avatar;
    img.alt = d.hero.name;
    img.style.cssText = 'width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid var(--color-primary)';
    avatarEl.innerHTML = '';
    avatarEl.appendChild(img);
  }

  // About
  document.querySelector('.about-text').innerHTML = d.about.text;
  const eduList = document.querySelector('.education-list');
  d.about.education.forEach(item => {
    eduList.insertAdjacentHTML('beforeend',
      `<div class="education-item">
        <strong>${item.school}</strong> · ${item.degree} · ${item.major}
        <br><small class="text-small" style="color:var(--color-text-muted)">${item.time}</small>
      </div>`
    );
  });

  // Skills
  const skillsCloud = document.getElementById('skillsCloud');
  d.skills.forEach(s => {
    skillsCloud.insertAdjacentHTML('beforeend',
      `<span class="skill-tag">${s.name}<span class="level">${s.level}%</span></span>`
    );
  });

  // Contact
  const contactList = document.getElementById('contactList');
  if (d.contact.email) {
    contactList.insertAdjacentHTML('beforeend',
      `<div class="contact-item"><i data-lucide="mail" size="20"></i> ${d.contact.email}</div>`
    );
  }
  if (d.contact.wechat) {
    contactList.insertAdjacentHTML('beforeend',
      `<div class="contact-item"><i data-lucide="message-circle" size="20"></i> 微信：${d.contact.wechat}</div>`
    );
  }
  if (d.contact.github) {
    contactList.insertAdjacentHTML('beforeend',
      `<div class="contact-item"><i data-lucide="github" size="20"></i> <a href="${d.contact.github}" target="_blank">${d.contact.github}</a></div>`
    );
  }

  // Re-init Lucide icons (for dynamic elements)
  if (window.lucide) lucide.createIcons();

  // Lightbox
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<button class="lightbox-arrow lightbox-prev"><i data-lucide="chevron-left" size="28"></i></button><img src="" alt=""><button class="lightbox-arrow lightbox-next"><i data-lucide="chevron-right" size="28"></i></button>';
  document.body.appendChild(lb);

  const lbImg = lb.querySelector('img');
  const lbPrev = lb.querySelector('.lightbox-prev');
  const lbNext = lb.querySelector('.lightbox-next');

  let currentGroup = [];
  let currentIndex = 0;

  function showImage(index) {
    currentIndex = index;
    lbImg.src = currentGroup[currentIndex];
  }

  function nextImage() { showImage((currentIndex + 1) % currentGroup.length); }
  function prevImage() { showImage((currentIndex - 1 + currentGroup.length) % currentGroup.length); }

  lbNext.addEventListener('click', function (e) { e.stopPropagation(); nextImage(); });
  lbPrev.addEventListener('click', function (e) { e.stopPropagation(); prevImage(); });

  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target === lbImg) lb.classList.remove('open');
  });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') lb.classList.remove('open');
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });

  // 点击图片时收集同组图片并打开
  document.addEventListener('click', function (e) {
    const img = e.target.closest('.project-image img, .timeline-images img');
    if (!img) return;

    const container = img.closest('.project-image') || img.closest('.timeline-images');
    if (!container) return;

    const allImgs = container.querySelectorAll('img');
    currentGroup = Array.from(allImgs).map(el => el.src);
    currentIndex = currentGroup.indexOf(img.src);
    if (currentIndex < 0) currentIndex = 0;

    lbImg.src = currentGroup[currentIndex];
    lb.classList.add('open');
  });
})();
