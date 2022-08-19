<template v-if="show">
  <transition name="el-zoom-in-top">
    <div
      v-if="show"
      v-clickoutside="dialogChange"
      class="car-province"
      :style="{'left':left, 'top': top}"
    >
      <div class="province-in">
        <a
          v-for="item in province"
          :key="item"
          :class="{
            'blank': item <0,
            'special': special.includes(item),
            'active': item === value
          }"
          href="javascript:void(0)"
          @click="handleChange(item)"
        >
          {{ item | provinceName }}
        </a>
      </div>
    </div>
  </transition>
</template>
<script>
import clickoutside from '../../utils/clickoutside'
export default {
  name: 'CarProvinceDialog',
  directives: {
    clickoutside
  },
  filters: {
    provinceName(val) {
      return val < 0 ? '' : val
    }
  },
  model: {
    event: 'change',
    prop: 'value'
  },
  props: {
    show: {
      default: false,
      type: Boolean
    },
    stickyElId: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: '京'
    }
  },
  data() {
    return {
      left: 0,
      top: 0,
      special: ['使', '领', '警', '学', '港', '澳', '台'],
      province: ['京', '津', '渝', '沪', '冀', '晋', '辽', '吉', '黑', '苏', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '琼', '川', '贵', '云', '陕', '甘', '青', '蒙', '桂', '宁', '新', '藏', '使', '领', '警', '学', '港', '澳', '台', -1, -2]
    }
  },
  watch: {
    show: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.$nextTick(() => {
            const el = document.querySelector(`#${this.stickyElId}`)
            const domRect = el.getBoundingClientRect()
            if (el) {
              this.left = `${domRect.left - 11}px`
              this.top = `${domRect.bottom + 1}px`
            } else {
              console.warn('附着元素不存在')
            }
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    dialogChange(val) {
      console.log('111', val)
      setTimeout(() => {
        this.$emit('update:show', false)
      }, 16)
    },
    handleChange(val) {
      if (val < 0) {
        return false
      }
      this.$emit('change', val)
      this.$emit('update:show', false)
    }
  }
}
</script>
<style lang="scss" scoped>
  .car-province {
    position: fixed;
    z-index: 99999999999999999;
  }
  .province-in {
    width:  320px;
    flex-wrap: wrap;
    box-sizing: border-box;
    display: flex;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    a {
      background-color: #fff;
      color: #313131;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      border-right: 1px solid #e7eaf1;
      border-bottom: 1px solid #e7eaf1;
      transition: all 0.3s;
      &.special {
        background-color: #fef2f2;
      }
      &:hover {
        background-color: #ecf4ff;
      }
      &.active {
        background-color: #196fe8;
        color: #fff;
      }
      &.blank {
        &:hover {
          background-color: #fff;
        }
        cursor:not-allowed;
      }
    }
    a:nth-last-of-type(-n+8) {
      border-bottom: none;
    }
    a:nth-child(8n) {
      border-right: none;
    }
  }
</style>
