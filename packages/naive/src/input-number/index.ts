import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { NInputNumber } from 'naive-ui'

import { transformComponent } from '../__builtins__'
import { PreviewText } from '../preview-text'

export type InputNumberProps = typeof NInputNumber

const TransformNInputNumber = transformComponent<InputNumberProps>(
  NInputNumber,
  {
    change: 'update:modelValue',
  },
)

export const InputNumber = connect(
  TransformNInputNumber,
  mapProps(
    {
      value: 'modelValue',
      readOnly: 'readonly',
    },
    (props) => {
      let controlsPosition = 'right'
      if (props.controlsPosition) {
        controlsPosition = props.controlsPosition
      }
      return {
        controlsPosition,
        modelValue: props.modelValue,
      }
    },
  ),
  mapReadPretty(PreviewText.Input),
)

export default InputNumber
