import React from 'react'
import propTypes from 'prop-types'
import { Link } from 'gatsby'

import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import TouchAppIcon from '@material-ui/icons/TouchApp'

class ClickerList extends React.Component {
  static propTypes = {
    connection: propTypes.object.isRequired
  }
  constructor (props) {
    super(props)
    this.state = { clickers: [] }
  }
  componentDidMount () {
    const { connection } = this.props
    const query = connection.createFetchQuery('examples', {
      // numClicks: 137 @todo scope by subscription
      $sort: { numClicks: -1 }
    })
    query.on('ready', () => this.setState({ clickers: query.results }))
    query.on('error', err => alert(err.message))
  }
  render () {
    const clickers = this.state.clickers.map(clickerDoc => {
      const { id, data } = clickerDoc
      const { name, numClicks } = data
      return (
        <div key={clickerDoc.id}>
          <ListItem component={Link} to={`/app/clickers/${id}`}>
            <ListItemIcon>
              <TouchAppIcon />
            </ListItemIcon>
            <ListItemText>{`${name} with ${numClicks} clicks`}</ListItemText>
          </ListItem>
          <Divider />
        </div>
      )
    })
    return (
      <>
        <h1>Your Clickers:</h1>
        <List>{clickers}</List>
        <Button component={Link} to='/app/add'>
          Add new clicker
        </Button>
      </>
    )
  }
}

export default ClickerList
