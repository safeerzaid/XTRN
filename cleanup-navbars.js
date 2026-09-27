const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'client', 'src', 'pages');

const files = [
  'Home.jsx',
  'ProductListingPage.jsx',
  'ProductDetailPage.jsx',
  'CartPage.jsx',
  'Profile.jsx',
];

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    const lines = content.replace(/\r/g, '').split('\n');
    const newLines = lines.filter(line => !line.includes('import NavBar from') && !line.includes('import Footer from') && !line.includes('<NavBar') && !line.includes('</NavBar>') && !line.includes('<Footer') && !line.includes('</Footer>'));
    
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
    console.log(`Updated ${file}`);
  }
});
