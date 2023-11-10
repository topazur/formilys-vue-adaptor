import { shallowRef } from 'vue'

/**
 * @title 用于给一个异步函数增加竞态锁，防止并发执行。
 * @link [操考 ahooks](https://ahooks.js.org/zh-CN/hooks/use-lock-fn)
 */
export function useLockFn<P extends any[] = any[], V = any>(fn: (...args: P) => Promise<V>) {
  const lockRef = shallowRef<boolean>(false)

  return async function (...args: P): Promise<V> {
    if (lockRef.value) { return }

    lockRef.value = true
    try {
      const ret = await fn(...args)
      return ret
    }
    finally {
      lockRef.value = false
    }
  }
}
