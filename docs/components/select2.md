<script setup>
import SelectLoadDemo from '../demos/select2/Load.vue'
import SelectSlotDemo from '../demos/select2/Slot.vue'
</script>

# 去除 disbaled 选项

```css
.ant-select-item-option.ant-select-item-option-disabled.option-identifier-progress,
.ant-select-item-option.ant-select-item-option-disabled.option-identifier-nomore {
  cursor: default;
}
```

# Select2 Demo

> `packages/antdv/src/select2/index.tsx`
> 建议开启 labelInValue 便于回显

<!-- demos -->
<SelectLoadDemo />

<SelectSlotDemo />
