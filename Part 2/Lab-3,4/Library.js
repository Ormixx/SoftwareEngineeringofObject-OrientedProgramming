const fs = require('fs');
const Book = require('./Book');
const User = require('./User');
const Admin = require('./Admin');
class Library {
    #books = [];
    #users = [];
    #booksFile;
    #usersFile;
    constructor(booksFile = './data/books.json', usersFile = './data/users.json') {
        this.#booksFile = booksFile;
        this.#usersFile = usersFile;
        this.#loadData();
    }
    #loadData() {
        try {
            if (fs.existsSync(this.#booksFile)) {
                const booksData = JSON.parse(fs.readFileSync(this.#booksFile, 'utf8'));
                this.#books = booksData.map(b => Book.fromJSON(b));
            }
        } catch (error) {
            console.error('Ошибка загрузки книг:', error.message);
            this.#books = [];
        }

        try {
            if (fs.existsSync(this.#usersFile)) {
                const usersData = JSON.parse(fs.readFileSync(this.#usersFile, 'utf8'));
                this.#users = usersData.map(u => User.fromJSON(u));
            }
        } catch (error) {
            console.error('Ошибка загрузки пользователей:', error.message);
            this.#users = [];
        }
    }
    #saveBooks() {
        try {
            const data = this.#books.map(b => b.toJSON());
            fs.writeFileSync(this.#booksFile, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Ошибка сохранения книг:', error.message);
        }
    }
    #saveUsers() {
        try {
            const data = this.#users.map(u => u.toJSON());
            fs.writeFileSync(this.#usersFile, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Ошибка сохранения пользователей:', error.message);
        }
    }

    // работа с книгами
    addBook(title, author, isbn, amount = 1) {
        try {
            const existingBook = this.#books.find(b => b.getIsbn() === isbn);
            if (existingBook) {
                existingBook.setTotalAmount(existingBook.getTotalAmount() + amount);
                console.log(`Добавлено ${amount} экз. книги "${title}" (ISBN: ${isbn})`);
            } else {
                const book = new Book(title, author, isbn, amount);
                this.#books.push(book);
                console.log(`Добавлена книга "${title}" (ISBN: ${isbn}) в количестве ${amount} экз.`);
            }
            this.#saveBooks();
        } catch (error) {
            console.error('Ошибка добавления книги:', error.message);
        }
    }

    delBook(isbn) {
        try {
            const index = this.#books.findIndex(b => b.getIsbn() === isbn);
            if (index === -1) {
                throw new Error(`Книга с ISBN ${isbn} не найдена`);
            }
            const book = this.#books[index];
            if (book.getAvailableAmount() < book.getTotalAmount()) {
                throw new Error('Нельзя удалить книгу, есть выданные экземпляры');
            }
            this.#books.splice(index, 1);
            console.log(`Книга с ISBN ${isbn} удалена`);
            this.#saveBooks();
        } catch (error) {
            console.error('Ошибка удаления книги:', error.message);
        }
    }

    findBook(isbn) {
        try {
            const book = this.#books.find(b => b.getIsbn() === isbn);
            if (!book) {
                throw new Error(`Книга с ISBN ${isbn} не найдена`);
            }
            console.log(`Книга: ${book.getTitle()}, автор: ${book.getAuthor()}, ISBN: ${book.getIsbn()}`);
            console.log(`Всего экз.: ${book.getTotalAmount()}, на руках: ${book.getIssuedAmount()}, доступно: ${book.getAvailableAmount()}`);
            return book;
        } catch (error) {
            console.error('Ошибка поиска книги:', error.message);
            return null;
        }
    }

    issueBook(isbn, userCardNumber) {
        try {
            const book = this.#books.find(b => b.getIsbn() === isbn);
            if (!book) {
                throw new Error(`Книга с ISBN ${isbn} не найдена`);
            }
            if (book.getAvailableAmount() <= 0) {
                throw new Error('Нет доступных экземпляров');
            }
            const user = this.#users.find(u => u.getCardNumber() === userCardNumber);
            if (!user) {
                throw new Error(`Пользователь с картой ${userCardNumber} не найден`);
            }
            book.issue();
            user.getBook(book.getId());
            this.#saveBooks();
            this.#saveUsers();
            console.log(`Книга "${book.getTitle()}" выдана пользователю ${user.getFullName()}`);
        } catch (error) {
            console.error('Ошибка выдачи книги:', error.message);
        }
    }

    returnBook(isbn, userCardNumber) {
        try {
            const book = this.#books.find(b => b.getIsbn() === isbn);
            if (!book) {
                throw new Error(`Книга с ISBN ${isbn} не найдена`);
            }
            const user = this.#users.find(u => u.getCardNumber() === userCardNumber);
            if (!user) {
                throw new Error(`Пользователь с картой ${userCardNumber} не найден`);
            }
            book.returnBook();
            user.returnBook(book.getId());
            this.#saveBooks();
            this.#saveUsers();
            console.log(`Книга "${book.getTitle()}" возвращена пользователем ${user.getFullName()}`);
        } catch (error) {
            console.error('Ошибка возврата книги:', error.message);
        }
    }

    getBooks() {
        if (this.#books.length === 0) {
            console.log('Библиотека пуста');
            return;
        }
        console.log('\nСПИСОК КНИГ:');
        for (const book of this.#books) {
            console.log(`${book.getTitle()} | ${book.getAuthor()} | ISBN: ${book.getIsbn()}`);
            console.log(`  Всего: ${book.getTotalAmount()} | На руках: ${book.getIssuedAmount()} | Доступно: ${book.getAvailableAmount()}`);
        }
    }

    //работа с пользователями
    addUser(lastName, firstName, cardNumber) {
        try {
            if (this.#users.some(u => u.getCardNumber() === cardNumber)) {
                throw new Error(`Пользователь с картой ${cardNumber} уже существует`);
            }
            const user = new User(lastName, firstName, cardNumber);
            this.#users.push(user);
            console.log(`Добавлен пользователь: ${lastName} ${firstName}, карта: ${cardNumber}`);
            this.#saveUsers();
        } catch (error) {
            console.error('Ошибка добавления пользователя:', error.message);
        }
    }

    addAdmin(lastName, firstName, cardNumber, adminCode) {
        try {
            if (this.#users.some(u => u.getCardNumber() === cardNumber)) {
                throw new Error(`Пользователь с картой ${cardNumber} уже существует`);
            }
            const admin = new Admin(lastName, firstName, cardNumber, adminCode);
            this.#users.push(admin);
            console.log(`Добавлен администратор: ${lastName} ${firstName}, карта: ${cardNumber}`);
            this.#saveUsers();
        } catch (error) {
            console.error('Ошибка добавления администратора:', error.message);
        }
    }

    delUser(cardNumber) {
        try {
            const index = this.#users.findIndex(u => u.getCardNumber() === cardNumber);
            if (index === -1) {
                throw new Error(`Пользователь с картой ${cardNumber} не найден`);
            }
            const user = this.#users[index];
            if (user.getBorrowedBooks().length > 0) {
                throw new Error('Нельзя удалить пользователя с непогашенными книгами');
            }
            this.#users.splice(index, 1);
            console.log(`Пользователь с картой ${cardNumber} удален`);
            this.#saveUsers();
        } catch (error) {
            console.error('Ошибка удаления пользователя:', error.message);
        }
    }

    getUsers() {
        if (this.#users.length === 0) {
            console.log('Нет зарегистрированных пользователей');
            return;
        }
        console.log('\nСПИСОК ПОЛЬЗОВАТЕЛЕЙ:');
        for (const user of this.#users) {
            const books = user.getBorrowedBooks();
            const bookTitles = books.map(bookId => {
                const book = this.#books.find(b => b.getId() === bookId);
                return book ? book.getTitle() : 'неизвестно';
            });
            console.log(`${user.getFullName()} | Карта: ${user.getCardNumber()} | Роль: ${user.getRole()}`);
            console.log(`  Книги на руках (${books.length}): ${bookTitles.join(', ') || 'нет'}`);
        }
    }

    getUserBooks(cardNumber) {
        try {
            const user = this.#users.find(u => u.getCardNumber() === cardNumber);
            if (!user) {
                throw new Error(`Пользователь с картой ${cardNumber} не найден`);
            }
            
            const borrowedBooks = user.getBorrowedBooks();
            console.log(`\nКниги пользователя ${user.getFullName()}:`);
            if (borrowedBooks.length === 0) {
                console.log('  Нет книг на руках');
                return;
            }
            
            for (const bookId of borrowedBooks) {
                const book = this.#books.find(b => b.getId() === bookId);
                if (book) {
                    console.log(`  - ${book.getTitle()} | ${book.getAuthor()} | ISBN: ${book.getIsbn()}`);
                }
            }
        } catch (error) {
            console.error('Ошибка:', error.message);
        }
    }
}
module.exports = Library;