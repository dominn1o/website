document.addEventListener('DOMContentLoaded', () => {

    //Go back
    document.getElementById('Back').addEventListener('click', () => {
        window.location.href = '../index.html';
    });
    
    function openExternal(url) {
    window.open(url, "_blank", "noopener");
    }

    document.querySelector(".Instagram")
    .addEventListener("click", () => openExternal("https://www.instagram.com/dominn1o/"));
    document.querySelector(".Tiktok")
    .addEventListener("click", () => openExternal("https://www.tiktok.com/@dominn1o"));
    document.querySelector(".Facebook")
    .addEventListener("click", () => openExternal("https://www.facebook.com/Dominik.Madyavanhu"));


});
