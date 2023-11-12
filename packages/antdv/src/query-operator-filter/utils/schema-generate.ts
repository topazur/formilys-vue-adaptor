import {
  COMPONENT_QUERY_GRID, COMPONENT_QUERY_ITEM, COMPONENT_QUERY_ITEM_SELECT,
  definitionQueryGrid, definitionQueryItem, definitionQueryItemSelect,
} from './schema-definition'

import type { ISchema } from '@formily/vue'

/**
 * @title 业务定义字段配置
 */
export interface IQueryFieldItem {
  field: string
  operatorOptions: string[]
  operator: string
  isMultiple: boolean
  value?: any[]
}

/**
 * @title 生成 ISchema 传递给 SchemaField 组件
 * @param definitions https://react.formilyjs.org/zh-CN/api/shared/schema#详细说明
 * @param fields 业务定义字段配置
 */
export function generateSchema(definitions?: Record<string, ISchema>, fields?: Pick<IQueryFieldItem, 'field' | 'operatorOptions'>[]): ISchema {
  const mergeDefinitions: Record<string, ISchema> = {
    [COMPONENT_QUERY_GRID]: definitionQueryGrid,
    [COMPONENT_QUERY_ITEM]: definitionQueryItem,
    [COMPONENT_QUERY_ITEM_SELECT]: definitionQueryItemSelect,
    // NOTICE: 可覆写自定义 - Operator's props to modify definitions schema
    ...definitions,
  }

  // 计算 Item 集合
  const properties = fields?.reduce<Record<string, ISchema>>((previousValue, currentValue, currentIndex) => {
    const { field, operatorOptions } = currentValue

    const payload = {
      [field]: {
        '$ref': `#/definitions/${COMPONENT_QUERY_ITEM}`,
        'x-component-props.title': field,
        'properties': {
          operator: {
            '$ref': `#/definitions/${COMPONENT_QUERY_ITEM_SELECT}`,
            'x-component-props.options': operatorOptions,
          },
          value: {
            $ref: `#/definitions/${field}`,
          },
        },
      },
    }

    return Object.assign(previousValue, payload)
  }, {})

  return {
    definitions: mergeDefinitions,
    type: 'object',
    properties: {
      [COMPONENT_QUERY_GRID]: {
        $ref: `#/definitions/${COMPONENT_QUERY_GRID}`,
        properties,
      },
    },
  }
}
