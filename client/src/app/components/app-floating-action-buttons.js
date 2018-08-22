import React from 'react'
import propTypes from 'prop-types'
import { Location } from '@reach/router'
import { navigate } from 'gatsby'

import { withStyles } from '@material-ui/core/styles'

import Zoom from '@material-ui/core/Zoom'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'

const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 4,
    right: theme.spacing.unit * 4
  }
})

class FloatingActionButtons extends React.Component {
  static propTypes = {
    classes: propTypes.object.isRequired,
    theme: propTypes.object.isRequired,
    location: propTypes.object.isRequired
  }
  state = {
    activeFab: null
  }
  static getDerivedStateFromProps ({ location }, state) {
    state.activeFab = null

    if (/^\/app\/?$/.test(location.pathname)) {
      state.activeFab = 'addPublic'
    }

    if (/^\/app\/private\/?$/.test(location.pathname)) {
      state.activeFab = 'addPrivate'
    }

    if (/^\/app\/clickers\/.+/.test(location.pathname)) {
      state.activeFab = 'edit'
    }

    return state
  }
  shouldComponentUpdate (nextProps, nextState) {
    return nextState.activeFab !== this.state.activeFab
  }
  render () {
    const { classes, theme } = this.props
    const fabs = [
      {
        id: 'addPublic',
        color: 'primary',
        className: classes.fab,
        icon: <AddIcon />,
        callback: () => {
          navigate(`/app/add`)
        }
      },
      {
        id: 'addPrivate',
        color: 'primary',
        className: classes.fab,
        icon: <AddIcon />,
        callback: () => {
          navigate(`/app/private/add`)
        }
      },
      {
        id: 'edit',
        color: 'secondary',
        className: classes.fab,
        icon: <EditIcon />,
        callback: () => {
          alert('@todo')
        }
      }
    ]

    const transitionDuration = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen
    }

    return (
      <>
        {fabs.map((fab, index) => (
          <Zoom
            key={fab.id}
            in={this.state.activeFab === fab.id}
            timeout={transitionDuration}
            style={{
              transitionDelay: `${
                this.state.value === index ? transitionDuration.exit : 0
              }ms`
            }}
            unmountOnExit
          >
            <Button
              variant='fab'
              className={fab.className}
              color={fab.color}
              onClick={fab.callback}
            >
              {fab.icon}
            </Button>
          </Zoom>
        ))}
      </>
    )
  }
}

const FabStyled = withStyles(styles, { withTheme: true })(FloatingActionButtons)

class FabWrapper extends React.PureComponent {
  render () {
    return (
      <Location>{({ location }) => <FabStyled location={location} />}</Location>
    )
  }
}

export default FabWrapper
