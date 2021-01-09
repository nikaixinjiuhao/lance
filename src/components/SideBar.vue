<template>
  <nav class="drawer open">
    <div class="expansion-panel">
      <div class="expansion-panel-header">
        <span class="drawer-module-color bg-color-yellow"></span>
        Getting started
        <span class="expansion-indicator"></span>
      </div>
      <div class="expansion-panel-body">
        <div class="expansion-panel-content">
          <a class="list-item" href="index.html">
            Introduction
          </a>
          <a class="list-item" href="browser.html">
            Browser support
          </a>
        </div>
      </div>

      <div class="expansion-panel-header">
        <span class="drawer-module-color bg-color-green"></span>
        Content
        <span class="expansion-indicator"></span>
      </div>
      <div class="expansion-panel-body">
        <div class="expansion-panel-content">
          <a class="list-item" href="grid.html">
            Grid layout
          </a>
          <a class="list-item" href="typography.html">
            Typography
          </a>
          <a class="list-item" href="spacing.html">
            Spacing
          </a>
        </div>
      </div>

      <div class="expansion-panel-header open">
        <span class="drawer-module-color bg-color-darkgreen"></span>
        Components
        <span class="expansion-indicator"></span>
      </div>
      <div class="expansion-panel-body open">
        <div class="expansion-panel-content open">
          <router-link class="list-item" to="/index">首页</router-link>
          <router-link class="list-item" to="/purchase">收货</router-link>
          <router-link class="list-item" to="/print">打印标签</router-link>
          <router-link class="list-item" to="/bom">BOM</router-link>
        </div>
      </div>
    </div>
    <div class="list-item list-item-logout">
      <router-link to="/login">Log out</router-link>

    </div>
  </nav>
</template>

<script>
  export default {
    name: 'SideBar'
  }
</script>

<style>

</style>
