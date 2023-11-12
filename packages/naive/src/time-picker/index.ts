import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { NTimePicker } from 'naive-ui'

import { transformComponent } from '../__builtins__/shared'
import { PreviewText } from '../preview-text'

export type TimePickerProps = typeof NTimePicker

const TransformNTimePicker = transformComponent<TimePickerProps>(
  NTimePicker,
  {
    change: 'update:modelValue',
  },
)

export const TimePicker = connect(
  TransformNTimePicker,
  mapProps({ readOnly: 'readonly', value: 'modelValue' }),
  mapReadPretty(PreviewText.TimePicker),
)

export default TimePicker
