import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import { login, logout } from '../utils/AuthService'
import { SessionConsumer } from '../components/session'

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
    siteTitle: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired
  }

  render () {
    const { siteTitle, classes } = this.props
    return (
      <AppBar position='static'>
        <Toolbar className={classes.root}>
          <div className={classes.flex}>
            <IconButton
              className={classes.menuButton}
              onClick={this.toggleDrawer()}
              color='inherit'
              aria-label='Menu'
            >
              <MenuIcon />
            </IconButton>
            <SwipeableDrawer
              open={this.state.drawerOpen}
              onClose={this.toggleDrawer()}
              onOpen={this.toggleDrawer()}
            >
              <List component='nav'>
                <ListItem
                  onClick={this.toggleDrawer()}
                  component={Link}
                  to={`/`}
                >
                  <ListItemText primary='Home' />
                </ListItem>
                <ListItem
                  onClick={this.toggleDrawer()}
                  component={Link}
                  to={`/app`}
                >
                  <ListItemText primary='Clicker' />
                </ListItem>
                <SessionConsumer>
                  {({ jwt }) =>
                    jwt ? (
                      <ListItem onClick={logout} component={Link}>
                        <ListItemText primary='Logout' />
                      </ListItem>
                    ) : (
                      <ListItem onClick={logout} component={Link}>
                        <ListItemText
                          primary='Login'
                          onClick={this.toggleDrawer()}
                        />
                      </ListItem>
                    )
                  }
                </SessionConsumer>
              </List>
            </SwipeableDrawer>
            <Button component={Link} to='/' size='large' color='inherit'>
              {siteTitle}
            </Button>
          </div>
          <div>
            <SessionConsumer>
              {({ jwt }) =>
                jwt ? (
                  <Button onClick={logout} color='inherit'>
                    Logout
                  </Button>
                ) : (
                  <Button onClick={login} color='inherit'>
                    Login / Register
                  </Button>
                )
              }
            </SessionConsumer>
          </div>
        </Toolbar>
      </AppBar>
    )
  }
}

export default withStyles(styles)(Header)
