import React from 'react'
import { Link } from 'gatsby'

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import HomeIcon from '@material-ui/icons/Home'
import ViewListIcon from '@material-ui/icons/ViewList'
import AuthIcon from '@material-ui/icons/PowerSettingsNew'

import { login, logout } from '../utils/auth-service'

import { SessionConsumer } from './session'

export default class Drawer extends React.PureComponent {
  render () {
    return (
      <SessionConsumer>
        {({ jwt, drawerOpen, toggleDrawer }) => (
          <SwipeableDrawer
            open={drawerOpen}
            onClose={toggleDrawer}
            onOpen={toggleDrawer}
          >
            <List component='nav'>
              <ListItem onClick={toggleDrawer} component={Link} to={`/`}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary='Home' />
              </ListItem>
              <ListItem onClick={toggleDrawer} component={Link} to={`/app`}>
                <ListItemIcon>
                  <ViewListIcon />
                </ListItemIcon>
                <ListItemText primary='App' />
              </ListItem>
              {jwt ? (
                <ListItem onClick={logout}>
                  <ListItemIcon>
                    <AuthIcon />
                  </ListItemIcon>
                  <ListItemText primary='Logout' onClick={toggleDrawer} />
                </ListItem>
              ) : (
                <ListItem onClick={login}>
                  <ListItemIcon>
                    <AuthIcon />
                  </ListItemIcon>
                  <ListItemText primary='Login' onClick={toggleDrawer} />
                </ListItem>
              )}
            </List>
          </SwipeableDrawer>
        )}
      </SessionConsumer>
    )
  }
}
