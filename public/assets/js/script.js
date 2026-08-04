$(document).ready(function() {

    $('#menuToggle').on('click', function() {
        $('#navMenu').addClass('active');
        $('#menuOverlay').addClass('active');
        $('body').css('overflow', 'hidden');
    });

    function closeMobileMenu() {
        $('#navMenu').removeClass('active');
        $('#menuOverlay').removeClass('active');
        $('body').css('overflow', 'auto');
    }

    $('#closeMenu, #menuOverlay').on('click', function() {
        closeMobileMenu();
    });

    $(document).keyup(function(e) {
        if (e.key === "Escape") {
            closeMobileMenu();
        }
    });

    $('.hero-bg-slider').slick({
        dots: false,
        arrows: false,
        infinite: true,
        speed: 1000,
        fade: true,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: false
    });

    $('.events-slick-slider').slick({
        dots: false,
        infinite: true,
        speed: 400,
        slidesToShow: 3,
        slidesToScroll: 1,
        swipeToSlide: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    //arrows: false
                }
            }
        ]
    });

    $('.testimonials-slick-slider').slick({
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
});