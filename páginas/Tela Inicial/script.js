
document.addEventListener('click', function(event) {
    for (let i = 0; i < 3; i++) {
        setTimeout(() => createHeart(event.clientX, event.clientY), i * 100);
    }
});

function createHeart(x, y) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤';
    heart.style.cssText = `
        position: fixed;
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
        font-size: 20px;
        color: #C039A8;
        z-index: 10000;
        opacity: 0.8;
        transition: all 1s ease-out;
    `;
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.style.transform = 'translateY(-50px) scale(0.5)';
        heart.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, 1000);
}