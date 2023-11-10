import { LoadingOutlined } from '@ant-design/icons-vue'

export const SELECT2_ABORT_REASON = 'DROPDOWN_HIDDEN'

// 外部传入的 props 属性 或 具名插槽，可直接被覆盖
export const defaultNotFoundContent = (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'rgba(0, 0, 0, 0.25)', cursor: 'default' }} >
    没有数据？尝试输入关键词检索
  </div >
)

// 通过 slots 自定义 dom 结构
export const SELECT2_IDENTIFIER_NOMORE = 'SELECT2_IDENTIFIER_NOMORE'
export const deafultRequestNoMore = (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    没有更多数据了
  </div >
)

// 通过 slots 自定义 dom 结构
export const SELECT2_IDENTIFIER_PROGRESS = 'SELECT2_IDENTIFIER_PROGRESS'
export const deafultRequestInProgress = (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <LoadingOutlined />
    <span style={{ marginLeft: '8px' }}>
      数据加载中...
    </span>
  </div >
)
