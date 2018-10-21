<template>
  <div :id="sId" :class="{'vis-hide': !visible}"></div>
</template>
<script>
export default {
  data () {
    return {
      sentId: this.sId,
    }
  },
  props: {
    // id must be provided
    sId: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
    }
  },
}
</script>

<style scoped>
  div {
    border: 1px solid red;
  }
</style>
