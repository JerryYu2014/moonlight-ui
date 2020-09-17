<template>
  <Scrollbar :ref="tpleditorCUID" :id="tpleditorCUID" contenteditable class="ml-tpleditor" @keydown.native="KeydownHandler" />
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
      // 个模板编辑点的数据模型
      TemplateItemList: [],
      KeydownHandler: null,
      // 缓存已输入的数据
      InputValues: [],
      ActiveState: [],
      // 输入框单位宽度
      InputUnitWidth: 10,
      // 选择框单位宽度
      SelectUnitWidth: 20,
      willTabOut: false
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
      this.handleKeydown(null)
    }
  },
  mounted () {
    this.compileTemplateToUI(this.content)
    this.handleKeydown(null)

    // 对可编辑区域键盘按键弹起事件防抖动处理
    this.KeydownHandler = this.debounce(
      (env) => {
        this.handleKeydown(env)
      },
      150,
      true
    )
    // 禁止黏贴 html
    this.$refs[this.tpleditorCUID].$el.addEventListener('paste', function (e) {
      e.stopPropagation()

      let paste = (e.clipboardData || window.clipboardData).getData(
        'text/html'
      )

      if (paste) {
        e.preventDefault()
        alert('不允许黏贴HTML文本！')
      }
    })
  },
  destroyed () {
    this.$refs[this.tpleditorCUID] &&
      this.$refs[this.tpleditorCUID].$el &&
      this.$refs[this.tpleditorCUID].$el.removeEventListener('paste')
  },
  methods: {
    handleKeydown (env) {
      this.$emit(
        'extract',
        this.extractContentWithData(),
        this.restoreToTemplate(this.$refs[this.tpleditorCUID].$el.innerHTML)
      )

      // console.log('env', env)

      if (env && env.key === 'Tab') {
        const firstChild = document.getElementById(
          this.TemplateItemList[0].ElId
        )
        const lastChild = document.getElementById(
          this.TemplateItemList[this.TemplateItemList.length - 1].ElId
        )
        if (this.willTabOut) {
          firstChild.focus()
          this.willTabOut = false
        }
        if (document.activeElement.id === lastChild.id) {
          this.willTabOut = true
        }
      }

      //   if (env && env.keyCode >= 37 && env.keyCode <= 40) {
      //     // console.log('getSelection()', getSelection())
      //     const selection = window.getSelection()
      //     console.log('selection', selection)
      //     const range = selection.getRangeAt(0)
      //     console.log('range', range)
      //     selection.setPosition(
      //       document.getElementById(this.TemplateItemList[0].ElId).getRootNode(),
      //       1
      //     )
      //   }

      //   console.log('getSelection()', getSelection())
    },
    extractContentWithData () {
      let source = this.content

      // 获取输入控件中的数据
      for (let i = 0; i < this.TemplateItemList.length; i++) {
        const element = this.TemplateItemList[i]

        if (document.getElementById(element.ElId) instanceof HTMLInputElement) {
          element.Values = document.getElementById(element.ElId).value
        } else if (
          document.getElementById(element.ElId) instanceof HTMLSelectElement
        ) {
          element.Values = document.getElementById(
            element.ElId
          ).nextElementSibling.value
        }

        this.InputValues[i] = element.Values
      }

      // 输入数据替换模板标记
      source = this.fillValues(this.$refs[this.tpleditorCUID].$el.innerHTML)

      // 可编辑区域为空时，清空已输入数据的缓存
      if (!source) {
        this.InputValues = []
      }

      return source
    },
    restoreToTemplate (htmlStr) {
      let retTpl = htmlStr
      for (let index = 0; index < this.TemplateItemList.length; index++) {
        const element = this.TemplateItemList[index]
        retTpl = retTpl.replace(element.Html, `[${element.Mark}]`)
      }
      // 替换html 标签
      retTpl = retTpl.replace(/<.*?>/g, '')
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
      // 替换html 标签
      retTplWithValue = retTplWithValue.replace(/<.*?>/g, '')
      return retTplWithValue
    },
    fillValues (htmlStr) {
      let retText = htmlStr
      for (let index = 0; index < this.TemplateItemList.length; index++) {
        const element = this.TemplateItemList[index]
        retText = retText.replace(element.Html, element.Values)
      }
      // 替换html 标签
      retText = retText.replace(/<.*?>/g, '')
      return retText
    },
    compileTemplateToUI (tpl) {
      const self = this
      // 匹配 [___]或[abc;def;] 字符串
      // const regExp1 = new RegExp(/\[.*?\]/gi)
      // 匹配 [___]中[abc;def;] 中 [] 内的字符串（___ 或 abc;def;）
      const regExp2 = new RegExp(/(?<=\[).*?(?=\])/g)

      const div = document.createElement('div')

      if (regExp2.test(tpl)) {
        // const matchRegExp1 = text.match(regExp1)
        // console.log('matchRegExp1', matchRegExp1)

        const matchRegExp2 = tpl.match(regExp2)
        // console.log('matchRegExp2', matchRegExp2)

        // 移除可编辑区域中的dom，避免内存泄露
        for (let index = 0; index < this.TemplateItemList.length; index++) {
          const element = this.TemplateItemList[index]
          if (
            document.getElementById(element.ElId) instanceof HTMLInputElement
          ) {
            document.getElementById(element.ElId).remove()
          } else if (
            document.getElementById(element.ElId) instanceof HTMLSelectElement
          ) {
            document.getElementById(element.ElId).parentElement.remove()
          }
        }

        this.TemplateItemList = []

        for (let index = 0; index < matchRegExp2.length; index++) {
          const input = document.createElement('input')
          input.type = 'text'

          const spanForSelect = document.createElement('span')

          const select = document.createElement('select')

          const selectInput = document.createElement('input')

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
            // 选择框
            ctrlType = 0

            const maxLengthStr = this.getMaxLenFromStrArr(strArr)

            if (select.options && select.options.length > 0) {
              for (let idx = select.options.length - 1; idx >= 0; idx--) {
                select.options.remove(idx)
              }
            }

            for (let idx = 0; idx < strArr.length; idx++) {
              const selectOption = document.createElement('option')
              selectOption.value = strArr[idx]
              selectOption.label = strArr[idx]
              select.options.add(selectOption)
            }

            select.id = `${this.tpleditorCUID}_${index + 1}`

            selectInput.style = `width:${
              this.SelectUnitWidth * maxLengthStr - 18
            }px;position:absolute;left:0px;top:2px;padding:0;height: 15px;border: none;outline: none;color: #409eff;text-align:center;`

            select.style = `width:${
              this.SelectUnitWidth * maxLengthStr
            }px;border:none;border-bottom:1px solid #409eff;outline: none;color: #409eff;`

            spanForSelect.style = `position:relative;width:${
              this.SelectUnitWidth * maxLengthStr
            }px;`

            spanForSelect.appendChild(select)
            spanForSelect.appendChild(selectInput)
            TemplateItem.Html = spanForSelect.outerHTML
          } else {
            // 文本框
            ctrlType = 1

            input.id = `${this.tpleditorCUID}_${index + 1}`
            input.style = `width:${
              this.InputUnitWidth * TemplateItem.Mark.length
            }px;border:none;border-bottom:1px solid #409eff;outline: none;color: #409eff;text-align:center;`

            TemplateItem.Html = input.outerHTML
          }

          tpl = this.replaceStrByPos(
            tpl,
            TemplateItem.StartPosition - 1,
            TemplateItem.EndPosition + 1,
            ctrlType ? input.outerHTML : spanForSelect.outerHTML
          )

          this.TemplateItemList.push(TemplateItem)
        }

        div.innerHTML = tpl

        this.$refs[this.tpleditorCUID].$el.innerHTML = ''
        this.$refs[this.tpleditorCUID].$el.appendChild(div)

        // 设置文本输入和选择控件已输入的数据；选择控件添加change 事件监听
        for (let index = 0; index < this.TemplateItemList.length; index++) {
          const element = this.TemplateItemList[index]
          const tagEle = document.getElementById(element.ElId)

          if (tagEle instanceof HTMLInputElement) {
            if (this.InputValues[index]) {
              tagEle.setAttribute('value', this.InputValues[index])
              this.TemplateItemList[index].Html = tagEle.outerHTML
            }
          } else if (tagEle instanceof HTMLSelectElement) {
            if (this.InputValues[index]) {
              const splitArr = (element.Mark && element.Mark.split(';')) || []
              let m = -1
              for (let n = 0; n < splitArr.length; n++) {
                const ele = splitArr[n]
                if (ele === this.InputValues[index]) {
                  m = n
                  break
                }
              }
              tagEle.selectedIndex = m
              tagEle.nextElementSibling.value = this.InputValues[index]
              this.TemplateItemList[index].Html = tagEle.outerHTML
            } else {
              tagEle.selectedIndex = -1
              this.TemplateItemList[index].Html = tagEle.outerHTML
            }

            tagEle.onclick = function (e) {
              console.log('e', e)
            }

            tagEle.onchange = function (e) {
              this.nextElementSibling.value = e.target.value
              self.handleKeydown()
            }

            // 选择器Tab 按键切换聚焦事件处理
            tagEle.onfocus = function (e) {
              e.target.style.outline = '1px solid #409eff'
              element.Html = e.target.outerHTML
            }

            tagEle.onblur = function (e) {
              e.target.style.outline = 'none'
              element.Html = e.target.outerHTML
            }
          }
        }
      } else {
        div.innerHTML = tpl
        this.$refs[this.tpleditorCUID].$el.innerHTML = ''
        this.$refs[this.tpleditorCUID].$el.appendChild(div)
      }

      console.log('this.TemplateItemList', this.TemplateItemList)
    },
    sibling (elm) {
      var a = []
      var p = elm.parentNode.children
      for (var i = 0, pl = p.length; i < pl; i++) {
        if (p[i] !== elm) a.push(p[i])
      }
      return a
    },
    replaceStrByPos (sourceStr, index, lastIndex, replaceStr) {
      const newStr = `${sourceStr.substring(
        0,
        index
      )}${replaceStr}${sourceStr.substring(lastIndex)}`
      return newStr
    },
    // 节流
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
    // 防抖
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
    getMaxLenFromStrArr (strArr) {
      if (strArr && Array.isArray(strArr)) {
        strArr.sort((pre, next) => next.length - pre.length)
        if (strArr.length > 0) {
          return strArr[0].length
        }
      }
      return 0
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

select:focus {
  outline: 1px solid #afecab;
}

.ml-tpleditor >>> .select:focus {
  outline: 1px solid #afecab;
}
</style>
