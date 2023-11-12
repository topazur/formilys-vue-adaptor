import { defineComponent, h } from 'vue'
import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { NCheckbox, NCheckboxGroup } from 'naive-ui'

import {
  composeExport,
  resolveComponent,
  transformComponent,
} from '../__builtins__/shared'
import { PreviewText } from '../preview-text'

import type { SlotTypes } from '../__builtins__/shared'
import type { Component, PropType } from 'vue'

type NCheckboxProps = Omit<typeof NCheckbox, 'value'> & {
  value: NCheckboxProps['label']
}

export interface CheckboxProps extends NCheckboxProps {
  option: Omit<typeof NCheckbox, 'value'> & {
    value: NCheckboxProps['label']
    label: SlotTypes
  }
}

const CheckboxOption = defineComponent({
  name: 'FCheckbox',
  inheritAttrs: false,
  props: {
    option: {
      type: Object,
      default: null,
    },
  },
  setup(curtomProps, { attrs, slots }) {
    return () => {
      const props = attrs as unknown as CheckboxProps
      const option = curtomProps?.option
      if (option) {
        const children = {
          default: () => [
            resolveComponent(slots.default ?? option.label, { option }),
          ],
        }
        const newProps = {} as Partial<NCheckboxProps>
        Object.assign(newProps, option)
        newProps.label = option.value
        delete newProps.value

        return h(
          // attrs.optionType === 'button' ? NCheckboxButton : NCheckbox,
          NCheckbox,
          {
            ...newProps,
          },
          children,
        )
      }

      return h(
        NCheckbox,
        {
          ...props,
        },
        slots,
      )
    }
  },
})

export type CheckboxGroupProps = typeof NCheckboxGroup & {
  value: any[]
  options?: Array<CheckboxProps | string>
  // optionType: 'default' | 'button'
}

const TransformNCheckboxGroup = transformComponent(NCheckboxGroup, {
  change: 'update:modelValue',
})

const CheckboxGroupOption: Component = defineComponent({
  name: 'FCheckboxGroup',
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    // optionType: {
    //   type: String as PropType<CheckboxGroupProps['optionType']>,
    //   default: 'default',
    // },
  },
  setup(customProps, { attrs, slots }) {
    return (): any => {
      const options = customProps.options || []
      const children
        = options.length !== 0
          ? {
              default: () =>
                options.map((option) => {
                  if (typeof option === 'string') {
                    return h(
                      CheckboxOption,
                      {
                        option: {
                          label: option,
                          value: option,
                        },
                        // optionType: customProps.optionType,
                      },
                      slots?.option
                        ? { default: () => slots.option({ option }) }
                        : {},
                    )
                  }
                  else {
                    return h(
                      CheckboxOption,
                      {
                        option,
                        // optionType: customProps.optionType,
                      },
                      slots?.option
                        ? { default: () => slots.option({ option }) }
                        : {},
                    )
                  }
                }),
            }
          : slots
      return h(
        TransformNCheckboxGroup,
        {
          ...attrs,
        },
        children,
      )
    }
  },
})

const CheckboxGroup = connect(
  CheckboxGroupOption,
  mapProps({ dataSource: 'options', value: 'modelValue' }),
  mapReadPretty(PreviewText.Select, {
    multiple: true,
  }),
)

export const Checkbox = composeExport(connect(CheckboxOption), {
  Group: CheckboxGroup,
})

export default Checkbox
