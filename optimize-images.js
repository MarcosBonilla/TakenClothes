import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const publicDir = './public';
const targetSize = 400; // KB

async function optimizeImage(filePath) {
    const stats = statSync(filePath);
    const sizeInKB = stats.size / 1024;
    
    console.log(`\n📸 ${filePath} - ${sizeInKB.toFixed(2)} KB`);
    
    if (sizeInKB > targetSize) {
        let quality = 80;
        let optimized = false;
        
        while (quality > 50 && !optimized) {
            await sharp(filePath)
                .webp({ quality, effort: 6 })
                .toFile(filePath + '.tmp');
            
            const newStats = statSync(filePath + '.tmp');
            const newSize = newStats.size / 1024;
            
            if (newSize <= targetSize || quality <= 55) {
                await sharp(filePath + '.tmp')
                    .toFile(filePath);
                console.log(`✅ Optimizado a ${newSize.toFixed(2)} KB (calidad ${quality})`);
                optimized = true;
            }
            
            quality -= 5;
        }
        
        // Cleanup
        try {
            const fs = await import('fs');
            fs.unlinkSync(filePath + '.tmp');
        } catch {}
    } else {
        console.log(`✓ Ya está optimizado`);
    }
}

async function walkDir(dir) {
    const files = readdirSync(dir);
    
    for (const file of files) {
        const filePath = join(dir, file);
        const stat = statSync(filePath);
        
        if (stat.isDirectory()) {
            await walkDir(filePath);
        } else if (file.match(/\.(webp|jpg|jpeg|png)$/i)) {
            await optimizeImage(filePath);
        }
    }
}

console.log('🚀 Optimizando imágenes...\n');
walkDir(publicDir);
