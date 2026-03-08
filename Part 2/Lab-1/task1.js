const user = "Иванов Иван Иванович";
const result1 = user.replace(/(\S+)\s+(\S+)\s+(\S+)/, '$2 $1'); //Нумерованные группы
console.log(result1);
const result2 = user.replace(/(?<surname>\S+)\s+(?<name>\S+)\s+(?<patronymic>\S+)/, '$<name> $<surname>'); //Именованные группы
console.log(result2);