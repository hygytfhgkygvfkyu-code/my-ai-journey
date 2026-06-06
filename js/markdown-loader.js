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
        const imageSrc = meta.image || '';

        grid.insertAdjacentHTML('beforeend',
          `<div class="project-card">
            <div class="project-image">
              ${imageSrc
                ? `<img src="${imageSrc}" alt="${meta.name}" style="width:100%;height:100%;object-fit:cover;">`
                : `<i data-lucide="image" size="40"></i>`
              }
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

    if (window.lucide) lucide.createIcons();
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
          container.insertAdjacentHTML('beforeend',
            `<div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-date">${match[1].trim()}</div>
              <h3>${match[2].trim()}</h3>
              <p>${match[3].trim()}</p>
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
  }
})();
