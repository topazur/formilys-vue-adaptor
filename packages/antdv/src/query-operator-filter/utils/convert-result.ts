import { isArr, isEmpty } from '@formily/shared'

import type { IQueryFieldItem } from './schema-generate'

/**
 * @title 与后端交互的单个参数类型定义
 */
export interface IColumnCondition {
  field: string
  operator: string
  value: any[]
}

/**
 * @title 将过滤结果转化为后端所需要的格式
 * @param { `{ [key:string]: { operator: { label: string, value: string }, value: any } }` } values
 * @returns { `IColumnCondition[]` }
 */
export function convertValuesToConditions(values: any): IColumnCondition[] {
  const conditions: IColumnCondition[] = []

  for (const key in values) {
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      const { operator, value } = values[key]

      // 过滤掉没有操作符的
      if (!operator) {
        continue
      }

      // 过滤掉空值的
      // const valueType = Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
      if (isEmpty(value)) {
        continue
      }

      conditions.push({
        field: key,
        operator,
        value: isArr(value) ? value : [value],
      })
    }
  }

  return conditions
}

/**
 * @title 根据后端响应获取初始值来回显
 */
export function getInitialValue(definitionFields?: IQueryFieldItem[], conditions?: IColumnCondition[]): any {
  // 仅筛选出服务端存储的字段，其他字段会被过滤掉
  const remoteFields = conditions?.map((cond) => {
    const { field, operator, value } = cond

    const currentField = definitionFields?.find(item => item.field === field)
    // 本地也没找到对应的field，表示是非法字段
    if (!currentField) { return { field: '', operator: '', value: undefined } }

    return {
      field,
      // 如果传入字段的操作符不在预定义操作符列表中，则使用预定义字段的默认操作符
      operator: (currentField.operatorOptions.includes(operator) ? operator : undefined) || currentField.operator,
      // 根据预定义的 isMultiple 字段判断是否是数组，如果不是默认取第 0 项
      value: value ? (currentField.isMultiple ? value : value?.[0]) : undefined,
    }
  })?.filter(cond => !!cond.field)

  // 将筛选出的字段的信息转化为 IQueryFieldItem 类型，用于赋给表单初始值
  return remoteFields?.reduce((previousValue, currentValue) => {
    const { field, operator, value } = currentValue
    return {
      ...previousValue,
      [field]: {
        operator,
        value,
      },
    }
  }, {})
}
