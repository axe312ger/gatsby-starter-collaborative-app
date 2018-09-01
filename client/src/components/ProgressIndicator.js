import React from 'react'
import propTypes from 'prop-types'

import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  progress: {
    flex: 1,
    textAlign: 'center',
    selfAlign: 'center'
  }
}
class ProgressIndicator extends React.PureComponent {
  static propTypes = {
    text: propTypes.string,
    classes: propTypes.object.isRequired
  }
  render () {
    const { text, classes } = this.props
    return (
      <div className={classes.progress}>
        <CircularProgress />
        {text && <p>{text}</p>}
      </div>
    )
  }
}

export default withStyles(styles)(ProgressIndicator)
