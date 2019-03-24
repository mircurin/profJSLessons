
const goods = [
    { name: "Shirt", price: 150, quantity: 1, size: "L", color: "red" },
    { name: "Socks", price: 50, quantity: 1, size: "M", color: "blue" },
    { name: "Jacket", price: 350, quantity: 1, size: "XL", color: "green" },
    { name: "Jacket", price: 250, quantity: 1, size: "XXX", color: "yellow" },
];

let $catalog = document.getElementById("catalog");

const renderGoodsItem = (name, price, quantity, size, color) => {

    //return `<div class="goods-item"><h3>${title}</h3><p>${price}</p></div>`;

    let $template = document.getElementById("template").children[0].cloneNode(true);

    $template.querySelector(".productName").textContent = name;
    $template.querySelector(".productPrice").textContent = price;
    $template.querySelector(".productQuantity").textContent = quantity;
    $template.querySelector(".productSize").textContent = size;
    $template.querySelector(".productColor").textContent = color;

    return $template;

};

const renderGoodsList = (list) => {

    //document.querySelector('.goods-list').innerHTML = list.map(item => renderGoodsItem(item.name, item.price)).join(" ");

    list.forEach(item => $catalog.appendChild(renderGoodsItem(item.name, item.price, item.quantity, item.size, item.color)));
};

renderGoodsList(goods);
