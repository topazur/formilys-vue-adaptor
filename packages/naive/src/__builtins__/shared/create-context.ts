import {
  defineComponent,
  inject,
  provide,
  readonly,
  ref,
  toRef,
} from 'vue'

import type {
  DefineComponent,
  InjectionKey,
  Ref,
} from 'vue'

export interface CreateContext<T> {
  Provider?: DefineComponent
  Consumer?: DefineComponent
  injectKey: InjectionKey<Ref<T>>
}

export function createContext<T>(description?: string | number, defaultValue?: T): CreateContext<T> {
  const injectKey: InjectionKey<Ref<T>> = Symbol(description)

  return {
    Provider: defineComponent({
      name: 'ContextProvider',
      props: {
        value: {
          type: null,
          default() {
            return defaultValue ?? null
          },
        },
      },
      setup(props, { slots }) {
        const value = toRef(props, 'value' as never)
        provide(injectKey, readonly(value as never))
        return () => slots?.default?.()
      },
    }),

    Consumer: defineComponent({
      name: 'ContextConsumer',
      setup(_props, { slots }) {
        const value = inject(injectKey)
        return () => slots?.default?.(value)
      },
    }),
    injectKey,
  }
}

export function useContext<T>(context: CreateContext<T>) {
  const key = context.injectKey
  return inject(key, ref(null))
}
