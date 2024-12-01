<template>
    <div class="container">
        <p class="title">Список заявок</p>
        <Alert v-if="alert.show" :msg="alert.msg" :type="alert.type" @closeAlert="setAlert(false, null, false)" />
        <TableHeader />
        <main v-if="!loading">
            <TableBody />
        </main>
        <TableFooter v-if="!loading" />
        <div v-else class="container" style="text-align: center;">
            Загрузка...
        </div>
    </div>

</template>

<script>
import TableHeader from '../interfaceAdapters/tableHeader.vue';
import TableBody from '../interfaceAdapters/tableBody.vue';
import TableFooter from '../interfaceAdapters/tableFooter.vue';

import Alert from '../interfaceAdapters/components/ui/alert/alert.vue';
import { checkAuth } from '../usecases/utils/auth.js'
import { store } from '../store/index.js';
import { mapActions, mapGetters } from 'vuex';


export default {
    name: 'HomePage',
    components: {
        TableHeader,
        TableBody,
        TableFooter,
        Alert
    },
    data() {
        return {
            alert: {
                show: false,
                type: 'error',
                msg: null
            }
        }
    },
    computed: {
        ...mapGetters(["loading"]),
    },
    methods: {
        ...mapActions(["fetchData"]),
        async getData() {
            try {
                await store.dispatch('fetchData')
            } catch (error) {
                this.setAlert(false, error, true);
            }
        },
        async getPremises() {
            try {
                await store.dispatch('fetchPremises')
            } catch (error) {
                this.setAlert(false, error, true);
            }
        },
        setAlert(e, msg, show) {
            if (e) {
                this.alert.msg = msg;
                this.alert.type = 'success'
            }
            if (!e) {
                this.alert.msg = msg;
                this.alert.type = 'error'
            }
            this.alert.show = show;
        },
    },
    mounted() {
        checkAuth();
        this.getData();
        this.getPremises();
    }

}
</script>

<style lang="sass">
@use './../assets/style/style.sass'

.container
    background: #EEEEEE
    width: 1280px
    height: 100%
    gap: 20px
    margin: 2px auto
    overflow: auto
    border-radius: 10px


main
    padding: 10px 20px
    background: white

.title
    margin: 20px 2px
</style>