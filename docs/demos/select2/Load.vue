<script lang="ts">
import { ref } from 'vue'
import { Select2 } from '@odinlin/formily-antdv'

import { loadData } from './helper'

export default {
  components: {
    Select2,
  },
  setup() {
    const value = ref<any>({
      value: 'test1___1',
      label: 'test1___1的label',
    })

    const onChange = (val, option) => {
      value.value = val
    }

    const open = ref<boolean>(false)

    const onOpenChange = (val) => {
      open.value = val
    }

    return {
      loadData,
      value,
      onChange,
      open,
      onOpenChange,
    }
  },
}
</script>

<template>
  <ul>
    <h3>一、受控</h3>

    <li>
      <h6>
        <div>双向绑定value: {{ JSON.stringify(value) }}</div>
        <button
          style="border: 1px solid #000"
          @click="value = { value: 'testValue_null_2', label: 'testValue_null_2的label' }"
        >
          外部更改：set value
        </button>
      </h6>
      <Select2
        style="width: 300px" :show-search="false" :value="value" :load-data="(signal, opts) => loadData('testValue', signal, opts)"
        @change="onChange"
      />
    </li>

    <li>
      <h6>
        <div>受控open: {{ JSON.stringify({ open }) }} ==&gt; 外部控制首次打开也会加载</div>
      </h6>
      <Select2
        style="width: 300px" :show-search="false" :open="open" :load-data="(signal, opts) => loadData('testOpen', signal, opts)"
        @dropdownVisibleChange="onOpenChange"
      />
    </li>

    <h3>二、load情况</h3>

    <li>
      <h6>不可搜索（此时默认首次打开下拉框加载）==> 可以保留上次请求结果</h6>
      <Select2
        style="width: 300px" :show-search="false"
        :load-data="(signal, opts) => loadData('testLoad-one', signal, opts)"
      />
    </li>

    <li>
      <h6>可搜索（firstLoad=true 开启首次打开下拉框加载）==> 每次打开都要重新搜索</h6>
      <Select2
        style="width: 300px" :show-search="true" :first-load="true"
        :load-data="(signal, opts) => loadData('testLoad-two', signal, opts)"
      />
    </li>

    <li>
      <h6>可搜索（firstLoad=false 关闭首次打开下拉框加载）==> 每次打开都要重新搜索</h6>
      <Select2
        style="width: 300px" :show-search="true" :first-load="false"
        :load-data="(signal, opts) => loadData('testLoad-three', signal, opts)"
      />
    </li>
  </ul>
</template>
