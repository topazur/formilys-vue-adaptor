import { Schema } from '@formily/json-schema'

import type { ISchema } from '@formily/vue'

// 常量: 便于组件内部与使用者保持统一
export const COMPONENT_FORM_ITEM_COL_DECORATOR = 'FormItemColDecorator'

/**
 * @title 生成 ISchema 传递给 SchemaField 组件
 * @param definitions https://react.formilyjs.org/zh-CN/api/shared/schema#详细说明
 * @param schemas 业务定义字段配置
 * @desc 渲染结构: form -> formLayout -> row -> col -> FormItem + 输入控件
 */
export function generateSchema(definitions?: Record<string, ISchema>, schemas?: ISchema[]) {
  // 计算 Item 集合
  const properties = schemas?.reduce<Record<string, ISchema>>((previousValue, currentValue, currentIndex) => {
    if (!currentValue.name) {
      return previousValue
    }

    // 剔除 getColProps 属性，他是准备传给 AntdCol 容器组件
    const { 'x-decorator-props': decoratorProps, ...resetValue } = currentValue
    const { getColProps, ...restFecoratorProps } = decoratorProps || {}

    const field = {
      'x-decorator': 'FormItem',
      'x-decorator-props': restFecoratorProps,
      ...resetValue,
    }

    const payload = {
      [`${currentValue.name}_col`]: {
        'type': 'void',
        'x-decorator': COMPONENT_FORM_ITEM_COL_DECORATOR,
        'x-decorator-props': { getColProps },
        // 增加索引(从1开始)，便于计算栅格的显隐
        'x-data': { idx: currentIndex + 1 },
        'properties': {
          [currentValue.name]: field,
        },
      },
    }
    return Object.assign(previousValue, payload)
  }, {})

  // 源码(提前实例化): Schema.isSchemaInstance(props.schema) ? props.schema : new Schema({ type: 'object', ...props.schema })
  // https://github.com/alibaba/formily/blob/48c9968b42f6f82c065da897ee91fa118ccf0f5d/packages/vue/src/components/SchemaField.ts#L140
  return new Schema({
    definitions,
    type: 'object',
    properties,
  })
}
