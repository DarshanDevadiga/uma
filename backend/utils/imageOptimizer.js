const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Automatically compress and optimize an image using Sharp
 * Generates: WebP version, responsive sizes (large, medium), and a square thumbnail.
 * @param {string} filePath - Absolute path to the uploaded image
 * @param {string} subfolder - Subdirectory under uploads (e.g., 'news', 'gallery')
 * @returns {Object} Paths of optimized files relative to static serve path
 */
const optimizeImage = async (filePath, subfolder) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Original file not found: ${filePath}`);
  }

  const dirName = path.dirname(filePath);
  const extName = path.extname(filePath);
  const baseName = path.basename(filePath, extName);
  
  const results = {
    original: `/uploads/${subfolder}/${path.basename(filePath)}`,
    webp: `/uploads/${subfolder}/${baseName}.webp`,
    large: `/uploads/${subfolder}/${baseName}-large.webp`,
    medium: `/uploads/${subfolder}/${baseName}-medium.webp`,
    thumbnail: `/uploads/${subfolder}/${baseName}-thumb.webp`
  };

  try {
    const sharpImg = sharp(filePath);
    const metadata = await sharpImg.metadata();

    // 1. Generate WebP version (optimized compression)
    await sharpImg
      .webp({ quality: 80 })
      .toFile(path.join(dirName, `${baseName}.webp`));

    // 2. Generate Large WebP (Max width: 1200px)
    if (metadata.width > 1200) {
      await sharp(filePath)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(dirName, `${baseName}-large.webp`));
    } else {
      // Copy webp as fallback
      fs.copyFileSync(path.join(dirName, `${baseName}.webp`), path.join(dirName, `${baseName}-large.webp`));
    }

    // 3. Generate Medium WebP (Max width: 600px)
    await sharp(filePath)
      .resize({ width: 600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(dirName, `${baseName}-medium.webp`));

    // 4. Generate Thumbnail WebP (150x150 square crop)
    await sharp(filePath)
      .resize(150, 150, { fit: 'cover' })
      .webp({ quality: 75 })
      .toFile(path.join(dirName, `${baseName}-thumb.webp`));

    return results;
  } catch (error) {
    console.error('[ImageOptimizer] Optimization failed for:', filePath, error.message);
    // If sharp fails (e.g. invalid file format or binary error), return the original file as fallback for all paths
    return {
      original: results.original,
      webp: results.original,
      large: results.original,
      medium: results.original,
      thumbnail: results.original
    };
  }
};

module.exports = {
  optimizeImage
};
