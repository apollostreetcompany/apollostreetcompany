(function ($) {
  $(document).ready(function () {
    "use strict";

    var $body = $("body");
    var $window = $(window);
    var $navbar = $(".navbar");
    var $menu = $(".navigation-menu");
    var $hamburger = $(".hamburger");
    var $hamburgerButton = $(".hamburger-menu");

    function setNavbarState() {
      $navbar.toggleClass("navbar-scrolled", $window.scrollTop() > 24);
    }

    function closeMenu() {
      $menu.removeClass("active").attr("aria-hidden", "true");
      $hamburger.removeClass("open active");
      $hamburgerButton.attr("aria-expanded", "false");
      $body.removeClass("overflow");
    }

    function toggleMenu() {
      var isOpen = $menu.hasClass("active");

      if (isOpen) {
        closeMenu();
        return;
      }

      $menu.addClass("active").attr("aria-hidden", "false");
      $hamburger.addClass("open active");
      $hamburgerButton.attr("aria-expanded", "true");
      $body.addClass("overflow");
    }

    if ($.fn.typewriter) {
      $("#typewriter").typewriter({
        prefix: "",
        text: ["Please wait", "Still loading", "Almost done"],
        typeDelay: 100,
        waitingTime: 1500,
        blinkSpeed: 800,
      });
    }

    if (
      typeof Swiper !== "undefined" &&
      $(".swiper-slider .swiper-slide").length > 1
    ) {
      new Swiper(".swiper-slider", {
        speed: 700,
        loop: true,
        autoplay: {
          delay: 5600,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      });
    }

    $(".bg-image").each(function () {
      var image = $(this).data("background");

      if (image) {
        $(this).css("background-image", "url(" + image + ")");
      }
    });

    $(".project-box").hover(
      function () {
        var color = $(this).data("bg");

        if (color) {
          $(".works").css("background-color", color);
        }
      },
      function () {
        $(".works").css("background-color", "");
      },
    );

    $hamburgerButton.on("click", function (event) {
      event.preventDefault();
      toggleMenu();
    });

    $(".navigation-menu a").on("click", function () {
      closeMenu();
    });

    $("a[href^='#']").on("click", function (event) {
      var hash = this.hash;
      var $target;

      if (!hash || hash === "#") {
        return;
      }

      $target = $(hash);

      if (!$target.length) {
        return;
      }

      event.preventDefault();
      closeMenu();

      $("html, body").animate(
        {
          scrollTop: $target.offset().top,
        },
        700,
      );
    });

    function changeLanguage(language) {
      $("[data-lang-en]").each(function () {
        var $element = $(this);
        var text =
          language === "jp"
            ? $element.attr("data-lang-jp")
            : $element.attr("data-lang-en");

        if (typeof text !== "undefined") {
          $element.text(text);
        }
      });

      $("[data-text-en]").each(function () {
        var $element = $(this);
        var text =
          language === "jp"
            ? $element.attr("data-text-jp")
            : $element.attr("data-text-en");

        if (typeof text !== "undefined") {
          $element.attr("data-text", text);
        }
      });

      $(".language a").removeClass("active");
      $("#lang-" + (language === "jp" ? "jp" : "en")).addClass("active");
      $("html").attr("lang", language === "jp" ? "ja" : "en");
    }

    $("#lang-en").on("click", function (event) {
      event.preventDefault();
      changeLanguage("en");
    });

    $("#lang-jp").on("click", function (event) {
      event.preventDefault();
      changeLanguage("jp");
    });

    if (typeof WOW !== "undefined") {
      new WOW({
        animateClass: "animated",
        offset: 0,
      }).init();
    }

    $window.on("scroll", setNavbarState);
    setNavbarState();
  });

  $(window).on("load", function () {
    $("body").addClass("page-loaded");
  });
})(jQuery);
