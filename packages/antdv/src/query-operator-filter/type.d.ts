import type { VNode } from 'vue'

export type IFormatter = (type: string, key: string, idx: number) => VNode
