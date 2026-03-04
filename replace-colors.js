const fs = require('fs');
const path = require('path');

const replacements = [
    { from: /#042153/g, to: '#042153' }, // Purple 900 -> Brand Blue
    { from: /#011848/g, to: '#011848' }, // Purple 950 -> Darker Blue
    { from: /#000B21/g, to: '#000B21' }, // Very Dark Blue -> Extra Dark
    { from: /#021a42/g, to: '#021a42' }, // Dashboard Dark Blue -> Medium Dark Blue
    { from: /bg-blue-/g, to: 'bg-blue-' },
    { from: /text-blue-/g, to: 'text-blue-' },
    { from: /border-blue-/g, to: 'border-blue-' },
    { from: /ring-blue-/g, to: 'ring-blue-' },
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!['node_modules', '.next', '.git'].includes(file)) {
                processDirectory(fullPath);
            }
        } else {
            if (['.tsx', '.ts', '.css', '.json', '.js', '.html'].includes(path.extname(fullPath))) {
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
                    console.log(`Updated: ${fullPath}`);
                }
            }
        }
    }
}

processDirectory(path.join(__dirname));
console.log('Color replacement complete!');
