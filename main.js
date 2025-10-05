        // 创建星光背景
        function createStars() {
            const starsContainer = document.getElementById('stars');
            const starCount = 200;
            
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                
                // 随机大小和位置
                const size = Math.random() * 3;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.left = `${Math.random() * 100}vw`;
                star.style.top = `${Math.random() * 100}vh`;
                
                // 随机动画参数
                star.style.setProperty('--duration', `${2 + Math.random() * 3}s`);
                star.style.setProperty('--delay', `${Math.random() * 5}s`);
                
                starsContainer.appendChild(star);
            }
        }
        
        // 创建悬浮山脉
        function createMountains() {
            const canvas = document.getElementById('mountains');
            const width = canvas.width = window.innerWidth;
            const height = canvas.height = window.innerHeight * 0.3;
            
            // 绘制霓虹山脉
            function drawMountains() {
                
                // 绘制多道山脉
                for (let i = 0; i < 3; i++) {
                    const yBase = height - i * 40;
                    const peakCount = 10 + i * 3;
                    const peakHeight = 60 - i * 15;
                    
                    // 创建山峰点
                    for (let j = 0; j < peakCount; j++) {
                        const x = (width / (peakCount - 1)) * j;
                        const noise = Math.random() * 20;
                        const y = yBase - (peakHeight + noise);
                        ctx.lineTo(x, y);
                    }
                    
                    // 山脉渐变填充
                    const gradient = ctx.createLinearGradient(0, yBase - peakHeight, 0, height);
                    gradient.addColorStop(0, `rgba(157, 78, 221, ${0.1 - i * 0.03})`);
                    gradient.addColorStop(1, `rgba(79, 255, 201, ${0.05 - i * 0.015})`);
                
                }
            }
            
            drawMountains();
            
            // 响应窗口大小变化
            window.addEventListener('resize', () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight * 0.3;
                drawMountains();
            });
        }
        
        // 粒子系统 - 用于姓氏效果
        class ParticleSystem {
            constructor() {
                this.particles = [];
                this.container = document.getElementById('particles');
                this.canopyName = document.querySelector('.name-canopy');
                this.ripples = [];
            }
            
            // 创建粒子流拼写姓氏
            createNameParticles() {
                const name = '';
                const rect = this.canopyName.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                // 粒子起始位置（树根）
                const rootRect = document.querySelector('.tree-root').getBoundingClientRect();
                const startX = rootRect.left + rootRect.width / 2;
                const startY = rootRect.top + rootRect.height;
                
                for (let i = 0; i < name.length; i++) {
                    for (let j = 0; j < 15; j++) { // 每个字符多个粒子
                        setTimeout(() => {
                            const p = document.createElement('div');
                            p.className = 'particle';
                            p.innerText = name[i];
                            p.style.position = 'fixed';
                            p.style.left = `${startX}px`;
                            p.style.top = `${startY}px`;
                            p.style.color = `rgba(157, 78, 221, ${0.7 + Math.random() * 0.3})`;
                            p.style.fontSize = `${18 + Math.random() * 10}px`;
                            p.style.opacity = '0';
                            p.style.transition = 'all 1.5s ease-out';
                            p.style.zIndex = '10';
                            p.style.pointerEvents = 'none';
                            
                            this.container.appendChild(p);
                            
                            // 粒子动画
                            setTimeout(() => {
                                const angle = Math.random() * Math.PI * 2;
                                const radius = Math.random() * 100;
                                const targetX = centerX - 100 + (i * 50) + Math.cos(angle) * radius;
                                const targetY = centerY - 50 + Math.sin(angle) * radius;
                                
                                p.style.opacity = '1';
                                p.style.transform = `translate(${targetX - startX}px, ${targetY - startY}px)`;
                                
                                // 粒子消失
                                setTimeout(() => {
                                    p.style.opacity = '0';
                                    setTimeout(() => p.remove(), 1500);
                                }, 2000);
                            }, 100);
                            
                        }, i * 300 + j * 50);
                    }
                }
            }
            
            // 创建金属花瓣
            createPetalParticles() {
                setInterval(() => {
                    const petal = document.createElement('div');
                    petal.className = 'petal';
                    petal.innerHTML = '❖', '✦', '✧', '✶', '✷', '✸', '✹', '❈', '❉';
                    petal.style.position = 'fixed';
                    petal.style.left = `${Math.random() * 1000}vw`;
                    petal.style.top = '-50px';
                    petal.style.color = `rgba(79, 255, 201, ${0.7 + Math.random() * 0.3})`;
                    petal.style.fontSize = `${16 + Math.random() * 10}px`;
                    petal.style.opacity = '0.8';
                    petal.style.zIndex = '8';
                    petal.style.pointerEvents = 'none';
                    petal.style.transition = 'transform 0.3s ease';
                    
                    this.container.appendChild(petal);
                    
                    // 花瓣飘落动画
                    const duration = 5000 + Math.random() * 1000;
                    const endY = window.innerHeight + 50;
                    const endX = parseFloat(petal.style.left) + (Math.random() - 0.5) * 200;
                    
                    petal.style.transition = `left ${duration}ms linear, top ${duration}ms ease-in`;
                    
                    setTimeout(() => {
                        petal.style.top = `${endY}px`;
                        petal.style.left = `${endX}px`;
                    }, 10);
                    
                    // 花瓣落地效果
                    setTimeout(() => {
                        this.createBinaryRipple(endX, endY);
                        petal.remove();
                    }, duration + 100);
                }, 800);
            }
            
            // 创建二进制涟漪
            createBinaryRipple(x, y) {
                const ripple = document.createElement('div');
                ripple.className = 'binary-ripple';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                ripple.style.width = '0px';
                ripple.style.height = '0px';
                
                this.container.appendChild(ripple);
                
                // 涟漪动画
                let size = 0;
                const maxSize = 100 + Math.random() * 150;
                const growthRate = 8;
                const binaryChars = ['0', '1', '#', '*', '&', '%', '$', '@'];
                
                const animateRipple = () => {
                    size += growthRate;
                    ripple.style.width = `${size}px`;
                    ripple.style.height = `${size}px`;
                    
                    // 在涟漪边缘添加二进制字符
                    if (size % 20 < growthRate) {
                        const char = document.createElement('div');
                        char.className = 'binary-char';
                        char.innerText = binaryChars[Math.floor(Math.random() * binaryChars.length)];
                        char.style.position = 'fixed';
                        char.style.left = `${x + size * Math.cos(Math.random() * Math.PI * 2)}px`;
                        char.style.top = `${y + size * Math.sin(Math.random() * Math.PI * 2)}px`;
                        char.style.color = `rgba(79, 255, 201, ${1 - size/maxSize})`;
                        char.style.fontSize = '12px';
                        char.style.zIndex = '9';
                        char.style.pointerEvents = 'none';
                        
                        this.container.appendChild(char);
                        
                        // 字符消失
                        setTimeout(() => {
                            char.style.opacity = '0';
                            setTimeout(() => char.remove(), 500);
                        }, 500);
                    }
                    
                    ripple.style.opacity = `${1 - size/maxSize}`;
                    
                    if (size < maxSize) {
                        requestAnimationFrame(animateRipple);
                    } else {
                        ripple.remove();
                    }
                };
                
                animateRipple();
            }
        }
        
        // 初始化页面
        document.addEventListener('DOMContentLoaded', () => {
            createStars();
            
            const particleSystem = new ParticleSystem();
            particleSystem.createNameParticles();
            particleSystem.createPetalParticles();
            
            // 添加交互效果：点击名字触发特效
            const rootName = document.querySelector('.name-root');
            rootName.addEventListener('click', () => {
                // 添加发光脉冲特效
                rootName.style.animation = 'none';
                setTimeout(() => {
                    rootName.style.animation = 'glow-pulse 4s infinite alternate';
                }, 10);
                
                // 创建点击位置的涟漪
                particleSystem.createBinaryRipple(
                    rootName.getBoundingClientRect().left + rootName.offsetWidth / 2,
                    rootName.getBoundingClientRect().top + rootName.offsetHeight / 2
                );
            });
        });