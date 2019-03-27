$catalog = document.getElementById("catalog");
$cart = document.getElementById("headerCart");

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

class ItemsList extends Item{
    constructor() {
        super();
        this.items = [];
    }

    fetchItems() {
        this.items = [
            { name: "Shirt", price: 150, quantity: 2, size: "L", color: "redddd" },
            { name: "Socks", price: 50, quantity: 1, size: "M", color: "blue" },
            { name: "Jacket", price: 350, quantity: 2, size: "XL", color: "green" },
            { name: "Jacket", price: 250, quantity: 1, size: "XXX", color: "yellow" },
        ];

        this.items = this.items.map(item => new Item(item.name, item.price, item.quantity, item.size, item.color));
    }

    render() {
        this.items.forEach(item => $catalog.appendChild(super.render(item.name, item.price, item.quantity, item.size, item.color)));
    }

    total() {
        return this.items.reduce((acc, item) => {
            return acc + (item.price * item.quantity);
        }, 0);
    }//Считаем общюю сумма Итого
}

const items = new ItemsList();
items.fetchItems();
items.render();
$cart.querySelector(".cartTotal").textContent = "Итого: " + items.total();//Выводим общюю Итого