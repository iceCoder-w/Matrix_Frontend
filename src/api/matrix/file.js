import request from '@/utils/request'

export default {

  mergeUpload(courseInfo) {
    return request({
      url: '/eduservice/course/addCourseInfo',
      method: 'post',
      data: courseInfo
    })
  }
  // // 添加课程信息
  // addCourseInfo(courseInfo) {
  //   return request({
  //     url: '/eduservice/course/addCourseInfo',
  //     method: 'post',
  //     data: courseInfo
  //   })
  // },
  // // 查询所有讲师
  // getListTeacher() {
  //   return request({
  //     url: '/eduservice/edu-teacher/findAll',
  //     method: 'get'
  //   })
  // },
  //
  // // 根据课程id查询课程基本信息
  // getCourseInfoById(id) {
  //   return request({
  //     url: `/eduservice/course/getCourseInfo/${id}`,
  //     method: 'get'
  //   })
  // },
  // // 修改课程基本信息
  // updateCourseInfo(courseInfo) {
  //   return request({
  //     url: '/eduservice/course/updateCourseInfo',
  //     method: 'post',
  //     data: courseInfo
  //   })
  // },
  //
  // // 课程发布确认信息
  // getPublicCourseInfo(courseId) {
  //   return request({
  //     url: `/eduservice/course/getPublishCourseInfo/${courseId}`,
  //     method: 'get'
  //   })
  // },
  //
  // // 课程最终发布
  // publishCourse(courseId) {
  //   return request({
  //     url: `/eduservice/course/publishCourse/${courseId}`,
  //     method: 'post'
  //   })
  // },
  //
  // // 按条件分页查询
  // getPageList(page, limit, searchObj) {
  //   return request({
  //     url: `/eduservice/course/pageCourseCondition/${page}/${limit}`,
  //     method: 'get',
  //     params: searchObj
  //   })
  // },
  //
  // // 删除课程
  // removeById(id) {
  //   return request({
  //     url: `/eduservice/course/removeById/${id}`,
  //     method: 'delete'
  //   })
  // }
}
