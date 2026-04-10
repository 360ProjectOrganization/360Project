const multer = require('multer');

const MAX_BYTES = 5 * 1024 * 1024;

function imageFileFilter(req, file, cb) {
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
        return cb(new Error('Please choose an image file (JPEG, PNG, GIF, WebP, etc.).'));
    }
    cb(null, true);
}

const pfpUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_BYTES },
    fileFilter: imageFileFilter,
});


// Multer middleware for a single profile-picture field, with JSON error responses.
function multerPfpSingle(fieldName) {
    return (req, res, next) => {
        pfpUpload.single(fieldName)(req, res, (err) => {
            if (!err) return next();

            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ error: 'Image is too large. Maximum file size is 5 MB.' });
                }
                return res.status(400).json({ error: err.message || 'Upload failed.' });
            }

            return res.status(400).json({ error: err.message || 'Invalid file.' });
        });
    };
}

module.exports = { multerPfpSingle, MAX_BYTES };