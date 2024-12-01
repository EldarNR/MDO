<template>
  <div class="alert-wrapper" :class="type">
    <p class="alert-message">{{ msg }}</p>
    <button class="alert-close" @click="closeAlert">х</button>
  </div>
</template>

<script>
export default {
  name: "Alert",
  props: {
    msg: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "success", //info,success,error,warning
    },
  },
  data() {
    return {
      visible: true,
    };
  },
  emits: ['closeAlert'],
  methods: {
    closeAlert() {
      this.visible = false;
      this.$emit("closeAlert");
    },
  },
};
</script>

<style lang="sass">
  .alert-wrapper 
    width: 250px
    height: 50px
    text-align: center
    position: absolute
    top: 20px
    left: 50%
    transform: translateX(-50%)
    z-index: 9999
    padding: 10px 20px
    border-radius: 5px
    font-size: 16px
    color: #fff
    display: flex
    align-items: center
    justify-items: end

    gap: 10px
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1)
  
    &.info 
      background-color: #007bff
    
  
    &.success 
      background-color: #28a745
    
  
    &.warning 
      background-color: #ffc107
      color: #212529
    
  
    &.error 
      background-color: #dc3545
    

    .alert-message 
      margin: 0
      flex: 1
      font-size: 18px
    
  
    .alert-close 
      background: transparent
      border: none
      color: #fff
      font-size: 20px
      font-weight: bold
      cursor: pointer
      position: absolute
      right: 0
      top: 0px
    
  
  </style>