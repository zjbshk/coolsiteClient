<template>
  <div>
    <div class="coolsite_header">
      <div class="input_box horizontal_layout">
        <span class="tip">酷站</span>
        <el-input :placeholder="'请输入内容锁定酷站,本类酷站数: '+urls.length+' 个'" v-model="keyword" clearable></el-input>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :md="6" :xs="24" :sm="12" :lg="6" v-for="url in search()" :key="url.objectId">
          <div class="grid-content">
            <div class="horizontal_layout" @click.stop="openUrlByBrowser(url.link)">
              <img
                :src="url.ico_link"
                onerror="onerror=null;src='http://xmm.itreatment.top/favicon.ico'"
                class="ico_link"
              >
              <span class="url_name">{{url.name}}</span>
            </div>
            <p class="decription">{{url.decription}}</p>
            <div></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      urls: [],
      keyword: ""
    };
  },
  props: ["class_objectId"],
  methods: {
    init() {
      var urlsTemp = localStorage.getItem(this.class_objectId);
      this.urls.splice(0, this.urls.length);
      if (urlsTemp && urlsTemp != "undefined") {
        this.urls = JSON.parse(urlsTemp);
      }

      if (this.urls.length == 0) {
        const queryUrl = Bmob.Query("url");
        queryUrl.equalTo("class_", "==", this.class_objectId);
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
        queryUrl.limit(500);

        queryUrl.find().then(urls => {
          this.urls = urls;
          localStorage.setItem(this.class_objectId, JSON.stringify(urls));
        });
      }
    },
    openUrlByBrowser(link) {
      this.$electron.remote.shell.openExternal(link);
    },
    search() {
      if (this.keyword.trim() == "") {
        return this.urls;
      } else {
        var tempUrls = [];
        for (var i = 0; i < this.urls.length; i++) {
          var url = this.urls[i];
          if (
            url.name.indexOf(this.keyword) != -1 ||
            url.link.indexOf(this.keyword) != -1
          ) {
            tempUrls.push(url);
          }
        }
        return tempUrls;
      }
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
  watch: {
    class_objectId: function() {
      this.init();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style>
.grid-content {
  background-color: #ffffff;
  border-radius: 5px;
  padding: 5px 10px 5px 5px;
  margin: 5px 0px;
  height: 50px;
}

.grid-content:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.grid-content:hover .ico_link {
  border-radius: 5%;
  transition: all 0.2s ease;
}
.ico_link {
  width: 25px;
  height: 25px;
  margin: 0px 10px;
  border-radius: 50%;
}

.horizontal_layout {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.decription {
  font-size: 12px;
  color: #606266;
  padding-right: 10px;
  margin: 5px 10px 5px 5px;

  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  -ms-text-overflow: ellipsis;
  white-space: nowrap;
}

.coolsite_header {
  margin: 0px 100px 20px 100px;
  height: 30px;
  border-radius: 5px;
}

.input_box {
  border-radius: 5px;
  background: #ffffff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.input_box input {
  border: 0px;
  height: 40px;
}

.input_box .tip {
  width: 40px;
  padding: 0px 0px 0 15px;
  font-size: 16px;
  font-weight: 700;
  color: #606266;
  margin-right: 6px;
}

.url_name {
  font-size: 16px;
  font-weight: 700;
  color: #303133;

  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  -ms-text-overflow: ellipsis;
  white-space: nowrap;
}

.url_name:hover {
  color: rgb(185, 169, 124);
}
</style>
