// Copy email address functionality
function copyEmail() {
    // Define the email address explicitly
    const email = 'derek.photo@outlook.com';
    
    // Try a simple copy approach that works in most browsers
    try {
        // Create a textarea element
        const textArea = document.createElement('textarea');
        textArea.value = email;
        
        // Position it off-screen but accessible
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        
        // Add to document
        document.body.appendChild(textArea);
        
        // Select all text
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, textArea.value.length);
        
        // Copy to clipboard
        const successful = document.execCommand('copy');
        
        // Show notification based on result
        if (successful) {
            showCopyNotification();
        } else {
            throw new Error('execCommand copy failed');
        }
        
        // Clean up
        document.body.removeChild(textArea);
    } catch (err) {
        console.error('Failed to copy email: ', err);
        showCopyNotification(true);
    }
}

// Show copy notification
function showCopyNotification(isError = false) {
    // Remove any existing notification first
    const existingNotification = document.getElementById('email-copy-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'email-copy-notification';
    
    // Get current language from localStorage or use default
    const currentLang = localStorage.getItem('preferredLang') || 'en';
    
    // Get language data based on current language
    const currentLangData = currentLang === 'zh' ? langData_zh : langData_en;
    
    // Get notification message from language data
    const message = isError ? currentLangData.email_copy_failed : currentLangData.email_copied;
    notification.textContent = message;
    
    // Set initial styles
    notification.style.cssText = `
        position: absolute;
        bottom: -45px;
        left: 0;
        background-color: #FFB74D;
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        width: fit-content;
        opacity: 0;
        transform: translateY(10px);
        z-index: 1000;
        pointer-events: none;
        transition: opacity 0.3s ease, transform 0.3s ease;
    `;
    
    // Find the social-link container and add notification
    const socialLink = document.querySelector('.social-link');
    socialLink.appendChild(notification);
    
    // Trigger reflow to ensure animation works
    notification.offsetHeight;
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(10px)';
        // Remove after animation completes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 2000);
}

// Add CSS styles to prevent layout shift on first click
if (!document.getElementById('email-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'email-notification-styles';
    style.textContent = `
        /* Pre-set styles to prevent layout shift on first click */
        .footer-section .social-link {
            position: relative !important;
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
        }
        
        .footer-section .email-text {
            flex: none !important;
        }
    `;
    document.head.appendChild(style);
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create combined language data object from external files
    const langData = {
        en: langData_en,
        zh: langData_zh
    };
    
    // Get saved language from localStorage or use default
    let currentLang = localStorage.getItem('preferredLang') || 'en';
    
    // Update lightbox tag text based on current language
    function updateLightboxTag(lang) {
        const lightboxTag = document.querySelector('.lightbox-tag');
        if (lightboxTag) {
            lightboxTag.textContent = langData[lang].lightbox_title;
        }
    }
    
    // Translate function
    function translatePage(lang) {
        // Update document lang attribute
        document.documentElement.lang = lang;
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (langData[lang][key]) {
                el.innerHTML = langData[lang][key];
            }
        });
        
        // Update page title
        document.title = langData[lang].page_title;
        
        // Update lightbox tag
        updateLightboxTag(lang);
    }
    
    // Language switch handler
    function switchLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('preferredLang', lang);
        
        // Update active state of language buttons
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
        
        // Translate the page
        translatePage(lang);
    }
    
    // Initialize language
    translatePage(currentLang);
    document.querySelector(`[data-lang="${currentLang}"]`).classList.add('active');
    
    // Add event listeners for language buttons
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            switchLanguage(lang);
        });
    });
    
    // Hero Slider
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroPrev = document.querySelector('.hero-btn.prev');
    const heroNext = document.querySelector('.hero-btn.next');
    const indicators = document.querySelectorAll('.indicator');
    
    let currentSlide = 0;
    let slideInterval;
    
    // Get random images from array
    function getRandomImages(images, count) {
        const shuffled = [...images].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }
    
    // Set random images to hero slides
    function setRandomHeroImages() {
        // Generate still category images from galleryConfig
        const stillImages = [];
        if (galleryConfig.still) {
            const stillConfig = galleryConfig.still;
            for (let i = 1; i <= stillConfig.totalImages; i++) {
                stillImages.push(stillConfig.mapToLandscape(i));
            }
        }
        
        // Use still images for hero slides
        const randomImages = getRandomImages(stillImages, heroSlides.length);
        
        heroSlides.forEach((slide, index) => {
            const heroImage = slide.querySelector('.hero-image');
            if (heroImage && randomImages[index]) {
                heroImage.style.backgroundImage = `url('${randomImages[index]}')`;
            }
        });
    }
    
    function initSlider() {
        if (heroSlides.length > 0) {
            setRandomHeroImages();
            startSlider();
        }
    }
    
    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopSlider() {
        clearInterval(slideInterval);
    }
    
    function showSlide(index) {
        // Ensure index is within bounds
        if (index < 0) {
            currentSlide = heroSlides.length - 1;
        } else if (index >= heroSlides.length) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }
        
        // Update slider items
        heroSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === currentSlide) {
                slide.classList.add('active');
            }
        });
        
        // Update indicators
        indicators.forEach((indicator, i) => {
            indicator.classList.remove('active');
            if (i === currentSlide) {
                indicator.classList.add('active');
            }
        });
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Event listeners for slider controls
    if (heroPrev) {
        heroPrev.addEventListener('click', function() {
            stopSlider();
            prevSlide();
            startSlider();
        });
    }
    
    if (heroNext) {
        heroNext.addEventListener('click', function() {
            stopSlider();
            nextSlide();
            startSlider();
        });
    }
    
    // Event listeners for indicators
    indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            stopSlider();
            showSlide(parseInt(this.dataset.index));
            startSlider();
        });
    });
    
    // Gallery Configuration
    // To add new images later, simply update the configuration below
    
    // Function to test if an image exists at a given path
    function imageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }
    
    // Function to get all valid image paths from a directory
    async function getValidImagePaths(directory, prefix, maxConsecutiveFailures = 3) {
        // Based on the console errors, most images are png format
        const extensions = ['png']; // Only check png format first to reduce 404 errors
        const validPaths = [];
        let consecutiveFailures = 0;
        let index = 1;
        const maxPossibleAttempts = 100; // 设置最大可能尝试次数，防止无限循环
        
        // Try image indices until we reach max possible attempts or have too many consecutive failures
        while (index <= maxPossibleAttempts && consecutiveFailures < maxConsecutiveFailures) {
            let found = false;
            
            // Try each extension (only png for now to reduce errors)
            for (const extension of extensions) {
                const imagePath = `${directory}/${prefix}-${index}.${extension}`;
                const exists = await imageExists(imagePath);
                
                if (exists) {
                    validPaths.push(imagePath);
                    found = true;
                    consecutiveFailures = 0; // Reset failure counter
                    break; // Move to next index if found
                }
            }
            
            // If no extension found for this index
            if (!found) {
                consecutiveFailures++;
            }
            
            index++;
        }
        
        // Only check jpg format for specific known images that might be jpg
        // This reduces the number of 404 errors significantly
        if (validPaths.length === 0) {
            // If no png images found, try jpg for the first few indices
            for (let index = 1; index <= 5; index++) {
                const imagePath = `${directory}/${prefix}-${index}.jpg`;
                const exists = await imageExists(imagePath);
                
                if (exists) {
                    validPaths.push(imagePath);
                }
            }
        }
        
        return validPaths;
    }
    
    // Initialize gallery with dynamic image detection
    async function initializeGallery() {
        try {
            // Get valid image paths for both categories with automatic detection
            const stillImages = await getValidImagePaths('images/still', 's'); // 自动检测still文件夹中的图片数量
            const wallpaperImages = await getValidImagePaths('images/wallpaper', 'w'); // 自动检测wallpaper文件夹中的图片数量
            
            // Create dynamic gallery configuration
            const newGalleryConfig = {
                still: {
                    totalImages: stillImages.length,
                    validPaths: stillImages,
                    mapToLandscape: (index) => {
                        const safeIndex = index - 1;
                        return safeIndex >= 0 && safeIndex < stillImages.length ? stillImages[safeIndex] : '';
                    }
                },
                wallpaper: {
                    totalImages: wallpaperImages.length,
                    validPaths: wallpaperImages,
                    mapToLandscape: (index) => {
                        const safeIndex = index - 1;
                        return safeIndex >= 0 && safeIndex < wallpaperImages.length ? wallpaperImages[safeIndex] : '';
                    }
                }
            };
            
            // Update global galleryConfig
            galleryConfig = newGalleryConfig;
            window.galleryConfig = galleryConfig;
            
            // Re-initialize slider with updated still images
            setRandomHeroImages();
            
            // Generate gallery with dynamic configuration
            generateGallery(galleryConfig);
        } catch (error) {
            console.error('Error initializing gallery:', error);
        }
    }
    
    // Image mapping configuration
    // This will be replaced with dynamic configuration during initialization
    let galleryConfig = {
        still: {
            totalImages: 0,
            validPaths: [],
            mapToLandscape: () => ''
        },
        wallpaper: {
            totalImages: 0,
            validPaths: [],
            mapToLandscape: () => ''
        }
    };
    
    // Initialize slider
    initSlider();
    

    
    // Function to determine image orientation
    function getImageOrientation(width, height) {
        return width > height ? 'landscape' : 'portrait';
    }
    
    // Check if CSS Grid is supported
    function isCssGridSupported() {
        try {
            const testElement = document.createElement('div');
            testElement.style.display = 'grid';
            return testElement.style.display === 'grid';
        } catch (e) {
            return false;
        }
    }
    
    // JavaScript-based Masonry Layout Fallback
    function applyMasonryLayout() {
        // Apply special handling for portrait images regardless of CSS Grid support
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            const img = item.querySelector('.gallery-image');
            if (img && item.dataset.orientation === 'portrait') {
                // For portrait images, reduce height to create cropping effect
                item.style.height = `${item.offsetWidth * 1.8}px`;
            }
        });
        
        // Only apply JS masonry if CSS Grid is not supported
        if (isCssGridSupported()) return;
        
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;
        
        const allItems = Array.from(galleryGrid.children);
        if (allItems.length === 0) return;
        
        // Filter out hidden items
        const visibleItems = allItems.filter(item => item.style.display !== 'none');
        if (visibleItems.length === 0) return;
        
        // Get computed styles
        const gridStyles = getComputedStyle(galleryGrid);
        const gapValue = gridStyles.gap;
        const gapSize = parseInt(gapValue) || 16; // Default to 16px if gap is not defined
        
        // Get container width first
        const containerWidth = galleryGrid.offsetWidth;
        
        // Get a reliable base width for column calculation
        // Use the grid's minmax value or calculate based on container
        let baseItemWidth;
        
        // Try to extract minmax value from grid-template-columns
        const gridTemplateColumns = gridStyles.gridTemplateColumns;
        const minmaxMatch = gridTemplateColumns.match(/minmax\(([^,]+),/);
        
        if (minmaxMatch) {
            // Use the min value from minmax as base width
            baseItemWidth = parseInt(minmaxMatch[1]);
        } else {
            // Fallback: calculate base width based on container and typical column count
            baseItemWidth = Math.floor(containerWidth / 3); // Use 3 columns as base for better layout
        }
        
        // Ensure base width is at least a reasonable minimum
        baseItemWidth = Math.max(baseItemWidth, 200);
        
        // Calculate number of columns based on container width and base item width
        const numColumns = Math.max(1, Math.floor((containerWidth + gapSize) / (baseItemWidth + gapSize)));
        
        // Use the calculated column width as the standard item width
        const itemWidth = Math.floor((containerWidth - gapSize * (numColumns - 1)) / numColumns);
        
        // Reset all grid and item styles
        galleryGrid.style.position = 'relative';
        galleryGrid.style.height = '';
        
        allItems.forEach(item => {
            item.style.position = '';
            item.style.left = '';
            item.style.top = '';
        });
        
        // Force layout recalculation
        galleryGrid.offsetHeight;
        
        // Create column arrays to track heights
        const columnHeights = new Array(numColumns).fill(0);
        
        // Optimized item distribution for balanced column heights
        visibleItems.forEach((item, index) => {
            // For all items, use consistent width for proper layout
            item.style.width = `${itemWidth}px`;
            
            // Force image to load and get dimensions
            const img = item.querySelector('.gallery-image');
            let itemHeight = item.offsetHeight;
            
            // If image is not loaded yet, use natural dimensions if available
            if (img && img.complete) {
                // Calculate height based on natural aspect ratio
                const orientation = getImageOrientation(img.naturalWidth, img.naturalHeight);
                if (orientation === 'portrait') {
                    // For portrait images, reduce height to create cropping effect
                    itemHeight = img.naturalHeight / img.naturalWidth * itemWidth * 0.7; // Reduce height by 30% for cropping
                } else {
                    // For landscape images, use full height
                    itemHeight = img.naturalHeight / img.naturalWidth * itemWidth;
                }
            } else {
                // Fallback height
                itemHeight = itemWidth * 0.75; // 4:3 aspect ratio fallback
            }
            
            // Set the calculated height for the item container
            item.style.height = `${itemHeight}px`;
            
            // Find the shortest column considering the item's height
            let minHeightIndex = 0;
            for (let i = 1; i < numColumns; i++) {
                if (columnHeights[i] < columnHeights[minHeightIndex]) {
                    minHeightIndex = i;
                }
            }
            
            // Calculate item position based on consistent grid width
            const leftPosition = minHeightIndex * (itemWidth + gapSize);
            const topPosition = columnHeights[minHeightIndex];
            
            // Set item position
            item.style.position = 'absolute';
            item.style.left = `${leftPosition}px`;
            item.style.top = `${topPosition}px`;
            
            // Update column height with the actual calculated item height
            columnHeights[minHeightIndex] += itemHeight + gapSize;
        });
        
        // Update container height
        const maxHeight = Math.max(...columnHeights);
        galleryGrid.style.height = maxHeight > 0 ? `${maxHeight}px` : '';
        
        // Log for debugging
        console.log('Masonry layout applied:', {
            numColumns,
            itemWidth,
            gapSize,
            containerWidth,
            columnHeights,
            maxHeight
        });
    }
    
    // Waterfall Layout with Original Image Dimensions
    let columnCount = 3;
    let columnHeights = [];
    
    // Calculate optimal column count based on screen size
    function calculateColumnCount() {
        const width = window.innerWidth;
        if (width < 576) {
            columnCount = 1;
        } else if (width < 992) {
            columnCount = 2;
        } else {
            columnCount = 3;
        }
        return columnCount;
    }
    
    // Initialize column heights
    function initColumnHeights() {
        columnHeights = new Array(columnCount).fill(0);
    }
    
    // Find the shortest column index, always preferring leftmost columns
    function findShortestColumn() {
        if (columnHeights.length === 0) return 0;
        
        let shortestIndex = 0;
        let shortestHeight = columnHeights[0];
        
        for (let i = 1; i < columnHeights.length; i++) {
            // Use a larger epsilon to prioritize left columns when heights are similar
            // This ensures single images in last row are placed on the left
            const epsilon = 10; // 10px tolerance
            if (columnHeights[i] < shortestHeight - epsilon) {
                shortestHeight = columnHeights[i];
                shortestIndex = i;
            }
        }
        
        return shortestIndex;
    }
    
    // Function to check if all images are loaded
    function checkIfAllImagesLoaded() {
        if (window.imagesLoaded === window.totalImagesToLoad) {
            // Re-apply waterfall layout to ensure consistent positioning
            // This ensures all images are positioned in DOM order, not loading order
            reapplyWaterfallLayout();
            
            // Only re-initialize filter functionality once
            if (!window.filterInitialized) {
                initializeGalleryFilter();
                window.filterInitialized = true;
            } else {
                // Just update the galleryItems reference in filter functionality
                updateGalleryFilter();
            }
            
            // Initialize lightbox functionality after gallery is generated
            initializeLightbox();
        }
    }
    
    // Dynamic Gallery Generation with Waterfall Layout
    function generateGallery(config) {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;
        
        // Update global galleryConfig with the new configuration
        if (config) {
            galleryConfig = config;
        }
        
        // Reset loaded images count
        window.imagesLoaded = 0;
        window.totalImagesToLoad = 0;
        
        // Get total images count
        Object.values(galleryConfig).forEach(config => {
            window.totalImagesToLoad += config.totalImages;
        });
        
        // Clear existing gallery items
        galleryGrid.innerHTML = '';
        
        // Set gallery grid to use absolute positioning for waterfall layout
        galleryGrid.style.position = 'relative';
        galleryGrid.style.height = 'auto';
        galleryGrid.style.gridAutoRows = '';
        galleryGrid.style.gridTemplateRows = '';
        galleryGrid.style.alignItems = '';
        galleryGrid.style.justifyContent = '';
        
        // Calculate column count and initialize heights
        calculateColumnCount();
        initColumnHeights();
        
        // Generate new gallery items based on configuration
        Object.entries(galleryConfig).forEach(([category, config]) => {
            const { totalImages, mapToLandscape } = config;
            
            for (let i = 1; i <= totalImages; i++) {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.dataset.category = category;
                
                const img = document.createElement('img');
                
                // Set image source using the mapping function
                img.src = mapToLandscape(i);
                
                img.alt = `${category.charAt(0).toUpperCase() + category.slice(1)} Image ${i}`;
                img.className = 'gallery-image';
                
                // Set initial styles to maintain original dimensions
                img.style.objectFit = 'contain';
                img.style.objectPosition = 'center';
                img.style.width = 'auto';
                img.style.height = 'auto';
                img.style.maxWidth = '100%';
                img.style.maxHeight = 'none';
                img.style.background = 'transparent';
                
                // Detect image orientation once image is loaded
                img.addEventListener('load', function() {
                    // Get original dimensions and calculate container width
                    const naturalWidth = this.naturalWidth;
                    const naturalHeight = this.naturalHeight;
                    const orientation = getImageOrientation(naturalWidth, naturalHeight);
                    galleryItem.dataset.orientation = orientation;
                    
                    // Only set dimensions and orientation, don't calculate position yet
                    // Position will be calculated for all images once they're all loaded
                    const galleryGrid = this.closest('.gallery-grid');
                    const gap = parseFloat(window.getComputedStyle(galleryGrid).gap);
                    const containerWidth = galleryGrid.offsetWidth;
                    const columnWidth = (containerWidth - gap * (columnCount - 1)) / columnCount;
                    
                    // Calculate new dimensions while maintaining original aspect ratio
                    let itemWidth = Math.min(naturalWidth, columnWidth);
                    let itemHeight = (itemWidth * naturalHeight) / naturalWidth;
                    
                    // Set item dimensions while keeping original ratio
                    galleryItem.style.width = `${itemWidth}px`;
                    galleryItem.style.height = `${itemHeight}px`;
                    
                    // Add loaded class for smooth transition
                    galleryItem.classList.add('loaded');
                    
                    window.imagesLoaded++;
                    checkIfAllImagesLoaded();
                });
                
                // Fallback if image fails to load
                img.addEventListener('error', function() {
                    galleryItem.dataset.orientation = 'landscape'; // Default fallback
                    galleryItem.classList.add('loaded');
                    
                    window.imagesLoaded++;
                    checkIfAllImagesLoaded();
                });
                
                galleryItem.appendChild(img);
                galleryGrid.appendChild(galleryItem);
            }
        });
        
        // If no images to load, initialize immediately
        if (window.totalImagesToLoad === 0) {
            if (!window.filterInitialized) {
                initializeGalleryFilter();
                window.filterInitialized = true;
            }
            initializeLightbox();
        }
    }
    
    // Update waterfall layout when window is resized
    function updateWaterfallLayout() {
        // Skip if no gallery grid
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;
        
        // Calculate new column count
        const newColumnCount = calculateColumnCount();
        
        // Only re-layout if column count changed
        if (newColumnCount !== columnCount) {
            // Just call reapplyWaterfallLayout which handles all repositioning logic
            reapplyWaterfallLayout();
        }
    }
    
    // Initialize window resize listener for waterfall layout
    window.addEventListener('resize', function() {
        updateWaterfallLayout();
    });
    
    // Gallery Filter - Global variables to keep state
    let currentGalleryItems = [];
    let currentFilterBtns = [];
    let currentOrientationBtns = [];
    
    // Function to apply combined filter
    function applyFilters() {
        // Get current category filter
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const categoryFilter = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';
        
        // Get current orientation filter
        const activeOrientationBtn = document.querySelector('.orientation-btn.active');
        const orientationFilter = activeOrientationBtn ? activeOrientationBtn.dataset.orientation : 'all';
        
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;
        
        // First show/hide items immediately without any animation
        currentGalleryItems.forEach(item => {
            // Get item category and orientation
            const itemCategory = item.dataset.category;
            const itemOrientation = item.dataset.orientation;
            
            // Check if item matches both filters
            const categoryMatch = categoryFilter === 'all' || itemCategory === categoryFilter;
            const orientationMatch = orientationFilter === 'all' || itemOrientation === orientationFilter;
            
            // Show/hide without any animation or transition
            if (categoryMatch && orientationMatch) {
                // Remove any existing transition styles
                item.style.transition = 'none';
                item.style.opacity = '1';
                item.style.transform = 'none';
                item.style.display = 'block';
            } else {
                // Remove any existing transition styles
                item.style.transition = 'none';
                item.style.display = 'none';
                item.style.opacity = '1';
                item.style.transform = 'none';
            }
        });
        
        // Force reflow immediately
        void galleryGrid.offsetWidth;
        
        // Re-apply waterfall layout after filtering
        reapplyWaterfallLayout();
    }
    
    // Function to reapply waterfall layout after filtering
    function reapplyWaterfallLayout() {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;
        
        // Get all visible items
        const visibleItems = Array.from(galleryGrid.children).filter(item => {
            return item.style.display !== 'none' && window.getComputedStyle(item).display !== 'none';
        });
        
        if (visibleItems.length === 0) {
            // No visible items, reset grid styles
            galleryGrid.style.position = '';
            galleryGrid.style.height = '';
            return;
        }
        
        // Set gallery grid to use absolute positioning for waterfall layout
        galleryGrid.style.position = 'relative';
        galleryGrid.style.height = 'auto';
        galleryGrid.style.gridAutoRows = '';
        galleryGrid.style.gridTemplateRows = '';
        galleryGrid.style.alignItems = '';
        galleryGrid.style.justifyContent = '';
        
        // Calculate column count and initialize heights
        calculateColumnCount();
        initColumnHeights();
        
        // Get gap size
        const gap = parseFloat(window.getComputedStyle(galleryGrid).gap);
        const containerWidth = galleryGrid.offsetWidth;
        const columnWidth = (containerWidth - gap * (columnCount - 1)) / columnCount;
        
        // Reset all visible items positioning
        visibleItems.forEach(item => {
            item.style.position = '';
            item.style.left = '';
            item.style.top = '';
            item.style.width = '';
        });
        
        // Force reflow
        void galleryGrid.offsetWidth;
        
        // Re-position all visible items in the same order as initial load
        // Sort items by their original category and index to match initial load order
        const sortedItems = [...visibleItems].sort((a, b) => {
            // Extract category and index from item
            const aCategory = a.dataset.category;
            const bCategory = b.dataset.category;
            
            // First sort by category
            if (aCategory !== bCategory) {
                return aCategory.localeCompare(bCategory);
            }
            
            // Then sort by their position in the DOM to maintain original order
            return Array.from(galleryGrid.children).indexOf(a) - Array.from(galleryGrid.children).indexOf(b);
        });
        
        // Re-position all sorted items
        sortedItems.forEach(item => {
            const img = item.querySelector('.gallery-image');
            if (!img) return;
            
            // Get image dimensions
            const naturalWidth = img.naturalWidth;
            const naturalHeight = img.naturalHeight;
            
            // Calculate item dimensions while maintaining original aspect ratio
            let itemWidth = Math.min(naturalWidth, columnWidth);
            let itemHeight = (itemWidth * naturalHeight) / naturalWidth;
            
            // Set item dimensions
            item.style.width = `${itemWidth}px`;
            item.style.height = `${itemHeight}px`;
            
            // Find the shortest column to place this item
            const shortestColumnIndex = findShortestColumn();
            
            // Apply position for waterfall layout
            const left = shortestColumnIndex * (columnWidth + gap);
            item.style.position = 'absolute';
            item.style.left = `${left}px`;
            item.style.top = `${columnHeights[shortestColumnIndex]}px`;
            
            // Update column height
            columnHeights[shortestColumnIndex] += itemHeight + gap;
        });
        
        // Update gallery grid height to fit all items
        const maxHeight = Math.max(...columnHeights);
        galleryGrid.style.height = `${maxHeight}px`;
    }
    
    // Gallery Filter initialization
    function initializeGalleryFilter() {
        currentFilterBtns = document.querySelectorAll('.filter-btn');
        currentOrientationBtns = document.querySelectorAll('.orientation-btn');
        currentGalleryItems = document.querySelectorAll('.gallery-item');
        
        // Event listener for category filter buttons
        currentFilterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                currentFilterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // Apply combined filters
                applyFilters();
            });
        });
        
        // Event listener for orientation filter buttons
        currentOrientationBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                currentOrientationBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // Apply combined filters
                applyFilters();
            });
        });
    }
    
    // Update gallery filter with new items
    function updateGalleryFilter() {
        // Just update the galleryItems reference
        currentGalleryItems = document.querySelectorAll('.gallery-item');
        // Apply current filters to new items
        applyFilters();
    }
    
    // Initialize gallery after DOM is loaded with dynamic image detection
    initializeGallery();
    
    // Update gallery items on window resize for CSS Grid layout
    window.addEventListener('resize', function() {
        // Debounce to avoid too many recalculations
        clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(() => {
            // Re-apply filters to update grid layout
            if (window.filterInitialized) {
                applyFilters();
            }
        }, 250);
    });
    
    // Lightbox initialization
    let currentLightboxIndex = 0;
    let lightboxImages = [];
    
    // Get lightbox elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxClose = document.querySelector('.lightbox-close');
    const downloadBtn = document.querySelector('.download-btn');
    
    function initializeLightbox() {
        const galleryImages = document.querySelectorAll('.gallery-image');
        
        // Clear existing lightbox images and listeners
        lightboxImages = [];
        
        // Collect all gallery images
        galleryImages.forEach((img, index) => {
            const imgSrc = img.src;
            lightboxImages.push(imgSrc);
            
            // Remove any existing click listeners
            img.onclick = null;
            
            // Add new click listener
            img.addEventListener('click', function() {
                openLightbox(index);
            });
        });
        
        // Update lightbox tag language
        updateLightboxTag(currentLang);
    }
    
    function openLightbox(index) {
        currentLightboxIndex = index;
        
        // Get lightbox info element
        const lightboxInfo = document.querySelector('.lightbox-info');
        
        // Reset dimensions
        lightboxImg.style.width = 'auto';
        lightboxImg.style.height = 'auto';
        lightboxInfo.style.width = 'auto';
        
        // Ensure navigation buttons are visible
        const lightboxPrev = document.querySelector('.lightbox-prev');
        const lightboxNext = document.querySelector('.lightbox-next');
        
        if (lightboxPrev) {
            lightboxPrev.style.display = 'flex';
            lightboxPrev.style.visibility = 'visible';
            lightboxPrev.style.opacity = '1';
        }
        
        if (lightboxNext) {
            lightboxNext.style.display = 'flex';
            lightboxNext.style.visibility = 'visible';
            lightboxNext.style.opacity = '1';
        }
        
        // Show lightbox immediately
        lightbox.classList.add('active');
        // Disable scrolling
        document.body.style.overflow = 'hidden';
        
        // Update lightbox tag based on current language
        updateLightboxTag(currentLang);
        
        // Set image source and wait for it to load
        lightboxImg.src = lightboxImages[currentLightboxIndex];
        
        // Wait for image to load completely
        lightboxImg.onload = function() {
            // Get image natural dimensions
            const imgWidth = lightboxImg.naturalWidth;
            const imgHeight = lightboxImg.naturalHeight;
            
            // Calculate aspect ratio
            const aspectRatio = imgWidth / imgHeight;
            
            // Get viewport dimensions
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Define padding and maximum dimensions
            const padding = 50; // 50px padding on all sides
            const maxWidth = viewportWidth - (padding * 2);
            const maxHeight = viewportHeight - (padding * 2);
            
            let displayWidth, displayHeight;
            
            if (aspectRatio > 1) {
                // Landscape image
                // First try to fit by width
                displayWidth = Math.min(imgWidth, maxWidth);
                displayHeight = displayWidth / aspectRatio;
                
                // If height exceeds max, scale by height
                if (displayHeight > maxHeight) {
                    displayHeight = maxHeight;
                    displayWidth = displayHeight * aspectRatio;
                }
            } else {
                // Portrait image
                // First try to fit by height
                displayHeight = Math.min(imgHeight, maxHeight);
                displayWidth = displayHeight * aspectRatio;
                
                // If width exceeds max, scale by width
                if (displayWidth > maxWidth) {
                    displayWidth = maxWidth;
                    displayHeight = displayWidth / aspectRatio;
                }
            }
            
            // Apply calculated dimensions to lightbox image
            lightboxImg.style.width = `${Math.floor(displayWidth)}px`;
            lightboxImg.style.height = `${Math.floor(displayHeight)}px`;
            
            // Get lightbox info element
            const lightboxInfo = document.querySelector('.lightbox-info');
            
            // Calculate the new width based on image orientation
            let newWidth;
            if (aspectRatio < 1) {
                // Portrait image: info bar is 140% of image width
                newWidth = Math.floor(displayWidth * 1.4);
            } else {
                // Landscape image: keep info bar at 80% of image width
                newWidth = Math.floor(displayWidth * 0.8);
            }
            
            // Remove any existing width and transform styles
            lightboxInfo.removeAttribute('style');
            
            // Directly set the width without any animation
            // This avoids any possible transition effects
            lightboxInfo.style.width = `${newWidth}px`;
            
            // Ensure there's no transform applied
            lightboxInfo.style.transform = 'none';
            
            // Ensure no transitions are applied
            lightboxInfo.style.transition = 'none';
            lightboxInfo.style.animation = 'none';
            
            // Adjust close button position and color based on image
            adjustCloseButton();
            
            // Add console log for debugging
            console.log('Image width:', displayWidth, 'px');
            console.log('Image height:', displayHeight, 'px');
        };
    }
    
    // Adjust close button position and color based on image
    function adjustCloseButton() {
        const lightboxClose = document.querySelector('.lightbox-close');
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxContent = document.querySelector('.lightbox-content');
        
        // Get image and container positions
        const imageRect = lightboxImage.getBoundingClientRect();
        const contentRect = lightboxContent.getBoundingClientRect();
        
        // Calculate position relative to image
        const buttonOffset = 20;
        const left = imageRect.width - (lightboxClose.offsetWidth + buttonOffset);
        const top = buttonOffset;
        
        // Set button position
        lightboxClose.style.position = 'absolute';
        lightboxClose.style.top = `${top}px`;
        lightboxClose.style.left = `${left}px`;
        lightboxClose.style.right = 'auto';
        lightboxClose.style.transform = 'none';
        
        // Create a canvas to get image pixel data
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match image
        canvas.width = lightboxImage.width;
        canvas.height = lightboxImage.height;
        
        // Draw the image to canvas
        ctx.drawImage(lightboxImage, 0, 0, canvas.width, canvas.height);
        
        // Define sample area (top-right corner)
        const sampleSize = Math.min(50, canvas.width, canvas.height);
        const sampleX = canvas.width - sampleSize;
        const sampleY = 0;
        
        try {
            // Get pixel data from top-right corner
            const imageData = ctx.getImageData(sampleX, sampleY, sampleSize, sampleSize);
            const data = imageData.data;
            
            // Calculate average color
            let totalR = 0, totalG = 0, totalB = 0;
            let pixelCount = 0;
            
            // Sample every 5th pixel to improve performance
            for (let i = 0; i < data.length; i += 4 * 5) {
                totalR += data[i];
                totalG += data[i + 1];
                totalB += data[i + 2];
                pixelCount++;
            }
            
            const avgR = Math.round(totalR / pixelCount);
            const avgG = Math.round(totalG / pixelCount);
            const avgB = Math.round(totalB / pixelCount);
            
            // Calculate luminance to determine contrast color
            // Using formula: 0.299*R + 0.587*G + 0.114*B
            const luminance = 0.299 * avgR + 0.587 * avgG + 0.114 * avgB;
            
            // Set button color based on luminance
            const buttonColor = luminance > 128 ? '#000000' : '#ffffff';
            lightboxClose.style.color = buttonColor;
            
            // Adjust button background opacity based on contrast
            lightboxClose.style.backgroundColor = luminance > 128 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'rgba(0, 0, 0, 0.2)';
            
            console.log('Adjusted close button color to:', buttonColor, 'based on avg color:', avgR, avgG, avgB);
        } catch (error) {
            console.error('Error adjusting close button color:', error);
            // Fallback to white
            lightboxClose.style.color = '#ffffff';
            lightboxClose.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
        }
        
        // Clean up canvas
        canvas.remove();
    }
    
    // Adjust lightbox size when window is resized
    window.addEventListener('resize', function() {
        if (lightbox.classList.contains('active')) {
            // Re-open the current image to recalculate size
            openLightbox(currentLightboxIndex);
        }
    });
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        // Enable scrolling
        document.body.style.overflow = 'auto';
    }
    
    // Navigate to previous image
    function previousImage() {
        if (currentLightboxIndex > 0) {
            currentLightboxIndex--;
            openLightbox(currentLightboxIndex);
        }
    }
    
    // Navigate to next image
    function nextImage() {
        if (currentLightboxIndex < lightboxImages.length - 1) {
            currentLightboxIndex++;
            openLightbox(currentLightboxIndex);
        }
    }
    
    // Simple and reliable download functionality
    function downloadImage() {
        console.log('Download button clicked');
        
        const imgUrl = lightboxImages[currentLightboxIndex];
        const filename = `image-${currentLightboxIndex + 1}.jpg`;
        
        console.log('Image URL:', imgUrl);
        console.log('Filename:', filename);
        
        // Check if lightboxImages and currentLightboxIndex are valid
        if (!lightboxImages || !lightboxImages[currentLightboxIndex]) {
            console.error('Invalid image URL or index:', { lightboxImages, currentLightboxIndex });
            return;
        }
        
        // Create a new link element
        const link = document.createElement('a');
        
        // Set the image URL
        link.href = imgUrl;
        
        // Set download attribute with filename
        link.download = filename;
        
        // Add rel="noopener noreferrer" for security
        link.rel = 'noopener noreferrer';
        
        // Make the link invisible
        link.style.display = 'none';
        
        // Append the link to the body
        document.body.appendChild(link);
        
        try {
            // Use requestAnimationFrame to ensure the link is in the DOM
            requestAnimationFrame(() => {
                // Trigger the click event
                link.click();
                console.log('Download triggered successfully');
            });
        } catch (error) {
            console.error('Download failed:', error);
            // Alternative: use dispatchEvent
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            link.dispatchEvent(clickEvent);
            console.log('Download event dispatched as fallback');
        } finally {
            // Clean up the link after a short delay
            setTimeout(() => {
                document.body.removeChild(link);
                console.log('Download completed - link removed from DOM');
            }, 100);
        }
        
        console.log('Download process finished');
    }
    
    // Event listeners for lightbox controls
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Navigation button event listeners
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', previousImage);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', nextImage);
    }
    
    // Enhanced download button event listener with debugging
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            // Prevent any potential default behavior that might be interfering
            e.preventDefault();
            e.stopPropagation();
            console.log('Download button click event captured');
            
            // Use a more reliable download approach
            const imgUrl = lightboxImages[currentLightboxIndex];
            const filename = `image-${currentLightboxIndex + 1}.jpg`;
            
            console.log('Image URL from lightbox:', imgUrl);
            console.log('Window location origin:', window.location.origin);
            
            // Try to detect if it's a local file path
            const isLocalPath = imgUrl.startsWith('images/') || imgUrl.startsWith('./images/');
            console.log('Is local path:', isLocalPath);
            
            if (isLocalPath) {
                console.log('Handling local file path:', imgUrl);
                downloadLocalImage(imgUrl, filename);
            } else {
                // For remote files or absolute URLs, use regular download
                console.log('Handling remote/absolute URL:', imgUrl);
                downloadImage(imgUrl, filename);
            }
        });
    } else {
        console.error('Download button not found in DOM');
    }

    // Download Notification Functions
    let downloadNotification = null;
    let notificationBtn = null;
    
    // Initialize notification elements
    function initNotification() {
        downloadNotification = document.getElementById('downloadNotification');
        notificationBtn = document.getElementById('notificationBtn');
        
        if (downloadNotification && notificationBtn) {
            notificationBtn.addEventListener('click', hideNotification);
        }
    }
    
    // Show download notification
    function showNotification(message) {
        if (downloadNotification) {
            const notificationText = downloadNotification.querySelector('.notification-text');
            if (notificationText) {
                notificationText.textContent = message;
            }
            
            downloadNotification.classList.add('active');
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                hideNotification();
            }, 5000);
        }
    }
    
    // Hide download notification
    function hideNotification() {
        if (downloadNotification) {
            downloadNotification.classList.remove('active');
        }
    }
    
    // Special function for local images to avoid CORS issues
    function downloadLocalImage(localPath, filename) {
        console.log('=== Download Local Image ===');
        console.log('Local path:', localPath);
        console.log('Filename:', filename);
        
        // Initialize notification if not already done
        if (!downloadNotification) {
            initNotification();
        }
        
        try {
            // Create an image element to load the local image
            const img = new Image();
            
            // Set crossOrigin to avoid canvas tainting
            img.crossOrigin = 'anonymous';
            
            // Handle image load
            img.onload = function() {
                console.log('Local image loaded successfully');
                
                // Create a canvas and draw the image
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                // Convert canvas to blob
                canvas.toBlob(function(blob) {
                    if (blob) {
                        console.log('Canvas converted to blob:', blob.type, blob.size);
                        
                        // Create a blob URL
                        const blobUrl = URL.createObjectURL(blob);
                        console.log('Blob URL:', blobUrl);
                        
                        // Create download link
                        const link = document.createElement('a');
                        link.href = blobUrl;
                        link.download = filename;
                        link.rel = 'noopener noreferrer';
                        link.style.display = 'none';
                        
                        // Add to DOM and trigger download
                        document.body.appendChild(link);
                        
                        requestAnimationFrame(() => {
                            link.click();
                            
                            // Clean up
                            setTimeout(() => {
                                document.body.removeChild(link);
                                URL.revokeObjectURL(blobUrl);
                                console.log('Local image download completed successfully');
                            }, 100);
                        });
                    } else {
                        console.error('Failed to create blob from canvas');
                        showNotification('Download failed. Please right-click the image and select "Save image as..."');
                    }
                }, 'image/jpeg', 0.95);
            };
            
            // Handle image error
            img.onerror = function(error) {
                console.error('Failed to load local image:', error);
                showNotification('Download failed. Please right-click the image and select "Save image as..."');
            };
            
            // Load the image - use the actual path as is
            console.log('Loading image from:', localPath);
            img.src = localPath;
            
        } catch (error) {
            console.error('Local image download failed:', error);
            showNotification('Download failed. Please right-click the image and select "Save image as..."');
        }
    }
    
    // Optimized download function to reliably trigger browser download
    function downloadImage(url, filename) {
        console.log('=== Download Image ===');
        console.log('URL:', url);
        console.log('Filename:', filename);
        
        // Initialize notification if not already done
        if (!downloadNotification) {
            initNotification();
        }
        
        // For all cases, use fetch to ensure we get a blob that can be downloaded
        console.log('Using fetch to get blob for download');
        
        fetch(url, {
            mode: 'cors',
            credentials: 'omit',
            headers: {
                'Accept': 'image/*'
            }
        })
        .then(response => {
            console.log('Fetch response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return response.blob();
        })
        .then(blob => {
            console.log('Blob created:', blob.type, blob.size);
            
            // Create a blob URL
            const blobUrl = URL.createObjectURL(blob);
            console.log('Blob URL:', blobUrl);
            
            // Create download link with proper attributes
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            link.rel = 'noopener noreferrer';
            link.style.display = 'none';
            
            // Add to DOM and trigger download
            document.body.appendChild(link);
            
            // Use requestAnimationFrame to ensure DOM is ready
            requestAnimationFrame(() => {
                link.click();
                
                // Clean up after download
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(blobUrl);
                    console.log('Download completed successfully');
                }, 100);
            });
        })
        .catch(error => {
            console.error('Download failed:', error);
            
            // If fetch fails, try direct download as fallback
            console.log('Fetch failed, trying direct download as fallback');
            
            try {
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.rel = 'noopener noreferrer';
                link.style.display = 'none';
                
                document.body.appendChild(link);
                
                requestAnimationFrame(() => {
                    link.click();
                    
                    setTimeout(() => {
                        document.body.removeChild(link);
                        console.log('Direct download completed (fallback)');
                    }, 100);
                });
            } catch (fallbackError) {
                console.error('Fallback download also failed:', fallbackError);
                showNotification('Download failed. Please right-click the image and select "Save image as..."');
            }
        });
    }
    
    // Close lightbox when clicking outside
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Close lightbox with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    // Initialize notification system when DOM is loaded
    initNotification();
    
    // Email Modal Functionality
    const emailBtn = document.getElementById('email-btn');
    const emailModal = document.getElementById('email-modal');
    const emailClose = document.querySelector('.email-modal-close');
    const emailCopyBtn = document.getElementById('email-copy-btn');
    const emailAddress = document.getElementById('email-address');
    
    // Open email modal when clicking email button
    if (emailBtn && emailModal) {
        emailBtn.addEventListener('click', function() {
            emailModal.classList.add('active');
        });
    }
    
    // Close email modal when clicking close button
    if (emailClose && emailModal) {
        emailClose.addEventListener('click', function() {
            emailModal.classList.remove('active');
        });
    }
    
    // Close email modal when clicking outside
    if (emailModal) {
        emailModal.addEventListener('click', function(e) {
            if (e.target === emailModal) {
                emailModal.classList.remove('active');
            }
        });
    }
    
    // Close email modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && emailModal && emailModal.classList.contains('active')) {
            emailModal.classList.remove('active');
        }
    });
    
    // Copy email address to clipboard
    if (emailCopyBtn && emailAddress) {
        emailCopyBtn.addEventListener('click', function() {
            // Create a temporary input element
            const tempInput = document.createElement('input');
            tempInput.value = emailAddress.textContent;
            document.body.appendChild(tempInput);
            
            // Select and copy the text
            tempInput.select();
            document.execCommand('copy');
            
            // Remove the temporary input
            document.body.removeChild(tempInput);
            
            // Show notification
            showNotification('邮箱地址已复制到剪贴板');
            
            // Add copied animation
            emailCopyBtn.classList.add('copied');
            
            // Restore original state after animation completes
            setTimeout(function() {
                emailCopyBtn.classList.remove('copied');
            }, 600);
        });
    }
    
    // Initialize
    console.log('Photo Gallery Website Initialized');
});