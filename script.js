document.addEventListener("DOMContentLoaded", function () {
  const videos = document.querySelectorAll(".video-bg");
  const carousel = document.querySelector("#carouselExampleControls");

  function adjustVideoSize() {
    videos.forEach((video) => {
      const videoAspectRatio = video.videoWidth / video.videoHeight;
      const containerAspectRatio = window.innerWidth / window.innerHeight;

      if (containerAspectRatio > videoAspectRatio) {
        video.style.width = "100vw";
        video.style.height = "auto";
      } else {
        video.style.width = "auto";
        video.style.height = "100vh";
      }
    });
  }

  videos.forEach((video) => {
    video.addEventListener("loadedmetadata", adjustVideoSize);
  });

  window.addEventListener("resize", adjustVideoSize);

  // Touch swipe functionality
  let touchStartX = 0;
  let touchEndX = 0;

  function checkDirection() {
    if (touchEndX < touchStartX) {
      // Swipe left
      carousel.querySelector(".carousel-control-next").click();
    }
    if (touchEndX > touchStartX) {
      // Swipe right
      carousel.querySelector(".carousel-control-prev").click();
    }
  }

  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  carousel.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    checkDirection();
  });
});
