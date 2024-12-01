<template>
    <div class="table">
        <table>
            <thead>
                <tr class="table__header">
                    <th class="header__item">№ <img src="./../assets/icon/arrow.svg" class="activeArrow" alt="arrow">
                    </th>
                    <th class="header__item">Создана <img src="./../assets/icon/arrow.svg" class="activeArrow"
                            alt="arrow">
                    </th>
                    <th class="header__item">Адрес</th>
                    <th class="header__item">Заявитель</th>
                    <th class="header__item">Описание</th>
                    <th class="header__item">Срок </th>
                    <th class="header__item">Статус <img src="./../assets/icon/arrow.svg" class="activeArrow"
                            alt="arrow">
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item) in list" :key="item.id" @click="openModal(item)">
                    <td class="tabel__item"><span class="id">{{ item.number }}</span></td>
                    <td class="tabel__item">{{ formatDate(item.created_at) }}</td>
                    <td class="tabel__item">{{ getAddress(item) }}</td>
                    <td class="tabel__item">{{ getShortName(item.applicant) }}</td>
                    <td class="tabel__item tabel__item__description">{{ item.description }}</td>
                    <td class="tabel__item">{{ formatDate(item.due_date, true) }}</td>
                    <td class="tabel__item">{{ item.status.name }}</td>
                </tr>
            </tbody>
        </table>
        <Modal v-if="showModal" @closeModal="closeModal" :item_props="selectedItem" />
    </div>
</template>


<script>
import { mapGetters } from "vuex";
import Modal from "./components/ui/modal/modal.vue";
import { formatDate } from "../usecases/formDate";

export default {
    name: "TableComponent",
    components: { Modal },
    data() {
        return {
            loading: true,
            showModal: false,
            selectedItem: {},
        };
    },
    methods: {
        formatDate,
        closeModal() {
            this.showModal = false;
        },
        openModal(item) {
            console.log(item);
            this.selectedItem = item;
            this.showModal = true;
        },
        getAddress(item) {
            return item.premise?.address && item.apartment?.label
                ? `${item.premise.address}, ${item.apartment.label}`
                : "Нет данных";
        },
        getShortName(applicant) {
            const capitalize = (name) =>
                name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : false;

            const lastName = capitalize(applicant.last_name);
            const firstName = applicant.first_name ? capitalize(applicant.first_name[0]) : false;
            const patronymicName = applicant.patronymic_name ? capitalize(applicant.patronymic_name[0]) : false;

            if (!lastName || !firstName || !patronymicName) {
                return "Некорректное ФИО";
            }

            return `${lastName} ${firstName}.${patronymicName}.`;
        }


    },
    computed: {
        ...mapGetters(["list"]),
    },
};

</script>

<style lang="sass" scoped>
@use '../assets/style/style.sass'

$Primary: #50B053
$Gray: #EEEEEE
table
    width: 100%
    padding: 12px 8px
    gap: 8px
    font-family: Roboto
    font-size: 14px
    font-weight: 400
    line-height: 20px
    text-align: left
    text-underline-position: from-font
    text-decoration-skip-ink: none

    .header__item
        color: #50B053
        padding: 8px
        background: #ffff
        box-shadow: inset 0px -1px 0px #DDDFE0
        flex: none
        order: 0
        align-self: stretch
        flex-grow: 0  

.activeArrow
    &:hover
        filter: invert(0%) sepia(1%) saturate(3792%) hue-rotate(335deg) brightness(90%) contrast(88%)

    filter: invert(82%) sepia(0%) saturate(0%) hue-rotate(47deg) brightness(103%) contrast(87%)
.tabel__item
    cursor: pointer
    white-space: nowrap         
    overflow: hidden            
    text-overflow: ellipsis      
    max-width: 200px             
    border: none
    border-bottom: 2px solid $Gray
    padding: 6px
    
    &.tabel__item__description              
        max-width: 150px  
.id
    width: 40px
    height: 30px

    display: flex
    align-items: center
    font-size: 14px
    justify-content: center
    color: white
    border-radius: 4px
    background: $Primary
</style>