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
    shape: {
      type: String,
      default: '' // 'circle'圆角, 'rectangle'直角
    },
    type: {
      type: String,
      default: 'default', // ['default', 'success', 'warning', 'error', 'info']
      validator (value) {
        let types = [
          'default',
          'primary',
          'success',
          'warning',
          'error',
          'info'
        ]
        return types.includes(value) || !value
      }
    },
    size: {
      type: String,
      default: '' // ['large', 'medium', 'small']
    }
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
  width: 20px;
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
