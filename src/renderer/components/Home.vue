<template>
  <div>
    <div class="home_header">
      <div class="label_box">
        <p class="label" ref="default" @click="selector">搜索引擎</p>
        <p class="label" @click="selector">图源</p>
        <p class="label" @click="selector">书源</p>
        <p class="label" @click="selector">bt源</p>
        <p class="label" @click="selector">程序员</p>
      </div>
      <el-input
        clearable
        :placeholder="search_tip"
        v-model="search_key"
        class="input-with-select input_keyword"
        style="box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);"
      >
        <el-select v-model="select" slot="prepend" placeholder="请选择" @change="change_select">
          <el-option v-for="opt in options" :label="opt.name" :value="opt.url" :key="opt.objectId"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" style="font-size:20px" @click="search"></el-button>
      </el-input>
    </div>

    <div>
      <div class="class_box">
        <div class="horizontal_layout" style>
          <p class="dot"></p>
          <p class="class_box_label">精选酷站</p>
        </div>
        <hr class="hr_class">
        <el-row :gutter="10">
          <el-col :md="6" :xs="24" :sm="12" :lg="6" v-for="url in jxurls" :key="url.objectId">
            <div class="class_box_item">
              <div class="horizontal_layout" @click.stop="openUrlByBrowser(url.link)">
                <img
                  :src="url.ico_link"
                  onerror="onerror=null;src='http://xmm.itreatment.top/favicon.ico'"
                  class="ico_link"
                >
                <span class="url_name">{{url.name}}</span>
              </div>
              <p class="decription">{{url.decription}}</p>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="class_box">
        <div class="horizontal_layout" style>
          <p class="dot"></p>
          <p class="class_box_label">热门酷站</p>
        </div>
        <hr class="hr_class">
        <el-row :gutter="10">
          <el-col :md="6" :xs="24" :sm="12" :lg="6" v-for="url in rmurls" :key="url.objectId">
            <div class="class_box_item">
              <div class="horizontal_layout" @click.stop="openUrlByBrowser(url.link)">
                <img
                  :src="url.ico_link"
                  onerror="onerror=null;src='http://xmm.itreatment.top/favicon.ico'"
                  class="ico_link"
                >
                <span class="url_name">{{url.name}}</span>
              </div>
              <p class="decription">{{url.decription}}</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      search_key: "",
      search_tip: "请输入搜索信息",
      select: "",
      label: null,
      options: [],
      optionsObj: [],
      rmurls: [],
      jxurls: []
    };
  },
  methods: {
    search() {
      if (this.search_key.trim().length != 0) {
        var querylink = this.select.replace(/{{keyword}}/g, this.search_key);
        this.$electron.remote.shell.openExternal(querylink);
      } else {
        this.$notify.info({
          title: "温馨提示",
          message: "请输入搜索信息哦o(*≧▽≦)ツ┏━┓",
          offset: 10,
          duration: 2000
        });
      }
    },
    selector(e) {
      this.label.style = "border:0px;";
      this.label = e.target;
      this.change_label();
    },
    filterOptions(label) {
      var optionsTemp = [];
      for (var i = 0; i < this.optionsObj.length; i++) {
        var option = this.optionsObj[i];
        if (option.label == label) {
          optionsTemp.push(option);
        }
      }
      return optionsTemp;
    },
    change_select(url) {
      for (var i = 0; i < this.options.length; i++) {
        var option = this.options[i];
        if (url == option.url) {
          this.search_tip = option.pleaseholder;
        }
      }
    },
    change_label() {
      this.label.style = "border-bottom:2px rgb(255, 208, 75) solid";
      this.options = this.filterOptions(this.label.innerText);
      if (this.options.length == 0) {
        const querySearch = Bmob.Query("search");
        querySearch.equalTo("label", "==", this.label.innerText);
        querySearch.order("-order");
        querySearch.find().then(options => {
          this.options = options;
          if (options.length > 0) {
            this.search_tip = options[0].pleaseholder;
            this.select = options[0].url;
          }
          this.optionsObj = this.optionsObj.concat(options);
        });
      } else {
        if (this.options.length > 0) {
          this.search_tip = this.options[0].pleaseholder;
          this.select = this.options[0].url;
        }
      }
    },
    init() {
      const queryUrl = Bmob.Query("url");
      queryUrl.select(
        "class_",
        "name",
        "decription",
        "report_count",
        "link",
        "ico_link",
        "collect_count"
      );
      queryUrl.equalTo("state", "==", "0");
      queryUrl.limit(12);
      queryUrl.order("-collect_count");

      var rmurlsTemp = localStorage.getItem("rmurls");
      if (!rmurlsTemp) {
        queryUrl.find().then(urls => {
          this.rmurls = urls;
          localStorage.setItem("rmurls", JSON.stringify(urls));
        });
      } else {
        this.rmurls = JSON.parse(rmurlsTemp);
      }

      var jxurlsTemp = localStorage.getItem("jxurls");
      if (!jxurlsTemp) {
        queryUrl.equalTo("remark", "!=", "");
        queryUrl.find().then(urls => {
          this.jxurls = urls;
          localStorage.setItem("jxurls", JSON.stringify(urls));
        });
      } else {
        this.jxurls = JSON.parse(jxurlsTemp);
      }
    },
    openUrlByBrowser(link) {
      this.$electron.remote.shell.openExternal(link);
    }
  },
  filters: {
    clipSize(msg, size) {
      if (!msg || msg.length < size) {
        return msg;
      }
      return msg.substring(0, size);
    }
  },
  mounted() {
    var inputs = document.querySelectorAll("input");
    if (inputs && inputs.length == 2) {
      inputs[1].onkeyup = e => {
        if (e.keyCode == 13) {
          this.search();
        }
      };
    }
    this.label = this.$refs.default;
    this.change_label();

    this.init();
  }
};
</script>

<style>
.el-select .el-input {
  border: 0px;
  padding: 5px;
  width: 100px;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.home_header {
  margin: 10px 100px 50px 100px;
}

.label_box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 35px;
}

.label {
  font-size: 15px;
  font-weight: 500;
  color: #606266;
  cursor: pointer;
  margin: 0px 10px;
  padding: 2px;
}

.label:hover {
  color: rgba(255, 208, 75, 0.5);
  transition: all 0.3s ease;
}

.class_box {
  margin: 20px 50px 0px 50px;
  border-radius: 4px;
  background-color: #fff;
  padding: 10px;
  /* border: .3px #606266 solid; */
  /* box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1); */
}

.hr_class {
  border: 0px;
  margin-bottom: 20px;
  margin-top: 10px;
  border-bottom: 2px rgba(0, 0, 0, 0.06) solid;
}

.dot {
  width: 5px;
  height: 15px;
  margin: 0px 10px 0px 1px;
  border-radius: 5px;
  background: #303133;
}

.class_box_label {
  font-size: 12px;
  height: 15px;
  font-weight: 600;
  margin: 0px;
}

.class_box_item {
  /* border:1px #303133 solid; */
  padding: 5px;
  border-radius: 5px;
  background: #fafafa;
  cursor: pointer;
  margin-bottom: 10px;
}

.class_box_item:hover {
  background: #f2f6fc;
  transition: all 0.3s ease;
}
</style>