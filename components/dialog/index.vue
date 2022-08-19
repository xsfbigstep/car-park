<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogVisible"
    v-bind="$attrs"
    v-on="$listeners"
    @close="close"
  >
    <!-- :show-close="showClose" -->
    <slot />
    <span slot="title">
      <slot name="title-icon" />
      {{ title }}
      <slot name="title" />
    </span>
    <span v-if="showFooter" slot="footer" class="dialog-footer">
      <el-button
        v-if="showCancel"
        class="color333"
        type="text"
        @click="close"
      >
        {{ buttonCloseText }}
      </el-button>
      <el-button
        :disabled="disabled"
        :loading="isLoading"
        type="primary"
        @click="confirm"
      >
        {{ buttonConfirmText }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'self-dialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '提示'
    },
    buttonCloseText: {
      type: String,
      default: '取消'
    },
    buttonConfirmText: {
      type: String,
      default: '确定'
    },
    disabled: {
      default: false,
      type: Boolean
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true

    }
  },
  data() {
    return {
      dialogVisible: false,
      isLoading: this.loading
    }
  },

  watch: {
    visible: {
      handler() {
        this.dialogVisible = this.visible
      },
      immediate: false
    },
    loading() {
      this.isLoading = this.loading
    }
  },
  methods: {
    close() {
      // this.$emit('update:visible', false)
      this.$emit('update:loading', false)
      this.$emit('closeDialog')
    },
    confirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-dialog{
    border-radius: 16px;
    overflow: auto;
    .el-dialog__header{
      position: relative;
      padding: 14px 20px;
      border-bottom: 1px solid #E3E3E3;
      .el-dialog__headerbtn{
        top: 50%;
        margin-top: -11px;
        font-size: 22px;
      }
    }
    .el-dialog__body{
      padding: 20px;
    }
    .el-dialog__footer{
      padding: 12px 24px;
      background: #F6F8FA;
      .color333{
        color: #333333;
      }
    }

  }
</style>
