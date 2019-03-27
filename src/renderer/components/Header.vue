<template>
  <div class="horizontal_layout_right">
    <div class="drag"></div>
    <img src="../assets/img/small.svg" @click="small" class="handle_btn">
    <img src="../assets/img/big.svg" @click="big" class="handle_btn">
    <img src="../assets/img/cancel.svg" @click="cancel" class="handle_btn">
  </div>
</template>


<script>
export default {
  data() {
    return {};
  },
  methods: {
    small(e) {
      this.$electron.ipcRenderer.send("handle_btn","small")
    },
    big(e) {
      this.$electron.ipcRenderer.send("handle_btn","big")
    },
    cancel(e) {
      this.$electron.ipcRenderer.send("handle_btn","cancel")
    }
  }
};
</script>

<style>
.drag {
  -webkit-app-region: drag;
  height: 30px;
}

.horizontal_layout_right {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.horizontal_layout_right div {
  flex-grow: 2;
}

.handle_btn {
  width: 20px;
  height: 20px;
  padding: 5px;
}
.handle_btn:hover {
  background-color: #dcdfe6;
}
</style>

