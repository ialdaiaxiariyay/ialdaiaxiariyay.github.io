        // 启动日志模拟
        const bootLines = [
            "[   OK   ] 启动世界线变动率监测系统",
            "[   OK   ] 加载时间线收敛算法",
            "[   OK   ] 初始化Reading Steiner协议",
            "[   OK   ] 验证用户身份... 用户: ialdaiaxiariyay",
            "[   OK   ] 权限等级: 4 (世界线观测权限)",
            "[   OK   ] 连接GitHub资料库...",
            "[   OK   ] 加载模组开发环境",
            "[   OK   ] 同步世界线时间戳",
            "[   OK   ] 初始化辉光管显示模块",
            "[   OK   ] 系统准备就绪，启动用户界面",
            "",
            "欢迎访问 ialdaiaxiariyay 的世界线观测站",
            "当前世界线: Steins Gate (稳定)",
            "世界线变动率: 1.048596 (±0.000001)",
            "模组开发状态: 活跃",
            "小说连载状态: 进行中",
            "",
            "正在加载观察者档案..."
        ];
        
        const bootScreen = document.getElementById('boot-screen');
        const bootLinesContainer = document.getElementById('boot-lines');
        const bootStatus = document.getElementById('boot-status');
        const mainContent = document.getElementById('main-content');
        const worldlineValue = document.getElementById('worldline-value');
        const currentTime = document.getElementById('current-time');
        const accessTime = document.getElementById('access-time');
        const starsContainer = document.getElementById('stars');
        const mountainsContainer = document.getElementById('mountains');
        const particleName = document.getElementById('particle-name');
        
        // 创建星空
        function createStars() {
            const starCount = 200;
            
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                
                const size = Math.random() * 2 + 1;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                
                star.style.animationDelay = `${Math.random() * 3}s`;
                star.style.opacity = Math.random() * 0.5 + 0.3;
                
                starsContainer.appendChild(star);
            }
        }
        
        // 创建山脉
        function createMountains() {
            const mountainCount = 5;
            const colors = ['#0a1a2a', '#0a2a3a', '#1a3a5a', '#2a4a6a', '#3a5a7a'];
            
            for (let i = 0; i < mountainCount; i++) {
                const mountain = document.createElement('div');
                mountain.style.position = 'absolute';
                mountain.style.bottom = '0';
                mountain.style.width = `${20 + Math.random() * 30}%`;
                mountain.style.height = `${30 + Math.random() * 40}%`;
                mountain.style.left = `${i * (100 / mountainCount) - 10}%`;
                mountain.style.backgroundColor = colors[i % colors.length];
                mountain.style.clipPath = 'polygon(0% 100%, 50% 0%, 100% 100%)';
                mountain.style.opacity = '0.6';
                
                mountainsContainer.appendChild(mountain);
            }
        }
        
        // 模拟启动过程
        let currentLine = 0;
        
        function typeBootLine() {
            if (currentLine < bootLines.length) {
                const line = document.createElement('div');
                line.className = 'boot-line';
                line.textContent = bootLines[currentLine];
                bootLinesContainer.appendChild(line);
                
                // 如果是空行，添加间距
                if (bootLines[currentLine] === "") {
                    line.style.marginBottom = "1rem";
                }
                
                currentLine++;
                
                // 滚动到底部
                bootScreen.scrollTop = bootScreen.scrollHeight;
                
                // 随机延迟，模拟打字效果
                const delay = bootLines[currentLine-1] === "" ? 300 : Math.random() * 100 + 50;
                setTimeout(typeBootLine, delay);
            } else {
                // 启动完成，显示主界面
                setTimeout(() => {
                    bootStatus.textContent = "启动完成，正在进入主界面...";
                    setTimeout(() => {
                        bootScreen.style.opacity = '0';
                        setTimeout(() => {
                            bootScreen.style.display = 'none';
                            mainContent.style.display = 'grid';
                            // 开始背景动画
                            initNixieTubes();
                            startWorldlineAnimation();
                            createParticles();
                            updateCurrentTime();
                            setInterval(updateCurrentTime, 1000);
                        }, 500);
                    }, 1000);
                }, 500);
            }
        }
        
        // 开始启动模拟
        setTimeout(() => {
            createStars();
            createMountains();
            typeBootLine();
        }, 500);
        
        // 辉光管世界线变动器
        let nixieCanvas, nixieCtx;
        let nixieTubes = [];
        let worldline = 1.048596;
        
        function initNixieTubes() {
            nixieCanvas = document.getElementById('nixie-tubes');
            nixieCtx = nixieCanvas.getContext('2d');
            
            // 设置canvas尺寸
            function resizeCanvas() {
                nixieCanvas.width = window.innerWidth;
                nixieCanvas.height = window.innerHeight;
            }
            
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            
            // 创建辉光管
            const tubeCount = Math.floor(window.innerWidth / 100);
            for (let i = 0; i < tubeCount; i++) {
                nixieTubes.push({
                    x: Math.random() * nixieCanvas.width,
                    y: Math.random() * nixieCanvas.height,
                    width: 60,
                    height: 100,
                    value: Math.floor(Math.random() * 10),
                    glow: Math.random() * 0.5 + 0.5,
                    glowSpeed: Math.random() * 0.02 + 0.01,
                    color: Math.random() > 0.5 ? 'orange' : 'blue'
                });
            }
            
            // 开始动画
            animateNixieTubes();
        }
        
        function animateNixieTubes() {
            nixieCtx.fillStyle = 'rgba(10, 10, 10, 0.05)';
            nixieCtx.fillRect(0, 0, nixieCanvas.width, nixieCanvas.height);
            
            // 绘制辉光管
            nixieTubes.forEach(tube => {
                // 更新辉光效果
                tube.glow += tube.glowSpeed;
                if (tube.glow > 1) tube.glow = 0;
                
                // 偶尔改变数字
                if (Math.random() < 0.005) {
                    tube.value = Math.floor(Math.random() * 10);
                }
                
                // 绘制辉光管外框
                nixieCtx.fillStyle = 'rgba(30, 30, 30, 0.8)';
                nixieCtx.fillRect(tube.x, tube.y, tube.width, tube.height);
                
                // 绘制辉光
                const glowIntensity = 0.3 + 0.7 * Math.abs(Math.sin(tube.glow * Math.PI));
                nixieCtx.shadowColor = tube.color === 'orange' ? 'rgba(255, 153, 0, 0.8)' : 'rgba(0, 170, 255, 0.8)';
                nixieCtx.shadowBlur = 20 * glowIntensity;
                
                // 绘制数字
                nixieCtx.fillStyle = tube.color === 'orange' ? 
                    `rgba(255, 200, 0, ${glowIntensity})` : 
                    `rgba(100, 200, 255, ${glowIntensity})`;
                nixieCtx.font = 'bold 60px "Courier New", monospace';
                nixieCtx.textAlign = 'center';
                nixieCtx.textBaseline = 'middle';
                nixieCtx.fillText(tube.value, tube.x + tube.width/2, tube.y + tube.height/2);
                
                // 重置阴影
                nixieCtx.shadowBlur = 0;
                
                // 绘制辉光管细节
                nixieCtx.strokeStyle = 'rgba(100, 100, 100, 0.5)';
                nixieCtx.lineWidth = 2;
                nixieCtx.strokeRect(tube.x, tube.y, tube.width, tube.height);
            });
            
            requestAnimationFrame(animateNixieTubes);
        }
        
        // 世界线数值动画
        function startWorldlineAnimation() {
            function updateWorldline() {
                // 添加微小波动
                const fluctuation = (Math.random() - 0.5) * 0.000002;
                worldline += fluctuation;
                
                // 确保世界线在合理范围内
                if (worldline < 1.048590) worldline = 1.048590;
                if (worldline > 1.048602) worldline = 1.048602;
                
                // 更新显示
                worldlineValue.textContent = worldline.toFixed(6);
                
                // 根据波动改变颜色
                if (fluctuation > 0) {
                    worldlineValue.style.color = '#00ff41';
                    worldlineValue.style.textShadow = '0 0 10px #00ff41';
                } else if (fluctuation < 0) {
                    worldlineValue.style.color = '#ff0040';
                    worldlineValue.style.textShadow = '0 0 10px #ff0040';
                } else {
                    worldlineValue.style.color = '#ff9900';
                    worldlineValue.style.textShadow = '0 0 10px #ff9900';
                }
                
                // 随机间隔更新
                setTimeout(updateWorldline, Math.random() * 2000 + 1000);
            }
            
            updateWorldline();
        }
        
        // 粒子效果
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 50;
            const name = particleName.textContent;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.style.position = 'absolute';
                particle.style.color = i % 3 === 0 ? '#00ff41' : i % 3 === 1 ? '#00d9ff' : '#ff00ff';
                particle.style.fontSize = `${Math.random() * 10 + 10}px`;
                particle.style.opacity = Math.random() * 0.5 + 0.2;
                particle.style.userSelect = 'none';
                particle.style.pointerEvents = 'none';
                
                // 随机选择一个字符
                const charIndex = Math.floor(Math.random() * name.length);
                particle.textContent = name[charIndex];
                
                // 初始位置
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                
                particlesContainer.appendChild(particle);
                
                // 动画
                animateParticle(particle);
            }
        }
        
        function animateParticle(particle) {
            let x = parseFloat(particle.style.left);
            let y = parseFloat(particle.style.top);
            let xSpeed = (Math.random() - 0.5) * 0.5;
            let ySpeed = (Math.random() - 0.5) * 0.5;
            let opacity = parseFloat(particle.style.opacity);
            let opacityDirection = Math.random() > 0.5 ? 0.01 : -0.01;
            
            function move() {
                x += xSpeed;
                y += ySpeed;
                
                // 边界检查
                if (x < 0 || x > 100) xSpeed *= -1;
                if (y < 0 || y > 100) ySpeed *= -1;
                
                // 透明度变化
                opacity += opacityDirection;
                if (opacity < 0.1 || opacity > 0.6) {
                    opacityDirection *= -1;
                }
                
                particle.style.left = `${x}%`;
                particle.style.top = `${y}%`;
                particle.style.opacity = opacity;
                
                requestAnimationFrame(move);
            }
            
            move();
        }
        
        // 更新当前时间
        function updateCurrentTime() {
            const now = new Date();
            const formattedTime = now.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            currentTime.textContent = formattedTime;
            accessTime.textContent = formattedTime;
        }
        
        // 项目信息弹窗
        function showProjectInfo(projectId) {
            let title = '';
            let description = '';
            
            switch(projectId) {
                case 'archive':
                    title = '世界线档案馆';
                    description = '一个用于记录和分析世界线变动数据的Web应用。系统可以可视化不同世界线之间的变动轨迹，分析世界线收束点，并预测未来可能的世界线分支。该档案馆使用辉光管风格UI，数据通过加密协议传输，确保观测数据的安全性。';
                    break;
            }
            
            alert(`${title}\n\n${description}`);
        }
        
        // 机械树交互
        const tree = document.getElementById('tree');
        tree.addEventListener('click', () => {
            const name = particleName.textContent;
            const letters = name.split('');
            
            // 创建文字粒子爆炸效果
            letters.forEach((letter, index) => {
                const particle = document.createElement('div');
                particle.textContent = letter;
                particle.style.position = 'fixed';
                particle.style.color = '#00d9ff';
                particle.style.fontSize = '24px';
                particle.style.fontFamily = 'Orbitron, sans-serif';
                particle.style.fontWeight = 'bold';
                particle.style.textShadow = '0 0 10px #00d9ff';
                particle.style.zIndex = '10000';
                particle.style.left = '50%';
                particle.style.top = '50%';
                particle.style.transform = 'translate(-50%, -50%)';
                particle.style.pointerEvents = 'none';
                
                document.body.appendChild(particle);
                
                // 动画
                const angle = (index / letters.length) * Math.PI * 2;
                const distance = 200;
                const targetX = Math.cos(angle) * distance;
                const targetY = Math.sin(angle) * distance;
                
                let progress = 0;
                const duration = 1000;
                const startTime = Date.now();
                
                function animate() {
                    const currentTime = Date.now();
                    progress = (currentTime - startTime) / duration;
                    
                    if (progress < 1) {
                        const x = targetX * progress;
                        const y = targetY * progress;
                        const opacity = 1 - progress;
                        
                        particle.style.left = `calc(50% + ${x}px)`;
                        particle.style.top = `calc(50% + ${y}px)`;
                        particle.style.opacity = opacity;
                        
                        requestAnimationFrame(animate);
                    } else {
                        document.body.removeChild(particle);
                    }
                }
                
                animate();
            });
            
            // 恢复原状
            setTimeout(() => {
                particleName.style.animation = 'none';
                setTimeout(() => {
                    particleName.style.animation = 'pulse 2s infinite';
                }, 10);
            }, 1000);
        });