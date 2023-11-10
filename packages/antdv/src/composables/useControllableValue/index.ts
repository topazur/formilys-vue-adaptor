import { computed, shallowRef, watch } from 'vue'
import { isEqual } from '@formily/shared'

import type { ShallowRef } from 'vue'

// Options 该接口主要是自定义字段名，可覆盖默认值
export interface Options<T> {
  defaultValue?: T
  defaultValuePropName?: string
  valuePropName?: string
}

/**
 * @title 需要组件的状态既可以自己管理，也可以被外部控制
 * @param { Record<string, any> } props 外部传入的属性(#NOTICE: 不解构直接传入，否则watch监听失败; 提前定义props的类型，否则组件不会接受未定义的属性)
 * @param { Function } emitTrigger 包装 emit 触发器(#NOTICE: 与 react 不同的是 vue 需要用 emit 来通知父组件 & emits 需提前注册定义，否则不生效)
 * @param { Options } options
 * @link [操考 ahooks](https://ahooks.js.org/zh-CN/hooks/use-controllable-value)
 */
export function useControllableValue<T = any>(props: Record<string, any>, emitTrigger: (...args: any[]) => T, options: Options<T> = {}) {
  const {
    defaultValue = undefined,
    defaultValuePropName = 'defaultValue',
    valuePropName = 'value',
  } = options

  // 根据 优先级 且 是否有值 来获取始值
  const initialValue = computed<T>(() => {
    if (props[valuePropName]) {
      return props[valuePropName]
    }
    if (props[defaultValuePropName]) {
      return props[defaultValuePropName]
    }
    return defaultValue
  })

  // 声明内部状态
  const stateRef: ShallowRef<T> = shallowRef(initialValue.value)

  /**
   * @title 监听外部变化同时更新内部状态
   * @notice #NOTICE: 由于 vue 中的 props 定义方式，会自动赋予默认值，无法区分是否为用户传入。解决方法是在 set 时直接更新，在可能触发的 watch 中再次赋值
   * @case1 如果是受控模式，判断是否相等 (因为在 setState 中直接进行了赋值)，不相等则更新内部的 stateRef。
   * @case2 如果是非受控模式，根本不会触发 watch，所以不同担心。
   */
  watch(() => props[valuePropName], (newValue, oldValue) => {
    if (!isEqual(stateRef.value, newValue)) {
      stateRef.value = newValue
    }
  })

  /**
   * @title update 操作
   * @step1 触发 emit 自定义事件，并得到返回值
   * @case2 直接将返回值赋值给 stateRef。不再区分是否为受控，直接更新，在 watch 中再进行 compare。
   */
  function setState(...args) {
    const value = emitTrigger(...args)
    stateRef.value = value
  }

  return [stateRef, setState] as const
}
