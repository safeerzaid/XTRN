const fs = require('fs');
let file = fs.readFileSync('routes/productRoutes.js', 'utf8');

// Use a simple indexOf/substring replacement to avoid any regex escaping issues in JS itself
const startMarker = "const escapedQuery = q.trim().replace(";
const startIndex = file.indexOf(startMarker);
const endMarker = ");\\n    const searchRegex";
const endIndex = file.indexOf(endMarker);

const correctReplace = "const escapedQuery = q.trim().replace(/[.*+?^${}()|[\\\\]\\\\\\\\]/g, '\\\\\\\\$&'";
file = file.substring(0, startIndex) + correctReplace + file.substring(endIndex);

fs.writeFileSync('routes/productRoutes.js', file);
