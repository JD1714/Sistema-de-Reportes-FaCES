const fs = require('fs');
const path = require('path');

const distHtmlPath = path.join(__dirname, '..', 'dist', 'index.html');

if (!fs.existsSync(distHtmlPath)) {
  console.error('dist/index.html does not exist.');
  process.exit(1);
}

let html = fs.readFileSync(distHtmlPath, 'utf8');

// Convert logos to base64 Data URIs
const darkLogoPath = path.join(__dirname, '..', 'public', 'faces_logo_dark.png');
const lightLogoPath = path.join(__dirname, '..', 'public', 'faces_logo_light.png');

if (fs.existsSync(darkLogoPath)) {
  const darkBase64 = 'data:image/png;base64,' + fs.readFileSync(darkLogoPath).toString('base64');
  html = html.split('/faces_logo_dark.png').join(darkBase64);
  console.log('✓ Inlined faces_logo_dark.png as Base64');
}

if (fs.existsSync(lightLogoPath)) {
  const lightBase64 = 'data:image/png;base64,' + fs.readFileSync(lightLogoPath).toString('base64');
  html = html.split('/faces_logo_light.png').join(lightBase64);
  console.log('✓ Inlined faces_logo_light.png as Base64');
}

// Copy to a convenient, clearly named output file
const outputFaCESHtml = path.join(__dirname, '..', 'FaCES_Sistema_Completo.html');
fs.writeFileSync(distHtmlPath, html, 'utf8');
fs.writeFileSync(outputFaCESHtml, html, 'utf8');

console.log(`\n🎉 ¡Archivo único generado exitosamente!`);
console.log(`📄 Ubicación: ${outputFaCESHtml}`);
console.log(`📦 Tamaño final: ${(Buffer.byteLength(html, 'utf8') / 1024).toFixed(2)} KB`);
