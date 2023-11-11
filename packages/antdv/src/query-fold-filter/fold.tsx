import { computed, defineComponent, provide, shallowRef } from 'vue'
import { Button as AntdButton, Col as AntdCol, Row as AntdRow, Space as AntdSpace } from 'ant-design-vue'
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { Form as AntdForm, FormItem as AntdFormItem, getFormLayoutProps } from '@formily/antdv'

import { generateSchema } from './utils/schema-generate'
import FormItemColDecorator from './components/col'

import type { Component, DefineComponent, ExtractPropTypes, PropType, SlotsType, VNode } from 'vue'
import type { Form as FormType } from '@formily/core'
import type { ISchema } from '@formily/vue'
import type { RowProps } from 'ant-design-vue'
import type { FormItemProps } from '@formily/antdv'

// vue props 定义
export function getQueryFoldFormProps() {
  return {
    ...getFormLayoutProps(),
    /* 覆盖默认值 */
    layout: {
      type: [String] as PropType<'inline' | 'horizontal' | 'vertical'>,
      default: 'vertical',
    },
    colon: {
      default: false,
    },
    feedbackLayout: {
      type: String,
      default: 'terse',
    },
    size: {
      default: 'default',
    },
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
    schemas: {
      type: Array as PropType<ISchema[]>,
    },
    defaultCollapsed: {
      type: Boolean,
      default: true,
    },
    maxColumns: {
      type: Number,
      default: 3,
    },
    rowProps: {
      type: Object as PropType<RowProps>,
    },
    colButtonProps: {
      type: Object as PropType<FormItemProps>,
    },
    buttonFold: {
      type: Array as PropType<Array<string>> as PropType<[string, string]>,
      default: () => ['展开', '收起'],
    },
  }
}

// 转化为 ts 类型
export type IQueryFoldFormProps = Partial<ExtractPropTypes<ReturnType<typeof getQueryFoldFormProps>>>

/**
 * @title 通用 Form 组件，通过栅格实现展开收起的功能。
 * @method {❌ FormGrid} => 该组件使用了 observer，且 shouldVisible 判断显隐逻辑复杂；Form的参数无法透传到FormItem上。
 * @method {✅ 使用 antd 栅格布局} => 按钮组自动撑满，逻辑简单，且Form的参数可以透传到FormItem上。
 * @todo 该版本需求是收起时只显示一行，如果想要收起时显示多行则需迭代新功能。
 * @idea 交互形式参考: https://procomponents.ant.design/components/query-filter
 */
export const QueryFoldForm: DefineComponent = defineComponent({
  name: 'QueryFoldForm',
  props: getQueryFoldFormProps(),
  slots: Object as SlotsType<{
    default: any
    button: any
  }>,
  setup(props, { attrs, slots, emit, expose }) {
    // 折叠状态
    const collapsedRef = shallowRef<boolean>(props.defaultCollapsed)

    // 提供折叠状态给 AntdCol 判断显隐
    provide('collapsed', collapsedRef)
    provide('maxColumns', props.maxColumns)

    /**
     * @title 生成 ISchema 传递给 SchemaField 组件
     * @param definitions https://react.formilyjs.org/zh-CN/api/shared/schema#详细说明
     * @param schemas 业务定义字段配置
     */
    const schema = computed(() => {
      return generateSchema(props.definitions, props.schemas)
    })

    return () => {
      const {
        definitions,
        schemas,
        defaultCollapsed,
        maxColumns,
        rowProps,
        colButtonProps,
        buttonFold = ['展开', '收起'],

        ...restProps
      } = props

      return (
        <AntdForm
          {...restProps}
          {...attrs}
        >
          <AntdRow
            wrap={true}
            gutter={[20, 0]}
            justify="start"
            align="bottom"
            // NOTICE: 可覆写自定义 - Fold's props
            {...(rowProps as any)}
          >

            {/* NOTICE: SchemaField 外会包裹一层 <div style="display: contents;" />；但是 contents 不影响栅格布局 */}
            {/* 模板语法插槽：<slot :components="components" :scope="scope"></slot> */}
            {slots.default?.({
              schema: schema.value,
              components: {
                [FormItemColDecorator.name]: FormItemColDecorator,
                FormItem: AntdFormItem,
              },
              scope: { collapsed: collapsedRef.value, maxColumns },
            })}

            {/* 按钮组: 一直显示、默认撑满剩余列、当数量小于maxColumns时无需折叠按钮 */}
            <AntdCol flex="auto">
              <AntdFormItem {...(colButtonProps as any)} >
                <AntdSpace
                  class='ant-formily-fold-button-group'
                  style={{ display: 'flex', width: '100%' }}
                  align="right"
                >
                  {slots.button?.()}
                  {
                    buttonFold && schemas && schemas.length >= maxColumns
                    && <AntdButton
                      type="link"
                      style={{ paddingLeft: 5, paddingRight: 5 }}
                      onClick={() => collapsedRef.value = !collapsedRef.value}
                    >
                      {
                        collapsedRef.value
                          ? (<>
                            {buttonFold[0]}
                            <DownOutlined />
                          </>)
                          : (<>
                            {buttonFold[1]}
                            <UpOutlined />
                          </>)
                      }
                    </AntdButton>
                  }
                </AntdSpace>
              </AntdFormItem>
            </AntdCol>

          </AntdRow>
        </AntdForm>
      )
    }
  },
})
