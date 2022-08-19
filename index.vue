<template>
    <component :is="packParams.currentComponent" :packParams="packParams" class="s-iot"></component>
</template>
<script>
import inParkCar from "./inParkCar.vue"  // 在场车管理
import fixedCar from "./fixedCar.vue"  // 固定车管理
import blackList from "./blackList.vue"  // 黑名单管理
export default {
  name: 'carPark',
  components: { inParkCar, fixedCar, blackList },
  props:{
      npmParams: {
          type: Object,
          required: true,
          default: () => undefined
      }
  },
  data() {
    return {
        packParams: {
            currentComponent: "inParkCar",  // 当前显示的组件，默认为在场车管理
            parkName: ""  // 车场名称
        }
    }
  },
  computed: {

  },
  watch:{
      npmParams: {
          handler(){
              this.initCom();
          },
          deep: true
      }
  },
  created() {
      this.initCom();
  },
  methods:{
      initCom(){
        if(this.npmParams){
            for (const key in this.npmParams) {
                if (Object.hasOwnProperty.call(this.npmParams, key)) {
                    const value = this.npmParams[key];
                    this.packParams[key] = value;
                }
            }
        }
      }
  }
}
</script>
<style lang="sass">
@import './styles/index.scss'
</style>

