import { defineComponent } from 'vue'

import type { DefineComponent } from 'vue'

export const OptionRender: DefineComponent = defineComponent({
  name: 'OptionRender',
  props: {
    value: { type: String },
    label: { type: String },
  },
  setup(_props, { attrs, expose, slots, emit }) {
    return () => {
      const { value, label } = _props
      console.log('[vscode-log] optionRender.tsx@Line 21: ', label)

      if (value === 'SELECT2_IDENTIFIER_NOMORE') {
        return label
      }
      else if (value === 'SELECT2_IDENTIFIER_PROGRESS') {
        return label
      }
      else {
        return <div>
          <h5>The slot's value: {value}</h5>
          <h5>The slot's label: {label}</h5>
        </div>
      }
    }
  },
})

export async function loadData(prefix: string, signal: AbortSignal, opts: { q: string; offset: number }) {
  const { q, offset } = opts
  const result = offset >= 20
    ? []
    : Array(10).fill(`${prefix}_${q || 'null'}_`).map((item, idx) => {
      return {
        value: `${item}${offset + idx}`,
        label: `${item}${offset + idx}`,
      }
    })

  return fetch('http://jsonplaceholder.typicode.com/users', {
    method: 'GET',
    signal,
  }).then(res => result)
  // console.log('[vscode-log] loadData: ', q)
  // return new Promise<any[]>((resolve, reject) => {
  //   setTimeout(() => {
  //     if (offset >= 20) {
  //       resolve([])
  //       return
  //     }
  //     resolve(Array(10).fill(`${prefix}_${q || 'null'}_`).map((item, idx) => {
  //       return {
  //         value: `${item}${offset + idx}`,
  //         label: `${item}${offset + idx}`,
  //       }
  //     }))
  //   }, 1000)
  // })
}
