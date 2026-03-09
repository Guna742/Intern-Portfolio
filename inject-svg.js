const fs = require('fs');
const path = require('path');

const svgMarkup = `<svg class="iris-vector-logo" viewBox="0 0 100 70" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; padding: 6px;">
  <path d="M5 35C5 35 25 5 50 5C75 5 95 35 95 35C95 35 75 65 50 65C25 65 5 35 5 35Z" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>
  <circle cx="50" cy="35" r="20" stroke="currentColor" stroke-width="4"/>
  <circle cx="50" cy="35" r="11" stroke="currentColor" stroke-width="3"/>
  <circle cx="50" cy="35" r="5" fill="currentColor"/>
  <line x1="36" y1="49" x2="64" y2="21" stroke="currentColor" stroke-width="3"/>
  <circle cx="36" cy="49" r="3" fill="var(--glass-bg, #000)" stroke="currentColor" stroke-width="2.5"/>
  <circle cx="64" cy="21" r="3" fill="var(--glass-bg, #000)" stroke="currentColor" stroke-width="2.5"/>
  <circle cx="58" cy="43" r="3" fill="var(--glass-bg, #000)" stroke="currentColor" stroke-width="2.5"/>
</svg>`;

const htmlFiles = [
    'projects.html',
    'profile-view.html',
    'profile-builder.html',
    'leaderboard.html',
    'students.html',
    'student-profile.html',
    'student-analytics.html',
    'admin-profile.html',
    'dashboard.html',
    'login.html'
];

htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Replace <img> tag entirely. Matches any img pointing to iris-logo.png
        content = content.replace(/<img\s+src="img\/iris-logo\.png"[^>]*>/g, svgMarkup);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
