const API_URL = "http://localhost:3000";

//Компонент поиска
Vue.component("search", {
    template: `
        <form class="searchWrap">
                <div class="searchBrowse">
                    Browse
                    <i class="fas fa-caret-down"></i>
                </div>
                <input type="text" v-model="searchQuery" class="headerSearch" />
                <button @click.prevent="handleSearchClick">
                    <i class="fas fa-search"></i>
                </button>
        </form>`,
    data(){
        return {
            searchQuery: "",
        }
    },
    methods: {
        handleSearchClick(){
            this.$emit("onsearch", this.searchQuery);
        }
    }
});
//Компонент для товара
Vue.component("product-item", {
    props: ["item"],//item приходит в компонетн из вне
    template: `
    <section class="item shoppingGridRow">
            <div class="product">
                <img src="images/product1.jpg" alt="">
                <div class="productDetails">
                    <h2 class="productName">{{ item.name }}</h2>
                    <div class="productColor">
                        <span class="productParam">Color:</span>
                        {{ item.color }}
                    </div>
                    <div class="productSize">
                        <span class="productParam">Size:</span>
                        {{ item.size }}
                    </div>
                </div>
            </div>
            <div class="productPrice">{{ item.price }}</div>
            <div class="productQty">
                <input class="productQuantity" type="text" value="1">
            </div>
            <div class="productShipping">
                <button @click="handleBuyClick(item)" class="cart-button accountBtn" type="button">Добавить</button>
            </div>
            <div class="productSubtotal">$300</div>
            <div class="productAction">
                <i class="fas fa-times-circle"></i>
            </div>
        </section>
    `,
    methods: {
        handleBuyClick(item) {//слушает события
            this.$emit("onbuy", item);//При нажатии на кнопку, бросаем событие
        }
    }
});
//Компонент для списка товаров
Vue.component("products", {
    props: ["query"],
    //для компонента создали свое событие
    template:`
    <div id="template">
        <product-item v-for="entry in filteredItems" :item="entry" @onbuy="handleBuyClick"></product-item>
    </div>`,
    methods: {
        handleBuyClick(item) {//слушает события
            this.$emit("onbuy", item);
        }
    },
    data() {
        return {
            items: [],
        };
    },
    computed: {
        filteredItems() {
            if(this.query){
                const regexp = new RegExp(this.query, "i");
                return this.items.filter((item) => regexp.test(item.name));
            } else {
                return this.items;
            }
        }
    },
    mounted() {
        fetch(`${API_URL}/products`)
            .then(response => response.json())
            .then((items) => {
                //debugger
                this.items = items;
            });
    }
});
//Компонент корзина
Vue.component("cart", {
    props: ["cart"],
    template: `
    <div class="container headerCart" id="headerCart">
        <button class="cart-button accountBtn" type="button">Корзина</button>
        <div class="cartTotal" id="cartTotal"></div>
        <ul>
            <li v-for="item in cart">{{ item.name }} ({{item.quantity}})<button @click="handleDeleteClick(item)">X</button></li>
        </ul>
        <div>Общая стоимость: {{total}}</div>
    </div>`,
    computed: {
        total(){
            return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        }
    },
    methods: {
        handleDeleteClick(item){
            this.$emit("delete", item);
        }
    }
});
const app = new Vue({
    el: "#app",
    data: {
        filterValue: "",
        cart: [],
    },
    mounted() {
        fetch (`${API_URL}/cart`)
            .then(response =>response.json())
            .then((items) => {
                this.cart = items;
            })
    },
    methods: {
        handleDeleteClick(item){
            //Проверяем товар на количество
            //Если > 1 , то меняем поле quantity
            //Если < 1 , то удаляес товар из cart
            if(item.quantity > 1) {
                fetch (`${API_URL}/cart/${item.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ quantity: item.quantity - 1 })
                })
                    .then((response) => response.json())
                    .then((item) => {
                        const itemIdx = this.cart.findIndex((entry) => entry.id === item.id);
                        //Меняем только определенное поле
                        //this.cart[itemIdx].quantity = item.quantity;
                        //Обновляем страницу
                        Vue.set(this.cart, itemIdx, item);
                    });
            } else {
                fetch(`${API_URL}/cart/${item.id}`, {
                    method: "DELETE",
                })
                    .then(() => {
                        this.cart = this.cart.filter((cartItem) => cartItem.id !== item.id);
                    })
            }

        },
        handleSearchClick(query) {
            this.filterValue = query;
        },
        handleBuyClick(item) {
             const cartItem = this.cart.find((entry) => entry.id === item.id);
             if(cartItem) {
                 //Если есть товар, то увеличить количество товара
                 fetch (`${API_URL}/cart/${item.id}`, {
                     method: "PATCH",
                     headers: {
                         "Content-type": "application/json",
                     },
                     body: JSON.stringify({ quantity: cartItem.quantity +1 })
                 })
                     .then((response) => response.json())
                     .then((item) => {
                         const itemIdx = this.cart.findIndex((entry) => entry.id === item.id);
                         //Меняем только определенное поле
                         //this.cart[itemIdx].quantity = item.quantity;
                         //Обновляем страницу
                         Vue.set(this.cart, itemIdx, item);
                     });
             } else {
                 //Если нет товара, то добавляем товар
                 fetch (`${API_URL}/cart`, {
                     method: "POST",
                     headers: {
                         "Content-type": "application/json",
                     },
                     body: JSON.stringify({ ...item, quantity: 1})
                     })
                     .then((response) => response.json())
                     .then((item) => {
                         this.cart.push(item);
                     });
             }
        }
    }
});