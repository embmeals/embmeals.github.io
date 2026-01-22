/**
 * Main Application Module
 * Follows Single Responsibility Principle - coordinates all application modules
 */
(function ($) {
    "use strict";

    /**
     * Application Configuration
     * Centralized configuration object
     */
    const AppConfig = {
        selectors: {
            window: $(window),
            container: $(".tokyo_tm_all_wrap"),
            sections: $(".tokyo_tm_section"),
            navigationLinks: $(".transition_link a"),
            mobileMenuButton: $(".tokyo_tm_topbar .trigger .hamburger"),
            mobileMenu: $(".tokyo_tm_mobile_menu"),
            learnMoreButton: $(".tokyo_tm_button a"),
            portfolioItems: $(".portfolio_zoom"),
            customCursor: $(".mouse-cursor"),
        },
        cssClasses: {
            opened: "opened",
            closed: "closed",
            active: "active",
            hidden: "hidden",
            animated: "animated",
        },
        animations: {
            enter: $(".tokyo_tm_all_wrap").data("enter"),
            exit: $(".tokyo_tm_all_wrap").data("exit"),
        },
    };


    /**
     * Modal Manager Module
     * Handles modal creation and management
     */
    const ModalManager = {
        modalTemplate: `
            <div class="tokyo_tm_modalbox">
                <div class="box_inner">
                    <div class="close">
                        <button type="button" aria-label="Close modal"><i class="icon-cancel" aria-hidden="true"></i></button>
                    </div>
                    <div class="description_wrap"></div>
                </div>
            </div>
        `,

        inject() {
            AppConfig.selectors.container.prepend(this.modalTemplate);
        },

        initialize() {
            this.inject();
            this.attachCloseHandlers();
        },

        attachCloseHandlers() {
            $(document).on("click", ".tokyo_tm_modalbox .close button", function (e) {
                e.preventDefault();
                $(".tokyo_tm_modalbox").removeClass("opened");
            });
        },
    };

    /**
     * Navigation Controller
     * Handles page transitions and navigation
     */
    const NavigationController = {
        initialize() {
            this.initializeInitialSection();
            this.attachNavigationHandlers();
            this.attachMobileMenuHandlers();
            this.attachHashChangeHandler();
        },

        initializeInitialSection() {
            const initialHash = this.getInitialHash();
            const $targetSection = this.getSectionByHash(initialHash);

            this.setActiveSection($targetSection, initialHash);
            this.setActiveMenuItem(initialHash);
        },

        getInitialHash() {
            const hash = window.location.hash;
            if (hash && hash.length > 1) {
                return hash;
            }
            return "#home";
        },

        getSectionByHash(hash) {
            const $section = $(hash);
            if ($section.length) {
                return $section;
            }
            return $("#home");
        },

        attachNavigationHandlers() {
            AppConfig.selectors.navigationLinks.on("click", (event) => {
                this.handleNavigationClick(event);
            });
        },

        handleNavigationClick(event) {
            event.preventDefault();
            const clickedLink = $(event.currentTarget);
            const target = clickedLink.attr("href");

            if (!this.isValidSectionHash(target)) {
                return;
            }

            const $targetSection = this.getSectionByHash(target);
            const $listItem = clickedLink.closest("li");

            if ($listItem.hasClass(AppConfig.cssClasses.active)) {
                return;
            }

            this.transitionToSection($targetSection, $listItem, target);
        },

        isValidSectionHash(target) {
            return typeof target === "string" && target.startsWith("#") && target.length > 1;
        },

        isButtonNavigation(link) {
            return link.parent().hasClass("tokyo_tm_button");
        },

        triggerMenuNavigation(target) {
            $(`.menu .transition_link a[href="${target}"]`).trigger("click");
        },

        transitionToSection(targetSection, listItem, targetHash) {
            const { sections, container } = AppConfig.selectors;
            const { opened, active, hidden, animated } = AppConfig.cssClasses;
            const { enter, exit } = AppConfig.animations;

            sections.removeClass(active);
            sections.removeClass(`${animated} ${enter}`);

            if (container.hasClass(opened)) {
                sections.addClass(`${animated} ${exit}`);
            }

            container.addClass(opened);
            this.setActiveMenuItem(targetHash);

            targetSection
                .removeClass(`${animated} ${exit}`)
                .addClass(`${animated} ${enter}`)
                .removeClass(hidden)
                .addClass(active);

            sections.not(targetSection).addClass(hidden);

            this.updateHash(targetHash);
        },

        setActiveSection(targetSection, targetHash) {
            const { sections } = AppConfig.selectors;
            const { active, hidden } = AppConfig.cssClasses;

            sections.removeClass(active).addClass(hidden);
            targetSection.removeClass(hidden).addClass(active);

            this.updateHash(targetHash);
        },

        setActiveMenuItem(targetHash) {
            const $navigationList = $(".transition_link li");
            $navigationList.removeClass(AppConfig.cssClasses.active);
            $(`.transition_link a[href="${targetHash}"]`).closest("li").addClass(AppConfig.cssClasses.active);
        },

        updateHash(targetHash) {
            if (targetHash && history.replaceState) {
                history.replaceState(null, "", targetHash);
            } else if (targetHash) {
                window.location.hash = targetHash;
            }
        },

        attachHashChangeHandler() {
            $(window).on("hashchange", () => {
                const targetHash = this.getInitialHash();
                const $targetSection = this.getSectionByHash(targetHash);

                this.setActiveSection($targetSection, targetHash);
                this.setActiveMenuItem(targetHash);
            });
        },

        attachMobileMenuHandlers() {
            const { mobileMenuButton, mobileMenu } = AppConfig.selectors;

            mobileMenuButton.on("click", () => {
                mobileMenuButton.toggleClass("is-active");
                mobileMenu.toggleClass("opened");
            });

            mobileMenu.find("ul li a").on("click", () => {
                mobileMenuButton.removeClass("is-active");
                mobileMenu.removeClass("opened");
            });

            $(window).on("resize", () => {
                if (window.innerWidth > 1040) {
                    mobileMenuButton.removeClass("is-active");
                    mobileMenu.removeClass("opened");
                }
            });
        },
    };

    /**
     * About Modal Controller
     * Opens and closes the "Learn More" modal
     */
    const AboutModalController = {
        initialize() {
            this.attachOpenHandler();
            this.attachCloseHandlers();
        },

        attachOpenHandler() {
            $(document).on("click", ".custom-btn.btn-15", (event) => {
                event.preventDefault();
                $(".tokyo_tm_modalbox_about").addClass("opened");
            });
        },

        attachCloseHandlers() {
            $(document).on("click", ".tokyo_tm_modalbox_about .close button", (event) => {
                event.preventDefault();
                $(".tokyo_tm_modalbox_about").removeClass("opened");
            });

            $(document).on("keydown", (event) => {
                if (event.key === "Escape") {
                    $(".tokyo_tm_modalbox_about").removeClass("opened");
                    $("#nsfw_disclaimer").attr("aria-hidden", "true");
                }
            });
        },
    };

    /**
     * Portfolio Manager
     * Handles portfolio interactions and filtering
     */
    const PortfolioManager = {
        initialize() {
            this.attachHoverHandlers();
            this.attachFilterHandlers();
        },

        attachHoverHandlers() {
            AppConfig.selectors.portfolioItems
                .on("mouseenter", function () {
                    $(this).addClass("hover");
                })
                .on("mouseleave", function () {
                    $(this).removeClass("hover");
                });
        },

        attachFilterHandlers() {
            // Portfolio filtering logic would go here
            // Keeping placeholder for future enhancement
        },
    };

    /**
     * Custom Cursor Controller
     * Manages custom cursor behavior
     */
    const CustomCursorController = {
        initialize() {
            this.attachCursorHandlers();
        },

        attachCursorHandlers() {
            const { customCursor } = AppConfig.selectors;

            $(document).on("mousemove", (e) => {
                customCursor.css({
                    top: e.clientY + "px",
                    left: e.clientX + "px",
                });
            });

            $("a, button, .cursor-pointer")
                .on("mouseenter", () => {
                    customCursor.addClass("cursor-hover");
                })
                .on("mouseleave", () => {
                    customCursor.removeClass("cursor-hover");
                });
        },
    };

    /**
     * Image Handler
     * Manages image-related functionality
     */
    const ImageHandler = {
        initialize() {
            this.convertImagesToSvg();
            this.applyBackgroundImages();
        },

        convertImagesToSvg() {
            $("img.svg").each(function () {
                const $img = $(this);
                const imgID = $img.attr("id");
                const imgClass = $img.attr("class");
                const imgURL = $img.attr("src");

                $.get(
                    imgURL,
                    function (data) {
                        let $svg = $(data).find("svg");

                        if (typeof imgID !== "undefined") {
                            $svg = $svg.attr("id", imgID);
                        }
                        if (typeof imgClass !== "undefined") {
                            $svg = $svg.attr("class", imgClass + " replaced-svg");
                        }
                        $svg = $svg.removeAttr("xmlns:a");
                        $img.replaceWith($svg);
                    },
                    "xml",
                );
            });
        },

        applyBackgroundImages() {
            $("[data-img-url]").each(function () {
                const element = $(this);
                const url = element.data("img-url");
                if (url) {
                    element.css("background-image", `url(${url})`);
                }
            });
        },
    };


    /**
     * Gallery Popup Manager
     * Restores template lightbox behavior for collage folders using Magnific Popup.
     */
    const GalleryPopupManager = {
        initialize() {
            this.attachFolderOpenHandlers();
        },

        attachFolderOpenHandlers() {
            // All folders: open gallery immediately.
            $(".folder.gallery_zoom").on("click", "a.open-btn", (event) => {
                event.preventDefault();
                const $folder = $(event.currentTarget).closest(".folder.gallery_zoom");
                const href = $(event.currentTarget).attr("href");
                this.openFolderGallery($folder, href);
            });
        },

        openFolderGallery($folder, startHref) {
            if (typeof $.magnificPopup === "undefined") {
                return;
            }

            const items = this.buildFolderItems($folder);
            if (!items.length) {
                return;
            }

            const startIndex = this.getStartIndex(items, startHref);

            $.magnificPopup.open(
                {
                    items,
                    type: "image",
                    gallery: { enabled: true },
                    image: { titleSrc: "title" },
                },
                startIndex,
            );
        },

        buildFolderItems($folder) {
            const items = [];

            if (!$folder || !$folder.length) {
                return items;
            }

            const $primary = $folder.find("a.open-btn").first();
            const primaryHref = $primary.attr("href");
            const primaryTitle = $primary.attr("title") || "";

            if (primaryHref) {
                items.push({ src: primaryHref, title: primaryTitle });
            }

            $folder.find(".hidden-images a.zoom").each(function () {
                const href = $(this).attr("href");
                if (!href) {
                    return;
                }
                items.push({ src: href, title: $(this).attr("title") || "" });
            });

            return items;
        },

        getStartIndex(items, startHref) {
            if (!startHref) {
                return 0;
            }

            const index = items.findIndex((item) => item && item.src === startHref);
            return index >= 0 ? index : 0;
        },
    };

    /**
     * Preloader Manager
     * Handles preloader display and hiding
     */
    const PreloaderManager = {
        initialize() {
            this.hidePreloader();
        },

        hidePreloader() {
            const $preloader = $("#preloader");
            let preloaderHidden = false;

            const hideLoader = () => {
                if (preloaderHidden) {
                    return;
                }
                preloaderHidden = true;
                $preloader.addClass("preloaded");
                setTimeout(() => {
                    $preloader.css("display", "none");
                }, 1200);
            };

            AppConfig.selectors.window.on("load", () => {
                hideLoader();
            });

            setTimeout(hideLoader, 3000);
        },
    };

    /**
     * Application Initializer
     * Coordinates initialization of all modules
     */
    const AppInitializer = {
        initialize() {
            this.attachWindowLoadHandler();
            this.initializeModules();
        },

        
        attachWindowLoadHandler() {
            AppConfig.selectors.window.on("load", () => {
                // Post-load initialization if needed
            });
        },

        initializeModules() {
            PreloaderManager.initialize();
            ModalManager.initialize();
            NavigationController.initialize();
            AboutModalController.initialize();
            PortfolioManager.initialize();
            CustomCursorController.initialize();
            ImageHandler.initialize();
            GalleryPopupManager.initialize();
                    },
    };

    /**
     * Application Entry Point
     * Initializes the entire application when DOM is ready
     */
    $(document).ready(() => {
        AppInitializer.initialize();
    });
})(jQuery);
