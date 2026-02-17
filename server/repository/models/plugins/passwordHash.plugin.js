const bcrypt = require('bcrypt');

const saltRounds = 10; // bcrypt cost facter (higher value = slower hash = more secure)

module.exports = function passwordHashPlugin(schema) {
    // 'this' refers to the stuff being saved (applicant/admin/company)
    schema.pre("save", async function (next) {
        try {
            // Only hash if the password is new or modified
            if (!this.isModified('password')) {
                return next();
            }

            // Hash and replace the plain text pw with the hashed pw
            this.password = await bcrypt.hash(this.password, saltRounds);
            next();
        } catch (e) {
            next(e);
        }
    });

    schema.methods.comparePassword = function (plainPassword) {
        if (!this.password) return Promise.resolve(false);

        if (!this.password.startsWith('$2')) {
            return Promise.resolve(plainPassword === this.password);
        }
        
        return bcrypt.compare(plainPassword, this.password);
    };
};