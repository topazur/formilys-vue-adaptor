import { connect, mapProps } from '@formily/vue'

import { Input } from '../input'

import type { NInput } from 'naive-ui'

export type PasswordProps = typeof NInput

export const Password = connect(
  Input,
  mapProps(props => ({
    ...props,
    showPassword: true,
  })),
)

export default Password
