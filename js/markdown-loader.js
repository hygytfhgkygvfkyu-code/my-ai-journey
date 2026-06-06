// Markdown loader — 加载 content/ 下的 .md 文件并渲染到页面
(function () {

  // 项目清单 — 新增项目在这里加一行即可
  const projectFiles = [
    'coze.md',
    'openclaw-feishu.md',
    'vscode-claude-deepseek.md',
    'clipboard.md',
    'paper.md',
    'tianshang-website.md'
  ];

  // 解析 HTML 注释 frontmatter
  function parseFrontmatter(md) {
    const meta = {};
    const match = md.match(/^<!--\s*([\s\S]*?)\s*-->/);
    if (match) {
      const lines = match[1].split('\n');
      lines.forEach(line => {
        const colon = line.indexOf(':');
        if (colon > 0) {
          const key = line.slice(0, colon).trim();
          const val = line.slice(colon + 1).trim();
          meta[key] = val;
        }
      });
      md = md.slice(match[0].length).trim();
    }
    return { meta, body: md };
  }

  // 加载单个 .md 文件
  async function loadMarkdown(filename) {
    const resp = await fetch('content/projects/' + filename);
    if (!resp.ok) throw new Error('Failed to load ' + filename);
    const text = await resp.text();
    const { meta, body } = parseFrontmatter(text);
    return { meta, html: marked.parse(body) };
  }

  // 渲染项目卡片
  async function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    // 加载所有项目
    const results = await Promise.allSettled(projectFiles.map(loadMarkdown));

    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        const { meta, html } = result.value;
        const tags = (meta.tech || '').split(',').map(t => t.trim()).filter(Boolean);
        const images = (meta.images || meta.image || '').split(',').map(s => s.trim()).filter(Boolean);
        const multiImg = images.length > 1;

        const imgBlock = images.length === 0
          ? `<i data-lucide="image" size="40"></i>`
          : multiImg
            ? `<div class="carousel" data-carousel>
                <div class="carousel-track">
                  ${images.map(src => `<div class="carousel-slide"><img src="${src}" alt=""></div>`).join('')}
                </div>
                <button class="carousel-btn carousel-prev"><i data-lucide="chevron-left" size="18"></i></button>
                <button class="carousel-btn carousel-next"><i data-lucide="chevron-right" size="18"></i></button>
                <div class="carousel-dots">
                  ${images.map((_, idx) => `<span class="carousel-dot${idx === 0 ? ' active' : ''}" data-index="${idx}"></span>`).join('')}
                </div>
              </div>`
            : `<img src="${images[0]}" alt="${meta.name}" style="width:100%;height:100%;object-fit:cover;">`;

        grid.insertAdjacentHTML('beforeend',
          `<div class="project-card">
            <div class="project-image">
              ${imgBlock}
            </div>
            <div class="project-body">
              <h3>${meta.name || '项目 ' + (i + 1)}</h3>
              <div class="project-desc">${html}</div>
              ${tags.length ? `<div class="project-tags">${tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>` : ''}
            </div>
          </div>`
        );
      } else {
        grid.insertAdjacentHTML('beforeend',
          `<div class="project-card">
            <div class="project-image"><i data-lucide="alert-circle" size="40"></i></div>
            <div class="project-body">
              <h3>项目 ${i + 1}</h3>
              <div class="project-desc" style="color:var(--color-text-muted)">内容加载失败</div>
            </div>
          </div>`
        );
      }
    });

    // 初始化轮播
    initCarousels();

    if (window.lucide) lucide.createIcons();

    // 触发动画
    if (window.initCardAnimation) window.initCardAnimation();
  }

  // 轮播初始化
  function initCarousels() {
    document.querySelectorAll('[data-carousel]').forEach(carousel => {
      const track = carousel.querySelector('.carousel-track');
      const slides = carousel.querySelectorAll('.carousel-slide');
      const dots = carousel.querySelectorAll('.carousel-dot');
      const prev = carousel.querySelector('.carousel-prev');
      const next = carousel.querySelector('.carousel-next');
      let current = 0;
      const total = slides.length;

      function goTo(idx) {
        current = idx;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
      }

      prev.addEventListener('click', () => {
        goTo((current - 1 + total) % total);
      });
      next.addEventListener('click', () => {
        goTo((current + 1) % total);
      });
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          goTo(parseInt(dot.dataset.index));
        });
      });

      // Touch swipe
      let startX = 0;
      track.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
      }, { passive: true });
      track.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
          goTo(diff > 0 ? (current + 1) % total : (current - 1 + total) % total);
        }
      });
    });
  }

  // 页面加载完成后渲染
  function init() {
    renderProjects();
    loadTimeline();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 加载时间线
  async function loadTimeline() {
    const container = document.getElementById('timelineContainer');
    if (!container) return;

    try {
      const resp = await fetch('content/timeline.md');
      if (!resp.ok) throw new Error('Failed to load timeline');
      const text = await resp.text();

      // 解析格式: - **date** | **title** — description
      const lines = text.split('\n');
      lines.forEach(line => {
        const match = line.match(/^\s*-\s*\*\*(.+?)\*\*\s*\|\s*\*\*(.+?)\*\*\s*[—\-]\s*(.+)/);
        if (match) {
          const rawDesc = match[3].trim();
          const pipeIdx = rawDesc.lastIndexOf(' | ');
          let desc = rawDesc;
          let imgs = [];
          if (pipeIdx > 0) {
            desc = rawDesc.slice(0, pipeIdx);
            const imgStr = rawDesc.slice(pipeIdx + 3);
            imgs = imgStr.split(',').map(s => s.trim()).filter(Boolean);
          }

          const imgHTML = imgs.length
            ? `<div class="timeline-images">${imgs.map(src => `<img src="${src}" alt="">`).join('')}</div>`
            : '';

          container.insertAdjacentHTML('beforeend',
            `<div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-date">${match[1].trim()}</div>
              <h3>${match[2].trim()}</h3>
              <p>${desc}</p>
              ${imgHTML}
            </div>`
          );
        }
      });
    } catch (err) {
      // 回退到 data.js 中的时间线数据
      if (typeof siteData !== 'undefined' && siteData.timeline) {
        siteData.timeline.forEach(item => {
          container.insertAdjacentHTML('beforeend',
            `<div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-date">${item.date}</div>
              <h3>${item.title}</h3>
              <p>${item.desc}</p>
            </div>`
          );
        });
      }
    }

    if (window.initTimelineAnimation) window.initTimelineAnimation();
  }
})();
