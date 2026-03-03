const sharp = require('sharp');
const fs = require('fs');

async function processIcons() {
    const svgFile = 'public/logo_komi.svg';
    console.log('Reading:', svgFile);
    fs.copyFileSync(svgFile, 'public/icon.svg');
    console.log('Copied icon.svg');

    const svgBuffer = fs.readFileSync(svgFile);

    // 192 transparent
    await sharp(svgBuffer)
        .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toFile('public/icon-192.png');
    console.log('Generated icon-192.png');

    // 512 transparent
    await sharp(svgBuffer)
        .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toFile('public/icon-512.png');
    console.log('Generated icon-512.png');

    // 192 maskable (padded on a background #111827 or #FFFFFF, the theme_color is #4C1D95, let's use white #ffffff for best contrast with black logo)
    await sharp(svgBuffer)
        .resize(134, 134, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .extend({
            top: 29, bottom: 29, left: 29, right: 29,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toFile('public/icon-maskable-192.png');
    console.log('Generated icon-maskable-192.png');

    // 512 maskable
    await sharp(svgBuffer)
        .resize(358, 358, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .extend({
            top: 77, bottom: 77, left: 77, right: 77,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toFile('public/icon-maskable-512.png');
    console.log('Generated icon-maskable-512.png');
}

processIcons().catch(console.error);
