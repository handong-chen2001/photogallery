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
│   ├── still/          # Still images
│   ├── wallpaper/      # Wallpaper images
└── README.md           # read me file
```
## Naming Convention

All image files follow the convention:
```
[category]-[number].[format]
```

For example:
- `s-1.jpg` - First still image
- `w-3.jpg` - Third wallpaper image

## Implementation Details

### Fonts
The website uses Google Fonts:
- Playfair Display (headings)
- Montserrat (body text)

## Performance Optimization

- Optimize images using tools like TinyPNG or Squoosh
- Use appropriate image formats (JPG for photos, PNG for graphics)
- Implement lazy loading for images
- Minify CSS and JavaScript for production

## License

This project is open source and available under the MIT License.