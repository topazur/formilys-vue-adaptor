<script lang="ts">
// @ts-expect-error 类型声明
import { useControllableValue } from '@odinlin/formily-antdv'

export default {
  components: {},
  props: {
    modelValue: {
      type: String,
    },
  },
  emits: ['update:modelValue', 'change', 'input'],
  setup(props, { emit }) {
    const [stateRef, updateStateRef] = useControllableValue(
      props,
      (...args) => {
        const [e] = args

        const value = (e.target as HTMLInputElement).value
        emit('update:modelValue', value)
        emit('input', e)
        return value
      },
      {
        defaultValue: '',
        defaultValuePropName: 'defaultModelValue',
        valuePropName: 'modelValue',
      })

    return { stateRef, updateStateRef }
  },
}
</script>

<template>
  <div>
    <input style="width: 300px; border: 1px solid #ccc;" :value="stateRef" @input="updateStateRef">
  </div>
</template>
