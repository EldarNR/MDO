<template>
    <header>
        <div class="btn__block">
            <Button class="btn" msg="Создать" @click="showModal = true" />
            <Modal v-if="showModal" @closeModal="showModal = false" />
        </div>

        <div class="header__search">
            <Input class="search" msg="Поиск (№ заявки, название)" @input="handleInput">
            <img src="./../assets/icon/search.svg" alt="icon" class="search-icon" @click="searchId">
            </Input>
            <select class="search" v-model="premise_id" @change="premisesId">
                <option value="" disabled>Дом</option>
                <option v-for="item in premises" :key="item.id" :value="item.id">{{ item.id }}</option>
            </select>
        </div>
    </header>
</template>

<script>
import Button from './components/ui/button/button.vue'
import Input from './components/ui/input/input.vue';
import Modal from './components/ui/modal/modal.vue';

import { mapGetters } from 'vuex';
export default {
    name: 'TableHeader',
    data() {
        return {
            search: '',
            premise_id: '',

            showModal: false,
        }
    },
    components: {
        Button, Input, Modal
    },
    methods: {
        searchId() {
            this.$store.dispatch("setSearch", {
                search: this.search,
            })
        },
        premisesId() {
            this.$store.dispatch("setPremises", {
                premise_id: this.premise_id,
            })
        },
        handleInput(value) {
            this.search = value;
        },
        closeModal() {
            this.showModal = true;
        }
    },
    computed: {
        ...mapGetters(["premises"]),
    }
}
</script>

<style lang="sass">

$Gray: #EEEEEE
header
    background: white
    padding: 10px 20px
    color: #999
.header__search
    width: 100%
    display: flex
    padding: 0px
    gap: 32px

    .search, option
        width: 50%
        border: none 
        border-bottom: 2px solid $Gray
        outline: none
        color: #999

.btn__block
    width: 100%
    display: flex
    justify-content: end

    
.search-icon
  width: 16px
  height: 16px
  margin-left: 8px
  position: absolute
  right: 26px
  cursor: pointer

  &:hover
    filter: brightness(0.8)
</style>