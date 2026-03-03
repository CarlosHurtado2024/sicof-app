const fs = require('fs');
const path = require('path');

const prefixes = ['text-', 'bg-', 'border-', 'ring-', 'from-', 'to-', 'via-', 'shadow-', 'fill-'];
const replacements = [];

for (const p of prefixes) {
    replacements.push({ from: new RegExp(p + 'blue-', 'g'), to: p + 'purple-' });
    replacements.push({ from: new RegExp(p + 'cyan-', 'g'), to: p + 'fuchsia-' });
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!['node_modules', '.next', '.git', 'public'].includes(file)) {
                processDirectory(fullPath);
            }
        } else {
            if (['.tsx', '.ts'].includes(path.extname(fullPath))) {
                let content = fs.readFileSync(fullPath, 'utf8');
                let modified = false;

                for (const { from, to } of replacements) {
                    if (from.test(content)) {
                        content = content.replace(from, to);
                        modified = true;
                    }
                }

                if (modified) {
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log(`Updated gradients: ${fullPath}`);
                }
            }
        }
    }
}

processDirectory(path.join(__dirname, 'app'));
processDirectory(path.join(__dirname, 'components'));
console.log('Gradient replacement complete!');
