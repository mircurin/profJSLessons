const API_URL = "http://localhost:3000";

const app = new Vue({
    el: "#app",
    data: {
        items: [],
        filteredItems: [],
        searchQuery: "",
        cart: [],
    },
    mounted() {
        fetch(`${API_URL}/products`)
            .then(response => response.json())
            .then((items) => {
                this.items = items;
                this.filteredItems = items;
            });

        fetch (`${API_URL}/cart`)
            .then(response =>response.json())
            .then((items) => {
                this.cart = items;
            })
    },
    computed: {
        total(){
            return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        }
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
        handleSearchClick() {
            const regexp = new RegExp(this.searchQuery, "i");
            this.filteredItems = this.items.filter((item) => regexp.test(item.name));
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