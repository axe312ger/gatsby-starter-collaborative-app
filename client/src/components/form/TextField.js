// Based on: https://codesandbox.io/s/2z5y03y81r

import React from 'react'
import propTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
export default class MaterialTextField extends React.PureComponent {
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
      input: { name, onChange, value, ...restInput },
      meta,
      ...rest
    } = this.props
    return (
      <TextField
        {...rest}
        name={name}
        helperText={meta.touched ? meta.error : undefined}
        error={meta.error && meta.touched}
        InputProps={{ ...InputProps, ...restInput }}
        onChange={onChange}
        value={value}
      />
    )
  }
}
