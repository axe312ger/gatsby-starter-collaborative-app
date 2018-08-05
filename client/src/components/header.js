import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

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
