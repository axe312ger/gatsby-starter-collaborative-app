import React from 'react'
import propTypes from 'prop-types'

import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'

import AppNavigation from './app-navigation'

const styles = theme => ({
  desktopWrapper: {
    flex: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      ...theme.mixins.gutters(),
      display: 'flex',
      flexDirection: 'column',
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2
    }
  },
  mobileWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: console.log({ theme }) || '500px',
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  content: {
    flex: 1,
    overflow: 'auto',
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
})

class AppLayout extends React.PureComponent {
  static propTypes = {
    classes: propTypes.object.isRequired,
    children: propTypes.node.isRequired
  }
  render () {
    const { classes, children } = this.props

    const AppContent = (
      <>
        <div className={classes.content}>{children}</div>
        <AppNavigation />
      </>
    )

    return (
      <>
        <div className={classes.mobileWrapper}>{AppContent}</div>
        <div className={classes.desktopWrapper}>
          <Paper>{AppContent}</Paper>
        </div>
      </>
    )
  }
}

export default withStyles(styles)(AppLayout)
