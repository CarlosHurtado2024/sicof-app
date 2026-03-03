const fs = require('fs');
const path = require('path');

const replacements = [
    { from: /#4C1D95/g, to: '#4C1D95' }, // Dark Blue -> Purple 900
    { from: /#3B0764/g, to: '#3B0764' }, // Hover Dark Blue -> Purple 950
    { from: /#2E1065/g, to: '#2E1065' }, // Very Dark Blue -> Violet 950
    { from: /#1F0A47/g, to: '#1F0A47' }, // Dashboard Dark Blue -> Dark Violet
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
