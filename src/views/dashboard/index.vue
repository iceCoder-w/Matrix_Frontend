<template>
  <div class="dashboard-container">
    <div>欢迎回来！</div>
    <div class="dashboard-text">name:{{ name }}</div>
    <div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div>

    <!-- 文件上传部分 -->
    <uploader
      ref="uploader"
      :options="options"
      :file-status-text="statusText"
      :auto-start="true"
      class="uploader-app"
      @file-added="onFileAdded"
      @file-progress="onFileProgress"
      @file-success="onFileSuccess"
      @file-error="onFileError">
      <uploader-unsupport/>

      <uploader-drop>
        <i class="el-icon-upload"/>
        <p>将文件拖到此处，或点击上传</p>
        <uploader-btn>普通文件</uploader-btn>
        <uploader-btn :attrs="attrs">图片</uploader-btn>
        <uploader-btn :directory="true">文件夹</uploader-btn>
        <uploader-btn id="global-uploader-btn" ref="uploadBtn" :attrs="attrs">选择文件<i class="el-icon-upload el-icon--right"/></uploader-btn>
      </uploader-drop>

      <uploader-list ref="list"/>

      <div/>
      <el-progress :percentage="percentage" :format="format"/>

    </uploader>

    <div slot="footer" class="uploader-footer">
      <span class="filetotal">共计: {{ file_total }}</span>
      <el-button v-show="controllerErrorFileDialog" type="danger" plain @click="errorDialog=true">错误信息</el-button>
      <el-button :disabled="startBtn" type="primary" @click="startUpload"><span>全部开始</span></el-button>
      <el-button :disabled="stopBtn" type="primary" @click="stopUpload"><span>全部暂停</span></el-button>
      <el-button @click="cancelUpload">清空上传列表</el-button>
    </div>

    <el-table
      :data="fileList"
      :key="Math.random()"
      style="width: 600px;margin: 20px auto;">
      <el-table-column
        prop="id"
        label="文件id"
        width="100"/>
      <el-table-column
        prop="name"
        label="文件名"
        width="240"/>
      <el-table-column
        prop="size"
        label="文件大小"
        width="180"/>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SparkMD5 from 'spark-md5'
import UploaderBtn from './btn.vue'
import UploaderList from './list.vue'

export default {
  name: 'Dashboard',
  components: {
    UploaderBtn,
    UploaderList
  },
  data() {
    return {
      // 已上传的文件列表
      fileList: [],

      options: {
        target: process.env.BASE_API + '/fileservice/simupload/uploadFile',
        maxChunkRetries: 3, // 失败后最多自动重试上传次数
        fileParameterName: 'contents',
        chunkSize: 10 * 1024 * 1024, // 分块大小10MB(单位：字节)
        simultaneousUploads: 2, // 支持的并发上传个数
        testChunks: true, // 是否开启服务器分片校验，对应GET类型同名的target URL
        // 服务器分片校验函数，判断秒传及断点续传,传入的参数是Uploader.Chunk实例以及请求响应信息
        // 若return true,则不再调用上传接口
        checkChunkUploadedByResponse: function(chunk, response_msg) {
          const objMessage = JSON.parse(response_msg)
          if (objMessage.skipUpload) {
            return true
          }
          return (objMessage.uploadedChunks || []).indexOf(chunk.offset + 1) >= 0
        }
      },

      statusText: {
        success: '上传成功',
        error: '上传失败',
        uploading: '上传中',
        paused: '等待中',
        waiting: '等待中'
      },
      attrs: {
        accept: []
        // accept: 'image/*'
      },
      file_total: 0, // 本次文件上传的总数
      // errorfilelist: [], // 上传失败信息列表

      controllerErrorFileDialog: false, // 错误信息是否显示
      percentage: 0,
      startBtn: false,
      stopBtn: true
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
    // 全部开始
    startUpload() {
      if (this.file_total <= 0) { return }
      this.startBtn = true
      this.stopBtn = false
      for (let i = 0; i < this.$refs.list.fileList.length; i++) {
        console.log(this.$refs.list.fileList[i])
        console.log('文件名：' + this.$refs.list.fileList[i].name)
        console.log('文件大小：' + this.$refs.list.fileList[i].size)
        console.log('文件类型：' + this.$refs.list.fileList[i].type)
        console.log('文件修改时间：' + this.$refs.list.fileList[i].lastModifiedDate)
        this.$refs.list.fileList[i].resume()
      }

      // 另一种写法
      // this.$refs.list.fileList.length
      // for (var i = 0; i < this.$refs.uploader.uploader.files.length; i++) {
      //   this.$refs.uploader.uploader.files[i].resume()
      // }

      // this.$refs.startBtn.$vnode.elm.innerText = '全部开始'
    },

    // 全部暂停
    stopUpload() {
      if (this.file_total <= 0) { return }
      this.startBtn = false
      this.stopBtn = true
      for (let i = 0; i < this.$refs.list.fileList.length; i++) {
        this.$refs.list.fileList[i].pause()
      }
    },

    // 取消上传
    cancelUpload(file) {
      this.clearcache()
    },

    // 清除缓存
    clearcache() {
      this.percentage = 0
      this.file_total = 0
      this.$refs.uploader.uploader.cancel()
      // this.errorfilelist = []
      // this.controllerErrorFileDialog = false
      // this.getresourceDetail()
    },

    // todo：bug-传输完成的提示,未生效
    format(percentage) {
      // eslint-disable-next-line eqeqeq
      return percentage === 100 ? '上传完成' : `${percentage}%`
    },

    // 显示进度
    onFileProgress(file) {
      this.percentage = 0
      this.percentage = Math.ceil(file.progress() * 100)
      console.log('正在上传中，Percentage:' + this.percentage)
    },

    // 添加文件到列表还未上传,每添加一个文件，就会调用一次,
    // 在这里过滤并收集文件夹中文件格式不正确信息，
    // 同时把所有文件的状态设为暂停中
    onFileAdded(file) {
      // if (this.percentage === 100) {
      // this.$refs.uploader.uploader.cancel()
      // }

      // todo：判断列表里是否还有正在上传的文件，若没有需要禁用暂停按钮
      // 有新文件添加时，可以点击开始按钮
      this.startBtn = false
      this.stopBtn = false

      this.computeMD5(file)
      this.$nextTick(() => {
        this.file_total = this.$refs.list.fileList.length // 计算文件数量
      })
    },

    /*
     第一个参数 rootFile 就是成功上传的文件所属的根 Uploader.File 对象，它应该包含或者等于成功上传文件；
     第二个参数 file 就是当前成功的 Uploader.File 对象本身；
     第三个参数就是 message 就是服务端响应内容，永远都是字符串；
     第四个参数 chunk，Uploader.Chunk 实例，它就是该文件的最后一个块实例，（请求的响应码：chunk.xhr.status）
     */
    // todo:传输成功后前端提示
    onFileSuccess(rootFile, file, response, chunk) {
      // refProjectId为预留字段，可关联附件所属目标，例如所属档案，所属工程等
      // file.refProjectId = '123456789'
      // mergeFile(file).then(responseData => {
      //   if (responseData.data.code === 415) {
      //     console.log('合并操作未成功，结果码：' + responseData.data.code)
      //   }
      // }).catch(function(error) {
      //   console.log('合并后捕获的未知异常：' + error)
      // })
      this.startBtn = false
      this.stopBtn = true
      console.log(response)
      this.$notify({
        title: '上传成功',
        message: JSON.parse(response).message,
        type: 'success'
      })
      this.$refs.uploader.uploader.removeFile(file)

      this.fileList[this.fileList.length] = file
      // console.log(this.fileList)
      this.file_total = this.$refs.list.fileList.length
    },

    onFileError(rootFile, file, response, chunk) {
      console.log('上传完成后异常信息：' + response)
    },

    // 计算md5，实现断点续传及秒传
    computeMD5(file) {
      file.pause()
      // 单个文件的大小限制10G
      const fileSizeLimit = 10 * 1024 * 1024 * 1024
      console.log('文件大小：' + file.size)
      console.log('限制大小：' + fileSizeLimit)
      if (file.size > fileSizeLimit) {
        this.$message({
          showClose: true,
          message: '文件大小不能超过10G'
        })
        file.cancel()
      }

      const fileReader = new FileReader()
      const time = new Date().getTime()
      const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      let currentChunk = 0
      const chunkSize = 10 * 1024 * 1000
      const chunks = Math.ceil(file.size / chunkSize)
      const spark = new SparkMD5.ArrayBuffer()
      // 由于计算整个文件的Md5太慢，因此采用只计算第1块文件的md5的方式
      const chunkNumberMD5 = 1

      loadNext()

      fileReader.onload = e => {
        spark.append(e.target.result)

        if (currentChunk < chunkNumberMD5) {
          loadNext()
        } else {
          const md5 = spark.end()
          file.uniqueIdentifier = md5
          // file.resume() // 继续上传
          console.log(`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`)
        }
      }

      fileReader.onerror = function() {
        this.error(`文件${file.name}读取出错，请检查该文件`)
        file.cancel()
      }

      function loadNext() {
        const start = currentChunk * chunkSize
        const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize

        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end))
        currentChunk++
        console.log('计算第' + currentChunk + '块')
      }
    }

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

    .uploader-app {
    width: 700px;
    padding: 15px;
    margin: 40px auto 40px;
    font-size: 16px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
    }

    .uploader-app .uploader-drop{

    }
    .uploader-app .uploader-btn {
    margin-right: 4px;
    }
    .uploader-app .uploader-list {
    max-height: 440px;
    margin: 10px auto;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
    }

    //.uploader-app .uploader-list .uploader-file .uploader-file-progress{
    //  background: #00a2d4;
    //}

    .uploader-footer {
    width: 600px;
    padding: 15px;
    margin: 0 auto;
    font-size: 16px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .6)
    }
</style>
