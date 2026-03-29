class User {
    #id;
    #lastName;
    #firstName;
    #cardNumber;
    #borrowedBooks;
    constructor(lastName, firstName, cardNumber) {
        this.#id = User.#generateId();
        this.#lastName = lastName;
        this.#firstName = firstName;
        this.#cardNumber = cardNumber;
        this.#borrowedBooks = [];

        if (!lastName || !firstName) {
            throw new Error('Фамилия и имя обязательны');
        }
        if (!cardNumber || cardNumber.length < 5) {
            throw new Error('Номер карточки должен содержать минимум 5 символов');
        }
    }
    static #generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
    }
    getId() { return this.#id; }
    getLastName() { return this.#lastName; }
    getFirstName() { return this.#firstName; }
    getCardNumber() { return this.#cardNumber; }
    getBorrowedBooks() { return [...this.#borrowedBooks]; }
    getBook(bookId) {
        if (this.#borrowedBooks.includes(bookId)) {
            throw new Error('Книга уже выдана этому пользователю');
        }
        this.#borrowedBooks.push(bookId);
    }
    returnBook(bookId) {
        const index = this.#borrowedBooks.indexOf(bookId);
        if (index === -1) {
            throw new Error('Книга не найдена у пользователя');
        }
        this.#borrowedBooks.splice(index, 1);
    }
    getFullName() {
        return `${this.#lastName} ${this.#firstName}`;
    }
    getRole() {
        return 'пользователь';
    }
    toJSON() {
        return {
            id: this.#id,
            lastName: this.#lastName,
            firstName: this.#firstName,
            cardNumber: this.#cardNumber,
            borrowedBooks: this.#borrowedBooks,
            userType: this.constructor.name === 'Admin' ? 'admin' : 'user'
        };
    }
    static fromJSON(data) {
        const Admin = require('./Admin');
        let user;
        if (data.userType === 'admin') {
            user = new Admin(data.lastName, data.firstName, data.cardNumber, data.adminCode);
        } else {
            user = new User(data.lastName, data.firstName, data.cardNumber);
        }
        user.#id = data.id;
        user.#borrowedBooks = data.borrowedBooks || [];
        return user;
    }
}
module.exports = User;