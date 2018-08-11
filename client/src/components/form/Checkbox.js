// Based on: https://codesandbox.io/s/2z5y03y81r

import React from 'react'
import propTypes from 'prop-types'
import Checkbox from '@material-ui/core/Checkbox'

export default class MaterialCheckbox extends React.PureComponent {
  static propTypes = {
    input: propTypes.object.isRequired,
    meta: propTypes.object.isRequired,
    InputProps: propTypes.object
  }
  static defaultProps = {
    InputProps: {}
  }
  render () {
    const {
      InputProps,
      input: { checked, name, onChange, ...restInput },
      meta,
      ...rest
    } = this.props

    return (
      <Checkbox
        {...rest}
        name={name}
        InputProps={{ ...InputProps, ...restInput }}
        onChange={onChange}
        checked={!!checked}
      />
    )
  }
}
