/* ============================================
   HIDEOUT CAFE — Interactive Functionality
   ============================================ */

(function () {
    'use strict';

    /* ---------- 1. AOS INITIALISATION ---------- */
    document.addEventListener('DOMContentLoaded', function () {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 80,
                disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            });
        }

        /* ---------- 2. STICKY NAVBAR & BACK-TO-TOP ---------- */
        const navbar = document.getElementById('mainNav');
        const backToTop = document.getElementById('backToTop');

        function handleScroll() {
            const scrollY = window.scrollY;

            if (scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            if (scrollY > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }

            highlightActiveNav();
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        /* ---------- 3. ACTIVE NAVIGATION HIGHLIGHT ---------- */
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        function highlightActiveNav() {
            let currentId = '';
            const scrollPos = window.scrollY + 120;

            sections.forEach(function (section) {
                if (scrollPos >= section.offsetTop) {
                    currentId = section.getAttribute('id');
                }
            });

            navLinks.forEach(function (link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + currentId) {
                    link.classList.add('active');
                }
            });
        }

        /* ---------- 4. SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || targetId === '') return;

                const target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();

                // Close mobile menu if open
                const navCollapse = document.getElementById('navbarNav');
                if (navCollapse.classList.contains('show') && typeof bootstrap !== 'undefined') {
                    const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }

                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });

        /* ---------- 5. MENU CATEGORY FILTERING ---------- */
        const filterButtons = document.querySelectorAll('.filter-btn');
        const menuItems = document.querySelectorAll('.menu-item');

        filterButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const filter = this.getAttribute('data-filter');

                filterButtons.forEach(function (b) { b.classList.remove('active'); });
                this.classList.add('active');

                menuItems.forEach(function (item) {
                    const category = item.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        item.classList.remove('hide');
                        item.style.display = '';
                        item.classList.add('aos-animate');
                    } else {
                        item.classList.add('hide');
                        item.style.display = 'none';
                    }
                });

                // Refresh AOS so newly shown items animate correctly
                if (typeof AOS !== 'undefined') {
                    setTimeout(function () { AOS.refresh(); }, 50);
                }
            });
        });

        /* ---------- 6. GALLERY LIGHTBOX ---------- */
        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxClose = document.getElementById('lightboxClose');
        const lightboxPrev = document.getElementById('lightboxPrev');
        const lightboxNext = document.getElementById('lightboxNext');

        const galleryImages = Array.prototype.map.call(galleryItems, function (item) {
            return item.querySelector('img');
        });

        let currentIndex = 0;

        function openLightbox(index) {
            currentIndex = index;
            lightboxImg.src = galleryImages[currentIndex].src;
            lightboxImg.alt = galleryImages[currentIndex].alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            lightboxImg.src = galleryImages[currentIndex].src;
            lightboxImg.alt = galleryImages[currentIndex].alt;
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            lightboxImg.src = galleryImages[currentIndex].src;
            lightboxImg.alt = galleryImages[currentIndex].alt;
        }

        galleryItems.forEach(function (item, index) {
            item.addEventListener('click', function () {
                openLightbox(index);
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxNext.addEventListener('click', showNext);
        lightboxPrev.addEventListener('click', showPrev);

        // Close when clicking on backdrop (not the image)
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });

        // Keyboard navigation
        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        });

        /* ---------- 7. DYNAMIC FOOTER YEAR ---------- */
        const yearEl = document.getElementById('footerYear');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }

        /* ---------- 8. HERO ENTRANCE (fallback if AOS disabled) ---------- */
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('[data-aos]').forEach(function (el) {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
        }
    });
})();