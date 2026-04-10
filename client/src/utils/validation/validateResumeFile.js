// match seerver
export const RESUME_MAX_BYTES = 5 * 1024 * 1024;

export function validateResumeFile(file) {
    if (!file) return { ok: true };
    const looksPdf = file.type === 'application/pdf' || (file.name && file.name.toLowerCase().endsWith('.pdf'));
    
    if (!looksPdf) {
        return { ok: false, message: 'Please upload a PDF file.' };
    }

    if (file.size > RESUME_MAX_BYTES) {
        return { ok: false, message: 'File is too large. Maximum size is 5 MB.' };
    }
    
    return { ok: true };
}