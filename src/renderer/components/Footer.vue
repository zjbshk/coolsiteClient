<template>
  <div>
    <el-row class="footer_tip">
      收录酷站数:
      <span class="coolsite_num">{{coolsite_num}}</span>个&nbsp;&nbsp;更新时间:
      <span class="coolsite_updatedAt">{{updatedAt}}</span>
    </el-row>
  </div>
</template>


<script>
export default {
  data() {
    return {
      coolsite_num: 0,
      updatedAt:''
    };
  },

  methods: {},
  mounted: function() {
    const query = this.$Bmob.Query("url");
    query.count().then(num => {
      this.coolsite_num = num;
    });

    query.select("updatedAt");
    query.order("-updatedAt");
    query.limit(1);
    query.find().then(res => {
      if(res.length == 1){
          var updatedAt = res[0].updatedAt
          var end = updatedAt.indexOf(" ");
          if(end != -1){
              this.updatedAt = updatedAt.substring(0,end)
          }
      }
    });
  }
};
</script>

<style>
.coolsite_num {
  color: #76c47a;
  font-size: 20px;
}

.coolsite_updatedAt{
    color: #303133;
    font-size: 15px;
}
.footer_tip {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
  color: #606266;
  font-size: 12px;
}
</style>
