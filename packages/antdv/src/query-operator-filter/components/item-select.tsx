import { computed, defineComponent, inject, shallowRef } from 'vue'
import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { Select as AntdSelect } from 'ant-design-vue'
import { selectProps as initSelectProps } from 'ant-design-vue/lib/select'
import { initDefaultProps } from 'ant-design-vue/lib/_util/props-util'
import { PreviewText } from '@formily/antdv'
import { LoadingOutlined } from '@ant-design/icons-vue'

import type { IFormatter } from '../type'
import type { DefineComponent, ExtractPropTypes, PropType, SlotsType } from 'vue'
import type { DefaultOptionType, LabeledValue, SelectValue } from 'ant-design-vue/lib/select'

const InternalQueryItemSelect: DefineComponent = defineComponent({
  name: 'QueryItemSelect',
  inheritAttrs: false,
  props: initDefaultProps({
    ...initSelectProps(),
    options: {
      type: Array as PropType<string[]>,
    },
    value: {
      type: String,
    },
    onChange: {
      type: Function as PropType<(value: string) => void>,
    },
    // 是否隐藏已选择选项
    hideSelectedOption: {
      type: Boolean,
      default: true,
    },
  },
  {
    listHeight: 200,
    listItemHeight: 24,
    disabled: false,
    placeholder: '',
    allowClear: false,
    mode: undefined,
    showSearch: false,
    virtual: false,
    labelInValue: true,
    hideSelectedOption: true,
  }),
  slots: Object as SlotsType<{
    notFoundContent: any
    suffixIcon: any
    itemIcon: any
    removeIcon: any
    clearIcon: any
    dropdownRender: any
    option: any
    placeholder: any
    tagRender: any
    maxTagPlaceholder: any
    optionLabel: any
    default: any
  }>,
  setup(props, { attrs, slots, listeners }: any) {
    const formatter: IFormatter = inject<any>('formatter', (type: string, key: string, idx: number) => key)

    /**
     * @title 劫持 value 的 state，方便回显
     */
    const innerValue = shallowRef<SelectValue | undefined | null>(props.value
      ? {
          value: props.value,
          label: formatter('operator', props.value, -1),
        }
      : null)

    /**
     * @title 先过滤已选中的选项(通过 hideSelectedOption 控制)，再转化 options 的数据结构
     */
    const innerOptions = computed<DefaultOptionType[] | undefined>(() => {
      return props.options
        ?.filter((item) => {
          // 隐藏已选中的选项
          if (props.hideSelectedOption && (item === props.value)) {
            return false
          }
          return true
        })
        ?.map((item) => {
          return {
            value: item,
            label: item,
          }
        })
    })

    /**
     * @title 劫持 onChange 方法
     */
    const innerChangeHandle = (value: LabeledValue, option: LabeledValue[]) => {
      const { value: valueStr } = value

      // 外部存储字符串，只需要value即可
      props.onChange?.(valueStr as string)
      // 内部存储整个对象，用于回显
      innerValue.value = {
        ...value,
        label: formatter('operator', valueStr as string, -1),
      }
    }

    return () => {
      const {
        hideSelectedOption,

        listHeight = 256, // 设置弹窗滚动高度
        disabled = false, // 禁用
        placeholder = '', // 选择框默认文本
        allowClear = false, // 自定义清除按钮
        mode = undefined, // 单选
        showSearch = false, // 不显示搜索按钮

        virtual,
        labelInValue,
        value,
        options,
        onChange,

        ...restProps
      } = props
      return (
        <AntdSelect
          {...restProps}
          {...attrs}
          style={{ flex: 'none', width: '100px' }}
          listHeight={listHeight}
          disabled={disabled}
          placeholder={placeholder}
          allowClear={allowClear}
          mode={mode}
          showSearch={showSearch}
          virtual={false}
          labelInValue={true}
          value={innerValue}
          options={innerOptions}
          onChange={innerChangeHandle}
          v-slots={{
            ...slots,
            option: ({ value }) => {
              return formatter('operator', value as string, -1)
            },
          }}
        />
      )
    }
  },
})

/**
 * @title 主要用于对第三方组件库的无侵入接入 Formily
 * @docs https://vue.formilyjs.org/zh-CN/api/shared/connect
 */
export const QueryItemSelect: DefineComponent = connect(
  InternalQueryItemSelect,
  mapProps(
    {
      // 手动映射dataSource到自定义组件中
      dataSource: 'options',
      loading: true,
    },
    (props, field) => {
      const { options, suffixIcon } = props

      // NOTICE: 当可选用的操作符小于等于1时，隐藏该选择器的UI，但是保留数据
      if (options && options.length <= 1) {
        field.hidden = true
      }

      // 覆盖 loading和validating 时的 suffix
      const suffixIconRender = field?.['loading'] || field?.['validating']
        ? (
          <LoadingOutlined />
          )
        : (
            suffixIcon
          )

      return Object.assign({}, props, { suffixIcon: suffixIconRender })
    },
  ),
  mapReadPretty(PreviewText.Select),
)

export default QueryItemSelect
