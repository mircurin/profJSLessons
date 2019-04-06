const app = new Vue({
    el: "#app",
    data: {
        items: [],
        filteredItems: [],
        searchQuery: "",
    },
    mounted() {
        //debugger;
        fetch("http://localhost:3000/products")
            .then(response => response.json())
            .then((items) => {
                this.items = items;
                this.filteredItems = items;
            });
    },
    methods: {
        handleSearchClick() {
            //debugger;
            const regexp = new RegExp(this.searchQuery, "i");
            this.filteredItems = this.items.filter((item) => regexp.test(item.name));
        }
    }
});