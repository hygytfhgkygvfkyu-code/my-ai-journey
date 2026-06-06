// Scroll-triggered entrance animations
(function () {

  // 区块入场
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
  });

  // 时间线节点逐个入场（由 markdown-loader 渲染后调用）
  window.initTimelineAnimation = function () {
    const container = document.getElementById('timelineContainer');
    if (!container) return;
    const items = container.querySelectorAll('.timeline-item');
    const tlObserver = new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          items.forEach((item, i) => {
            setTimeout(() => item.classList.add('visible'), i * 120);
          });
          tlObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    tlObserver.observe(container);
  };

  // 项目卡片入场（由 markdown-loader 渲染后调用）
  window.initCardAnimation = function () {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    const cards = grid.querySelectorAll('.project-card');
    const cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cards.forEach((card, i) => {
            setTimeout(() => card.classList.add('visible'), i * 100);
          });
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    cardObserver.observe(grid);
  };
})();
