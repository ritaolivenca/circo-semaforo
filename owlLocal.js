$(document).ready(function () {
  $(".owl-carousel").on("initialized.owl.carousel", function () {
    setTimeout(function () {
      $(".owl-item.active .owl-slide-animated").addClass("is-transitioned");
      $("section").show();
    }, 200);
  });

  const $owlCarousel = $(".owl-carousel").owlCarousel({
    items: 1,
    loop: true,
    nav: true,
    navText: [
      '<svg width="50" height="50" viewBox="0 0 24 24"><path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/></svg>',
      '<svg width="50" height="50" viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></svg>', // icons from https://iconmonstr.com
    ],
  });

  $owlCarousel.on("changed.owl.carousel", function (e) {
    $(".owl-slide-animated").removeClass("is-transitioned");

    const $currentOwlItem = $(".owl-item").eq(e.item.index);
    $currentOwlItem.find(".owl-slide-animated").addClass("is-transitioned");

    const $target = $currentOwlItem.find(".owl-slide-text");
    if ($target.length) {
      doDotsCalculations($target);
    }
  });

  $owlCarousel.on("resize.owl.carousel", function () {
    setTimeout(function () {
      setOwlDotsPosition();
    }, 50);
  });

  function setOwlDotsPosition() {
    const $target = $(".owl-item.active .owl-slide-text");
    if ($target.length) {
      doDotsCalculations($target);
    }
  }

  function doDotsCalculations(el) {
    if (el.length) {
      const height = el.height();
      const position = el.position();
      if (position) {
        const { top, left } = position;
        const res = height + top + 20;

        $(".owl-carousel .owl-dots").css({
          top: `${res}px`,
          left: `${left}px`,
        });
      }
    }
  }

  setOwlDotsPosition();
});
