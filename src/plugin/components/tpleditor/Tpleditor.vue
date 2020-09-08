<template>
  <!-- <div contenteditable class="ml-tpleditor">
    <blockquote contenteditable="true">
      <p>Edit this content to add your own quote</p>
    </blockquote>
    <cite contenteditable="true">-- Write your own name here</cite>
    <br />123
    <input type="text" name id style="display:inline;" />
    kasdfklja
    <select name id style="display:inline;">
      <option value="123">张三</option>
      <option value="456">李四</option>
    </select>
  </div>-->

  <Scrollbar
    ref="tpleditor"
    contenteditable
    class="ml-tpleditor"
    @keyup.native="handleKeyup"
    v-model="content"
  ></Scrollbar>
</template>

<script>
import Scrollbar from '../scrollbar/Scrollbar'

export default {
  name: 'Tpleditor',
  components: { Scrollbar },
  data () {
    return {}
  },
  model: {
    prop: 'content',
    event: 'change'
  },
  props: {
    isappend: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: null
    }
  },
  watch: {
    content (oldval, newval) {
      //   this.compileTextToUI(newval)
    }
  },
  mounted () {
    // console.log('props', this.$props)
    this.$refs.tpleditor.$el.innerText = this.content
  },
  methods: {
    handleKeyup () {
      //   console.log('arguments', arguments)
      //   console.log('content', this.content)

      this.$emit('change', this.$refs.tpleditor.$el.innerText)
      //   this.keepLastIndex(this.$refs.tpleditor.$el)

      //   this.compileTextToUI(newval)

      console.log(
        'this.$refs.tpleditor.$el.innerText',
        this.$refs.tpleditor.$el.innerText
      )
    },
    compileTextToUI (text) {
      console.log(text)
    },
    keepLastIndex (obj) {
      if (window.getSelection) {
        // ie11 10 9 ff safari
        obj.focus() // 解决ff不获取焦点无法定位问题
        let range = window.getSelection() // 创建range
        // if (range.anchorOffset !== 0) {
        //   return
        // }
        range.selectAllChildren(obj) // range 选择obj下所有子内容
        range.collapseToEnd() // 光标移至最后
      } else if (document.selection) {
        // ie10 9 8 7 6 5
        let range = document.selection.createRange() // 创建选择对象
        // if (range.anchorOffset !== 0) {
        //   return
        // }
        // var range = document.body.createTextRange();
        range.moveToElementText(obj) // range定位到obj
        range.collapse(false) // 光标移至最后
        range.select()
      }
    }
  }
}
</script>

<style scoped>
[contenteditable="true"] {
  caret-color: red;
}

.ml-tpleditor {
  width: 100%;
  height: 300px;
  border: 1px solid rgb(175, 170, 170);
  padding: 15px;
  border-radius: 5px;
  text-align: left;
  box-sizing: border-box;
  overflow: auto;

  /* word-wrap: none;
  word-break: keep-all;
  word-spacing: 100%; */
  /* white-space: pre; */
  /* word-wrap: break-all; */
}

.ml-tpleditor:focus {
  outline: none;
}

.output {
  font: 1rem "Fira Sans", sans-serif;
}

blockquote {
  background: #eee;
  border-radius: 5px;
  margin: 16px 0;
}

blockquote p {
  padding: 15px;
}

cite {
  margin: 16px 32px;
}

blockquote p::before {
  content: "\201C";
}

blockquote p::after {
  content: "\201D";
}
</style>
