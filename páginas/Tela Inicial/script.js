
class FloatingHearts {
    constructor() {
        this.colors = ['#f00', '#f06', '#f0f', '#f6f', '#f39', '#f9c'];
        this.minSize = 16;
        this.maxSize = 28;
        this.maxHearts = 66;
        this.hearts = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.isActive = false;

        this.init();
    }

    init() {
        this.createHearts();
        this.bindEvents();
        this.animate();
    }

    createHearts() {
        document.querySelectorAll('.floating-heart').forEach(heart => heart.remove());

        for (let i = 0; i < this.maxHearts; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.innerHTML = '♥';
            heart.style.cssText = `
                position: fixed;
                pointer-events: none;
                font-size: ${this.minSize}px;
                opacity: 0;
                z-index: 10000;
                color: ${this.colors[i % this.colors.length]};
                font-weight: normal;
                transition: opacity 0.3s ease;
                will-change: transform, opacity;
            `;
            document.body.appendChild(heart);

            this.hearts.push({
                element: heart,
                x: 0,
                y: 0,
                size: this.minSize,
                speed: 0.3 + Math.random() * 0.7,
                angle: Math.random() * Math.PI * 2,
                life: 0,
                active: false,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 3 - 1
            });
        }
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            if (!this.isActive) {
                this.spawnHeart();
                this.isActive = true;
            }
        });


        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            this.mouseX = touch.clientX;
            this.mouseY = touch.clientY;
            this.spawnHeart();
        });

       
        let lastSpawn = 0;
        const spawnInterval = () => {
            const now = Date.now();
            if (this.isActive && now - lastSpawn > 100) {
                this.spawnHeart();
                lastSpawn = now;
            }
            requestAnimationFrame(spawnInterval);
        };
        spawnInterval();
    }

    spawnHeart() {
        const inactiveHeart = this.hearts.find(heart => !heart.active);

        if (inactiveHeart) {
            inactiveHeart.x = this.mouseX;
            inactiveHeart.y = this.mouseY;
            inactiveHeart.size = this.minSize + Math.random() * (this.maxSize - this.minSize);
            inactiveHeart.life = 0;
            inactiveHeart.active = true;
            inactiveHeart.vx = (Math.random() - 0.5) * 2;
            inactiveHeart.vy = -Math.random() * 3 - 1;

            const heart = inactiveHeart.element;
            heart.style.left = `${inactiveHeart.x}px`;
            heart.style.top = `${inactiveHeart.y}px`;
            heart.style.fontSize = `${inactiveHeart.size}px`;
            heart.style.opacity = '0.8';
            heart.style.transform = 'translate(0, 0) scale(0.5)';
            heart.style.transition = 'none';

            setTimeout(() => {
                heart.style.transition = 'all 0.5s ease-out';
                heart.style.transform = 'translate(0, 0) scale(1)';
            }, 10);
        }
    }

    animate() {
        this.hearts.forEach(heart => {
            if (heart.active) {
                heart.life += 0.016;

              
                heart.vy += 0.05; 
                heart.vx *= 0.99; 
                heart.vy *= 0.99;

                heart.x += heart.vx;
                heart.y += heart.vy;

                
                heart.element.style.left = `${heart.x}px`;
                heart.element.style.top = `${heart.y}px`;
                heart.element.style.opacity = `${0.8 - (heart.life * 0.8)}`;
                heart.element.style.transform = `translate(${heart.vx * 10}px, ${heart.vy * 10}px) scale(${1 - heart.life * 0.3})`;

                
                if (heart.life > 0.8 && Math.random() < 0.02) {
                    this.breakHeart(heart);
                }

                
                if (heart.life > 2 ||
                    heart.y < -100 ||
                    heart.y > window.innerHeight + 100 ||
                    heart.x < -100 ||
                    heart.x > window.innerWidth + 100) {
                    this.deactivateHeart(heart);
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }

    breakHeart(heart) {
        heart.element.innerHTML = '💔';
        heart.element.style.fontWeight = 'bold';
        heart.element.style.color = '#ff4444';
        heart.vx *= 2; 
        heart.vy *= 1.5;
    }

    deactivateHeart(heart) {
        heart.active = false;
        heart.element.style.opacity = '0';
        heart.element.style.transition = 'opacity 0.3s ease';
        heart.element.innerHTML = '♥';
        heart.element.style.fontWeight = 'normal';
        heart.element.style.color = this.colors[Math.floor(Math.random() * this.colors.length)];

        setTimeout(() => {
            heart.element.style.transition = 'none';
        }, 300);
    }

    
    destroy() {
        this.hearts.forEach(heart => {
            if (heart.element && heart.element.parentNode) {
                heart.element.parentNode.removeChild(heart.element);
            }
        });
        this.hearts = [];
    }
}


document.addEventListener('DOMContentLoaded', () => {
   
    setTimeout(() => {
        window.floatingHearts = new FloatingHearts();
    }, 1000);
});


if (module && module.hot) {
    module.hot.dispose(() => {
        if (window.floatingHearts) {
            window.floatingHearts.destroy();
        }
    });
}

