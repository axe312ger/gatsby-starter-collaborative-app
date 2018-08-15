import React from 'react'
import { Location, navigate } from '@reach/router'

import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import ViewListIcon from '@material-ui/icons/ViewList'
import AddIcon from '@material-ui/icons/ExposurePlus1'

const actionMap = {
  app: {
    path: '/app',
    regex: /^\/app/
  },
  add: {
    path: '/app/add',
    regex: /\/add$/
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
          Object.keys(actionMap).forEach(actionId => {
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
                label='App'
                value={'app'}
                icon={<ViewListIcon />}
              />
              <BottomNavigationAction
                label='Add Clicker'
                value={'add'}
                icon={<AddIcon />}
              />
            </BottomNavigation>
          )
        }}
      </Location>
    )
  }
}

export default AppNavigation
