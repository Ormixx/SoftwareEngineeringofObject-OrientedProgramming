const fs = require('fs');
class Book {
    #id;
    #title;
    #author;
    #isbn;
    #totalAmount;
    #issuedAmount;

    constructor(title, author, isbn, totalAmount = 1) {
        this.#id = Book.#generateId();
        this.#title = title;
        this.#author = author;
        this.#isbn = isbn;
        this.#totalAmount = totalAmount;
        this.#issuedAmount = 0;
        // валидация
        if (!Book.#validateIsbn(isbn)) {
            throw new Error(`Неверный формат ISBN: ${isbn}`);
        }
        if (totalAmount <= 0) {
            throw new Error('Количество экземпляров должно быть больше 0');
        }
        if (!title || !author) {
            throw new Error('Название и автор обязательны');
        }
    }

    static #validateIsbn(isbn) {
        const cleaned = isbn.replace(/-/g, '');
        return /^\d{5,13}$/.test(cleaned);
    }
    static #generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
    }

    // геттеры
    getId() { return this.#id; }
    getTitle() { return this.#title; }
    getAuthor() { return this.#author; }
    getIsbn() { return this.#isbn; }
    getTotalAmount() { return this.#totalAmount; }
    getIssuedAmount() { return this.#issuedAmount; }
    getAvailableAmount() { return this.#totalAmount - this.#issuedAmount; }

    // сеттеры с валидацией
    setTotalAmount(amount) {
        if (amount < 0) throw new Error('Количество не может быть отрицательным');
        if (amount < this.#issuedAmount) {
            throw new Error('Нельзя уменьшить количество книг, если есть выданные экземпляры');
        }
        this.#totalAmount = amount;
    }

    // методы выдачи и возврата
    issue() {
        if (this.#issuedAmount >= this.#totalAmount) {
            throw new Error('Нет доступных экземпляров');
        }
        this.#issuedAmount++;
    }
    returnBook() {
        if (this.#issuedAmount <= 0) {
            throw new Error('Нет выданных экземпляров');
        }
        this.#issuedAmount--;
    }

    // преобразование в объект для сохранения
    toJSON() {
        return {
            id: this.#id,
            title: this.#title,
            author: this.#author,
            isbn: this.#isbn,
            totalAmount: this.#totalAmount,
            issuedAmount: this.#issuedAmount
        };
    }

    // для создания из объекта
    static fromJSON(data) {
        const book = new Book(data.title, data.author, data.isbn, data.totalAmount);
        book.#id = data.id;
        book.#issuedAmount = data.issuedAmount;
        return book;
    }
}
module.exports = Book;