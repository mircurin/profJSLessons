const app = new Vue({
    el: "#app",
    data: {
        items: [],
        filteredItems: [],
        searchQuery: "",
    },
    mounted() {
        fetch("http://localhost:3000/products")
            .then(response => response.json())
            .then((items) => {
                this.items = items;
                this.filteredItems = items;
            });
    },
    methods: {
        handleSearchClick() {

        }
    }
});