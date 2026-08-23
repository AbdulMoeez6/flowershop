const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, 'src'), function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    
    // Exact string replacements for mojibake
    newContent = newContent.split('â€“').join('–');
    newContent = newContent.split('â€”').join('—');
    newContent = newContent.split('â€™').join('’');
    newContent = newContent.split('ðŸŒ¸').join('🌸');
    newContent = newContent.split('â˜Žï¸').join('☎️');
    newContent = newContent.split('âœ‰ï¸').join('✉️');
    newContent = newContent.split('ðŸ“').join('📍');
    newContent = newContent.split('â€œ').join('“');
    newContent = newContent.split('â€ ').join('”');

    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Fixed:', filePath);
    }
  }
});
