import type { ISchema } from '@formily/vue'

/********************************************************************/
/** *************************** constants */
/********************************************************************/

// 内置 (通过createSchemaField注册) 的组件名称，暴露给Schema使用
export const COMPONENT_QUERY_GRID = 'QueryGrid'
export const COMPONENT_QUERY_ITEM = 'QueryItem'
export const COMPONENT_QUERY_ITEM_SELECT = 'QueryItemSelect'

/********************************************************************/
/** ************************** definitions */
/********************************************************************/

export const definitionQueryGrid: ISchema = {
  'type': 'void',
  'x-component': 'QueryGrid',
  // NOTICE: 可覆写自定义 - Operator's field schema
  'x-component-props': {
    colWrap: true,
    minColumns: 2,
    maxColumns: 2,
    columnGap: 32,
    rowGap: 0,
    // shouldVisible
  },
}

export const definitionQueryItem: ISchema = {
  'type': 'object',
  'x-component': 'QueryItem',
  // NOTICE: 可覆写自定义 - Operator's field schema
  'x-component-props': {
    style: { marginBottom: 8 },
  },
}

/**
 * @title 字段操作符选择器配置
 * @param { QueryItemSelectProps } 详情见 QueryItemSelect 组件
 */
export const definitionQueryItemSelect: ISchema = {
  'type': 'string',
  'x-component': 'QueryItemSelect',
  // NOTICE: 可覆写自定义 - Operator's field schema
  'x-component-props': {
    hideSelectedOption: true,
    options: [],
  },
}
