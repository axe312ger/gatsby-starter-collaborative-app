import React from 'react'
import propTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'

import AppNavigation from './app-navigation'
import AppFloatingActionButtons from './app-floating-action-buttons'

const styles = theme => ({
  wrapper: {
    height: 'calc(100vh - 56px)',
    display: 'grid',
    gridTemplateRows: '1fr auto',
    gridTemplateColumns: '100%',
    [theme.breakpoints.up('sm')]: {
      height: `calc(100vh - 56px - ${theme.spacing.unit * 2}px)`,
      boxShadow: theme.shadows[1]
    }
  },
  mainArea: {
    display: 'grid',
    position: 'relative',
    overflow: 'hidden'
  },
  scrollWrapper: {
    overflow: 'auto',
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    [theme.breakpoints.up('sm')]: {
      padding: 0
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
        <div className={classes.wrapper}>
          <div className={classes.mainArea}>
            <div className={classes.scrollWrapper}>{children}</div>
            <AppFloatingActionButtons />
          </div>
          <AppNavigation />
        </div>
      </>
    )
  }
}

export default withStyles(styles)(AppLayout)
