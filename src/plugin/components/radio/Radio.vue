<template>
  <div class="ml-radio">
    <div class="ml-radio-list" :class="{'ml-radio-direction':direction=='vertical'}">
      <div
        class="ml-radio-cell"
        v-for="(option,index) in options"
        :key="index"
        @change="handleChange"
      >
        <input
          id="ml-radio"
          class="ml-radio-input"
          type="radio"
          :style="{width:width+'px',height:width+'px'}"
          v-model="currentValue"
          :disabled="option.disabled"
          :value="option.value || option"
        />
        <label
          for="ml-radio"
          class="ml-radio-label"
          :style="{width:width-2+'px',height:width-2+'px','background-color':option.value==currentValue?backgroundColor:normalColor,'border':option.value==currentValue?'1px solid'+backgroundColor:'1px solid'+normalColor}"
          :class="{'ml-radio-disabled':option.disabled}"
        ></label>
        <span
          class="ml-radio-text"
          :style="{color:option.value==currentValue?backgroundColor:normalColor}"
        >{{option.label}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Radio',
  data () {
    return {
      currentValue: this.value
    }
  },
  props: {
    width: {
      type: [Number, String],
      default: 20
    },
    value: String,
    options: {
      type: Array,
      required: true
    },
    direction: {
      type: String,
      default: 'horizontal' // 可选vertical垂直，默认horizontal水平
    },
    normalColor: {
      type: String,
      default: '#c8c9cc'
    },
    backgroundColor: {
      type: String,
      default: '#25c6fc'
    }
  },
  methods: {
    handleChange () {
      this.$emit('input', this.currentValue).$emit('change', this.currentValue)
    }
  },
  created () {
    // console.log(this.backgroundColor)
    if (typeof this.width === 'string' && this.width.indexOf('px') !== -1) {
      this.width = this.width.split('px')[0]
    }
  }
}
</script>

<style lang="scss">
.ml-radio {
  display: inline-block;
  .ml-radio-list {
    display: flex;
    .ml-radio-cell {
      padding: 5px 10px;
      display: flex;
      align-items: center;
      position: relative;
      .ml-radio-input {
        position: absolute;
        opacity: 0;
        z-index: 999;
        cursor: pointer;
      }
      .ml-radio-label {
        border-radius: 100%;
        display: inline-block;
        margin-right: 5px;
        vertical-align: top;
        // cursor: pointer;
        text-align: center;
        -webkit-transition: all 250ms ease;
        transition: all 250ms ease;
        outline: none;
        box-shadow: inset 0 0 0 4px #f4f4f4;
      }
      .ml-radio-disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .ml-radio-text {
        display: inline-block;
      }
    }
  }
  .ml-radio-direction {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
