<template>
  <ml-scrollbar style="width:100%;height:98vh;overflow:auto;">
    <div style="width: 100%;height: 150vh;text-align: center;">
      <!-- <h1>{{ msg }}</h1> -->

      <!-- <ml-button size="large" type="error">NICE</ml-button>
      <ml-radio :options="radioOptions">NICE</ml-radio>
      <ml-switch />
      <ml-checkbox />-->

      <div id="svg-compile"></div>
      <select>
        <option value="德国">德国</option>
        <option value="挪威">挪威</option>
        <option value="瑞士">瑞士</option>
      </select>
      <!-- :content="DiagnosticTemplate" -->
      <div style="width:95%; height:50vh;border:1px solid #000;text-align:left;padding:20px;overflow:auto;">

        <ml-tpleditor v-model="DiagnosticTemplate" style="width: 90wh;" @extract='handleExtract' />

        <ml-button size="large" type="error" @click="handleBtnClick">修改数据</ml-button>
        <div><strong>模板数据:</strong>{{DiagnosticTemplate}}</div>
        <div><strong>提取的数据:</strong>{{DiagnosticContent}}</div>
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
        '2D+3D+MPR：双侧茎突走行未见异常，左侧长度为[_________]cm，右侧长度为[_____]cm。茎突骨质未见异常。[abc;def;ghk; ]未见异常改变。',
      DiagnosticContent: '',
      DiagnosticNewTemplate: '',
      radioOptions: [
        { label: '啊123', value: 123 },
        { label: '啊456', value: 456 }
      ]
    }
  },
  watch: {
    DiagnosticTemplate () {
      // console.log('DiagnosticTemplate', this.DiagnosticTemplate)
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
    handleExtract (data, template) {
      // console.log('content/content', data)
      this.DiagnosticContent = data
      this.DiagnosticNewTemplate = template
    },
    handleBtnClick () {
      this.DiagnosticTemplate =
        this.DiagnosticNewTemplate +
        '2D+3D+MPR：双侧茎突走行未见异常，左侧长度为[ABC;123;+++]cm，右侧长度为[_____]cm。茎突骨质未见异常。[123;456;789; ]未见异常改变。'
      //   this.DiagnosticTemplate +=
      //     '2D+3D+MPR：双侧茎突走行未见异常，左侧长度为[ABC;123;+++]cm，右侧长度为[_____]cm。茎突骨质未见异常。[123;456;789; ]未见异常改变。'
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

/* select{
    border: none;
    border-bottom:1px solid blue ;
}

select:focus {
  outline: 1px solid #afecab;
} */
</style>
