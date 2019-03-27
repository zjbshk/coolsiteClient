<template>
  <div id="app">
    <el-container :style="'height:'+winHeight+'px'">
      <el-aside width="220px" :style="'height:'+winHeight+'px'">
        <div style="background:#434a50;padding:10px 0px;">
          <img src="./assets/img/logo.svg" class="appcation_icon">
        </div>
        <el-menu
          default-active="0"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="0" @click="change(null)">
            <i class="el-icon-setting"></i>
            <span slot="title">酷站首页</span>
          </el-menu-item>

          <el-submenu :index="index+1+''" v-for="(tag,index) in tags" :key="tag.objectId">
            <template slot="title">
              <i class="el-icon-menu"></i>
              {{tag.name}}
            </template>

            <el-menu-item
              v-for="(_class,indexClass) in tag._classes"
              :key="_class.objectId"
              :index="index+'-'+indexClass"
              @click="change(_class.objectId)"
            >{{_class.name}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header class="toolbar" style="height:40px;padding:0px;">
          <headerVue/>
        </el-header>

        <el-main class="main_body">
          <component :is="DomName" :class_objectId="class_objectId"></component>
        </el-main>

        <el-footer class="footer" style="height: 30px;">
          <footerVue/>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>


<script>
var home = require("./components/Home.vue").default;
var coolsite = require("./components/Coolsite.vue").default;
var headerVue = require("./components/Header.vue").default;
var footerVue = require("./components/Footer.vue").default;
export default {
  name: "coolsite_home",
  data() {
    return {
      winHeight: document.documentElement.clientHeight,
      tags: [],
      DomName: "home",
      class_objectId: "home",
    };
  },
  methods: {
    init() {
      const queryTag = this.$Bmob.Query("tag");
      queryTag.select("name");
      queryTag.equalTo("state", "==", "OK");
      queryTag.order("-order");
      queryTag.limit(200);

      queryTag.find().then(tags => {
        const query_class = this.$Bmob.Query("class_");
        query_class.select("tag", "name");
        query_class.equalTo("state", "==", "OK");
        query_class.order("-order");
        query_class.limit(500);

        query_class.find().then(_classes => {
          for (var i = 0; i < tags.length; i++) {
            var tag = tags[i];
            for (var j = 0; j < _classes.length; j++) {
              var _class = _classes[j];
              if (_class.tag == tag.objectId) {
                if (!tag._classes) tag._classes = [];
                tag._classes.push(_class);
              }
            }
          }
          this.tags = this.tags.concat(tags);
        });
      });
    },
    change(class_objectId) {
      if (class_objectId) {
        this.class_objectId = class_objectId;
        this.DomName = "coolsite";
      } else {
        this.DomName = "home";
      }
    }
  },
  components: {
    home,
    coolsite,
    headerVue,
    footerVue
  },
  mounted() {
    localStorage.clear();
    window.onresize = () => {
      this.winHeight = document.documentElement.clientHeight;
    };
    this.init();

    document.body.ondrop = 
    document.body.ondragstart = 
    document.body.ondragenter = 
    document.body.ondragover = 
    document.body.ondragleave = 
    document.body.onselectstart = e => {
      e.preventDefault();
    };
  }
};
</script>




<style>
html,
body {
  margin: 0px;
  padding: 0px;
  background: #F1F2F9;
  /* background: url('') repeat center top; */
}

.toolbar {
  width: 100%;
}

.main_body {
  background-color: #F1F2F9;
}
.footer {
  width: 100%;
}

.appcation_icon {
  width: 100%;
  height: 100px;
}

::-webkit-scrollbar {
  width: 5px;
  height: 0;
}
::-webkit-scrollbar-button {
  width: 5px;
  height: 0;
}
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}
::-webkit-scrollbar-thumb {
  background: rgba(129, 134, 83, 0.5);
  border-radius: 5px;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #808d8d;
}
::-webkit-scrollbar-thumb:active {
  background-color: rgb(255, 208, 75);
}

/* .bgimg{
  position:absolute;
  height: 100%;
  width: 100%;
  z-index: 0;
  top: 0px;
  left: 0px;
} */
</style>
