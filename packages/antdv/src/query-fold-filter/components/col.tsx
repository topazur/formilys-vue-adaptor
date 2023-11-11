import { computed, defineComponent, inject } from 'vue'
import { useField } from '@formily/vue'
import { Col as AntdCol } from 'ant-design-vue'

import { COMPONENT_FORM_ITEM_COL_DECORATOR } from '../utils/schema-generate'

import type { DefineComponent, ExtractPropTypes, PropType, ShallowRef, SlotsType } from 'vue'
import type { ColProps } from 'ant-design-vue'

// vue props 定义
export function getFormItemColDecoratorProps() {
  return {
    getColProps: {
      type: Function as PropType<(opts: { collapsed: boolean; maxColumns: number }) => ColProps>,
      default: undefined,
    },
  }
}

// 转化为 ts 类型
export type IFormItemColDecoratorProps = Partial<ExtractPropTypes<ReturnType<typeof getFormItemColDecoratorProps>>>

/**
 * @title 容器组件，仅包含 Col，不包含 FormItem 组件(不能透传props)。
 * @desc For 'x-decorator'，根据折叠情况判断显隐
 */
const FormItemColDecorator: DefineComponent = defineComponent({
  name: COMPONENT_FORM_ITEM_COL_DECORATOR,
  props: getFormItemColDecoratorProps(),
  slots: Object as SlotsType<{
    default: any
  }>,
  setup(props, { attrs, slots, emit, expose }) {
    const filed = useField() // 当前字段
    const collapsedRef = inject<ShallowRef<boolean>>('collapsed')
    const maxColumns = inject<number>('maxColumns', 3)

    /**
     * @title 根据 maxColumns 计算 Col 组件的属性
     */
    const colProps = computed(() => {
      if (props.getColProps) { return props.getColProps({ collapsed: collapsedRef.value, maxColumns }) }
      return {
        order: 0,
        pull: 0,
        push: 0,
        offset: 0,
        span: 24 / maxColumns,
      }
    })

    /**
     * @title 计算折叠后隐藏的 Col 组件，给予 `display:none` 的样式
     */
    const style = computed(() => {
      const idx = filed.value?.data?.idx as number

      // 当收缩成一行时，仅显示 maxColumns-1 个 FormItem，剩余一个由 ButtonGroup 占据
      if (collapsedRef.value && idx > maxColumns - 1) { return { display: 'none' } }
      return {}
    })

    return () => {
      return (
        <AntdCol {...colProps.value} style={style.value}>
          {slots.default?.()}
        </AntdCol>
      )
    }
  },
})

export default FormItemColDecorator
