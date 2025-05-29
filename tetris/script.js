document.addEventListener("DOMContentLoaded", () => {
  const pages = document.querySelectorAll(".page");
  const flipSound = document.getElementById("flipSound");
  let current = 0;

  const showPage = (index) => {
    pages.forEach((page, i) => {
      if (i <= index) {
        page.style.transform = "rotateY(-180deg)";
      } else {
        page.style.transform = "rotateY(0deg)";
      }
    });
    if (index > 0) flipSound.play();
  };

  pages.forEach((page, i) => {
    if (i !== 0 && i !== pages.length - 1) {
      page.addEventListener("click", () => {
        current = i;
        showPage(current);
      });
    }
  });

  document.getElementById("start").addEventListener("click", () => {
    current = 1;
    showPage(current);
  });
});
