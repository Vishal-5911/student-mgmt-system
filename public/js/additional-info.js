function toggleDropdown() {
    document.getElementById("topicDropdown").classList.toggle("show");
}

function showTopic(index) {
    // Hide all topics
    document.querySelectorAll('.topic-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show selected topic
    document.getElementById(`topic-${index}`).style.display = 'block';
}

// Hide dropdown when clicking outside
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].classList.contains('show')) {
                dropdowns[i].classList.remove('show');
            }
        }
    }
};
