<template>
    <main class="content">
    <TopBar></TopBar>
    <div class="main-container">
      <SideBar></SideBar>
      <div class="main-content open">
        <router-view></router-view>
      </div>
    </div>
  </main>

</template>
<script>
  import TopBar from "../components/TopBar";
  import SideBar from "../components/SideBar";
  export default {
    name: 'Home',
    components: {
      TopBar,
      SideBar
    },
    mounted() {
      const monitorJs = document.createElement('script');
      monitorJs.type = 'text/javascript';
      monitorJs.src = '../static/js/monitor-bootstrap.min.js';
      const prismJs = document.createElement('script');
      prismJs.type = 'text/javascript';
      prismJs.src = '../static/js/monitor-bootstrap.min.js';
      document.body.appendChild(monitorJs);
      document.body.appendChild(monitorJs);

    }
  }

</script>
<style>
  .content{
    /*height: calc(100vh - 64px);*/
    height: 100vh;
  }
</style>
