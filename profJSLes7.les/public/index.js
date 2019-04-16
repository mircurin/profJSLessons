const fs = require("fs");

fs.readFile("./db/products.json", "utf-8", (err, data) => {
    if(err) {
        console.log(err);
        return;
    }

    //console.log(data.toString());
    //console.log(data);

    //Распарсить json
    const products = JSON.parse(data);

    //Добавляем в products новый элемент
    products.push({ "id": 5, "name": "Шуба", "price": 10000, "quantity": 1, "size": "M", "color": "red" });

    //Записываем массив в файл products.json
    fs.writeFile("./db/products.json", JSON.stringify(products), (err) => {
        if(err) {
           console.log(err);
        }
    });
});