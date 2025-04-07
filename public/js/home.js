const slides = document.querySelector('.slides');
const slide = document.querySelectorAll('.slide');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
let index = 0;

function showSlide(i) {
    if (i >= slide.length) index = 0;
    if (i < 0) index = slide.length - 1;
    
    // Corrected transform property
    slides.style.transform = `translateX(${-index * 100}%)`;
}

prev.addEventListener('click', () => { 
    index--; 
    showSlide(index); 
});

next.addEventListener('click', () => { 
    index++; 
    showSlide(index); 
});

setInterval(() => { 
    index++; 
    showSlide(index); 
}, 3000);
