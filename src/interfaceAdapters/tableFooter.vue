<template>
    <div class="footer-pagination">
        <div class="footer-info">
            <span>
                {{ `${data.page === 1 ? 1 : (data.page - 1) * limit } – ${Math.min(data.page * limit, data.count)
                    } из ${data.count || 0} записей` }}
            </span>
            <select class="footer-select" v-model="limitLocal" @change="setLimitStorage">
                <option v-for="item in Array.from({ length: 10 }, (_, i) => i + 1)" :key="item" :value="item * 10">
                    {{ item * 10 }}
                </option>
            </select>
        </div>
        <div class="pagination-controls">
            <button class="pagination-btn double-left" :disabled="currentPage === 1" @click="changePage(1)">
                &laquo;
            </button>
            <button class="pagination-btn left" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
                &lt;
            </button>
            <button v-for="item in visiblePages" :key="item" class="pagination-btn"
                :class="{ active: item === currentPage }" @click="changePage(item)">
                {{ item }}
            </button>
            <div v-if="currentPage + maxVisiblePages < totalPages" style="display: flex; align-items: end;">
                <span class="dots">...</span>
                <button class="pagination-btn" @click="changePage(totalPages)">{{ totalPages }}</button>
            </div>
            <button class="pagination-btn right" :disabled="currentPage === totalPages"
                @click="changePage(currentPage + 1)">
                &gt;
            </button>
            <button class="pagination-btn double-right" :disabled="currentPage === totalPages"
                @click="changePage(totalPages)">
                &raquo;
            </button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "TableFooter",
    data() {
        return {
            maxVisiblePages: 5,
        };
    },
    watch: {
        limit(newLimit) {
            this.limitLocal = newLimit;
        },
    },
    methods: {
        setLimitStorage() {
            this.$store.dispatch("setLimit", { page_size: this.limitLocal });
        },
        changePage(newPage) {
            if (newPage !== this.currentPage) {
                this.$store.dispatch("setPagination", { page: newPage });
            }
        },
    },
    computed: {
        ...mapGetters(["data", "limit"]),
        limitLocal: {
            get() {
                return this.limit;
            },
            set(value) {
                this.$store.dispatch("setLimit", { page_size: value });
            },
        },
        currentPage() {
            return this.data.page || 1;
        },
        totalPages() {
            return Math.ceil(this.data.count / this.limit);
        },
        visiblePages() {
            if (!this.totalPages) return [];
            const startPage = Math.max(this.currentPage - Math.floor(this.maxVisiblePages / 2), 1);
            const endPage = Math.min(startPage + this.maxVisiblePages - 1, this.totalPages);
            return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
        },
    },
};
</script>

<style lang="sass" scoped>
.footer-pagination 
    display: flex
    justify-content: space-between
    align-items: center
    padding: 10px 20px
    background-color: #fff
    color: black
    border-top: 1px solid #ddd
    .footer-info 
        display: flex
        align-items: center
        font-size: 14px
        span 
            color: black
            margin-right: 10px
        
        .footer-select 
            padding: 5px
            border: 1px solid #ddd
            border-radius: 4px
            font-size: 14px
            &:focus 
                outline: none
                border-color: #50b053
            
        
    

    .pagination-controls 
        display: flex
        align-items: center
        .pagination-btn 
            display: flex
            justify-content: center
            align-items: center
            width: 30px
            height: 30px
            margin: 0 5px
            padding: 0
            font-size: 14px
            color: #666
            background-color: #fff
            border: 1px solid #ddd
            border-radius: 50%
            cursor: pointer
            transition: all 0.2s ease

            &:hover 
                background-color: #f4f4f4
            

            &:disabled 
                cursor: not-allowed
                color: #ccc
                background-color: #f9f9f9
            

            &.active 
                background-color: #50b053
                color: #fff
                border-color: #50b053
                font-weight: bold
            
        

        .dots 
            margin: 0 5px
            font-size: 14px
            color: #666
        
    

</style>