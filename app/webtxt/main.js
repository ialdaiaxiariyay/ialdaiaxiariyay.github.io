        // DOM元素
        const sidebar = document.getElementById('sidebar');
        const chapterList = document.getElementById('chapter-list');
        const content = document.getElementById('content');
        const bookTitle = document.getElementById('book-title');
        const chapterTitle = document.getElementById('chapter-title');
        const chapterContent = document.getElementById('chapter-content');
        const loading = document.getElementById('loading');
        const jsonUrlInput = document.getElementById('json-url');
        const loadConfigBtn = document.getElementById('load-config');
        const toggleSidebarBtn = document.getElementById('toggle-sidebar');
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const decreaseFontBtn = document.getElementById('decrease-font');
        const resetFontBtn = document.getElementById('reset-font');
        const increaseFontBtn = document.getElementById('increase-font');
        const prevChapterBtn = document.getElementById('prev-chapter');
        const nextChapterBtn = document.getElementById('next-chapter');
        const progressBar = document.getElementById('progress-bar');
        const infoPanel = document.getElementById('info-panel');
        const chapterInfo = document.getElementById('chapter-info');
        const progressInfo = document.getElementById('progress-info');

        const CustomTitle = "世界线收束：真理之环"

        // 当前小说数据
        let currentBook = {
            title: '',
            baseUrl: '',
            chapters: []
        };

        // 当前章节索引
        let currentChapterIndex = 0;

        // 初始化
        function init() {
            
            // 事件监听
            loadConfigFromUrl();
            toggleSidebarBtn.addEventListener('click', toggleSidebar);
            darkModeToggle.addEventListener('click', toggleDarkMode);
            decreaseFontBtn.addEventListener('click', decreaseFont);
            resetFontBtn.addEventListener('click', resetFont);
            increaseFontBtn.addEventListener('click', increaseFont);
            prevChapterBtn.addEventListener('click', prevChapter);
            nextChapterBtn.addEventListener('click', nextChapter);
            
            // 监听键盘事件
            document.addEventListener('keydown', handleKeyPress);
            
            // 监听滚动事件
            content.addEventListener('scroll', updateProgress);
            
            // 检查本地存储的主题设置
            if (localStorage.getItem('darkMode') === 'enabled') {
                document.body.classList.add('dark-mode');
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i><span>日间模式</span>';
            }
            
            // 检查字体大小设置
            const savedFontSize = localStorage.getItem('fontSize');
            if (savedFontSize) {
                chapterContent.style.fontSize = savedFontSize;
            }
        }

        function fetchWithCacheBuster(url) {
            const separator = url.includes('?') ? '&' : '?';
            return fetch(`${url}${separator}_t=${Date.now()}`);
        }


        // 从URL加载配置
        function loadConfigFromUrl() {
            const url = "./config.json";
            if (!url) {
                alert('请输入JSON配置文件链接');
                return;
            }

            loading.style.display = 'block';
            chapterContent.style.display = 'none';
            chapterTitle.style.display = 'none';
            bookTitle.style.display = 'none';
            infoPanel.style.display = 'none';
            document.getElementById('chapter-nav').style.display = 'none';

            fetchWithCacheBuster(url)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then(config => {
                const baseUrl = './txt/'; // 可根据需要从 config 中获取
                loadAllChapters(config, baseUrl);
            })
            .catch(error => {
                loading.innerHTML = `<p style="color:red;">加载配置失败: ${error.message}</p>`;
            });
        }

        // 加载所有章节内容
        function loadAllChapters(config, baseUrl) {
            const chapterFiles = Object.values(config);
            const chapterPromises = chapterFiles.map(file => 
                fetchWithCacheBuster(baseUrl + file)
                .then(response => {
                    if (!response.ok) throw new Error(`无法加载文件: ${file}`);
                    return response.text();
                })
                .catch(error => `【加载失败】${file}: ${error.message}`)
            );

            Promise.all(chapterPromises)
                .then(contents => {
                    // 构建章节内容对象
                    const chapterContentMap = {};
                    chapterFiles.forEach((file, index) => {
                        chapterContentMap[file] = contents[index];
                    });
                    
                    // 解析配置
                    parseConfig(config, chapterContentMap, CustomTitle);
                    
                    // 显示第一章
                    showChapter(0);
                    
                    loading.style.display = 'none';
                    chapterContent.style.display = 'block';
                    chapterTitle.style.display = 'block';
                    bookTitle.style.display = 'block';
                    infoPanel.style.display = 'flex';
                    document.getElementById('chapter-nav').style.display = 'flex';
                })
                .catch(error => {
                    console.error('加载章节内容失败:', error);
                    alert('加载章节内容失败');
                    loading.style.display = 'none';
                });
        }

        // 解析配置
        function parseConfig(config, contentMap, title) {
            currentBook.title = title;
            currentBook.chapters = [];
            
            // 遍历配置对象
            Object.entries(config).forEach(([chapterTitle, fileName]) => {
                currentBook.chapters.push({
                    title: chapterTitle,
                    content: contentMap[fileName] || `内容加载失败: ${fileName}`
                });
            });
            
            // 更新UI
            bookTitle.textContent = currentBook.title;
            updateChapterList();
        }

        // 更新章节列表
        function updateChapterList() {
            chapterList.innerHTML = '';
            
            currentBook.chapters.forEach((chapter, index) => {
                const li = document.createElement('li');
                li.className = 'chapter-item';
                if (index === currentChapterIndex) {
                    li.classList.add('active');
                }
                li.textContent = chapter.title;
                li.addEventListener('click', () => {
                    showChapter(index);
                    // 在移动端点击章节后自动隐藏侧边栏
                    if (window.innerWidth <= 768) {
                        sidebar.classList.remove('active');
                    }
                });
                chapterList.appendChild(li);
            });
        }

        // 显示指定章节
        function showChapter(index) {
            if (index < 0 || index >= currentBook.chapters.length) {
                return;
            }
            
            currentChapterIndex = index;
            const chapter = currentBook.chapters[index];
            
            chapterTitle.textContent = chapter.title;
            chapterContent.innerHTML = formatContent(chapter.content);
            
            // 更新章节列表中的激活状态
            const chapterItems = document.querySelectorAll('.chapter-item');
            chapterItems.forEach((item, i) => {
                if (i === index) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
            
            // 更新章节信息
            chapterInfo.textContent = `第${index + 1}章 / 共${currentBook.chapters.length}章`;
            
            // 更新导航按钮状态
            prevChapterBtn.disabled = index === 0;
            nextChapterBtn.disabled = index === currentBook.chapters.length - 1;
            
            // 滚动到顶部
            content.scrollTop = 0;
            
            // 更新进度条
            updateProgress();
        }

        // 格式化内容（将换行转换为段落）
        function formatContent(content) {
            if (!content) return '<p>暂无内容</p>';
            
            const paragraphs = content.split('\n').filter(p => p.trim() !== '');
            return paragraphs.map(p => `<p>${p}</p>`).join('');
        }

        // 切换侧边栏
        function toggleSidebar() {
            sidebar.classList.toggle('active');
        }

        // 切换夜间模式
        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
            
            // 更新按钮图标和文本
            if (document.body.classList.contains('dark-mode')) {
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i><span>日间模式</span>';
                localStorage.setItem('darkMode', 'enabled');
            } else {
                darkModeToggle.innerHTML = '<i class="fas fa-moon"></i><span>夜间模式</span>';
                localStorage.setItem('darkMode', 'disabled');
            }
        }

        // 减小字体
        function decreaseFont() {
            const currentSize = parseFloat(window.getComputedStyle(chapterContent).fontSize);
            if (currentSize > 14) {
                chapterContent.style.fontSize = (currentSize - 2) + 'px';
                localStorage.setItem('fontSize', chapterContent.style.fontSize);
            }
        }

        // 重置字体
        function resetFont() {
            chapterContent.style.fontSize = '';
            localStorage.removeItem('fontSize');
        }

        // 增大字体
        function increaseFont() {
            const currentSize = parseFloat(window.getComputedStyle(chapterContent).fontSize);
            if (currentSize < 24) {
                chapterContent.style.fontSize = (currentSize + 2) + 'px';
                localStorage.setItem('fontSize', chapterContent.style.fontSize);
            }
        }

        // 上一章
        function prevChapter() {
            if (currentChapterIndex > 0) {
                showChapter(currentChapterIndex - 1);
            }
        }

        // 下一章
        function nextChapter() {
            if (currentChapterIndex < currentBook.chapters.length - 1) {
                showChapter(currentChapterIndex + 1);
            }
        }

        // 处理键盘事件
        function handleKeyPress(e) {
            // 左右箭头切换章节
            if (e.key === 'ArrowLeft') {
                prevChapter();
            } else if (e.key === 'ArrowRight') {
                nextChapter();
            }
        }

        // 更新阅读进度
        function updateProgress() {
            const scrollTop = content.scrollTop;
            const scrollHeight = content.scrollHeight - content.clientHeight;
            const maxScroll = scrollHeight > 0 ? scrollHeight : 1;
            const scrollPercentage = Math.min(100, Math.max(0, Math.round((scrollTop / maxScroll) * 100)));
            progressBar.style.width = scrollPercentage + '%';
            progressInfo.textContent = scrollPercentage + '%';
        }

        // 初始化应用
        init();