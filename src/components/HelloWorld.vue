<template>
  <ml-scrollbar style="width:100%;height:98vh;overflow:auto;">
    <div style="width: 100%;height: 150vh;text-align: center;">
      <h1>{{ msg }}</h1>

      <ml-button size="large" type="error">NICE</ml-button>
      <ml-radio :options="radioOptions">NICE</ml-radio>
      <ml-switch />
      <ml-checkbox />

      <div id="svg-compile"></div>
    </div>
  </ml-scrollbar>
</template>

<script>
import { makePy } from 'moonlight-utils'
import { bubbleSort, svgCompile } from 'moonlight-algorithm'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '中：' + makePy('中', false),
      radioOptions: [
        { label: '啊123', value: 123 },
        { label: '啊456', value: 456 }
      ]
    }
  },
  mounted () {
    console.log(bubbleSort([2, 3, 9]))

    // 调用svgCompile编译器
    // const code = 'Paper 0 Pen 100 Line 0 50 100 50';
    const code = 'Paper 0 Pen 100 Line 0 50 100 100'
    const svg = svgCompile(code)
    console.log(svg)
    document.getElementById('svg-compile').innerHTML = svg
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
