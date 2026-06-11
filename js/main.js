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
        // Navbar Search Toggle
        $('#navSearchToggle').click(function(e) {
            e.preventDefault();
            $('#navSearchInput').toggleClass('active');
            if ($('#navSearchInput').hasClass('active')) {
                $('#navSearchInput').focus();
            }
        });

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
            if (!$(e.target).closest('#navSearchToggle').length && !$(e.target).closest('#navSearchInput').length) {
                $('#navSearchInput').removeClass('active');
            }
            if (!$(e.target).closest('#Pharmacovigilance').length) {
                $('#Pharmacovigilance').removeClass('expanded');
            }
            if (!$(e.target).closest('#chatbot-fab').length && !$(e.target).closest('.chatbot-overlay').length) {
                $('#chatbot-fab').removeClass('expanded');
            }
        });
        
        // --- Apply Site Settings Globablly ---
        applySiteSettings();
    });
    
    function applySiteSettings() {
        var isEnglish = window.location.pathname.includes('/en/');
        var defaultSettings = isEnglish ? {
            siteName: "EndoCare Yemen",
            siteEmail: "info@endocare-ye.com",
            sitePhone: "+967 712 345 678",
            siteAddress: "Hadda Street, Al-Barakah Commercial Building, Sana'a",
            siteDesc: "Your trusted partner for supplying certified medical vitamins and hormones in Yemen.",
            siteFb: "https://facebook.com/endocare",
            siteWa: "https://wa.me/967712345678"
        } : {
            siteName: "EndoCare اليمن",
            siteEmail: "info@endocare-ye.com",
            sitePhone: "+967 712 345 678",
            siteAddress: "شارع حدة، مبنى البركة التجاري، صنعاء",
            siteDesc: "شريكك الموثوق لتوريد الفيتامينات والهرمونات الطبية المعتمدة في اليمن.",
            siteFb: "https://facebook.com/endocare",
            siteWa: "https://wa.me/967712345678"
        };
        var stored = localStorage.getItem("endocare_settings");
        var settings = stored ? Object.assign({}, defaultSettings, JSON.parse(stored)) : defaultSettings;

        // Apply Email
        $('.site-email-text').text(settings.siteEmail);
        $('.site-email-href').attr('href', 'mailto:' + settings.siteEmail);
        
        // Apply Phone
        $('.site-phone-text').text(settings.sitePhone);
        $('.site-phone-href').attr('href', 'tel:' + settings.sitePhone.replace(/\s+/g, ''));
        
        // Apply Address
        $('.site-address-text').text(settings.siteAddress);
        
        // Apply Social Links
        $('.site-fb-href').attr('href', settings.siteFb);
        $('.site-tg-href').attr('href', settings.siteTg || '#'); // Add Telegram if we had it but fallback to #
        $('.site-li-href').attr('href', settings.siteLi || '#');
        $('.site-wa-href').attr('href', settings.siteWa);
        
        // If meta description
        var metaDesc = document.querySelector('meta[name="description"]');
        if(metaDesc) {
            metaDesc.setAttribute("content", settings.siteDesc);
        }
        
        // Dynamic Title Prefix
        if(document.title.includes("EndoCare اليمن")) {
            document.title = document.title.replace("EndoCare اليمن", settings.siteName);
        } else if(document.title.includes("EndoCare Yemen")) {
            document.title = document.title.replace("EndoCare Yemen", settings.siteName);
        }
    }
    
})(jQuery);

