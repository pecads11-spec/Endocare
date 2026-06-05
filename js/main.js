(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('bg-white shadow-sm').css('top', '-1px');
        } else {
            $('.sticky-top').removeClass('bg-white shadow-sm').css('top', '-100px');
        }
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    
    // FABs Click Logic
    $(document).ready(function() {
        // Pharmacovigilance Expand/Trigger
        $('#Pharmacovigilance').click(function(e) {
            e.stopPropagation(); // Prevent document click from firing
            if (!$(this).hasClass('expanded')) {
                $(this).addClass('expanded');
            } else {
                var pvModal = document.getElementById('pvModal');
                if (pvModal) {
                    var modal = bootstrap.Modal.getInstance(pvModal) || new bootstrap.Modal(pvModal);
                    modal.show();
                    $(this).removeClass('expanded');
                }
            }
        });

        // Close expanded FABs if clicked outside
        $(document).click(function(e) {
            if (!$(e.target).closest('#Pharmacovigilance').length) {
                $('#Pharmacovigilance').removeClass('expanded');
            }
            if (!$(e.target).closest('#chatbot-fab').length && !$(e.target).closest('.chatbot-overlay').length) {
                $('#chatbot-fab').removeClass('expanded');
            }
        });
    });
    
})(jQuery);

