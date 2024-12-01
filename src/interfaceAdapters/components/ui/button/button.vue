<template>
    <button>
        {{ msg }} 
    </button>
</template>

<script>
export default {
    name: "Button",
    props: {
        msg: {
            type: String
        },
    },
};
</script>

<style lang="sass">
@use './../../../../assets/style/style.sass'
$Primary: #50B053

button 
    display: flex
    justify-content: center
    align-items: center
    padding: 10px 16px
    gap: 4px
    background: $Primary
    border: none
    border-radius: 5px
    color: white
    cursor: pointer
    font-family: 'Roboto', sans-serif

    &:hover
        background: #319C4B
        cursor: pointer
    &:active
        background: #319C4B
    &:disabled
        cursor: default
        pointer-events: none


  </style>