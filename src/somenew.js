class UserService {
   //убрал объявления переменных, в классе так делать нельзя
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    get username() { 
        return this._username;  //обращаемся к контексту 
    }
    set username(val) { //если есть геттер - то должен быть и сеттер, иначе свойство будет только для чтения
        this._username = val;
    }
    get password() { 
        throw "You are not allowed to get password"
    }
    set password(val) { //аналогично сеттеру username
        this._password = val;
    }
    async authentificate_user() { //статические методы нельзя вызвать через новые экземпляры класса, убрал
        //устаревший синтаксис, переписал под async/await
        let result = false; //let потому что будет переназначение переменной
        try {
            const response = await fetch(`https://examples.com/api/user/authentificate?username=${this.username}&password=${this._password}`) //template literal, а не конкатенация
            const json = await response.json();
            response.status !== 200 ? result = json : result = true; //синтаксический сахар, тернарный оператор
        } catch(err) { //ловим ошибку
            console.log(err); //ошибка будет всегда, потому что api не существует
        }
    }
}


$('form #login').click(function() {
    var username = $('#username');
    var password = $('#password');
    const res = new UserService(username, password);
    const authRes = res.authentificate_user(); // создаем новый экземпляр класса и вызываем метод + убираем var
    authRes === true ? document.location.href = '/home' : alert(res.error);
})