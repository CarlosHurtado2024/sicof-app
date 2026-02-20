import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = resolve(__dirname, '..', 'public', 'icon.svg');
const publicDir = resolve(__dirname, '..', 'public');

const svgBuffer = readFileSync(svgPath);

const sizes = [192, 512];

async function generateIcons() {
    for (const size of sizes) {
        // Regular icon (transparent background)
        await sharp(svgBuffer)
            .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png()
            .toFile(resolve(publicDir, `icon-${size}.png`));
        console.log(`✅ Generated icon-${size}.png`);

        // Maskable icon (with purple background padding for safe zone)
        const padding = Math.round(size * 0.1);
        const innerSize = size - padding * 2;
        const innerSvg = await sharp(svgBuffer)
            .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png()
            .toBuffer();

        await sharp({
            create: {
                width: size,
                height: size,
                channels: 4,
                background: { r: 124, g: 58, b: 237, alpha: 255 } // #7C3AED
            }
        })
            .composite([{ input: innerSvg, top: padding, left: padding }])
            .png()
            .toFile(resolve(publicDir, `icon-maskable-${size}.png`));
        console.log(`✅ Generated icon-maskable-${size}.png`);
    }

    console.log('\n🎉 All PWA icons generated successfully!');
}

generateIcons().catch(console.error);
