<template>
  <div class="input-wrapper">
    <input type="text" :placeholder="msg" class="input-item" @input="onInput" />
    <slot class="search-icon" />
  </div>
</template>

<script>
export default {
  name: "Input",
  props: {
    msg: {
      type: String,
      default: "Введите текст",
    },
  },
  emits: ["input"],
  methods: {
    onInput(event) {
      this.$emit("input", event.target.value);
    },
  },
};
</script>

<style lang="sass">

.input-wrapper
  display: flex
  align-items: center
  width: 100%
  position: relative

.input-item
  flex: 1
  border: none
  outline: none
  font-size: 14px
  color: #999
  padding: 14px 10px
  margin-inline: 12px
  border-bottom: 2px solid #ccc

  &::placeholder
    color: #999

</style>