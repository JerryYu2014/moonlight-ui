<template>
  <Scrollbar :ref="tpleditorCUID" :id="tpleditorCUID" contenteditable class="ml-tpleditor" @keyup.native="KeyupHandler" />
  <!-- v-model="content" -->
</template>

<script>
// import Vue from 'vue'

import Scrollbar from '../scrollbar/Scrollbar'

export default {
  name: 'Tpleditor',
  components: { Scrollbar },
  data () {
    return {
      tpleditorCUID: `tpleditor_${new Date().getTime()}_${Math.floor(
        Math.random() * 1000
      )}`,
      TemplateItemList: [],
      KeyupHandler: null,
      InputValues: []
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
      this.compileTemplateToUI(val)
      this.handleKeyup()
    }
  },
  mounted () {
    this.compileTemplateToUI(this.content)
    this.handleKeyup()
    this.KeyupHandler = this.debounce(
      () => {
        this.handleKeyup()
      },
      500,
      true
    )
    // 禁止黏贴 html
    this.$refs[this.tpleditorCUID].$el.addEventListener('paste', function (e) {
      // e.preventDefault()
      e.stopPropagation()

      let paste = (e.clipboardData || window.clipboardData).getData(
        'text/html'
      )
      //   console.log('paste', paste)

      if (paste) {
        e.preventDefault()
        alert('不允许黏贴HTML文本！')
      }
    })
  },
  destroyed () {
    this.$refs[this.tpleditorCUID].$el.removeEventListener('paste')
  },
  methods: {
    handleKeyup (env) {
      this.$emit(
        'extract',
        this.extractContentWithData(),
        this.restoreToTemplate(this.$refs[this.tpleditorCUID].$el.innerHTML)
      )
      //   console.log(
      //     'this.$refs[this.tpleditorCUID].$el.innerHTML',
      //     this.$refs[this.tpleditorCUID].$el.innerHTML
      //   )

      //   this.$emit(
      //     'change',
      //     this.restoreToTemplate(this.$refs[this.tpleditorCUID].$el.innerHTML)
      //   )
      //   console.log(
      //     'this.$refs[this.tpleditorCUID].$el.textContent',
      //     this.$refs[this.tpleditorCUID].$el.textContent
      //   )
    },
    extractContentWithData () {
      let source = this.content

      // 获取输入控件中的数据
      for (let i = 0; i < this.TemplateItemList.length; i++) {
        const element = this.TemplateItemList[i]
        // if (i === 0) {
        //   source = element.Source
        // }
        element.Values = document.getElementById(element.ElId).value

        // if (
        //   document.getElementById(`${this.tpleditorCUID}_${i + 1}`) instanceof
        //   HTMLInputElement
        // ) {
        //   this.InputValues[i] = element.Values
        // } else if (
        //   document.getElementById(`${this.tpleditorCUID}_${i + 1}`) instanceof
        //   HTMLSelectElement
        // ) {
        //   const arr = element.Mark.split(';')
        //   for (let n = 0; n < arr.length; n++) {
        //     const ele = arr[n]
        //     if(ele===)
        //   }
        // }

        this.InputValues[i] = element.Values
      }
      //   console.log('this.InputValues', this.InputValues)

      // 输入数据替换模板标记
      source = this.fillValues(this.$refs[this.tpleditorCUID].$el.innerHTML)

      //   const regExp = new RegExp(/(?<=\[).*?(?=\])/g)
      //   for (let k = 0; k < this.TemplateItemList.length; k++) {
      //     const matchRegExp = this.TemplateItemList[0].Source.match(regExp)
      //     if (matchRegExp) {
      //       for (let j = 0; j < matchRegExp.length; j++) {
      //         // const element = matchRegExp[j]
      //         if (j === k) {
      //           const arr = regExp.exec(source)
      //           this.TemplateItemList[j].Mark = arr[0]
      //           this.TemplateItemList[j].Source = arr.input
      //           this.TemplateItemList[j].StartPosition = arr.index
      //           this.TemplateItemList[j].EndPosition = arr.index + arr[0].length
      //           const ex = this.TemplateItemList[k]
      //           source = this.replaceStrByPos(
      //             source,
      //             ex.StartPosition - 1,
      //             ex.EndPosition + 1,
      //             ex.Values
      //           )
      //         }
      //       }
      //     }
      //   }

      //   console.log('source', source)

      return source
    },
    restoreToTemplate (htmlStr) {
      let retTpl = htmlStr
      for (let index = 0; index < this.TemplateItemList.length; index++) {
        const element = this.TemplateItemList[index]
        retTpl = retTpl.replace(element.Html, `[${element.Mark}]`)
      }
      retTpl = retTpl.replace(/<.*?>/g, '')
      //   console.log('retTpl', retTpl)
      return retTpl
    },
    restoreToTemplateWithValue (htmlStr) {
      let retTplWithValue = htmlStr
      for (let index = 0; index < this.TemplateItemList.length; index++) {
        const element = this.TemplateItemList[index]
        retTplWithValue = retTplWithValue.replace(
          element.Html,
          `[${element.Mark}|${element.Values}]`
        )
      }
      retTplWithValue = retTplWithValue.replace(/<.*?>/g, '')
      //   console.log('retTplWithValue', retTplWithValue)
      return retTplWithValue
    },
    fillValues (htmlStr) {
      let retText = htmlStr
      for (let index = 0; index < this.TemplateItemList.length; index++) {
        const element = this.TemplateItemList[index]
        retText = retText.replace(element.Html, element.Values)
      }
      retText = retText.replace(/<.*?>/g, '')
      //   console.log('retText', retText)
      return retText
    },
    compileTemplateToUI (tpl) {
      const self = this
      // 包含 []
      // const regExp1 = new RegExp(/\[.*?\]/gi)
      // 不包含 []
      const regExp2 = new RegExp(/(?<=\[).*?(?=\])/g)

      if (regExp2.test(tpl)) {
        // const matchRegExp1 = text.match(regExp1)
        // console.log('matchRegExp1', matchRegExp1)

        const matchRegExp2 = tpl.match(regExp2)
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

        // console.log('0000', this.$refs[this.tpleditorCUID].$el.innerHTML)
        for (let index = 0; index < this.TemplateItemList.length; index++) {
          const element = this.TemplateItemList[index]
          if (
            document.getElementById(element.ElId) instanceof HTMLInputElement
          ) {
            document.getElementById(element.ElId).remove()
          } else if (
            document.getElementById(element.ElId) instanceof HTMLSelectElement
          ) {
            document.getElementById(element.ElId).remove()
          }
        }
        // console.log('1111', this.$refs[this.tpleditorCUID].$el.innerHTML)

        this.TemplateItemList = []

        for (let index = 0; index < matchRegExp2.length; index++) {
          const arr = regExp2.exec(tpl)

          const TemplateItem = {
            Mark: arr[0],
            Html: '',
            ElId: `${this.tpleditorCUID}_${index + 1}`,
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
              for (let idx = select.options.length - 1; idx >= 0; idx--) {
                select.options.remove(idx)
              }
            }

            for (let idx = 0; idx < strArr.length; idx++) {
              const selectOption = document.createElement('option')
              //   selectOption.text = strArr[idx]
              selectOption.value = strArr[idx]
              selectOption.label = strArr[idx]
              select.options.add(selectOption)
            }

            select.id = `${this.tpleditorCUID}_${index + 1}`
            TemplateItem.Html = select.outerHTML
          } else {
            // 文本控件
            ctrlType = 1

            input.id = `${this.tpleditorCUID}_${index + 1}`
            // input.setAttribute('value', '123')
            TemplateItem.Html = input.outerHTML
          }

          tpl = this.replaceStrByPos(
            tpl,
            TemplateItem.StartPosition - 1,
            TemplateItem.EndPosition + 1,
            ctrlType ? input.outerHTML : select.outerHTML
          )

          this.TemplateItemList.push(TemplateItem)
        }

        // console.log('this.TemplateItemList', this.TemplateItemList)

        p.innerHTML = tpl

        this.$refs[this.tpleditorCUID].$el.innerHTML = ''
        this.$refs[this.tpleditorCUID].$el.appendChild(p)

        // 设置文本输入和选择控件已输入的数据；选择控件添加change事件监听
        for (let index = 0; index < this.TemplateItemList.length; index++) {
          const element = this.TemplateItemList[index]

          if (
            document.getElementById(element.ElId) instanceof HTMLInputElement
          ) {
            if (this.InputValues[index]) {
              document
                .getElementById(element.ElId)
                .setAttribute('value', this.InputValues[index])
              this.TemplateItemList[index].Html = document.getElementById(
                element.ElId
              ).outerHTML
            }
          } else if (
            document.getElementById(element.ElId) instanceof HTMLSelectElement
          ) {
            if (this.InputValues[index]) {
              const splitArr = (element.Mark && element.Mark.split(';')) || []
              let n
              for (n = 0; n < splitArr.length; n++) {
                const ele = splitArr[n]
                if (ele === this.InputValues[index]) {
                  break
                }
              }
              //   debugger
              //   document.getElementById(element.ElId)[0].value = this.InputValues[index]
              document.getElementById(element.ElId).selectedIndex = n
              this.TemplateItemList[index].Html = document.getElementById(
                element.ElId
              ).outerHTML
            }
            document.getElementById(element.ElId).onchange = function () {
              self.handleKeyup()
            }
          }
        }
      }
    },
    replaceStrByPos (sourceStr, index, lastIndex, replaceStr) {
      const newStr = `${sourceStr.substring(
        0,
        index
      )}${replaceStr}${sourceStr.substring(lastIndex)}`
      return newStr
    },
    throttle (func, time) {
      let pre = 0
      let timer = null
      return function (...args) {
        if (Date.now() - pre > time) {
          clearTimeout(timer)
          timer = null
          pre = Date.now()
          func.apply(this, args)
        } else if (!timer) {
          timer = setTimeout(() => {
            func.apply(this, args)
          }, time)
        }
      }
    },
    debounce (func, time, immediate) {
      let timer = null
      return function (...args) {
        clearTimeout(timer)
        if (immediate && !timer) {
          func.apply(this, args)
        }
        timer = setTimeout(() => {
          func.apply(this, args)
        }, time)
      }
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
