(function ($) {
  $(document).ready(function () {
    "use strict";

    // WORKS BACKGROUND
    $(".project-box").hover(
      function () {
        var color = $(this).data("bg");
        $(".works").css({
          "background-color": color,
          "background-image": "none",
        });
      },
      function () {
        $(".works").css({
          "background-color": "",
          "background-image": "",
        });
      }
    );

    // TYPEWRITER
    $("#typewriter").typewriter({
      prefix: "",
      text: ["Please wait", "Still loading", "Almost done"],
      typeDelay: 100,
      waitingTime: 1500,
      blinkSpeed: 800,
    });

    // SLIDER
    var swiper = new Swiper(".swiper-slider", {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        renderBullet: function (index, className) {
          return '<span class="' + className + '">0' + (index + 1) + "</span>";
        },
      },
    });

    // DATA BACKGROUND IMAGE
    var pageSection = $(".bg-image");
    pageSection.each(function (indx) {
      if ($(this).attr("data-background")) {
        $(this).css(
          "background-image",
          "url(" + $(this).data("background") + ")"
        );
      }
    });

    // HAMBURGER MENU
    $(".hamburger").on("click", function (e) {
      if ($(".navigation-menu").hasClass("active")) {
        $(".hamburger").toggleClass("open");
        $("body").toggleClass("overflow");
        $(".navigation-menu").removeClass("active");
        $(".navigation-menu .inner .menu").css("transition-delay", "0s");
        $(".navigation-menu .inner blockquote").css("transition-delay", "0s");
        $(".navigation-menu .bg-layers span").css("transition-delay", "0.3s");
      } else {
        $(".navigation-menu").addClass("active");
        $(".hamburger").toggleClass("open");
        $("body").toggleClass("overflow");
        $(".navigation-menu.active .inner .menu").css(
          "transition-delay",
          "0.45s"
        );
        $(".navigation-menu.active .inner blockquote").css(
          "transition-delay",
          "0.50s"
        );
        $(".navigation-menu .bg-layers span").css("transition-delay", "0s");
      }
      $(this).toggleClass("active");
    });

    // PAGE TRANSITION
    $("body a").on("click", function (e) {
      if (typeof $(this).data("fancybox") == "undefined") {
        e.preventDefault();
        var url = this.getAttribute("href");
        if (url.indexOf("#") != -1) {
          var hash = url.substring(url.indexOf("#"));

          if ($("body " + hash).length != 0) {
            $(".transition-overlay").removeClass("active");
            $(".hamburger").toggleClass("open");
            $("body").toggleClass("overflow");
            $(".navigation-menu").removeClass("active");
            $(".navigation-menu .inner ul").css("transition-delay", "0s");
            $(".navigation-menu .inner blockquote").css(
              "transition-delay",
              "0s"
            );
            $(".navigation-menu .bg-layers span").css(
              "transition-delay",
              "0.3s"
            );

            $("html, body").animate(
              {
                scrollTop: $(hash).offset().top,
              },
              1000
            );
          }
        } else {
          $(".transition-overlay").toggleClass("active");
          setTimeout(function () {
            window.location = url;
          }, 1000);
        }
      }
    });

    // PAGE HEADER FADE
    var divs = $("header");
    $(window).on("scroll", function () {
      var st = $(this).scrollTop();
      divs.css({ opacity: 1 - st / 700 });
      divs.css({ "transition-delay": "0s" });
      divs.css({ transition: "0.05s ease-in-out" });
    });
  });
  // END JQUERY

  // WOW ANIMATION
  wow = new WOW({
    animateClass: "animated",
    offset: 0,
  });
  wow.init();

  // PRELOADER
  $(window).load(function () {
    $("body").addClass("page-loaded");
  });

  function changeLanguage(language) {
    // Select all elements with data-lang-en, data-lang-jp, data-text-en, and data-text-jp attributes
    $("[data-lang-en], [data-text-en], [data-text-jp]").each(function () {
      // Check for data-lang attributes
      if ($(this).is("[data-lang-en]")) {
        // Change text for data-lang attributes
        if (language === "jp") {
          $(this).text($(this).attr("data-lang-jp"));
        } else {
          $(this).text($(this).attr("data-lang-en"));
        }
      }
      // Check for data-text attributes
      if ($(this).is("[data-text-en]")) {
        // Change text for data-text attributes
        if (language === "jp") {
          $(this).attr("data-text", $(this).attr("data-text-jp"));
        } else {
          $(this).attr("data-text", $(this).attr("data-text-en"));
        }
      }
    });
  }

  // Event listener for English button
  $("#lang-en").on("click", function () {
    changeLanguage("en");
  });

  // Event listener for Japanese button
  $("#lang-jp").on("click", function () {
    changeLanguage("jp");
  });
})(jQuery);
