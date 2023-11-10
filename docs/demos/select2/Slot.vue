<script lang="ts">
import { Select2 } from '@odinlin/formily-antdv'

import { OptionRender, loadData } from './helper'

export default {
  components: {
    Select2,
    OptionRender,
  },
  setup() {
    return {
      loadData,
    }
  },
}
</script>

<template>
  <h1>插槽</h1>

  <ul>
    <li>
      <h6>测试 slot 透传：placeholder prop is string</h6>
      <Select2
        style="width: 300px" placeholder="placeholder is string" :show-search="true" :first-load="false"
        :load-data="(signal, opts) => loadData('placeholderProp', signal, opts)"
      />
    </li>

    <li>
      <h6>测试 slot 透传：placeholder slot</h6>
      <Select2
        style="width: 300px" :show-search="true" :first-load="false"
        :load-data="(signal, opts) => loadData('placeholderSlot', signal, opts)"
      >
        <template #placeholder>
          <b>具名插槽 之 placeholder</b>
        </template>
      </Select2>
    </li>

    <p style="border: 5px solid rgb(186, 25, 25)" />

    <li>
      <h6>测试 slot 透传(如果业务没传递，组件内部是设置了默认值的)：notFoundContent prop is string</h6>
      <Select2
        style="width: 300px" not-found-content="notFoundContent is string" :show-search="true" :first-load="false"
        :load-data="(signal, opts) => loadData('notFoundContentProp', signal, opts)"
      />
    </li>

    <li>
      <h6>测试 slot 透传(如果业务没传递，组件内部是设置了默认值的)：notFoundContent slot</h6>
      <Select2
        style="width: 300px" :show-search="true" :first-load="false"
        :load-data="(signal, opts) => loadData('notFoundContentSlot', signal, opts)"
      >
        <template #notFoundContent>
          <b>具名插槽 之 notFoundContent</b>
        </template>
      </Select2>
    </li>

    <p style="border: 5px solid rgb(186, 25, 25)" />

    <code>
      option slot (注意组件中对 <b style="color: red">加载中</b> 和 <b style="color: red">没有更多</b> 两个 option 的 value
      常量做了导出，可根据需要进行修改；其次也额外加了类名，可覆盖样式)
    </code>

    <li>
      <h6>方案一：全部 option 重写</h6>
      <Select2
        style="width: 300px" :show-search="true" :first-load="false"
        :load-data="(signal, opts) => loadData('option—one', signal, opts)"
      >
        <template #option="{ value, label }">
          <template v-if="value === 'SELECT2_IDENTIFIER_NOMORE'">
            This is no more
          </template>
          <template v-else-if="value === 'SELECT2_IDENTIFIER_PROGRESS'">
            This is loading
          </template>
          <template v-else>
            <h5>The slot's value: {{ value }}</h5>
            <h5>The slot's label: {{ label }}</h5>
          </template>
        </template>
      </Select2>
    </li>

    <li>
      <h6>方案二：jsx组件直接渲染vnode - 魔法打败魔法</h6>
      <Select2
        style="width: 300px" :show-search="true" :first-load="false"
        :load-data="(signal, opts) => loadData('option—one', signal, opts)"
      >
        <template #option="{ value, label }">
          <OptionRender :value="value" :label="label" />
        </template>
      </Select2>
    </li>

    <li>
      <h6>方案三：在模板中直接使用动态组件渲染vnode</h6>
      <Select2
        style="width: 300px" :show-search="true" :first-load="false"
        :load-data="(signal, opts) => loadData('option—one', signal, opts)"
      >
        <template #option="{ value, label }">
          <template v-if="value === 'SELECT2_IDENTIFIER_NOMORE'">
            <!-- <p>模板渲染{{ label }}</p> -->
            <!-- <p>h函数 {{ h('div', null, label) }}</p> -->
            <!-- <p>render函数 {{ render(label, window.ShadowRoot, false) }}</p> -->
            <!-- <div :ref="(ref: any) => ref.innerHTML = '<div>加载中...</div>'" /> -->
            <component :is="label" />
          </template>
          <template v-else-if="value === 'SELECT2_IDENTIFIER_PROGRESS'">
            <component :is="label" />
          </template>
          <template v-else>
            <h5>The slot's value: {{ value }}</h5>
            <h5>The slot's label: {{ label }}</h5>
          </template>
        </template>
      </Select2>
    </li>
  </ul>
</template>
