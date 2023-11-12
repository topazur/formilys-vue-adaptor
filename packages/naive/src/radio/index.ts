import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { defineComponent, h } from 'vue'
import { NRadio, NRadioButton, NRadioGroup } from 'naive-ui'

import {
  composeExport,
  resolveComponent,
  transformComponent,
} from '../__builtins__/shared'
import { PreviewText } from '../preview-text'

import type { PropType } from 'vue'
import type { SlotTypes } from '../__builtins__/shared'

export type NRadioProps = typeof NRadio
export type RadioGroupProps = typeof NRadioGroup & {
  value: any
  options?: (
    | (Omit<NRadioProps, 'value'> & {
      value: NRadioProps['label']
      label: SlotTypes
    })
    | string
  )[]
  optionType: 'defalt' | 'button'
}

const TransformNRadioGroup = transformComponent(NRadioGroup, {
  change: 'input',
})

const RadioGroupOption = defineComponent({
  name: 'FRadioGroup',
  props: {
    options: {
      type: Array as PropType<RadioGroupProps['options']>,
      default: () => [],
    },
    optionType: {
      type: String as PropType<RadioGroupProps['optionType']>,
      default: 'default',
    },
  },
  setup(customProps, { attrs, slots }) {
    return () => {
      const options = customProps.options || []
      const OptionType
        = customProps.optionType === 'button' ? NRadioButton : NRadio
      const children
        = options.length !== 0
          ? {
              default: () =>
                options.map((option) => {
                  if (typeof option === 'string') {
                    return h(
                      OptionType,
                      { label: option },
                      {
                        default: () => [
                          resolveComponent(slots?.option ?? option, { option }),
                        ],
                      },
                    )
                  }
                  else {
                    return h(
                      OptionType,
                      {
                        ...option,
                        value: undefined,
                        label: option.value,
                      },
                      {
                        default: () => [
                          resolveComponent(slots?.option ?? option.label, {
                            option,
                          }),
                        ],
                      },
                    )
                  }
                }),
            }
          : slots
      return h(
        TransformNRadioGroup,
        {
          ...attrs,
        },
        children,
      )
    }
  },
})

const RadioGroup = connect(
  RadioGroupOption,
  mapProps({ dataSource: 'options', value: 'modelValue' }),
  mapReadPretty(PreviewText.Select),
)
export const Radio = composeExport(NRadio, {
  Group: RadioGroup,
})

export default Radio
