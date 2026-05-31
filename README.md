# Aayush Narang | Personal Website

A minimalist, sleek personal website built with vanilla HTML, CSS, and JavaScript. It features a dark mode aesthetic, scroll-triggered fade-in animations, and a dynamic 3D holographic profile card.

## Features
- **3D Profile Card:** A fully interactive holographic tilt card built in vanilla JS (adapted from ReactBits).
- **Responsive Design:** Optimized for desktop and mobile viewing.
- **Glassmorphism:** Frosted glass navbar that dynamically blurs the background.
- **Minimalist Aesthetic:** Dark theme (`#0a0a0a` background) focusing on typography and content.
- **Scroll Animations:** IntersectionObserver-based scroll animations for smooth entry effects.

## Structure
- `index.html` - The main structure containing About Me, Education, Experience, and Projects tabs.
- `styles.css` - Global styles, CSS variables, typography, and layout.
- `ProfileCard.css` - Specialized styles for the 3D holographic tilt card.
- `script.js` - Tab switching logic, scroll animations, and the pointer-tracking math for the 3D card.

## How to Run Locally
Because this project uses vanilla web technologies, no build step or package manager is required. 

1. Clone or download the repository.
2. Double-click `index.html` to open it in your browser.
3. *Optional:* If you use VS Code, install the **Live Server** extension, right-click `index.html`, and select "Open with Live Server" to see changes automatically update as you edit.

## Customization
- **Images:** Swap out `new_founder.png` and `founder.png` to change the profile pictures. Replace the company logos in the project root to update experience and education tags.
- **Colors:** Modify the CSS variables inside the `:root` pseudo-class in `styles.css` to tweak the theme colors.
