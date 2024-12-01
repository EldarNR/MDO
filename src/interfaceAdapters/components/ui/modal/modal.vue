<template>
    <div class="modal-overlay" @click="handleOverlayClick" id="modal">
        <Alert v-if="alert.show" :msg="alert.msg" :type="alert.type" @closeAlert="setAlert('', '', false)" />
        <div class="modal">
            <div class="modal-header">
                <h2 class="modal-title">{{ (item_props && item_props.number && item_props.created_at) ?
                    `№${item_props.number}
                    ${formatDate(item_props.created_at)}` : 'Создание заявки' }}</h2>
                <div class="modal-status">{{ item_props && item_props.status.name ? item_props.status.name : 'Новая'
                    }}
                </div>
            </div>
            <div class="modal-body">
                <form @submit.prevent="item_props ? postEdit() : postCreate()">
                    <div class="form-group-first">
                        <div class="input-wrapper">
                            <input type="text" class="input-item" v-model="form.premise_id" placeholder="Дом"
                                @change="handleInputPremise" />
                            <img src="./../../../../assets/icon/triangle.svg" alt="icon" class="search-icon"
                                @click="fetchPremises">
                        </div>
                        <div v-if="loadingPremises" class="dropdown">
                            <div class="dropdown-item">Загрузка...</div>
                        </div>
                        <div v-else-if="openPremiseSearch" class="dropdown">
                            <div v-for="item in premises" :key="item.id" class="dropdown-item"
                                @click="selectPremise(item)">
                                {{ item.id }}
                            </div>
                        </div>

                        <div class="apartment-input-wrapper">
                            <input type="text" class="input-item" v-model="form.apartment_id" placeholder="Квартира"
                                @change="handleInputApartment" />
                            <img src="./../../../../assets/icon/triangle.svg" alt="icon" class="search-icon"
                                @click="fetchApartments">
                        </div>
                        <div v-if="loadingApartments" class="apartment-dropdown">
                            <div class="dropdown-item-apartment">Загрузка...</div>
                        </div>
                        <div v-else-if="openApartmentSearch" class="apartment-dropdown ">
                            <div v-for="item in apartmentsLocal" :key="item.id" class="apartment-dropdown-item"
                                @click="selectApartment(item)">
                                {{ item.id }}
                            </div>
                        </div>

                        <input type="datetime-local" v-model="form.due_date" placeholder="Срок"></input>
                    </div>
                    <div class="form-group-second">
                        <input type="text" v-model="form.applicant.last_name" placeholder="Фамилия" />
                        <input type="text" v-model="form.applicant.first_name" placeholder="Имя" />
                        <input type="text" v-model="form.applicant.patronymic_name" placeholder="Отчество" />
                        <input type="text" v-model="form.applicant.username" placeholder="Телефон" />
                    </div>
                    <div class="form-group-last">
                        <textarea v-model="form.description" placeholder="Описание заявки"></textarea>
                    </div>
                    <div style="display: flex; justify-content: flex-end;">
                        <Button type="submit" :msg="item_props ? 'Сохранить' : 'Создать'" style="width: 87px;" />
                    </div>

                </form>
            </div>
        </div>
    </div>
</template>

<script>
import Input from './../input/input.vue';
import { mapGetters } from 'vuex';
import apiClient from '../../../../usecases/utils/fetch';
import { __API_URL } from '../../../../usecases/URL';
import Alert from '../alert/alert.vue';
import { formatDate, formatDueDate } from '../../../../usecases/formDate';
import Button from '../button/button.vue';

export default {
    name: 'Modal',
    components: { Input, Alert, Button },
    data() {
        return {
            form: {
                premise_id: '',
                apartment_id: '',
                due_date: '',
                applicant: {
                    first_name: '',
                    last_name: '',
                    patronymic_name: '',
                    username: '',
                },
                description: '',
                status: null
            },
            openPremiseSearch: false,
            openApartmentSearch: false,
            apartmentsLocal: [],
            loadingPremises: false,
            loadingApartments: false,

            alert: {
                show: false,
                type: '',
                msg: '',
            }
        };
    },
    props: ['isModalOpen', 'item_props'
    ],
    methods: {
        formatDate, formatDueDate,
        closeModal() {
            this.$emit('closeModal');
        },

        setAlert(msg, type, show) {
            this.alert.show = show,
                this.alert.type = type,
                this.alert.msg = msg
        },
        handleOverlayClick(event) {
            if (event.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        },
        handleInputPremise() {
            this.openPremiseSearch = true;
            this.fetchPremises();
        },
        handleInputApartment() {
            this.openApartmentSearch = true;
            this.fetchApartments();
        },
        submitForm() {
            console.log(this.form);
        },
        selectPremise(item) {
            this.form.premise_id = item.id;
            this.openPremiseSearch = false;
        },
        selectApartment(item) {
            this.form.apartment_id = item.id;
            this.openApartmentSearch = false;
        },
        async fetchPremises() {
            this.loadingPremises = true;
            this.$store
                .dispatch('setPremises', { premise_id: this.form.premise_id })
                .finally(() => {
                    this.loadingPremises = false;
                });
        },
        async fetchApartments() {
            this.loadingApartments = true;
            try {
                const response = await apiClient.get(
                    `${__API_URL}/geo/v1.0/apartments/?premise_id=${this.form.premise_id}&search=${this.form.apartment_id}`
                );
                if (response.status === 200) {
                    this.apartmentsLocal = response.data.results;
                }
            } catch (e) {
                this.setAlert(e.response.data.detail, 'error', true);
            } finally {
                this.loadingApartments = false;
            }
        },
        async postCreate() {
            try {
                this.form.due_date = formatDueDate(this.form.due_date);
                const response = await apiClient.post(
                    `${__API_URL}/appeals/v1.0/appeals/`,
                    this.form,
                );
                //ОШИБКА: КОД - 400: {"data":{"status_id":["Обязательное поле."]},"detail":"Увы, произошла ошибка"}
                if (response.status === 201) {
                    this.closeModal();
                    this.getData();
                } else {
                    console.error('Неожиданный статус ответа:', response.status);
                }
            } catch (e) {
                this.setAlert(e.message, 'error', true);
            }
        },
        async postEdit() {
            try {
                const response = await apiClient.patch(
                    `${__API_URL}/appeals/v1.0/appeals/${this.item_props.id}/`,
                    this.form
                );
                if (response.status === 200 || response.status === 204) {
                    this.closeModal();
                    this.getData();
                }
            } catch (error) {
                this.setAlert(e.message, 'error', true);
            }
        },
        resetForm() {
            this.form = {
                premise_id: '',
                apartment_id: '',
                due_date: '',
                applicant: {
                    first_name: '',
                    last_name: '',
                    patronymic_name: '',
                    username: '',
                },
                description: '',
            };
        }

    },
    computed: {
        ...mapGetters(['premises']),
    },
    mounted() {
        this.fetchPremises();

        if (this.item_props) {
            this.form.premise_id = this.item_props.premise.id;
        }
        else {
            this.resetForm();
        }
    },

};
</script>


<style lang="sass">
$modal-overlay-bg: rgba(0, 0, 0, 0.5)
$modal-bg: #fff
$modal-border-radius: 10px
$modal-shadow: 0 4px 15px rgba(0, 0, 0, 0.2)
$Gray: #EEEEEE
.modal-overlay 
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: $modal-overlay-bg
    display: flex
    align-items: center
    justify-content: center
    z-index: 1000

.modal 
    background: $modal-bg
    border-radius: $modal-border-radius
    max-width: 500px
    box-shadow: $modal-shadow
    overflow: hidden

    &-header 
        display: flex
        justify-content: space-between
        align-items: center
        padding: 1rem 1.5rem
        border-bottom: 1px solid #ddd
        background: #f5f5f5

        .modal-title 
            font-size: 1.5rem
            font-weight: bold
            margin: 0
        

        .modal-status 
            font-size: 1rem
            color: #6c757d
            padding: 0.5rem 0.75rem
            background: #e9ecef
            border-radius: 4px
        
    

    &-body 
        padding: 1.5rem

        form 
            display: flex
            flex-direction: column
            gap: 1rem
            .form-group-first 
                display: grid
                position: relative
                grid-template-columns: 33% 33% 33%
                margin: 2px

                input,
                select 
                    flex: 1
                    width: 100%
                    border: none
                    border-bottom: 2px solid $Gray
                    font-size: 1rem
                    &:focus 
                        border-color: #007bff
                        outline: none
                    
                
            

            .form-group-second 
                display: grid
                position: relative
                grid-template-columns: 25% 25% 25% 25%
                align-content: center
                margin: 2px
                input,
                select 
                    flex: 1
                    margin-left: 8px
                    width: 100%
                    padding: 0.5rem
                    padding-right:2px 
                    border: 1px solid #ddd
                    border-radius: 2px
                    font-size: 1rem
                    border: none
                    border-bottom: 2px solid $Gray

                    &:focus 
                        border-color: #007bff
                        outline: none
                    
                
            

            .form-group-last textarea 
                width: 100%
                height: 100px
                padding: 0.5rem
                border: 1px solid #ddd
                border-radius: 4px
                font-size: 1rem
                border: none
                border-bottom: 2px solid $Gray

                &:focus 
                    border-color: #007bff
                    outline: none
                    border: none
                    border-bottom: 2px solid $Gray
                
            

        .dropdown 
            position: absolute
            top: 40px
            max-width: 100%
            width: 250px
            max-height: 200px
            overflow-y: auto
            background: #fff
            border: 1px solid #ddd
            border-radius: 4px
            z-index: 2000
            padding: 0.5rem
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
            overflow: auto
        

        .dropdown-item 
            padding: 0.5rem
            cursor: pointer
            border-bottom: 1px solid #f1f1f1

            &:hover 
                background-color: #f9f9f9
            

            &:last-child 
                border-bottom: none

.input-wrapper 
  position: relative
  width: 100% 


.input-item
  width: 100%
  border: none
  border-bottom: 2px solid $Gray
  outline: none

.search-icon 
  position: absolute
  right: 1rem
  top: 50%
  transform: translateY(-50%)
  cursor: pointer


.input-wrapper,
.apartment-input-wrapper 
    position: relative
    display: flex
    align-items: center

    .input-item 
        width: 100%
        padding: 0.5rem 2rem 0.5rem 1rem
        font-size: 1rem
        border:none
        border: none
        border-bottom: 2px solid $Gray
        outline: none
        transition: border-color 0.2s, box-shadow 0.2s

        &:focus 
            border-color: #007bff
            box-shadow: 0 0 4px rgba(0, 123, 255, 0.5)
        
    

    .search-icon 
        position: absolute
        right: 1rem
        cursor: pointer
        width: 20px
        height: 20px
        transition: opacity 0.2s

        &:hover 
            opacity: 0.7
        

.apartment-dropdown 
    position: absolute
    top: calc(100% + 4px)
    left: 50%
    width: 100%
    max-height: 200px
    overflow-y: auto
    background: #fff
    border: 1px solid #ddd
    border-radius: 4px
    z-index: 2000
    padding: 0.5rem
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
    animation: fadeIn 0.2s ease-out

    &.hidden 
        display: none
    

    .apartment-dropdown-item 
        padding: 0.5rem
        cursor: pointer
        border-bottom: 1px solid #f1f1f1
        &:hover 
            background-color: #f9f9f9
        &:last-child 
            border-bottom: none
textarea
input
select 
  border: none
  border-bottom: 2px solid #000
  outline: none
  padding: 8px 0
  box-sizing: border-box
  transition: border-color 0.3s ease

  &:focus 
    border-bottom-color: #007bff
  

  &:hover 
    border-bottom-color: #555


.form-group-last

    &.form-group-last
        border: none
        border-bottom: 2px solid $Gray
@keyframes fadeIn 
    from 
        opacity: 0
        transform: translateY(-10px)
    
    to 
        opacity: 1
        transform: translateY(0)



</style>
