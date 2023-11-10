<script setup>
import SelectParentDemo from '../demos/useControllableValue/Parent.vue'
</script>

# useControllableValue Demo

> `packages/antdv/src/hooks/useControllableValue/index.ts`


```
# v-model
<CustomInput v-model="searchText" />
<CustomInput :model-value="searchText" @update:model-value="newValue => searchText = newValue" />
defineEmits(['update:modelValue'])

# v-model:value
<CustomInput v-model:value="searchText" />
<CustomInput :value="searchText" @update:value="newValue => searchText = newValue" />
defineEmits(['update:value'])
```


<!-- demos -->
<SelectParentDemo />
