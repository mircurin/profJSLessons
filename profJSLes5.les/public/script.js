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
            const comp = this.searchQuery;
            console.log(this.searchQuery);
            return this.filteredItems.filter(function (elem) {
                if(comp==='') return true;
                else return elem.searchQuery.indexOf(comp) > -1;
            });

        }
    },
    computed:{

    }
});