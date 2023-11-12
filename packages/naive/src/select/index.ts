import { connect, h, mapProps, mapReadPretty } from '@formily/vue'
import { defineComponent } from 'vue'
import { NSelect } from 'naive-ui'

import { PreviewText } from '../preview-text'
import { transformComponent } from '../__builtins__'

export type SelectProps = typeof NSelect

const TransformNSelect = transformComponent<SelectProps>(NSelect, {
  change: 'update:modelValue',
})

const InnerSelect = connect(
  TransformNSelect,
  mapProps({ value: 'modelValue', readOnly: 'readonly' }),
  mapReadPretty(PreviewText.Select),
)

const SelectOption = defineComponent({
  name: 'FSelect',
  props: [],
  setup(customProps, { attrs, slots }) {
    return () => {
      return h(
        InnerSelect,
        {
          ...attrs,
        },
        null,
      )
    }
  },
})

export const Select = connect(
  SelectOption,
  mapProps({ dataSource: 'options', loading: true }),
  mapReadPretty(PreviewText.Select),
)

export default Select
