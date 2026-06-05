import fs from 'fs';
const css = fs.readFileSync('css/style.css', 'utf8');
let depth = 0;
const lines = css.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('@media')) {
    console.log('@media start at line ' + (i+1));
  }
  let lineDepthChange = 0;
  for (let j = 0; j < lines[i].length; j++) {
    if (lines[i][j] === '{') { depth++; lineDepthChange++; }
    if (lines[i][j] === '}') { depth--; lineDepthChange--; }
  }
  if (depth === 0 && lineDepthChange < 0) {
    // A block just closed
    if (lines[i].trim() === '}') {
       // if there was an open media, is it closing here?
    }
  }
}
let mediaOpenLine = -1;
depth = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('@media')) {
    mediaOpenLine = i + 1;
  }
  for (let j = 0; j < lines[i].length; j++) {
    if (lines[i][j] === '{') { depth++; }
    if (lines[i][j] === '}') {
      depth--;
      if (depth === 0 && mediaOpenLine !== -1) {
        console.log('@media from line ' + mediaOpenLine + ' closed at line ' + (i+1));
        mediaOpenLine = -1;
      }
    }
  }
}
