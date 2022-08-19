<template>
  <div class="empty-out">
    <img :src="emptyIcon" class="empty-icon">
    <span class="empty-text">暂无数据</span>
  </div>
</template>

<script>
export default {
  name: 'Empty',
  data() {
    return {
      emptyIcon: require('../../img/empty.png')
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
  .empty-out {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px 0;
    .empty-icon {
      width: 44px;
      height: 48px;
    }
    .empty-text {
      color: #000000;
      font-size: 16px;
      margin-top: 10px;
    }
  }
</style>
