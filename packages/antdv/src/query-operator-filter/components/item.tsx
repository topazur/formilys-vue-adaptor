import { computed, defineComponent, inject, provide, ref } from 'vue'
import { isVoidField } from '@formily/core'
import { connect, mapProps } from '@formily/vue'
import { Button as AntdButton, Popover as AntdPopover, Space as AntdSpace } from 'ant-design-vue'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue'
import { composeExport, resolveComponent, usePrefixCls, useToken } from '@formily/antdv/lib/__builtins__'
import { FormLayoutShallowContext, useFormLayout } from '@formily/antdv'
import useStyle from '@formily/antdv/lib/form-item/style'

import type { IFormatter } from '../type'
import type { FormItemProps } from '@formily/antdv'

const ICON_MAP = {
  error: () => <CloseCircleOutlined />,
  success: () => <CheckCircleOutlined />,
  warning: () => <ExclamationCircleOutlined />,
}

/**
 * @title 重写 FormItem: 删除label、content 外层包裹 AntdSpace.Compact 合并控件
 * @uri https://github.com/formilyjs/antdv/blob/main/packages/components/src/form-item/index.tsx
 */
export const QueryBaseItem = defineComponent({
  name: 'FormItem',
  props: {
    className: {},
    required: {},
    colon: {},
    layout: {},
    tooltip: {},
    label: {},
    labelStyle: {},
    labelAlign: {
      default: 'left',
    },
    labelWrap: {},
    labelWidth: {},
    wrapperWidth: {},
    labelCol: {},
    wrapperCol: {},
    wrapperAlign: {},
    wrapperWrap: {},
    wrapperStyle: {},
    fullness: {},
    addonBefore: {},
    addonAfter: {},
    size: {},
    extra: {},
    feedbackText: {},
    feedbackLayout: {},
    tooltipLayout: {},
    feedbackStatus: {},
    feedbackIcon: {},
    asterisk: {},
    gridSpan: {},
    bordered: { default: true },
    inset: { default: false },
  },
  setup(_props, { attrs, slots }) {
    const props = _props as FormItemProps

    const formatter: IFormatter = inject<any>('formatter', (type: string, key: string, idx: number) => key)
    provide(FormLayoutShallowContext, ref(null))

    const active = ref(false)

    const deepLayoutRef = useFormLayout()
    const prefixCls = usePrefixCls('formily-form-item', attrs.prefixCls as string)
    const [wrapSSR, hashId] = useStyle(prefixCls)
    // 样式前缀: antd's prefixCls + formily's tag
    const { token } = useToken()
    // 计算 Button 内容的样式 (内置样式可被覆盖; align决定文本对齐方向; 覆盖disabled下的背景色和文本颜色，使用当前主题的默认颜色)
    const oStyle = computed(() => {
      return Object.assign(
        { flex: 'none', width: '110px', cursor: 'default' },
        attrs.style,
        {
          textAlign: props.labelAlign,
          backgroundColor: token.value.colorBgContainer,
          color: token.value.colorText,
        },
      )
    })

    return () => {
      const deepLayout = deepLayoutRef.value
      const {
        layout = deepLayout.layout ?? 'horizontal',
        wrapperAlign = deepLayout.wrapperAlign ?? 'left',
        wrapperWrap = deepLayout.wrapperWrap,
        wrapperStyle = {},
        fullness = deepLayout.fullness,
        addonBefore,
        addonAfter,
        size = deepLayout.size,
        extra,
        feedbackText,
        feedbackLayout = deepLayout.feedbackLayout ?? 'loose',
        feedbackStatus,
        feedbackIcon,
        bordered = deepLayout.bordered,
        inset = deepLayout.inset,
        // tooltip,
        // asterisk,
      } = props

      const formatChildren
        = feedbackLayout === 'popover'
          ? (
            <AntdPopover
              autoAdjustOverflow
              placement="top"
              content={
                <div
                  class={{
                    [`${prefixCls}-${feedbackStatus}-help`]: !!feedbackStatus,
                    [`${prefixCls}-help`]: true,
                    [hashId.value]: true,
                  }}
                >
                  {feedbackStatus && ['error', 'success', 'warning'].includes(feedbackStatus)
                    ? (
                      <span style={{ marginInlineEnd: '6px' }}>{ICON_MAP[feedbackStatus]()}</span>
                      )
                    : (
                        ''
                      )}
                  {resolveComponent(feedbackText)}
                </div>
              }
            >
              <AntdSpace.Compact block={true}>
                <AntdButton disabled={true} style={oStyle.value}>
                  {formatter('field', (props.label || attrs.title) as string, -1)}
                </AntdButton>
                {slots.default?.()}
              </AntdSpace.Compact>
            </AntdPopover>
            )
          : (
            <AntdSpace.Compact block={true}>
              <AntdButton disabled={true} style={oStyle.value}>
                {formatter('field', (props.label || attrs.title) as string, -1)}
              </AntdButton>
              {slots.default?.()}
            </AntdSpace.Compact>
            )

      const renderFeedback = !!feedbackText
        && feedbackLayout !== 'popover'
        && feedbackLayout !== 'none' && (
          <div
            class={{
              [`${prefixCls}-${feedbackStatus}-help`]: !!feedbackStatus,
              [`${prefixCls}-help`]: true,
              [`${prefixCls}-help-enter`]: true,
              [`${prefixCls}-help-enter-active`]: true,
            }}
          >
            {resolveComponent(feedbackText)}
          </div>
      )

      const renderExtra = extra && <div class={`${prefixCls}-extra`}>{resolveComponent(extra)}</div>
      const renderContent = (
        <div
          class={{
            [`${prefixCls}-control`]: true,
          }}
        >
          <div class={`${prefixCls}-control-content`}>
            {addonBefore && (
              <div class={`${prefixCls}-addon-before`}>{resolveComponent(addonBefore)}</div>
            )}
            {
              <div
                class={{
                  [`${prefixCls}-control-content-component`]: true,
                  [`${prefixCls}-control-content-component-has-feedback-icon`]: !!feedbackIcon,
                }}
                style={wrapperStyle}
              >
                {formatChildren}
                {feedbackIcon && (
                  <div class={`${prefixCls}-feedback-icon`}>
                    {typeof feedbackIcon === 'string'
                      ? (
                        <i class={feedbackIcon} />
                        )
                      : (
                          resolveComponent(feedbackIcon)
                        )}
                  </div>
                )}
              </div>
            }
            {addonAfter && (
              <div class={`${prefixCls}-addon-after`}>{resolveComponent(addonAfter)}</div>
            )}
          </div>
          {renderFeedback}
          {renderExtra}
        </div>
      )
      return wrapSSR(
        <div
          data-grid-span={props.gridSpan}
          class={{
            [`${prefixCls}`]: true,
            [`${prefixCls}-layout-${layout}`]: true,
            [`${prefixCls}-${feedbackStatus}`]: !!feedbackStatus,
            [`${prefixCls}-feedback-has-text`]: !!feedbackText,
            [`${prefixCls}-size-${size}`]: !!size,
            [`${prefixCls}-feedback-layout-${feedbackLayout}`]: !!feedbackLayout,
            [`${prefixCls}-fullness`]: !!fullness || !!inset || !!feedbackIcon,
            [`${prefixCls}-inset`]: !!inset,
            [`${prefixCls}-active`]: active.value,
            [`${prefixCls}-inset-active`]: !!inset && active.value,
            [`${prefixCls}-control-align-${wrapperAlign}`]: true,
            [`${prefixCls}-control-wrap`]: !!wrapperWrap,
            [`${prefixCls}-bordered-none`]: bordered === false || !!inset || !!feedbackIcon,
            [`${hashId.value}`]: true,
          }}
          onFocus={() => {
            if (feedbackIcon || inset) {
              active.value = true
            }
          }}
          onBlur={() => {
            if (feedbackIcon || inset) {
              active.value = false
            }
          }}
        >
          {renderContent}
        </div>,
      )
    }
  },
})

const Item = connect(
  QueryBaseItem,
  mapProps(
    { validateStatus: true, title: 'label', required: true },
    (props, field) => {
      if (isVoidField(field)) { return props }
      if (!field) { return props }
      const takeMessage = () => {
        const split = (messages: any[]) => {
          return messages.reduce((buf, text, index) => {
            if (!text) { return buf }
            return index < messages.length - 1 ? buf.concat([text, ', ']) : buf.concat([text])
          }, [])
        }
        if (field.validating) { return }
        if (props.feedbackText) { return props.feedbackText }
        if (field.selfErrors.length) { return split(field.selfErrors) }
        if (field.selfWarnings.length) { return split(field.selfWarnings) }
        if (field.selfSuccesses.length) { return split(field.selfSuccesses) }
      }
      const errorMessages = takeMessage()
      return {
        feedbackText: Array.isArray(errorMessages) ? errorMessages.join(', ') : errorMessages,
        extra: props.extra || field.description,
      }
    },
    (props, field) => {
      if (isVoidField(field)) { return props }
      if (!field) { return props }
      return {
        feedbackStatus:
          field.validateStatus === 'validating'
            ? 'pending'
            : (Array.isArray(field.decorator) && field.decorator[1]?.feedbackStatus)
            || field.validateStatus,
      }
    },
    (props, field) => {
      if (isVoidField(field)) { return props }

      if (!field) { return props }
      let asterisk = false
      if (field.required && field.pattern !== 'readPretty') {
        asterisk = true
      }
      if ('asterisk' in props) {
        asterisk = props.asterisk
      }
      return {
        asterisk,
      }
    },
  ),
)

export const QueryItem = composeExport(Item, {
  BaseItem: QueryBaseItem,
})

export default QueryItem
