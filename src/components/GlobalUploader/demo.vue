<!-- 一个上传事例文件 -->
<template>
  <div id="global-uploader">

    <!-- 上传 -->
    <uploader
      ref="uploader"
      :options="options"
      :auto-start="false"
      class="uploader-app"
      @file-added="onFileAdded"
      @file-success="onFileSuccess"
      @file-progress="onFileProgress"
      @file-error="onFileError">
      <uploader-unsupport/>

      <uploader-btn id="global-uploader-btn" ref="uploadBtn" :attrs="attrs">选择文件</uploader-btn>

      <uploader-list v-show="panelShow">
        <div slot-scope="props" :class="{'collapse': collapse}" class="file-panel">
          <div class="file-title">
            <h2>文件列表</h2>
            <div class="operate">
              <el-button :title="collapse ? '展开':'折叠' " type="text" @click="fileListShow">
                <i :class="collapse ? 'icon-fullscreen': 'icon-minus-round'" class="iconfont"/>
              </el-button>
              <el-button type="text" title="关闭" @click="close">
                <i class="iconfont icon-close"/>
              </el-button>
            </div>
          </div>

          <ul class="file-list">
            <li v-for="file in props.fileList" :key="file.id">
              <uploader-file ref="files" :class="'file_' + file.id" :file="file" :list="true"/>
            </li>
            <div v-if="!props.fileList.length" class="no-file"><i class="nucfont inuc-empty-file"/> 暂无待上传文件</div>
          </ul>
        </div>
      </uploader-list>

    </uploader>

  </div>
</template>

<script>
import Bus from './js/bus'

export default {
  components: {},
  data() {
    return {
      options: {
        target: 'http://xxxxx/xx', // 目标上传 URL
        chunkSize: '2048000', // 分块大小
        fileParameterName: 'file', // 上传文件时文件的参数名，默认file
        maxChunkRetries: 3, // 最大自动失败重试上传次数
        testChunks: true, // 是否开启服务器分片校验
        // 服务器分片校验函数，秒传及断点续传基础
        checkChunkUploadedByResponse: function(chunk, message) {
          const objMessage = JSON.parse(message)
          if (objMessage.skipUpload) {
            return true
          }

          return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0
        },
        headers: {
          // 在header中添加的验证，请根据实际业务来
          // Authorization: 'Bearer ' + Ticket.get().access_token
        }
      },
      attrs: {
        // 接受的文件类型，形如['.png', '.jpg', '.jpeg', '.gif', '.bmp'...] 这里我封装了一下
        // accept: ACCEPT_CONFIG.getAll()
      },
      panelShow: false // 选择文件后，展示上传panel
    }
  },
  computed: {},
  mounted() {
    // 文件选择后的回调
    Bus.$on('fileAdded', () => {
      console.log('文件已选择')
    })

    // 文件上传成功的回调
    Bus.$on('fileSuccess', () => {
      console.log('文件上传成功')
    })
  },
  destroyed() {
    Bus.$off('fileAdded')
    Bus.$off('fileSuccess')
  },
  methods: {
    upload() {
      // 打开文件选择框
      Bus.$emit('openUploader', {
        superiorID: this.superiorID
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
