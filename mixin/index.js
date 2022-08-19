import Vue from 'vue'
const vm = new Vue()
const h = vm.$createElement
export default {
  methods: {
    // 全局混入弹窗确认 使用文档：参考 /carPark/carType.vue页面
    async showConfirm({
      title = '保存提示',
      showClose = false,
      showCancelButton = true,
      confirmButtonText = '确定',
      cancelButtonText = '取消',
      cancelButtonClass = 'self-confirm-cancel',
      confirmButtonClass = 'self-confirm-danger',
      closeOnClickModal = false,
      promiseCallBack = null,
      promiseCallBackParams = null,
      confirmText = '内容未保存，确定要退出编辑吗？',
      confirmDescText = '',
      customClass = '',
      defaultMsgboxEle = [
        h('i', {
          class: {
            'iconfont': true,
            'icon-billjinggao': true
          }
        }),
        h('div', {},
          [h('p', {
            class: {
              'normal-text': true
            }
          }, confirmText),
          h('p', {
            class: {
              'normal-desc-text': true
            }
          }, confirmDescText)]
        )

      ]
    } = { }) {
      const msgKey = +new Date()
      try {
        await vm.$msgbox({
          title,
          closeOnClickModal,
          message: h('div', {
            key: msgKey,
            class: {
              'self-confirm-content': true
            }
          }, defaultMsgboxEle),
          customClass: `self-confirm ${customClass}`,
          showClose,
          cancelButtonClass,
          confirmButtonClass,
          showCancelButton,
          confirmButtonText,
          confirmDescText,
          cancelButtonText,
          beforeClose: async(action, instance, done) => {
            if (action === 'confirm') {
              if (!promiseCallBack) {
                return done()
              }
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '执行中...'
              try {
                const code = await promiseCallBack(promiseCallBackParams)
                instance.confirmButtonText = confirmButtonText
                instance.confirmButtonLoading = false
                console.log('done', code)
                if (code === '0' || code === undefined) {
                  done()
                }
              } catch (e) {
                instance.confirmButtonText = confirmButtonText
                instance.confirmButtonLoading = false
                console.log(e)
              }
            } else {
              done()
            }
          }
        })
        return Promise.resolve()
      } catch (e) {
        return Promise.reject(e)
      }
    }
  }
}
