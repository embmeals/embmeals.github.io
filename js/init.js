/* global jQuery, $ */
(function ($) {
    "use strict";

    // ----------------------------------------
    // Cached selectors
    // ----------------------------------------
    var windowElement = $(window);
    var containerElement = $('.tokyo_tm_all_wrap');
    var learnMoreButton = containerElement.find('.tokyo_tm_button a');
    var aboutModal = $('.tokyo_tm_modalbox_about');

    // ----------------------------------------
    // CSS class names
    // ----------------------------------------
    var classNames = {
        opened: 'opened',
        closed: 'closed',
        active: 'active',
        hidden: 'hidden',
        enterAnimation: containerElement.data('enter'),
        exitAnimation: containerElement.data('exit')
    };

    // ----------------------------------------
    // Inject CSS styles dynamically
    // ----------------------------------------
    function injectStyles(cssString) {
        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';

        if (styleElement.styleSheet) {
            styleElement.styleSheet.cssText = cssString;  // For IE <=8
        } else {
            styleElement.appendChild(document.createTextNode(cssString));
        }

        document.head.appendChild(styleElement);
    }

    // ----------------------------------------
    // Initialize on document ready
    // ----------------------------------------
    $(documentReady);

    function documentReady() {
        if (typeof styles === 'string') {
            injectStyles(styles);
        }

        windowElement.on('load', onWindowLoad);

        injectModalWrapper();
        attachPageTransitionHandler();
        attachMobileMenuHandler();
        attachLearnMoreHandler();
        attachPortfolioHoverHandler();
        attachPortfolioFilterHandler();
        attachCustomCursorHandler();
        convertImagesToInlineSvg();
        initializePopupHandler();
        applyBackgroundImages();
        attachLocationClickHandler();
        attachNsfwDisclaimer();
    }

    // ----------------------------------------
    // Inject the generic modal wrapper
    // ----------------------------------------
    function injectModalWrapper() {
        var html =
            '<div class="tokyo_tm_modalbox">' +
            '  <div class="box_inner">' +
            '    <div class="close">' +
            '      <a href="#"><i class="icon-cancel"></i></a>' +
            '    </div>' +
            '    <div class="description_wrap"></div>' +
            '  </div>' +
            '</div>';
        containerElement.prepend(html);
    }

    // ----------------------------------------
    // Attach page transition handler
    // ----------------------------------------
    function attachPageTransitionHandler() {
        var sections = $('.tokyo_tm_section');
        var navigationList = $('.transition_link li');
        var navigationLink = $('.transition_link a');

        navigationLink.on('click', function (event) {
            var clicked = this;
            event.preventDefault();
            var link = $(clicked);
            var target = link.attr('href');

            if (link.parent().hasClass('tokyo_tm_button')) {
                $('.menu .transition_link a[href="' + target + '"]').trigger('click');
                hashtag();
                return;
            }

            var targetSection = $(target);
            var listItem = link.closest('li');

            if (!listItem.hasClass(classNames.active)) {
                navigationList.removeClass(classNames.active);
                containerElement.find(sections).removeClass('animated ' + classNames.enterAnimation);

                if (containerElement.hasClass(classNames.opened)) {
                    containerElement.find(sections).addClass('animated ' + classNames.exitAnimation);
                }

                listItem.addClass(classNames.active);
                containerElement.addClass(classNames.opened);

                targetSection
                    .removeClass('animated ' + classNames.exitAnimation)
                    .addClass('animated ' + classNames.enterAnimation)
                    .removeClass(classNames.hidden)
                    .addClass(classNames.active);

                sections.not(targetSection).addClass(classNames.hidden);
            }
        });
    }

    // ----------------------------------------
    // Update URL hash without page scroll
    // ----------------------------------------
    function hashtag() {
        var current = $('.transition_link li.active a').attr('href');
        if (current && history.replaceState) {
            history.replaceState(null, '', current);
        } else if (current) {
            window.location.hash = current;
        }
    }

    // ----------------------------------------
    // Attach mobile menu handler
    // ----------------------------------------
    function attachMobileMenuHandler() {
        var menuButton = $('.tokyo_tm_topbar .trigger .hamburger');
        var mobileMenu = $('.tokyo_tm_mobile_menu');
        var menuLinks = $('.tokyo_tm_mobile_menu ul li a');

        menuButton.on('click', function () {
            var clickedButton = this;
            $(clickedButton).toggleClass('is-active');
            mobileMenu.toggleClass(classNames.opened);
            return false;
        });

        menuLinks.on('click', function () {
            $('.tokyo_tm_topbar .trigger .hamburger').removeClass('is-active');
            mobileMenu.removeClass(classNames.opened);
            return false;
        });
    }

    // ----------------------------------------
    // Attach Learn More handler
    // ----------------------------------------
    function attachLearnMoreHandler() {
        learnMoreButton.on('click', function (event) {
            event.preventDefault();
            aboutModal.removeClass(classNames.closed).addClass(classNames.opened);
        });

        aboutModal.on('click', '.close a', function (event) {
            event.preventDefault();
            aboutModal.removeClass(classNames.opened).addClass(classNames.closed);
        });
    }

    // ----------------------------------------
    // Attach portfolio hover handler
    // ----------------------------------------
    function attachPortfolioHoverHandler() {
        var portfolioItems = $('.tokyo_tm_portfolio_animation_wrap');

        portfolioItems.each(function () {
            var currentItem = this;
            var element = $(currentItem);

            element.on('mouseenter', function () {
                var title = element.data('title');
                var category = element.data('category');

                if (title) {
                    $('.tokyo_tm_portfolio_titles')
                        .html(title + '<span class="work__cat">' + category + '</span>')
                        .addClass('visible');

                    $(document).on('mousemove.portfolio', function (e) {
                        $('.tokyo_tm_portfolio_titles').css({
                            left: e.clientX - 10,
                            top: e.clientY + 25
                        });
                    });
                }
            }).on('mouseleave', function () {
                $('.tokyo_tm_portfolio_titles').removeClass('visible');
                $(document).off('mousemove.portfolio');
            });
        });
    }

    // ----------------------------------------
    // Attach portfolio filter handler
    // ----------------------------------------
    function attachPortfolioFilterHandler() {
        if (!$.isFunction($.fn.isotope)) 
            return;
        
        var filterLinks = $('.tokyo_tm_portfolio .portfolio_filter ul a');
        var itemList = $('.tokyo_tm_portfolio .portfolio_list');

        filterLinks.on('click', function (event) {
            var clickedFilter = this;
            event.preventDefault();
            var filterValue = $(clickedFilter).data('filter');

            itemList.isotope({
                filter: filterValue,
                animationOptions: {duration: 750, easing: 'linear', queue: false}
            });

            filterLinks.removeClass('current');
            $(clickedFilter).addClass('current');
        });
    }

    function attachNsfwDisclaimer(){
        var $nsfwFolder = $("#art .folder[data-nsfw='true']");
        var $modal = $("#nsfw_disclaimer");
        
        if(!$nsfwFolder.length || !$modal.length) 
            return;

        var pendingHref = null;

        $(document).on('click', "#art .folder[data-nsfw='true'] .open-btn", function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
            pendingHref = $(this).attr('href');
            $modal.attr('aria-hidden','false');
        });

        $(document).on('click','[data-nsfw-cancel]', function(){
            $modal.attr('aria-hidden','true');
            pendingHref = null;
        });

        $(document).on('click','[data-nsfw-accept]', function(){
            $modal.attr('aria-hidden','true');
            if(pendingHref){
                openFolderGallery($nsfwFolder);
                pendingHref = null;
            }
        });

        function getFolderItems($folder){
            var items = [];
            var lead = $folder.find('.open-btn').attr('href');
            
            if(lead){ items.push({ src: lead }); }
            $folder.find('a.zoom').each(function(){
                items.push({ src: $(this).attr('href') });
            });
            return items;
        }

        function openFolderGallery($folder){
            $.magnificPopup.open({
                items: getFolderItems($folder),
                type: 'image',
                gallery: { enabled: true }
            });
        }
    }

    // ----------------------------------------
    // Handle window load
    // ----------------------------------------
    function onWindowLoad() {
        setTimeout(showPreloader, 500);
    }

    // ----------------------------------------
    // Show preloader
    // ----------------------------------------
    function showPreloader() {
        var isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
        var preloaderElement = $('#preloader');

        if (!isMobileDevice) {
            setTimeout(function () {
                preloaderElement.addClass('preloaded');
            }, 800);
            setTimeout(function () {
                preloaderElement.remove();
            }, 2000);
        } else {
            preloaderElement.remove();
        }
    }

    // ----------------------------------------
    // Attach custom cursor handler
    // ----------------------------------------
    function attachCustomCursorHandler() {
        var cursorElement = $('.mouse-cursor');
        
        if (!cursorElement.length) 
            return;

        var cursorInner = document.querySelector('.cursor-inner');
        var cursorOuter = document.querySelector('.cursor-outer');
        var isHovering = false;

        window.addEventListener('mousemove', function (e) {
            if (!isHovering) {
                cursorOuter.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
            }
            cursorInner.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
        });

        $('body').on('mouseenter', 'a, .cursor-pointer', function () {
            isHovering = true;
            cursorInner.classList.add('cursor-hover');
            cursorOuter.classList.add('cursor-hover');
        }).on('mouseleave', 'a, .cursor-pointer', function () {
            isHovering = false;
            cursorInner.classList.remove('cursor-hover');
            cursorOuter.classList.remove('cursor-hover');
        });

        cursorInner.style.visibility = 'visible';
        cursorOuter.style.visibility = 'visible';
    }

    // ----------------------------------------
    // Convert images to inline SVG
    // ----------------------------------------
    function convertImagesToInlineSvg() {
        $('img.svg').each(function () {
            var imageElement = this;
            var $img = $(imageElement);
            var svgClass = $img.attr('class');
            var svgUrl = $img.attr('src');

            $.get(svgUrl, function (data) {
                var $svg = $(data).find('svg');
                if (svgClass) {
                    $svg = $svg.attr('class', svgClass + ' replaced-svg');
                }
                $svg = $svg.removeAttr('xmlns a');
                $img.replaceWith($svg);
            }, 'xml');
        });
    }

    // ----------------------------------------
    // Initialize popup handler
    // ----------------------------------------
    function initializePopupHandler() {
       
        $('.popup-youtube, .popup-vimeo').magnificPopup({
            disableOn: 700,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
        });

        $('.soundcloude_link').magnificPopup({
            type: 'image',
            gallery: {enabled: true}
        });
    }

    $(document).on('click', '#art .folder .open-btn', function(e){
        var $btn = $(this);
        if($btn.closest('[data-nsfw="true"]').length){ return; }
        e.preventDefault();
        var $folder = $btn.closest('.folder');
        var items = [];
        
        var lead = $btn.attr('href');
        
        if(lead){ items.push({ src: lead }); }
        $folder.find('a.zoom').each(function(){ items.push({ src: $(this).attr('href') }); });
        $.magnificPopup.open({ items: items, type: 'image', gallery: { enabled: true }, removalDelay: 300, mainClass: 'mfp-fade' });
    });

    // ----------------------------------------
    // Apply background images
    // ----------------------------------------
    function applyBackgroundImages() {
        $('[data-img-url]').each(function () {
            var element = this;
            var $element = $(element);
            $element.css({backgroundImage: 'url(' + $element.data('img-url') + ')'});
        });
    }

    // ----------------------------------------
    // Attach location click handler
    // ----------------------------------------
    function attachLocationClickHandler() {
        $('.href_location').on('click', function (event) {
            var clickedLink = this;
            
            event.preventDefault();
            var address = $(clickedLink).text().trim().replace(/\s+/g, '+');
            window.open('https://maps.google.com?q=' + address);
        });
    }

})(jQuery);