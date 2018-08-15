import React from 'react'
import propTypes from 'prop-types'

import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  desktopWrapper: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  mobileWrapper: {
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  }
})

class AppLayout extends React.PureComponent {
  static propTypes = {
    classes: propTypes.object.isRequired,
    children: propTypes.node.isRequired
  }
  render () {
    const { classes, children } = this.props

    return (
      <>
        <div className={classes.mobileWrapper}>{children}</div>
        <Paper className={classes.desktopWrapper}>{children}</Paper>
      </>
    )
  }
}

export default withStyles(styles)(AppLayout)
