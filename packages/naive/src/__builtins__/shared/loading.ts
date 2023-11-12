import { useMessage } from 'naive-ui'

export async function loading(loadingText = 'Loading...',
  processor: () => Promise<any>) {
  const message = useMessage()

  let loadingInstance = null
  const loading = setTimeout(() => {
    loadingInstance = message.loading(loadingText, { })
  }, 100)
  try {
    return await processor()
  }
  finally {
    loadingInstance?.close()
    clearTimeout(loading)
  }
}
