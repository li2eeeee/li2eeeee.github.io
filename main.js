// 文章列表（手动添加）
const posts = [
];

// 获取所有分类
const categories = [...new Set(posts.map(p => p.category))];
const categoryList = document.getElementById('categories');

// 渲染侧边栏分类（可展开子文章）
categories.forEach(cat => {
  const li = document.createElement('li');
  li.textContent = cat;
  li.dataset.expanded = 'false';

  li.onclick = () => toggleCategory(cat, li);

  categoryList.appendChild(li);
});

// 切换分类展开/收起
function toggleCategory(cat, li) {
  const expanded = li.dataset.expanded === 'true';
  // 先移除已有子文章
  const existing = li.querySelectorAll('.sub-post');
  existing.forEach(e => e.remove());

  if(!expanded){
    const catPosts = posts.filter(p => p.category === cat);
    catPosts.forEach(p => {
      const sub = document.createElement('div');
      sub.textContent = p.title;
      sub.className = 'sub-post';
      sub.onclick = (e) => {
        e.stopPropagation();
        loadPost(p.file);
      };
      li.appendChild(sub);
    });
    li.dataset.expanded = 'true';
  } else {
    li.dataset.expanded = 'false';
  }
}

// 加载文章 Markdown
async function loadPost(file) {
  try {
    const res = await fetch(encodeURI(file));
    const md = await res.text();
    const content = document.getElementById('content');
    content.innerHTML = marked.parse(md);
    renderMath();
  } catch(e) {
    console.error("加载失败:", file, e);
  }
}

// 渲染 LaTeX
function renderMath() {
  renderMathInElement(document.getElementById('content'), {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false }
    ]
  });
}

// 搜索文章
document.getElementById('searchBox').addEventListener('input', e => {
  const keyword = e.target.value.toLowerCase();
  const found = posts.filter(p => p.title.toLowerCase().includes(keyword));
  const content = document.getElementById('content');
  content.innerHTML = '';
  if(found.length === 0){
    content.innerHTML = '<p>未找到相关文章</p>';
    return;
  }
  found.forEach(p => {
    const a = document.createElement('a');
    a.href = "#";
    a.textContent = `[${p.category}] ${p.title}`;
    a.className = "sub-post";
    a.onclick = () => loadPost(p.file);
    content.appendChild(a);
  });
});

loadPost(posts[0].file);
