<template>
  <div class="dashboard-container">
    <dicv>欢迎回来！</dicv>
    <div class="dashboard-text">name:{{ name }}</div>
    <div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div>

    <!-- 文件上传部分 -->
    <uploader :options="options" class="uploader-example">
      <uploader-unsupport/>
      <uploader-drop>
        <i class="el-icon-upload"/>
        <p>将文件拖到此处，或点击上传</p>
        <uploader-btn>普通文件</uploader-btn>
        <uploader-btn :attrs="attrs">图片</uploader-btn>
        <uploader-btn :directory="true">文件夹</uploader-btn>
      </uploader-drop>
      <uploader-list/>
    </uploader>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      options: {
        // 可通过 https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js 示例启动服务
        target: process.env.BASE_API + '/fileservice/upload/uploadFile',
        autoStart: false,
        testChunks: false
      },
      attrs: {
        accept: 'image/*'
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'introduction'
    ])
  },
  mounted() {

  },
  created() {

  },
  methods: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.uploader-example {
  width: 880px;
  padding: 15px;
  margin: 40px auto 0;
  font-size: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, .4);
}
.uploader-example .uploader-btn {
  margin-right: 4px;
}
.uploader-example .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
