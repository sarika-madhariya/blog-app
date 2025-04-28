// lib/compressAndConvert.js
export default function compressAndConvert(file, {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.7
} = {}) {
    return new Promise((resolve, reject) => {
        // Step 1: read file into DataURL
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onerror = reject;
        reader.onload = () => {
            // Step 2: load into Image
            const img = new Image();
            img.src = reader.result;
            img.onerror = reject;
            img.onload = () => {
                // Step 3: compute new dimensions
                let { width, height } = img;
                if (width > maxWidth) {
                    height = height * maxWidth / width;
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width = width * maxHeight / height;
                    height = maxHeight;
                }
                // Step 4: draw into canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                // Step 5: export to blob at given quality
                canvas.toBlob(blob => {
                    if (!blob) return reject(new Error("Compression failed"));
                    // Step 6: read blob as DataURL
                    const r2 = new FileReader();
                    r2.readAsDataURL(blob);
                    r2.onerror = reject;
                    r2.onload = () => resolve(r2.result);
                }, 'image/jpeg', quality);
            };
        };
    });
}
