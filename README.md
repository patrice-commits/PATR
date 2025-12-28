# Patrice Rivest - Interactive CV Website

A modern, bilingual (FR/EN) interactive CV website showcasing 25+ years of regional sales leadership experience. Built with vanilla HTML, CSS, and JavaScript for optimal performance and easy maintenance.

## 🚀 Features

- **Bilingual Support**: Seamless switching between French and English
- **Interactive Timeline**: Expandable professional experience with achievements
- **Filterable Competencies**: Click tags to filter relevant experiences and portfolio items
- **Portfolio Section**: Media contributions and professional activities with category filtering
- **KPI Achievements**: Visual metrics highlighting career successes
- **Responsive Design**: Mobile-first approach, works perfectly on all devices
- **Premium Design**: Modern corporate aesthetic with smooth animations
- **SEO Optimized**: Proper meta tags, semantic HTML, and OpenGraph support

## 📁 Project Structure

```
PatR/
├── index.html          # Main HTML file (SPA)
├── styles.css          # Complete design system and styling
├── app.js             # Application logic and interactivity
├── content.fr.json    # French content
├── content.en.json    # English content
├── portfolio.json     # Portfolio and media contributions
└── README.md          # This file
```

## 🏃‍♂️ Running Locally

### Option 1: Simple File Open
1. Navigate to the project folder
2. Double-click `index.html`
3. The website will open in your default browser

### Option 2: Local Server (Recommended)
Using Python:
```bash
# Python 3
python -m http.server 8000

# Then visit: http://localhost:8000
```

Using Node.js (npx):
```bash
npx serve

# Then visit the URL shown in terminal
```

Using Live Server (VS Code extension):
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

## 🌍 Deployment

### Netlify (Recommended)
1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop the entire `PatR` folder
3. Your site will be live in seconds
4. Get a custom domain: `patricerivest.netlify.app`

### GitHub Pages
1. Create a GitHub repository
2. Push all files to the repository
3. Go to Settings → Pages
4. Select main branch as source
5. Your site will be at `username.github.io/repo-name`

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project folder
3. Follow the prompts
4. Your site will be deployed automatically

## ✏️ Content Updates

### Updating Text Content

All content is stored in JSON files for easy updates:

**French Content**: Edit `content.fr.json`  
**English Content**: Edit `content.en.json`

#### Example: Update Phone Number
```json
{
  "header": {
    "phone": "(450) 760-8910"  // Change this value
  }
}
```

#### Example: Add New Achievement
In the `achievements.metrics` array:
```json
{
  "value": "+65%",
  "label": "New Achievement Label"
}
```

### Adding a New Experience Position

Edit `content.fr.json` and `content.en.json` in the `experience.positions` array:

```json
{
  "title": "Your Position Title",
  "company": "Company Name",
  "period": "Jan 2023 – Present",
  "description": "Brief description of the role...",
  "achievements": [
    "First achievement with impact metrics",
    "Second achievement showing results",
    "Third achievement demonstrating leadership"
  ],
  "tags": ["Sales", "Leadership", "Strategy"]
}
```

The website will automatically:
- Add it to the timeline
- Make it filterable by tags
- Include it in the accordion UI

### Updating Competencies

Edit the `competencies.categories` section:

```json
{
  "name": "Category Name",
  "skills": [
    "Skill 1",
    "Skill 2",
    "Skill 3"
  ]
}
```

Skills automatically become clickable tags that filter experience and portfolio items.

## 📚 Portfolio Management

### Adding a New Portfolio Item

Edit `portfolio.json` and add to the `items` array:

```json
{
  "id": "unique-identifier",
  "title": "Titre en français",
  "titleEn": "Title in English",
  "type": "editorial",
  "category": "article",
  "platform": "Platform Name",
  "year": "2024",
  "description": "Description en français...",
  "descriptionEn": "Description in English...",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "url": "https://example.com/article"
}
```

**Field Descriptions:**
- `id`: Unique identifier (lowercase with hyphens)
- `title`: French title
- `titleEn`: English title
- `type`: Item type (editorial, tv, business, speaking, etc.)
- `category`: Filter category (article, video, tv, editorial)
- `platform`: Publication/platform name
- `year`: Publication year or "Multiple Years" / "Ongoing"
- `description`: French description
- `descriptionEn`: English description
- `tags`: Array of searchable keywords
- `url`: Full URL or empty string `""` if not available yet

### Updating Portfolio URLs

Find the item by `id` and update the `url` field:

```json
{
  "id": "moto-journal",
  "url": "https://motojournal.com/patrice-rivest"
}
```

Empty URLs (`""`) display "URL à venir" / "URL coming soon" instead of a link.

### Portfolio Categories

Current categories (defined in `content.fr.json` and `content.en.json`):
- `article`: Articles / Articles
- `video`: Vidéos / Videos
- `tv`: Télévision / Television
- `editorial`: Éditorial / Editorial

To add a new category, update both content files:

```json
"portfolioSection": {
  "categories": {
    "article": "Articles",
    "newcategory": "New Category Label"
  }
}
```

## 🎨 Design Customization

### Changing Colors

Edit `styles.css` CSS variables at the top:

```css
:root {
    --color-primary: #1e40af;        /* Main brand color */
    --color-primary-light: #3b82f6;  /* Lighter accent */
    --color-primary-dark: #1e3a8a;   /* Darker shade */
}
```

### Changing Fonts

Update the Google Fonts import in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

Then update in `styles.css`:

```css
:root {
    --font-primary: 'YourFont', sans-serif;
}
```

## 📊 Analytics Integration

To add Google Analytics, insert before closing `</head>` tag in `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔧 Advanced Customization

### Adding a New Section

1. Add HTML structure in `index.html`:
```html
<section id="newsection" class="section newsection">
    <div class="container">
        <h2 class="section-title" data-content="newsection.title">Section Title</h2>
        <div id="newsectionContainer">
            <!-- Content will be dynamically rendered -->
        </div>
    </div>
</section>
```

2. Add navigation link:
```html
<li><a href="#newsection" class="nav-link" data-content="nav.newsection">New Section</a></li>
```

3. Add content to JSON files:
```json
{
  "nav": {
    "newsection": "New Section"
  },
  "newsection": {
    "title": "Section Title",
    "content": "Section content..."
  }
}
```

4. Add rendering logic in `app.js`:
```javascript
renderNewSection(data.newsection);
```

## 📱 Browser Compatibility

Tested and works perfectly on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

**Issue**: Content not updating after editing JSON  
**Solution**: Hard refresh the page (Ctrl+Shift+R / Cmd+Shift+R)

**Issue**: Website not loading when opened directly  
**Solution**: Use a local server (see Running Locally section)

**Issue**: Language not switching  
**Solution**: Check browser console for errors, ensure JSON files are valid

**Issue**: Portfolio items not showing  
**Solution**: Validate `portfolio.json` syntax at [jsonlint.com](https://jsonlint.com)

## 📄 License

© 2025 Patrice Rivest. All rights reserved.

## 🤝 Support

For questions or customization requests, contact:
- Email: patrice@rivest.co
- Phone: (450) 760-8910

---

**Version**: 1.0  
**Last Updated**: December 2025  
**Built with**: HTML5, CSS3, JavaScript ES6+
