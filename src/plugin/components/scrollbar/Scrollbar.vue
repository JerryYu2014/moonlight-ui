<template>
  <div :class="classSclb" class="ml-sclb-webkit-scrollbar">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Scrollbar',
  display: 'Scroll Bar',
  data () {
    return {
      preCls: 'ml-sclb'
    }
  },
  props: {
    // size: {
    //   type: String,
    //   default: '' // ['large', 'medium', 'small']
    // }
  },
  computed: {
    classSclb () {
      let { preCls, type, size, shape } = this
      let className = [
        `${preCls}`,
        {
          [`${preCls}-${type}`]: !!type,
          [`${preCls}-${size}`]: !!size,
          [`${preCls}-${shape}`]: !!shape
        }
      ]
      return className
    }
  },
  methods: {}
}
</script>

<style scoped>
.ml-sclb-webkit-scrollbar::-webkit-scrollbar {
  /* 滚动条整体样式：高宽分别对应横竖滚动条的粗细 */
  width: 10px;
  height: 10px;
}

.ml-sclb-webkit-scrollbar::-webkit-scrollbar-thumb {
  /* 滚动条里的滑动方块 */
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #535353;
}

.ml-sclb-webkit-scrollbar::-webkit-scrollbar-track {
  /* 滚动条里的滑动轨道 */
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #ededed;
}

/* .ml-sclb-webkit-scrollbar::-webkit-scrollbar-button{
}
.ml-sclb-webkit-scrollbar::-webkit-scrollbar-corner{
} */
</style>>
