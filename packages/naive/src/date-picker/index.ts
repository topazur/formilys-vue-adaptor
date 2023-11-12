import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { NDatePicker } from 'naive-ui'

import { transformComponent } from '../__builtins__/shared'
import { PreviewText } from '../preview-text'

export type DatePickerProps = typeof NDatePicker

const TransformNDatePicker = transformComponent<DatePickerProps>(
  NDatePicker,
  {
    change: 'update:modelValue',
  },
)

function getDefaultFormat(props: DatePickerProps, formatType = 'format') {
  const type = props.type

  if (type === 'week' && formatType === 'format') {
    return '[Week] ww'
  }
  else if (type === 'month') {
    return 'YYYY-MM'
  }
  else if (type === 'year') {
    return 'YYYY'
  }
  else if (type === 'datetime' || type === 'datetimerange') {
    return 'YYYY-MM-DD HH:mm:ss'
  }

  return 'YYYY-MM-DD'
}

export const DatePicker = connect(
  TransformNDatePicker,
  mapProps(
    {
      value: 'modelValue',
      readOnly: 'readonly',
    },
    (props: any) => {
      return {
        ...props,
        format: props.format || getDefaultFormat(props),
        valueFormat:
          props.valueFormat || getDefaultFormat(props, 'valueFormat'),
      }
    },
  ),
  mapReadPretty(PreviewText.DatePicker),
)

export default DatePicker
