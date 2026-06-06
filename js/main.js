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
  document.querySelector('.about-text').textContent = d.about.text;
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
  lb.innerHTML = '<img src="" alt="">';
  document.body.appendChild(lb);

  lb.addEventListener('click', function () {
    lb.classList.remove('open');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') lb.classList.remove('open');
  });

  window.openLightbox = function (src) {
    lb.querySelector('img').src = src;
    lb.classList.add('open');
  };
})();
