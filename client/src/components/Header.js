import React from 'react'
import propTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import BackIcon from '@material-ui/icons/ArrowBack'

import { login, logout } from '../utils/api/auth-service'
import { SessionConsumer } from '../utils/api/session'

const styles = {
  root: {
    margin: '0 auto',
    maxWidth: 960,
    width: '100%'
  },
  flex: {
    flex: 1
  }
}

class Header extends React.PureComponent {
  static propTypes = {
    siteTitle: propTypes.string.isRequired,
    classes: propTypes.object.isRequired
  }

  render () {
    const { siteTitle, classes } = this.props
    return (
      <SessionConsumer>
        {({ toggleDrawer }) => (
          <AppBar position='static'>
            <Toolbar className={classes.root}>
              <div className={classes.flex}>
                <IconButton
                  className={classes.menuButton}
                  onClick={toggleDrawer}
                  color='inherit'
                  aria-label='Menu'
                >
                  <MenuIcon />
                </IconButton>
                <IconButton
                  className={classes.menuButton}
                  onClick={() => window.history.back()}
                  color='inherit'
                  aria-label='Menu'
                >
                  <BackIcon />
                </IconButton>
                {siteTitle}
              </div>
              <div>
                <SessionConsumer>
                  {({ jwt }) =>
                    jwt ? (
                      <Button
                        onClick={logout}
                        aria-label='Logout'
                        color='inherit'
                      >
                        Logout
                      </Button>
                    ) : (
                      <Button
                        onClick={login}
                        aria-label='Login'
                        color='inherit'
                      >
                        Login / Register
                      </Button>
                    )
                  }
                </SessionConsumer>
              </div>
            </Toolbar>
          </AppBar>
        )}
      </SessionConsumer>
    )
  }
}

export default withStyles(styles)(Header)
