const Library = require('./Library');
const library = new Library();
const args = process.argv.slice(2);
const command = args[0];

try {
    switch (command) {
        // работа с книгами
        case 'add':
            library.addBook(args[1], args[2], args[3], parseInt(args[4]) || 1);
            break;
        case 'del':
            library.delBook(args[1]);
            break;
        case 'find':
            library.findBook(args[1]);
            break;
        case 'issue':
            library.issueBook(args[1], args[2]);
            break;
        case 'return':
            library.returnBook(args[1], args[2]);
            break;
        case 'list':
            library.getBooks();
            break;
        // работа с пользователями
        case 'user-add':
            library.addUser(args[1], args[2], args[3]);
            break;
        case 'admin-add':
            library.addAdmin(args[1], args[2], args[3], args[4]);
            break;
        case 'user-del':
            library.delUser(args[1]);
            break;
        case 'users':
            library.getUsers();
            break;
        case 'user-books':
            library.getUserBooks(args[1]);
            break;
        case 'help':
            console.log(`
КОМАНДЫ

Книги:
  add "Название" Автор ISBN [количество]   - добавить книгу
  del ISBN                                  - удалить книгу
  find ISBN                                 - найти книгу
  issue ISBN карта_пользователя             - выдать книгу
  return ISBN карта_пользователя            - вернуть книгу
  list                                      - список всех книг

Пользователи:
  user-add Фамилия Имя НомерКарты           - добавить пользователя
  admin-add Фамилия Имя НомерКарты Код      - добавить администратора
  user-del НомерКарты                       - удалить пользователя
  users                                     - список пользователей
  user-books НомерКарты                     - книги на руках у пользователя

Прочее:
  help                                      - эта справка
            `);
            break;

        default:
            console.log('Неизвестная команда. Используйте "help" для списка команд.');
    }
} catch (error) {
    console.error('Ошибка:', error.message);
}
// Пример команд:
// Добавить книгу           - node index.js add "Война и мир" Толстой 12345 2
// Добавить пользователя    - node index.js user-add Иванов Иван LIB-001
// Добавить администратора  - node index.js admin-add Петров Петр ADM-001 ADMIN123
// Выдать книгу             - node index.js issue 12345 LIB-001
// Список книг              - node index.js list
// Список пользователей     - node index.js users
// Книги пользователя       - node index.js user-books LIB-001
// Вернуть книгу            - node index.js return 12345 LIB-001
// Удалить пользователя     - node index.js user-del LIB-001, node index.js user-del ADM-001
// Удалить книгу            - node index.js del 12345
// Справка                  - node index.js help