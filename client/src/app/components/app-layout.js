import React from 'react'
import propTypes from 'prop-types'

import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'

import AppNavigation from './app-navigation'
import AppFloatingActionButtons from './app-floating-action-buttons'

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
    },
    '& > * ': {
      flex: 1,
      flexDirection: 'column',
      display: 'flex'
    }
  },
  mobileWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  mainAreaWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  mainArea: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    position: 'relative'
  },
  scrollWrapper: {
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

    const AppMainArea = (
      <div className={classes.mainAreaWrapper}>
        <div className={classes.mainArea}>
          <div className={classes.scrollWrapper}>{children}</div>
          <AppFloatingActionButtons />
        </div>
        <AppNavigation />
      </div>
    )

    return (
      <>
        <div className={classes.mobileWrapper}>{AppMainArea}</div>
        <div className={classes.desktopWrapper}>
          <Paper>{AppMainArea}</Paper>
        </div>
      </>
    )
  }
}

export default withStyles(styles)(AppLayout)
