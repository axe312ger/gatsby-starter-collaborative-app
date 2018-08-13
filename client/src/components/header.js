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
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import HomeIcon from '@material-ui/icons/Home'
import ViewListIcon from '@material-ui/icons/ViewList'
import AuthIcon from '@material-ui/icons/PowerSettingsNew'

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

  state = {
    drawerOpen: false
  }

  constructor (props) {
    super(props)
    this.toggleDrawer = this.toggleDrawer.bind(this)
  }

  toggleDrawer () {
    const { drawerOpen } = this.state
    this.setState({
      drawerOpen: !drawerOpen
    })
  }

  render () {
    const { siteTitle, classes } = this.props
    const { drawerOpen } = this.state
    return (
      <>
        <SwipeableDrawer
          open={drawerOpen}
          onClose={this.toggleDrawer}
          onOpen={this.toggleDrawer}
        >
          <List component='nav'>
            <ListItem onClick={this.toggleDrawer} component={Link} to={`/`}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary='Home' />
            </ListItem>
            <ListItem onClick={this.toggleDrawer} component={Link} to={`/app`}>
              <ListItemIcon>
                <ViewListIcon />
              </ListItemIcon>
              <ListItemText primary='App' />
            </ListItem>
            <SessionConsumer>
              {({ jwt }) =>
                jwt ? (
                  <ListItem onClick={logout}>
                    <ListItemIcon>
                      <AuthIcon />
                    </ListItemIcon>
                    <ListItemText primary='Logout' />
                  </ListItem>
                ) : (
                  <ListItem onClick={login}>
                    <ListItemIcon>
                      <AuthIcon />
                    </ListItemIcon>
                    <ListItemText primary='Login' onClick={this.toggleDrawer} />
                  </ListItem>
                )
              }
            </SessionConsumer>
          </List>
        </SwipeableDrawer>
        <AppBar position='static'>
          <Toolbar className={classes.root}>
            <div className={classes.flex}>
              <IconButton
                className={classes.menuButton}
                onClick={this.toggleDrawer}
                color='inherit'
                aria-label='Menu'
              >
                <MenuIcon />
              </IconButton>
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
      </>
    )
  }
}

export default withStyles(styles)(Header)
