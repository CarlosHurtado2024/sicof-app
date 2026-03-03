const fs = require('fs');
const path = require('path');

const replacements = [
    // Backgrounds
    { from: /bg-white(?=[\s"'])/g, to: 'bg-white/[0.02] backdrop-blur-xl' },
    { from: /bg-slate-50\/80/g, to: 'bg-white/[0.03] backdrop-blur-xl' },
    { from: /bg-slate-50(?=[\s"'])/g, to: 'bg-white/5' },
    { from: /bg-slate-100(?=[\s"'])/g, to: 'bg-white/10' },
    { from: /bg-slate-200(?=[\s"'])/g, to: 'bg-white/10' },

    // Borders & Dividers
    { from: /border-slate-100\/80/g, to: 'border-white/10' },
    { from: /border-slate-100/g, to: 'border-white/10' },
    { from: /border-slate-200/g, to: 'border-white/10' },
    { from: /divide-slate-50(?=[\s"'])/g, to: 'divide-white/5' },
    { from: /divide-slate-100/g, to: 'divide-white/5' },
    { from: /divide-slate-200/g, to: 'divide-white/5' },

    // Texts
    { from: /text-slate-800/g, to: 'text-white/90' },
    { from: /text-slate-700/g, to: 'text-white/80' },
    { from: /text-slate-600/g, to: 'text-white/70' },
    { from: /text-slate-500/g, to: 'text-white/50' },
    { from: /text-slate-400/g, to: 'text-white/40' },
    { from: /text-slate-300/g, to: 'text-white/30' },

    // Gradients & Themes specific
    { from: /from-\[#4C1D95\] to-\[#2C4A7C\]/g, to: 'from-purple-600/20 to-fuchsia-600/20 border border-white/10' },
    { from: /text-\[#4C1D95\]/g, to: 'text-purple-300' },
    { from: /bg-\[#4C1D95\]/g, to: 'bg-purple-600 border border-purple-500/50 hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.3)]' },
    { from: /hover:bg-\[#3B0764\]/g, to: 'hover:bg-purple-500' },
    { from: /hover:text-\[#3B0764\]/g, to: 'hover:text-white' },

    // Colored Badges (Riesgo, Fases)
    { from: /bg-emerald-50(?=[\s"'])/g, to: 'bg-emerald-500/10 border border-emerald-500/20' },
    { from: /text-emerald-700/g, to: 'text-emerald-300' },
    { from: /bg-amber-50(?=[\s"'])/g, to: 'bg-amber-500/10 border border-amber-500/20' },
    { from: /text-amber-700/g, to: 'text-amber-300' },
    { from: /bg-orange-50(?=[\s"'])/g, to: 'bg-orange-500/10 border border-orange-500/20' },
    { from: /text-orange-700/g, to: 'text-orange-300' },
    { from: /bg-red-50(?=[\s"'])/g, to: 'bg-red-500/10 border border-red-500/20' },
    { from: /text-red-700/g, to: 'text-red-300' },
    { from: /bg-purple-50(?=[\s"'])/g, to: 'bg-purple-500/10 border border-purple-500/20' },
    { from: /text-purple-700/g, to: 'text-purple-300' },

    // Other subtle fixes (shadows)
    { from: /shadow-sm(?=[\s"'])/g, to: 'shadow-[0_0_20px_rgba(0,0,0,0.3)]' },
    { from: /shadow-lg(?=[\s"'])/g, to: 'shadow-[0_0_30px_rgba(0,0,0,0.5)]' },
];

function processPath(targetPath) {
    const stat = fs.statSync(targetPath);
    if (stat.isDirectory()) {
        const files = fs.readdirSync(targetPath);
        for (const file of files) {
            processPath(path.join(targetPath, file));
        }
    } else {
        if (['.tsx', '.ts'].includes(path.extname(targetPath))) {
            let content = fs.readFileSync(targetPath, 'utf8');
            let modified = false;

            for (const { from, to } of replacements) {
                if (from.test(content)) {
                    content = content.replace(from, to);
                    modified = true;
                }
            }

            if (modified) {
                fs.writeFileSync(targetPath, content, 'utf8');
                console.log(`Dark Theme Updated: ${targetPath}`);
            }
        }
    }
}

// target dashboard components only, EXCLUDING page.tsx layout.tsx (we did manual), but including cases and others!
processPath(path.join(__dirname, 'app/dashboard/casos'));
processPath(path.join(__dirname, 'app/dashboard/personas'));
processPath(path.join(__dirname, 'app/dashboard/recepcion'));
// Let's also do expedition search component
processPath(path.join(__dirname, 'components'));

console.log('Dark mode applied to modules!');
