<script lang="ts">
import { computed, ref, watch } from 'vue'

import ControllableComponent from './ControllableComponent.vue'

export default {
  components: { ControllableComponent },
  setup(props) {
    const state = ref('')

    const onChange = (value) => {
      state.value = value
    }

    return { state, onChange }
  },
}
</script>

<template>
  <h3>非受控组件 ==&gt; 如果 props 中没有 value，则组件内部自己管理 state</h3>
  <ControllableComponent />

  <br>

  <h3>受控组件 ==&gt; 如果 props 有 value 字段，则由父级接管控制 state</h3>
  <div>state:{{ state }} <span @click="state = ''">清空</span> </div>
  <ControllableComponent v-model="state" />

  <br>

  <h3>无 value，有 onChange 的组件 ==&gt; 只要 props 中有 onChange 字段，则在 state 变化时，就会触发 onChange 函数</h3>
  <div>state:{{ state }}</div>
  <ControllableComponent @input="(e) => state = e.target.value" />
</template>
