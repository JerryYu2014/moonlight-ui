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
      // 个模板编辑点的数据模型
      TemplateItemList: [],
      KeyupHandler: null,
      // 缓存已输入的数据
      InputValues: [],
      // 输入框单位宽度
      InputUnitWidth: 10,
      // 选择框单位宽度
      SelectUnitWidth: 20
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
    // 对可编辑区域键盘按键弹起事件防抖动处理
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
      // console.log('paste', paste)

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
    handleKeyup (env) {
      this.$emit(
        'extract',
        this.extractContentWithData(),
        this.restoreToTemplate(this.$refs[this.tpleditorCUID].$el.innerHTML)
      )
      //   console.log('getSelection()', getSelection())
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

        if (document.getElementById(element.ElId) instanceof HTMLInputElement) {
          element.Values = document.getElementById(element.ElId).value
        } else if (
          document.getElementById(element.ElId) instanceof HTMLSelectElement
        ) {
          element.Values = document.getElementById(
            element.ElId
          ).nextElementSibling.value
        }

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

      // 可编辑区域为空时，清空已输入数据的缓存
      if (!source) {
        this.InputValues = []
      }

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

      // console.log('source', source)

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
      // console.log('retTpl', retTpl)
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
      // console.log('retTplWithValue', retTplWithValue)
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
      //   console.log('retText', retText)
      return retText
    },
    compileTemplateToUI (tpl) {
      const self = this
      // 匹配 [___]或[abc;def;] 字符串
      // const regExp1 = new RegExp(/\[.*?\]/gi)
      // 匹配 [___]中[abc;def;] 中 [] 内的字符串（___ 或 abc;def;）
      const regExp2 = new RegExp(/(?<=\[).*?(?=\])/g)

      if (regExp2.test(tpl)) {
        // const matchRegExp1 = text.match(regExp1)
        // console.log('matchRegExp1', matchRegExp1)

        const matchRegExp2 = tpl.match(regExp2)
        // console.log('matchRegExp2', matchRegExp2)

        const p = document.createElement('p')

        // console.log('0000', this.$refs[this.tpleditorCUID].$el.innerHTML)
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
        // console.log('1111', this.$refs[this.tpleditorCUID].$el.innerHTML)

        this.TemplateItemList = []

        for (let index = 0; index < matchRegExp2.length; index++) {
          const input = document.createElement('input')
          // input.className = 'ml-tpleditor-input'
          input.type = 'text'
          // input.style =
          //   'width:50px;border:none;border-bottom:1px solid blue;outline: none;color: blue;text-align:center;'

          const spanForSelect = document.createElement('span')
          // spanForSelect.style = 'position:relative;width:80px;'

          const select = document.createElement('select')
          //   select.tabIndex = index
          // select.style =
          //   'width:80px;border:none;border-bottom:1px solid blue;outline: none;color: blue;'
          // 'width:80px;border:none;border-bottom:1px solid blue;outline: none;color: blue;'

          const selectInput = document.createElement('input')
          // selectInput.style =
          //   'width:calc(80px - 18px);position:absolute;left:0px;height: 18px;border: none;outline: none;color: blue;text-align:center;'
          // 'width:62px;position:absolute;left:0px;height: 18px;border: none;outline: none;color: blue;text-align:center;'
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
            // select.tabIndex = index

            const maxLengthStr = this.getMaxLenFromStrArr(strArr)

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
            // input.tabIndex = index

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

        // console.log('this.TemplateItemList', this.TemplateItemList)

        p.innerHTML = tpl

        this.$refs[this.tpleditorCUID].$el.innerHTML = ''
        this.$refs[this.tpleditorCUID].$el.appendChild(p)

        // 设置文本输入和选择控件已输入的数据；选择控件添加change 事件监听
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
              let m = -1
              for (let n = 0; n < splitArr.length; n++) {
                const ele = splitArr[n]
                if (ele === this.InputValues[index]) {
                  m = n
                  break
                }
              }
              // document.getElementById(element.ElId)[0].value = this.InputValues[index]
              document.getElementById(element.ElId).selectedIndex = m
              document.getElementById(
                element.ElId
              ).nextElementSibling.value = this.InputValues[index]
              this.TemplateItemList[index].Html = document.getElementById(
                element.ElId
              ).outerHTML
            } else {
              document.getElementById(element.ElId).selectedIndex = -1
              this.TemplateItemList[index].Html = document.getElementById(
                element.ElId
              ).outerHTML
            }

            document.getElementById(element.ElId).onclick = function (e) {
              console.log('e', e)
            }

            document.getElementById(element.ElId).onchange = function (e) {
              this.nextElementSibling.value = e.target.value
              self.handleKeyup()
            }

            // 选择器Tab 按键切换聚焦事件处理
            document.getElementById(element.ElId).onfocus = function (e) {
              //   e.target.nextElementSibling.focus()
              e.target.style.outline = '1px solid #409eff'
              //   console.log('e.target-1', e.target)
              element.Html = e.target.outerHTML
              //   if (document.all) {
              //     // IE浏览器
              //     document.getElementById(element.ElId).blur()
              //     document
              //       .getElementById(element.ElId)
              //       .nextElementSibling.focus()
              //   } else {
              //     // 其它浏览器
              //     const env1 = document.createEvent('HTMLEvents')
              //     env1.initEvent('blur', false, true)
              //     document.getElementById(element.ElId).dispatchEvent(env1)
              //     const env = document.createEvent('HTMLEvents')
              //     env.initEvent('focus', false, true)
              //     document
              //       .getElementById(element.ElId)
              //       .nextElementSibling.dispatchEvent(env)
              //   }
            }

            document.getElementById(element.ElId).onblur = function (e) {
              e.target.style.outline = 'none'
              //   console.log('e.target-2', e.target)
              element.Html = e.target.outerHTML
            }

            document.getElementById(
              element.ElId
            ).nextElementSibling.onkeydown = function (env) {
              //   console.log('env', env)
              //   document.getElementById(element.ElId).click()
              //   if (document.all) {
              //     // IE浏览器
              //     document.getElementById(element.ElId).click()
              //   } else {
              //     // 其它浏览器
              //     var e = document.createEvent('MouseEvents')
              //     e.initEvent('click', false, true)
              //     // e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
              //     document.getElementById(element.ElId).dispatchEvent(e)
              //   }
            }

            // // 选择器-输入框聚焦事件处理
            // document.getElementById(
            //   element.ElId
            // ).nextElementSibling.onfocus = function () {
            //   if (document.all) {
            //     // IE浏览器
            //     document.getElementById(element.ElId).click()
            //   } else {
            //     // 其它浏览器
            //     var e = document.createEvent('MouseEvents')
            //     e.initEvent('click', false, true)
            //     env.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
            //     document.getElementById(element.ElId).dispatchEvent(e)
            //   }
            // }
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

select:focus {
  outline: 1px solid #afecab;
}

.ml-tpleditor >>> .select:focus {
  outline: 1px solid #afecab;
}
</style>
