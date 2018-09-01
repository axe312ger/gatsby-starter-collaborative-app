import React from 'react'
import { Location, navigate } from '@reach/router'

import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import LockIcon from '@material-ui/icons/Lock'
import GroupIcon from '@material-ui/icons/Group'

const actionMap = {
  all: {
    path: '/app',
    regex: /^\/app\/?$/
  },
  private: {
    path: '/app/private',
    regex: /\/private$/
  }
}

class AppNavigation extends React.PureComponent {
  handleChange = (event, value) => {
    navigate(actionMap[value].path)
  }

  render () {
    return (
      <Location>
        {({ location }) => {
          // determine active navigation action based on actionMap
          let value
          Object.keys(actionMap).forEach((actionId) => {
            const action = actionMap[actionId]
            if (action.regex.test(location.pathname)) {
              value = actionId
            }
          })

          return (
            <BottomNavigation
              value={value}
              onChange={this.handleChange}
              showLabels
            >
              <BottomNavigationAction
                label='All Clickers'
                value={'all'}
                icon={<GroupIcon />}
              />
              <BottomNavigationAction
                label='Your Clickers'
                value={'private'}
                icon={<LockIcon />}
              />
            </BottomNavigation>
          )
        }}
      </Location>
    )
  }
}

export default AppNavigation
