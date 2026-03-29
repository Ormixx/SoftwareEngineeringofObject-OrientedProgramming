const User = require('./User');
class Admin extends User {
    #adminCode;
    constructor(lastName, firstName, cardNumber, adminCode) {
        super(lastName, firstName, cardNumber);
        this.#adminCode = adminCode;

        if (!adminCode || adminCode.length < 3) {
            throw new Error('Код администратора должен содержать минимум 3 символа');
        }
    }
    getAdminCode() {
        return this.#adminCode;
    }
    getRole() {
        return 'администратор';
    }
    getFullName() {
        return `${super.getFullName()} (администратор)`;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            adminCode: this.#adminCode,
            userType: 'admin'
        };
    }
}
module.exports = Admin;