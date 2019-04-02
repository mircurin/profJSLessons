const API_URL = "http://localhost:3000";

$catalog = document.getElementById("catalog");
$cart = document.getElementById("headerCart");


function sendRequest(url) {
    return fetch(url).then((response) => response.json());
    /*return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url); // настройка запроса
        xhr.send();

        xhr.onreadystatechange = () => {
            if(xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject();
                }
            }
        }
    });*/

}

class Item {
    constructor(name, price, quantity, size, color) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.size = size;
        this.color = color;
    }

    render(name, price, quantity, size, color) {

        let $template = document.getElementById("template").children[0].cloneNode(true);

        $template.querySelector(".productName").textContent = name;
        $template.querySelector(".productPrice").textContent = price;
        $template.querySelector(".productQuantity").textContent = quantity;
        $template.querySelector(".productSize").textContent = size;
        $template.querySelector(".productColor").textContent = color;
        return $template;
    }
}

class ItemsList extends Item {
    constructor() {
        super();
        this.items = [];
    }

    fetchItems() {
        return sendRequest(`${API_URL}/products.json`).then((items) => {
            this.items = items.map(item => new Item(item.name, item.price, item.quantity, item.size, item.color));
        });
    }

    render() {
        this.items.forEach(item => $catalog.appendChild(super.render(item.name, item.price, item.quantity, item.size, item.color)));
        $cart.querySelector(".cartTotal").textContent = "Итого: " + items.total();//Выводим общюю Итого
    }

    total() {
        return this.items.reduce((acc, item) => {//Считаем общюю сумму Итого
            return acc + (item.price * item.quantity);
        }, 0);
    }
}

const items = new ItemsList();

items.fetchItems().then(() => {
    items.render();
});

