<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
// No additional logic needed in setup
</script>

<style lang="scss">
body {
  margin: 0px;
  padding: 0px;
  background: #f5f5f5;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}

.appnav {
  padding: 10px 0px 2px 0px;
  margin-bottom: 5px;
  border-bottom: 1px solid #eeeeee;
}

.appheader {
  padding-left: 50px;
}

.appfooter-language {
  text-align: center;
  color: darkgray;
}

.appfooter {
  text-align: center;
  color: darkgray;
  margin-top: 40px;
  padding: 10px;
}

.description {
  color: darkgray;
}

#app {
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100vh;
}

.pagination {
  margin-top: 14px;
  text-align: right;
  padding-right: 25px;
}

.page-table {
  background-color: white;
  padding-bottom: 10px;
}
</style>