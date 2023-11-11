import { defineComponent, onUnmounted, shallowRef, watch } from 'vue'
import { isArr, isEmpty } from '@formily/shared'
import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { useDebounceFn } from '@vueuse/core'
import { Select as AntdSelect } from 'ant-design-vue'
import { selectProps as initSelectProps } from 'ant-design-vue/lib/select'
import { initDefaultProps } from 'ant-design-vue/lib/_util/props-util'
import { PreviewText } from '@formily/antdv'

import {
  SELECT2_ABORT_REASON,
  defaultNotFoundContent,
} from './option-definition'
import { useControllableValue, useLockFn } from '../composables'
import { useAbortController, useMergeOptions } from './hooks'

import type { DefineComponent, SlotsType } from 'vue'
import type { SelectProps } from 'ant-design-vue/lib/select'

export { SELECT2_ABORT_REASON, SELECT2_IDENTIFIER_NOMORE, SELECT2_IDENTIFIER_PROGRESS } from './option-definition'

/**
 * ISelect2Props 继承并覆写了 AntdSelectProps 接口
 */
export interface ISelect2Props extends SelectProps {
  // 首次打开下拉框是否自动加载数据
  firstLoad?: boolean
  // 异步函数
  loadData?: (signal: AbortSignal, opts: { q: string; offset: number }) => Promise<any[]>
}

/**
 * @title 可搜索的 remote 选择器，支持滚动加载
 * @param { 后缀图标 } 可通过覆盖 suffixIcon 实现加载状态；也可以直接设置 loading 为 true 实现加载状态。选择后者。
 * @param { loadData } 异步加载选项列表
 *
 * @notice // NOTICE: 为什么没在加载时也显示loading，因为没滚动到底部时用户是看不到该选项，当滚动底部就触发了加载可以第一时间加载，没有抖动
 * @notice // NOTICE: 自定义该选项的样式: `option-identifier-*`
 * @notice // NOTICE: `filterOption={false}` => 必须关闭选项过滤 local 数据，而是通过 onSearch 过滤 remote 数据
 * @notice // NOTICE: `virtual={false}` => 关闭虚拟滚动，否则滚动无法监测触底
 *
 * @notice // NOTICE: 首次打开下拉列表时触发搜索 => 可搜索：`showSearch && innerOpen && firstLoad`；每次打开都要重新搜索，因为 search值 可能已改变，保存的选项可能不正确
 * @notice // NOTICE: 首次打开下拉列表时触发搜索 => 不可搜索：`!showSearch && innerOpen && getOptions().length <= 0`；不可搜索时没有 search值 的影响，可以保留上次请求结果
 *
 * @notice // NOTICE: 当搜索框有值时，直接关闭弹窗，此时也会触发 onSearch 搜索，search值为空。这里阻止掉该情况
 */
const InternalSelect2: DefineComponent = defineComponent({
  name: 'Select2',
  props: initDefaultProps(
    {
      ...initSelectProps(),
      firstLoad: {
        type: Boolean,
        default: true,
      },
      loadData: {
        type: Function,
        default: undefined,
      },
    },
    {
      listHeight: 200,
      listItemHeight: 24,
      showSearch: true,
      labelInValue: true,
      firstLoad: true,
      loadData: undefined,
    },
  ),
  slots: Object as SlotsType<{
    notFoundContent: any
    suffixIcon: any
    itemIcon: any
    removeIcon: any
    clearIcon: any
    dropdownRender: any
    option: any
    placeholder: any
    tagRender: any
    maxTagPlaceholder: any
    optionLabel: any
    default: any
  }>,
  setup(_props, { attrs, slots, emit, expose }) {
    const props = _props as ISelect2Props

    /**
     * @title 劫持 value 的 state，方便回显
     * @desc 需要组件的状态既可以自己管理，也可以被外部控制
     */
    const [innerValue, setInnerValue] = useControllableValue<any>(
      _props,
      (value, ...args) => {
        emit('update:value', value) // v-model:value
        emit('change', ...args) // @change

        return value
      },
      {
        defaultValue: undefined,
        defaultValuePropName: 'defaultValue',
        valuePropName: 'value',
      })

    /**
     * @title 劫持 open 的 state，方便判断仅在下拉框开启时才触发搜索
     * @desc 需要组件的状态既可以自己管理，也可以被外部控制
     */
    const [innerOpen, setInnerOpen] = useControllableValue<boolean>(
      _props,
      (visible, ...args) => {
        emit('dropdownVisibleChange', visible, ...args)

        return visible
      },
      {
        defaultValue: undefined,
        defaultValuePropName: 'defaultOpen',
        valuePropName: 'open',
      })

    // 存储选项列表，方便获取到当前最新的选项列表的长度
    const optionsRef = shallowRef<any[]>([])

    /**
     * @title 取消请求
     */
    const [abortControllerRef, getRefreshSignal] = useAbortController()

    /**
     * @title 异步请求相关状态
     */
    const loadInProgressRef = shallowRef<boolean>(false) // 是否正在请求中
    const loadNoMoreRef = shallowRef<boolean>(false) // 是否没有更多未加载的，为 true 时已加载完毕
    const searchValueRef = shallowRef<string>('') // 存储当前搜索值，用于在下拉滚动时引用

    /**
     * @title 对 options 进行包装处理
     */
    const mergeOptions = useMergeOptions(optionsRef, loadInProgressRef, loadNoMoreRef)

    /**
     * @title 搜索框键入的防抖查询函数
     * @desc 重置选项列表；offset重置为0
     */
    const onSearchDebounceRun = useDebounceFn(async (q: string) => {
      searchValueRef.value = q

      // 当搜索框有值时，直接关闭弹窗，此时也会触发 onSearch 搜索，search值为空。这里阻止掉该情况，不能简单的判断 search值为空 就阻止
      if (!innerOpen.value) { return }

      try {
        loadNoMoreRef.value = false
        optionsRef.value = []
        loadInProgressRef.value = true

        const response = await props.loadData?.(getRefreshSignal(), { q, offset: 0 })
        if (isArr(response) && !isEmpty(response)) {
          optionsRef.value = response
        }
      }
      finally {
        loadInProgressRef.value = false
      }
    }, 500)

    /**
     * @title 下拉列表滚动时的回调，增加静态锁 <触底操作只能等待异步函数完成之后才能再次触发>
     * @desc 往选项列表累加；offset 为上一次的 options 长度
     */
    const onPopupScrollLock = useLockFn(async (event: Event) => {
      // 没有更多了，则无需触发滚动加载
      if (loadNoMoreRef.value) { return }

      const { scrollTop, scrollHeight, clientHeight } = event.target as HTMLDivElement
      // 容差值是为了避免由于浏览器像素差异等问题导致的误判
      const tolerance = 2
      // 滚动条滚动的距离(scrollTop) 大于 滚动区域的总高度(scrollHeight)与滚动区域可见部分的高度(clientHeight)的差值
      if (!(scrollTop > scrollHeight - clientHeight - tolerance)) {
        return
      }

      try {
        loadInProgressRef.value = true

        const response = await props.loadData?.(getRefreshSignal(), { q: searchValueRef.value, offset: optionsRef.value.length })
        if (isArr(response) && !isEmpty(response)) {
          optionsRef.value = [...optionsRef.value, ...response]
        }
        else {
          loadNoMoreRef.value = true
        }
      }
      finally {
        loadInProgressRef.value = false
      }
    })

    /**
     * @title 劫持 onDropdownVisibleChange 方法
     */
    const innerDropdownVisibleChangeHandle = (visible: boolean) => {
      setInnerOpen(visible)

      // 当 showSearch 开启时且打开下拉框时，提前清空，防止保留上一次的渲染结果
      props.showSearch && visible && (optionsRef.value = [])
      // 当 showSearch 开启时且关闭下拉框时，延迟清空，防止出现 notFoundContent 的dom闪烁
      props.showSearch && !visible && setTimeout(() => optionsRef.value = [], 100)

      // 当 showSearch 开启时，根据 firstLoad 判断是否首次打开下拉列表时触发搜索
      props.showSearch && visible && props.firstLoad && onSearchDebounceRun('')
      // 当 showSearch 未开启时，默认首次打开下拉列表时触发搜索；后续打开保留上次搜索结果
      !props.showSearch && visible && optionsRef.value.length <= 0 && onSearchDebounceRun('')
    }

    watch(() => innerOpen, (newValue, oldValue, onCleanup) => {
      // 当下拉框已关闭，则手动触发 abort 方法
      !innerOpen.value && abortControllerRef.value.abort(SELECT2_ABORT_REASON)
    })

    /**
     * @title 卸载清除副作用
     */
    onUnmounted(() => {
      // 卸载时直接结束可能存在的上一次请求
      abortControllerRef.value.abort(SELECT2_ABORT_REASON)
    })

    return () => {
      const {
        /* 默认值 */
        listHeight,
        listItemHeight,
        labelInValue,
        showSearch,

        /* 劫持属性: 在此处都要 omit 掉，不希望传入 AntdSelect 中；而是使用内部维护的属性及方法。 - 痛点: vue 不支持属性覆盖吗？来者不拒啊 */
        options,
        value,
        onChange,
        // suffixIcon,
        loading,
        open,
        onDropdownVisibleChange,
        onSearch,
        onPopupScroll,

        /* 需判断是否传入 prop 或 slot */
        notFoundContent,

        /* 自定义异步加载 */
        firstLoad,
        loadData,

        ...restProps
      } = props

      // ===================== notFoundContent =====================
      let mergedNotFound: any
      if (notFoundContent !== undefined) {
        mergedNotFound = notFoundContent
      }
      else if (slots.notFoundContent) {
        mergedNotFound = slots.notFoundContent()
      }
      else {
        mergedNotFound = defaultNotFoundContent
      }

      return (
        <AntdSelect
          {...restProps}
          {...attrs}
          filterOption={false}
          virtual={false}
          /* 默认值 */
          listHeight={listHeight}
          listItemHeight={listItemHeight}
          labelInValue={labelInValue}
          showSearch={showSearch}
          /* 劫持 */
          options={mergeOptions.value}
          value={innerValue.value}
          onChange={setInnerValue}
          // suffixIcon={loadInProgressRef.value ? <LoadingOutlined /> : suffixIcon}
          loading={loadInProgressRef.value || loading}
          open={innerOpen.value}
          onDropdownVisibleChange={innerDropdownVisibleChangeHandle}
          onSearch={showSearch ? onSearchDebounceRun : undefined}
          onPopupScroll={onPopupScrollLock}
          /* slots 透传 */
          notFoundContent={mergedNotFound}
          v-slots={slots}
        />
      )
    }
  },
})

export const Select2 = connect(
  InternalSelect2,
  mapProps(
    {
      dataSource: 'options',
      loading: true,
    },
    ({ useNull, ...props }, field) => {
      let value = props.value
      if (!useNull && value === null) {
        value = undefined
      }

      const fieldLoading = field?.['loading'] || field?.['validating']
      return Object.assign({}, props, { value, loading: fieldLoading || props.loading })
    },
  ),
  mapReadPretty(PreviewText.Select),
)

export default Select2
