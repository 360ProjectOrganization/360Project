/** mactehs server-side size */
export const PFP_MAX_BYTES = 5 * 1024 * 1024;

export function validatePfpFile(file) {
    if (!file) return { ok: true };

    if (!file.type || !file.type.startsWith('image/')) {
        return { ok: false, message: 'Please choose an image file (JPEG, PNG, GIF, WebP, etc.).' };
    }

    if (file.size > PFP_MAX_BYTES) {
        return { ok: false, message: 'Image is too large. Maximum file size is 5 MB.' };
    }

    return { ok: true };
}

