<template>
  <Scrollbar :ref="tpleditorCUID" :id="tpleditorCUID" contenteditable class="ml-tpleditor" @keyup.native="handleKeyup" v-model="content" />
</template>

<script>
// import Vue from 'vue'

import Scrollbar from '../scrollbar/Scrollbar'

export default {
  name: 'Tpleditor',
  components: { Scrollbar },
  data () {
    return {
      tpleditorCUID: `tpleditor_${new Date().getTime()}`,
      TemplateItemList: [],
      OriginalTemplateContent: ''
    }
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
  directives: {
    focus: {
      // 指令的定义
      inserted: function (el) {
        el.focus()
      }
    }
  },
  watch: {
    content (val, oldval) {
      this.compileTextToUI(val)
    }
  },
  mounted () {
    this.OriginalTemplateContent = this.content

    this.compileTextToUI(this.content)
  },
  methods: {
    handleKeyup () {
      let source
      //   console.log('this.TemplateItemList---', this.TemplateItemList)
      for (let i = 0; i < this.TemplateItemList.length; i++) {
        const element = this.TemplateItemList[i]
        if (i === 0) {
          source = element.Source
        }
        element.Values = document.getElementById(
          `${this.tpleditorCUID}_${i + 1}`
        ).value
      }

      const regExp = new RegExp(/(?<=\[).*?(?=\])/g)

      for (let k = 0; k < this.TemplateItemList.length; k++) {
        const matchRegExp = this.TemplateItemList[0].Source.match(regExp)
        if (matchRegExp) {
          for (let j = 0; j < matchRegExp.length; j++) {
            // const element = matchRegExp[j]

            if (j === k) {
              const arr = regExp.exec(source)

              this.TemplateItemList[j].Mark = arr[0]
              this.TemplateItemList[j].Source = arr.input
              // this.TemplateItemList[j].Values = arr[0]
              this.TemplateItemList[j].StartPosition = arr.index
              this.TemplateItemList[j].EndPosition = arr.index + arr[0].length

              //   console.log(`ARR-${j}`, arr)

              const ex = this.TemplateItemList[k]

              source = this.replaceStrByPos(
                source,
                ex.StartPosition - 1,
                ex.EndPosition + 1,
                ex.Values
              )
            }
          }
        }
      }

      console.log('source', source)
      //   console.log('this.TemplateItemList', this.TemplateItemList)

      //   console.log(
      //     'this.$refs[this.tpleditorCUID].$el.innerHTML',
      //     this.$refs[this.tpleditorCUID].$el.innerHTML
      //   )

      //   this.$emit('change', this.$refs[this.tpleditorCUID].$el.innerHTML)
      this.$emit('change', source)
    },
    compileTextToUI (text) {
      // 包含 []
      //   const regExp1 = new RegExp(/\[.*?\]/gi)
      // 不包含 []
      const regExp2 = new RegExp(/(?<=\[).*?(?=\])/g)

      if (regExp2.test(text)) {
        // const matchRegExp1 = text.match(regExp1)
        // console.log('matchRegExp1', matchRegExp1)

        const matchRegExp2 = text.match(regExp2)
        // console.log('matchRegExp2', matchRegExp2)

        const p = document.createElement('p')

        const input = document.createElement('input')
        // input.className = 'ml-tpleditor-input'
        input.type = 'text'
        input.style =
          'width:50px;border:none;border-bottom:1px solid blue;outline: none;color: blue;text-align:center;'

        const select = document.createElement('select')
        select.style =
          'width:80px;border:none;border-bottom:1px solid blue;outline: none;color: blue;'

        this.TemplateItemList = []
        for (let index = 0; index < matchRegExp2.length; index++) {
          const arr = regExp2.exec(text)

          const TemplateItem = {
            Mark: arr[0],
            Source: arr.input,
            Values: '',
            StartPosition: arr.index,
            EndPosition: arr.index + arr[0].length
          }
          let ctrlType = 0
          const strArr = arr[0].split(';')

          if (strArr && Array.isArray(strArr) && strArr.length > 1) {
            // 选择控件
            ctrlType = 0

            if (select.options && select.options.length > 0) {
              for (let idx = select.options.length; idx >= 0; idx--) {
                select.options.remove(idx)
              }
            }

            for (let idx = 0; idx < strArr.length; idx++) {
              const selectOption = document.createElement('option')
              selectOption.textContent = strArr[idx]
              selectOption.value = strArr[idx]
              select.options.add(selectOption)
            }
            select.id = `${this.tpleditorCUID}_${index + 1}`
          } else {
            // 文本输入控件
            ctrlType = 1
            input.id = `${this.tpleditorCUID}_${index + 1}`
          }

          text = this.replaceStrByPos(
            text,
            TemplateItem.StartPosition - 1,
            TemplateItem.EndPosition + 1,
            ctrlType ? input.outerHTML : select.outerHTML
          )

          this.TemplateItemList.push(TemplateItem)
        }

        // console.log('this.TemplateItemList////', this.TemplateItemList)

        p.innerHTML = text

        this.$refs[this.tpleditorCUID].$el.innerHTML = ''
        this.$refs[this.tpleditorCUID].$el.appendChild(p)
      }
    },
    replaceStrByPos (sourceStr, index, lastIndex, replaceStr) {
      const newStr = `${sourceStr.substring(
        0,
        index
      )}${replaceStr}${sourceStr.substring(lastIndex)}`
      return newStr
    },
    keepLastIndex (obj) {
      if (window.getSelection) {
        // ie11 10 9 ff safari
        obj.focus() // 解决ff不获取焦点无法定位问题
        let range = window.getSelection() // 创建range
        range.selectAllChildren(obj) // range 选择obj下所有子内容
        range.collapseToEnd() // 光标移至最后
      } else if (document.selection) {
        // ie10 9 8 7 6 5
        let range = document.selection.createRange() // 创建选择对象
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
</style>
