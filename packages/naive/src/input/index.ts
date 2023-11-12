import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { NInput } from 'naive-ui'

import { composeExport, transformComponent } from '../__builtins__'
import { PreviewText } from '../preview-text'

export type InputProps = typeof NInput

const TransformNInput = transformComponent<InputProps>(NInput, {
  change: 'update:modelValue',
})

const InnerInput = connect(
  TransformNInput,
  mapProps({
    value: 'modelValue',
    readOnly: 'readonly',
  }),
  mapReadPretty(PreviewText.Input),
)

const TextArea = connect(
  InnerInput,
  mapProps((props) => {
    return {
      ...props,
      type: 'textarea',
    }
  }),
  mapReadPretty(PreviewText.Input),
)

export const Input = composeExport(InnerInput, {
  TextArea,
})

export default Input
