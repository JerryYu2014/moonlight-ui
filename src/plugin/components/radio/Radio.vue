<template>
  <label>
    <span>
      <input type="radio" @click="clickBtn" :class="classRadio" :disabled="isDisabled" />
    </span>

    <span>
      <slot></slot>
    </span>
  </label>
</template>

<script>
export default {
  name: 'Radio',
  display: 'Radio',
  data () {
    return {
      preCls: 'ml-radio'
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
    classRadio () {
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
