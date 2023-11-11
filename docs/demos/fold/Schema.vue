<script lang="ts">
import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/vue'
import { Button as AntdButton } from 'ant-design-vue'
import {
  DatePicker,
  Input,
  InputNumber,
  Select,
} from '@formily/antdv'
import { QueryFoldForm } from '@odinlin/formily-antdv'

import type { IFormFeedback } from '@formily/core'
import type { ISchema } from '@formily/vue'

const form = createForm()

const { SchemaField } = createSchemaField({
  // 组件列表
  components: {
    DatePicker,
    Input,
    InputNumber,
    Select,
  },
  // scope: { },
})

const schemas: ISchema[] = [
  {
    'type': 'string',
    'name': 'input1',
    'title': '普通输入框 (占用内部的 $ref 和 x-data 属性)',
    'x-component': 'Input',
    '$ref': '#/definitions/aaaaa',
    'x-data': { bbbbbb: '$ref 不会被覆盖，如果想修改请直接修改definitions；x-data会被合并' },
  },
  {
    'type': 'string',
    'name': 'input2',
    'title': '普通输入框 (带冒号、必填星号、提示)',
    'x-component': 'Input',
    'required': true,
    'x-decorator-props': {
      asterisk: true,
      colon: true,
      tooltip: '提示提示',
      tooltipLayout: 'icon',
    },
  },
  {
    'type': 'string',
    'name': 'number1',
    'title': '大小',
    'x-component': 'InputNumber',
    'x-decorator-props': {
      size: ['small', 'default', 'large'][0],
    },
  },
  {
    'type': 'string',
    'name': 'number2',
    'title': '前后缀内容',
    'x-component': 'InputNumber',
    'x-decorator-props': {
      addonBefore: 'addonBefore',
      addonAfter: 'addonAfter',
    },
  },
  {
    'type': 'string',
    'name': 'select2',
    'title': '反馈⽂案',
    'x-component': 'Select',
    'x-decorator-props': {
      feedbackText: 'feedbackText',
    },
  },
  {
    'type': 'string',
    'name': 'select3',
    'title': '扩展描述⽂案',
    'x-component': 'Select',
    'x-decorator-props': {
      extra: 'extra',
    },
  },
  {
    'type': 'string',
    'name': 'date2',
    'title': '复写 x-decorator-props.getColProps 修改 span',
    'x-component': 'DatePicker.RangePicker',
    'x-decorator-props': {
      getColProps: ({ collapsed, maxColumns }) => {
        return {
          span: 16,
        }
      },
    },
  },
]

export default {
  components: {
    AntdButton,
    QueryFoldForm,
    SchemaField,
  },
  setup() {
    const handleSubmit = (e) => {
      form
        ?.submit(e => console.log('onSubmit', e))
        .then(e => console.log('onSubmitSuccess', e))
        .catch(e => console.log('onSubmitFailed', e))
    }

    const handleRest = (e) => {
      form
        ?.reset('*', {
          forceClear: false,
          validate: false,
        })
        .then(e => console.log('resetValidateSuccess', e))
        .then(e => console.log('resetValidateFailed', e))
    }

    return {
      form,
      schemas,
      handleSubmit,
      handleRest,
    }
  },
}
</script>

<template>
  <QueryFoldForm :form="form" :schemas="schemas">
    <template #default="{ schema, components, scope }">
      <SchemaField :schema="schema" :components="components" :scope="scope" />
      <!-- <SchemaField v-bind="{ schema, components, scope }" /> -->
    </template>
    <template #button>
      <AntdButton type="primary" @click="handleSubmit">
        查询
      </AntdButton>
      <AntdButton type="default" @click="handleRest">
        重置
      </AntdButton>
    </template>
  </QueryFoldForm>
</template>
