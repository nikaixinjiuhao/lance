<template>
  <div class="index">
    <h1>首页</h1>
    <VueDragResize :isActive="true" :w="200" :h="200" :x="240" :y="60" v-on:resizing="resize" v-on:dragging="resize">
      <h3>Hello World!</h3>
      <p>{{ top }} х {{ left }} </p>
      <p>{{ width }} х {{ height }}</p>
    </VueDragResize>
  </div>
</template>

<script>

  import VueDragResize from "vue-drag-resize";

  export default {
    name: 'index',
    components: {
      VueDragResize
    },
    data(){
      return{
        width: 200,
        height: 200,
        top: 60,
        left: 240,
      }
    },
    methods:{
      resize(newRect) {
        this.width = newRect.width;
        this.height = newRect.height;
        this.top = newRect.top;
        this.left = newRect.left;
      }
    },
    created() {

    }
  }
</script>

<style>

</style>
