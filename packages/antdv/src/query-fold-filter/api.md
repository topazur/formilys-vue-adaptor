## Props

```tsx
export interface QueryFoldFormProps<ValueType extends object = any> extends Omit<AntdFormProps, 'form'> {
  // 覆写 form 实例，改成必传属性；并且支持传递泛型。
  form: Form<ValueType>

  // 传入的 Field 组件列表
  components?: { [key: string]: React.FC }
  definitions?: Record<string, ISchema>
  schemas?: ISchema[]

  // 默认的折叠状态
  defaultCollapsed?: boolean
  // 每行的最大列数量
  maxColumns?: number
  // 覆盖栅格 Row 组件属性
  rowProps?: RowProps
  // 覆盖按钮组 FormItem 组件属性
  buttonGroup?: IFormItemProps
}
```

### 容器组件：Form & Col 的属性默认值及覆盖

- restProps 覆盖 Form 组件属性, 可透传给 FormItem 组件，实现统一布局
- rowProps 覆盖 Row 组件属性, 自定义定义栅格容器

  ```tsx
  const example = (
    <AntdForm
      layout="vertical"
      colon={false}
      feedbackLayout="terse"
      size='default'
      {...restProps}
      form={form}
    >
      <AntdRow
        wrap={true}
        gutter={[20, 0]}
        justify="start"
        align="bottom"
        {...rowProps}
      >
      {children}
      </AntdRow>
    </AntdForm>
  )
  ```

### Field 组件属性默认值及覆盖

- 覆写 definitions 或者 schemas 属性，可为每个field单独设置，并且优先级高于 上述容器Form 组件属性
  ```tsx
  export interface IFormColItemProps extends IFormItemProps {
    getColProps?: (opts: { filed: GeneralField; collapsed: boolean; maxColumns: number }) => ColProps
  }
  ```

- 由于按钮组 无法在 ISchema 中定义，可在 QueryFoldFormProps.buttonGroup 中自定义
