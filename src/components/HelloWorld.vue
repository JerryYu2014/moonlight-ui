<template>
  <ml-scrollbar style="width:100%;height:98vh;overflow:auto;">
    <div style="width: 100%;height: 150vh;text-align: center;">
      <!-- <h1>{{ msg }}</h1> -->

      <!-- <ml-button size="large" type="error">NICE</ml-button>
      <ml-radio :options="radioOptions">NICE</ml-radio>
      <ml-switch />
      <ml-checkbox />-->

      <div id="svg-compile"></div>
      <!-- :content="DiagnosticTemplate" -->
      <div style="width:95%; height:40vh;border:1px solid #000;text-align:left;padding:20px;">
        <ml-tpleditor v-model="DiagnosticTemplate" style="width: 90wh;" />
        <ml-button size="large" type="error" @click="handleBtnClick">修改数据</ml-button>
        <div><strong>提取的数据:</strong>{{DiagnosticTemplate}}</div>
      </div>

      <!-- <ml-tpleditor
        v-model="DiagnosticTemplate"
        style="width: 100wh;margin-top:20px;"
      /> -->
    </div>
  </ml-scrollbar>
</template>

<script>
import { makePy } from 'moonlight-utils'
import {
  // bubbleSort,
  svgCompile
} from 'moonlight-algorithm'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '中：' + makePy('中', false),
      DiagnosticTemplate:
        '2D+3D+MPR：双侧茎突走行未见异常，左侧长度为[_____]cm，右侧长度为[_____]cm。茎突骨质未见异常。[abc;def;ghk; ]未见异常改变。',
      //   DiagnosticTemplate: null,
      radioOptions: [
        { label: '啊123', value: 123 },
        { label: '啊456', value: 456 }
      ]
    }
  },
  watch: {
    DiagnosticTemplate () {
      console.log('DiagnosticTemplate', this.DiagnosticTemplate)
    }
  },
  mounted () {
    // console.log(bubbleSort([2, 3, 9]))

    // 调用svgCompile编译器
    const code = 'Paper 0 Pen 100 Line 0 50 100 50'
    // const code = 'Paper 0 Pen 100 Line 0 50 100 100'
    const svg = svgCompile(code)
    // console.log(svg)
    document.getElementById('svg-compile').innerHTML = svg
  },
  methods: {
    handleTpleditorChange (content) {
      console.log('content/content', content)
      //   this.DiagnosticTemplate = content
    },
    handleBtnClick () {
      this.DiagnosticTemplate +=
        '2D+3D+MPR：双侧茎突走行未见异常，左侧长度为[ABC;123;+++]cm，右侧长度为[_____]cm。茎突骨质未见异常。[123;456;789; ]未见异常改变。'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
