const API_URL = "http://localhost:3000";

const $catalog = document.getElementById("catalog");
const $cart = document.getElementById("headerCart");
const $searchButton = document.querySelector(".fa-search");
const $searchText = document.querySelector(".headerSearch");
let flag = true;

$searchButton.addEventListener("click", () => {
    items.filterItems($searchText.value);
    items.render();
});

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
        this.filteredItems = [];
    }

    fetchItems() {
        return sendRequest(`${API_URL}/products.json`).then((items) => {
            this.items = items.map(item => new Item(item.name, item.price, item.quantity, item.size, item.color));
            this.filteredItems = this.items;
        });
    }

    filterItems(query){//Метод для поиска
        const regexp = new RegExp(query, 'i');
        //alert(this.filteredItems);
        this.filteredItems = this.items.filter((item) => regexp.test(item.name));
        alert("filterItems " + this.filteredItems);
    };

    render() {
        console.log(this.filteredItems);
        alert("render " + this.filteredItems);
        this.filteredItems.forEach(item => $catalog.appendChild(super.render(item.name, item.price, item.quantity, item.size, item.color)));
        //this.filteredItems.forEach(item => document.querySelector("#catalog").innerHTML += console.log(super.render(item.name, item.price, item.quantity, item.size, item.color) + ""));
        alert("render 2 " + this.filteredItems);
        $cart.querySelector(".cartTotal").textContent = "Итого: " + items.total();//Выводим общюю Итого
    }

    total() {
        return this.items.reduce((acc, item) => {//Считаем общюю сумму Итого
            return acc + (item.price * item.quantity);
        }, 0);
    }
}

const items = new ItemsList();
alert(flag);
    items.fetchItems().then(() => {
        alert("Start");

        items.render();
    });
    flag = false;
    alert("flag 2 " + flag);


