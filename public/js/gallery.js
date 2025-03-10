document.addEventListener("DOMContentLoaded", function () {
    let currentIndex = 0;
    const images = document.querySelectorAll(".gallery-container img");
    const totalImages = images.length;

    function updateGallery() {
        images.forEach((img, index) => {
            img.style.transform = `translateX(-${currentIndex * 100}%)`;
        });
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % totalImages;
        updateGallery();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateGallery();
    }

    document.getElementById("next").addEventListener("click", nextImage);
    document.getElementById("prev").addEventListener("click", prevImage);

    // Auto-scroll every 2 seconds
    setInterval(nextImage, 5000);
});
