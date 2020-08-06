<template>
  <div class="test test-1">
    <div class="scrollbar">
      <slot></slot>
    </div>
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
    isDisabled: Boolean,
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
    classBtn () {
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
  methods: {
    clickBtn (ev) {
      this.$emit('click', ev)
    }
  }
}
</script>

<style scoped>
.test {
  width: 100%;
  height: 200px;
  overflow: auto;
  float: left;
  margin: 5px;
  border: none;
}

.scrollbar {
  width: 30px;
  height: 300px;
  margin: 0 auto;
}

.test-1::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

.test-1::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #535353;
}

.test-1::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}
</style>>
