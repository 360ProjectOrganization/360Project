const multer = require('multer');

const MAX_BYTES = 5 * 1024 * 1024;

function pdfFileFilter(req, file, cb) {
    const nameOk = file.originalname && file.originalname.toLowerCase().endsWith('.pdf');
    const typeOk = file.mimetype === 'application/pdf';
    if (!typeOk && !nameOk) {
        return cb(new Error('Please upload a PDF file.'));
    }
    cb(null, true);
}

const resumeUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_BYTES },
    fileFilter: pdfFileFilter,
});

function multerResumeSingle(fieldName) {
    return (req, res, next) => {
        resumeUpload.single(fieldName)(req, res, (err) => {
            if (!err) return next();

            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ error: 'File is too large. Maximum file size is 5 MB.' });
                }
                return res.status(400).json({ error: err.message || 'Upload failed.' });
            }

            return res.status(400).json({ error: err.message || 'Invalid file.' });
        });
    };
}

module.exports = { multerResumeSingle, MAX_BYTES };