import { computed, defineComponent, provide } from 'vue'
import { Form as AntdForm, FormGrid as AntdFormGrid, getFormLayoutProps } from '@formily/antdv'

import { generateSchema } from './utils/schema-generate'
import { QueryItem, QueryItemSelect } from './components'

import type { IColumnCondition } from './utils/convert-result'
import type { IQueryFieldItem } from './utils/schema-generate'
import type { IFormatter } from './type'
import type { Component, DefineComponent, ExtractPropTypes, PropType, SlotsType, VNode } from 'vue'
import type { Form as FormType } from '@formily/core'
import type { ISchema } from '@formily/vue'

// vue props 定义
export function getQueryOperatorFilterProps() {
  return {
    ...getFormLayoutProps(),
    /* 继承 Form 的props */
    form: {
      type: Object as PropType<FormType>,
    },
    component: {
      type: [String, Object] as PropType<Component | string>,
    },
    previewTextPlaceholder: {
      type: [String, Function] as PropType<string | (() => VNode)>,
    },
    /* 自定义 */
    definitions: {
      type: Object as PropType<Record<string, ISchema>>,
    },
    definitionFields: {
      type: Array as PropType<IQueryFieldItem[]>, // local
    },
    conditions: {
      type: Array as PropType<IColumnCondition[]>, // remote
    },
    formatter: {
      type: Function as PropType<IFormatter>, // 表达式格式化函数
    },
  }
}

// 转化为 ts 类型
export type IQueryOperatorFilterProps = Partial<ExtractPropTypes<ReturnType<typeof getQueryOperatorFilterProps>>>

/**
 * @title 通用 Form 组件，通过栅格实现展开收起的功能。
 * @method {❌ FormGrid} => 该组件使用了 observer，且 shouldVisible 判断显隐逻辑复杂；Form的参数无法透传到FormItem上。
 * @method {✅ 使用 antd 栅格布局} => 按钮组自动撑满，逻辑简单，且Form的参数可以透传到FormItem上。
 * @todo 该版本需求是收起时只显示一行，如果想要收起时显示多行则需迭代新功能。
 * @idea 交互形式参考: https://procomponents.ant.design/components/query-filter
 */
export const QueryOperatorFilter: DefineComponent = defineComponent({
  name: 'QueryOperatorFilter',
  props: getQueryOperatorFilterProps(),
  slots: Object as SlotsType<{
    default: any
    button: any
  }>,
  setup(props, { attrs, slots, emit, expose }) {
    // 提供格式化函数给 字段名 和 操作符 组件
    provide('formatter', props.formatter)

    /**
     * @title 生成 ISchema 传递给 SchemaField 组件
     * @param definitions https://react.formilyjs.org/zh-CN/api/shared/schema#详细说明
     * @param schemas 业务定义字段配置
     */
    const schema = computed(() => {
      // 仅筛选出服务端存储的字段并渲染，其他字段会被过滤掉
      const remoteFields = props.conditions?.map((cond) => {
        const { field } = cond

        const currentField = props.definitionFields?.find(item => item.field === field)
        // 本地也没找到对应的field，表示是非法字段
        if (!currentField) { return { field: '', operatorOptions: [] } }

        return { field, operatorOptions: currentField.operatorOptions }
      })?.filter(cond => !!cond.field)

      return generateSchema(props.definitions, remoteFields)
    })

    return () => {
      const {
        definitions,
        definitionFields,
        conditions,
        formatter,

        ...restProps
      } = props

      return (
        <AntdForm
          {...restProps}
          {...attrs}
        >
          {/* NOTICE: SchemaField 外会包裹一层 <div style="display: contents;" />；但是 contents 不影响栅格布局 */}
          {/* 模板语法插槽：<slot :components="components" :scope="scope"></slot> */}
          {slots.default?.({
            schema: schema.value,
            components: {
              QueryGrid: AntdFormGrid,
              QueryItem,
              QueryItemSelect,
            },
            scope: {},
          })}

          {/* 按钮组 */}
          {slots.button?.()}
        </AntdForm>
      )
    }
  },
})
