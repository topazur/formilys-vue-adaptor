<script lang="ts">
import { createForm } from '@formily/core'
import { Button as AntdButton, Space as AntdSpace } from 'ant-design-vue'
import { createSchemaField } from '@formily/vue'
import {
  DatePicker,
  Input,
  Select,
} from '@formily/antdv'
import { QueryOperatorFilter, convertValuesToConditions, getInitialValue } from '@odinlin/formily-antdv'

import { definitions, fields, formatter } from './json'

import type { IColumnCondition } from '@odinlin/formily-antdv'

const conditions: IColumnCondition[] = [
  {
    field: 'subject',
    operator: 'LIKE',
    value: ['张'],
  },
  {
    field: 'status',
    operator: 'CONTAINS',
    value: [],
  },
  {
    field: 'assignedTo',
    operator: 'CONTAINS',
    value: ['1'],
  },
  {
    field: 'gmtCreate',
    operator: 'MORE_THAN',
    value: [],
  },
  {
    field: 'gmtModified',
    operator: 'BETWEEN',
    value: [],
  },
]

const form = createForm({
  // form.setInitialValues
  initialValues: getInitialValue(fields, conditions),
})
const { SchemaField } = createSchemaField({
  components: {
    DatePicker,
    Input,
    Select,
  },
})

export default {
  components: { QueryOperatorFilter, AntdSpace, AntdButton, SchemaField },
  setup() {
    const handleSubmit = (e) => {
      form
        ?.submit(e => console.log('onSubmit', convertValuesToConditions(e)))
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
      definitions,
      definitionFields: fields,
      conditions,
      formatter,
      handleSubmit,
      handleRest,
    }
  },
}
</script>

<template>
  <QueryOperatorFilter
    :form="form" :definitions="definitions" :definition-fields="definitionFields"
    :conditions="conditions" :formatter="formatter"
  >
    <template #default="{ schema, components, scope }">
      <SchemaField :schema="schema" :components="components" :scope="scope" />
      <!-- <SchemaField v-bind="{ schema, components, scope }" /> -->
    </template>
    <template #button>
      <AntdSpace>
        <AntdButton type="primary" @click="handleSubmit">
          查询
        </AntdButton>
        <AntdButton type="default" @click="handleRest">
          重置
        </AntdButton>
      </AntdSpace>
    </template>
  </QueryOperatorFilter>
</template>
l
