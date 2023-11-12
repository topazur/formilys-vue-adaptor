import { h, toRaw } from 'vue'

import { isVnode } from './utils'

import type { DefineComponent, VNode } from 'vue'
import type { SlotTypes } from '.'

export function resolveComponent(child?: SlotTypes,
  props?: Record<string, any>) {
  if (child) {
    if (typeof child === 'string' || typeof child === 'number') {
      return child
    }
    else if (typeof child === 'function') {
      return (child as (props: Record<string, any>) => VNode[])(props)
    }
    else if (isVnode(child)) {
      return child
    }
    else {
      return h(toRaw(child as DefineComponent), props)
    }
  }

  return null
}
