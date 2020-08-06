<template>
  <ml-scrollbar style="width:100%;height:98vh;overflow:auto;">
    <div class="scrollbar">
      <h1>{{ msg }}</h1>

      <ml-button size="large" type="error">NICE</ml-button>
      <ml-radio>NICE</ml-radio>
    </div>
  </ml-scrollbar>
</template>

<script>
import { makePy } from 'moonlight-utils'
import {} from 'moonlight-algorithm'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '中：' + makePy('中', false)
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

.scrollbar {
  width: 100%;
  height: 150vh;
  /* margin: 0 auto; */
}
</style>
