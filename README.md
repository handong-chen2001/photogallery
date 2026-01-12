# Photo Gallery Website

A modern, responsive photo gallery website built according to the Figma design specifications.

## Project Structure

```
HR_html/
├── index.html          # Main HTML file
├── styles/
│   └── main.css        # Main CSS file with responsive design
├── scripts/
│   └── main.js         # JavaScript functionality
├── images/             # Image resources folder
│   ├── hero/           # Hero section images
│   ├── gallery/        # Gallery images
│   ├── about/          # About section images
│   └── contact/        # Contact section images
└── README.md           # This file
```

## Image Resources Required

### Hero Section (Slider)
- **File names:** `hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg`
- **Dimensions:** 1920x1080px (or higher)
- **Format:** JPG
- **Description:** Large banner images for the hero slider

### Gallery Section

#### Nature Category
- **File names:** `nature-1.jpg`, `nature-2.jpg`, `nature-3.jpg`, `nature-4.jpg`
- **Dimensions:** 800x800px (1:1 aspect ratio)
- **Format:** JPG
- **Description:** Landscape and nature photography

#### City Category
- **File names:** `city-1.jpg`, `city-2.jpg`, `city-3.jpg`, `city-4.jpg`
- **Dimensions:** 800x800px (1:1 aspect ratio)
- **Format:** JPG
- **Description:** Urban and city photography

#### People Category
- **File names:** `people-1.jpg`, `people-2.jpg`, `people-3.jpg`, `people-4.jpg`
- **Dimensions:** 800x800px (1:1 aspect ratio)
- **Format:** JPG
- **Description:** Portraits and people photography

#### Events Category
- **File names:** `events-1.jpg`, `events-2.jpg`, `events-3.jpg`, `events-4.jpg`
- **Dimensions:** 800x800px (1:1 aspect ratio)
- **Format:** JPG
- **Description:** Event and celebration photography

### About Section
- **File name:** `about-photo.jpg`
- **Dimensions:** 600x800px (3:4 aspect ratio)
- **Format:** JPG
- **Description:** Photographer portrait

## Naming Convention

All image files follow the convention:
```
[category]-[number].[format]
```

For example:
- `nature-1.jpg` - First nature image
- `city-3.jpg` - Third city image

## Implementation Details

### HTML Structure
- Semantic HTML5 tags for better accessibility and SEO
- Responsive meta tag for mobile devices
- Proper heading hierarchy

### CSS Features
- Custom CSS variables for consistent theming
- Flexbox and Grid layouts for responsive design
- Media queries for different screen sizes (mobile, tablet, desktop)
- Smooth animations and transitions
- Accessibility features (focus states, alt text, etc.)

### JavaScript Functionality
- Mobile menu toggle
- Hero slider with controls and indicators
- Gallery filtering by category
- Lightbox image viewer
- Smooth scrolling navigation
- Form submission handling
- Image load animations
- Counter animations

### Responsive Breakpoints
- Mobile: < 576px
- Tablet: 576px - 768px
- Desktop: 768px - 992px
- Large Desktop: > 992px

## Browser Compatibility

The website is compatible with:
- Chrome (latest stable version)
- Firefox (latest stable version)
- Safari (latest stable version)
- Edge (latest stable version)

## Getting Started

1. Clone or download the repository
2. Replace the placeholder image references in `index.html` with your actual images
3. Ensure all images are placed in the correct directory structure
4. Open `index.html` in a web browser to view the website

## Customization

### Colors
Edit the CSS variables in `styles/main.css`:
```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
    /* More colors */
}
```

### Fonts
The website uses Google Fonts:
- Playfair Display (headings)
- Montserrat (body text)

### Content
Edit the text content in `index.html` to customize the website for your needs.

## Performance Optimization

- Optimize images using tools like TinyPNG or Squoosh
- Use appropriate image formats (JPG for photos, PNG for graphics)
- Implement lazy loading for images
- Minify CSS and JavaScript for production

## License

This project is open source and available under the MIT License.