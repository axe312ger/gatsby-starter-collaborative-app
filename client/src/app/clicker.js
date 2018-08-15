import React from 'react'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/ExposurePlus1'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = {
  buttons: {
    display: 'grid',
    gridGap: '24px',
    justifyContent: 'center',
    justifyItems: 'center'
  }
}

class Clicker extends React.Component {
  static propTypes = {
    connection: PropTypes.object.isRequired,
    docId: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired
  }
  state = {
    doc: null,
    value: 0
  }
  constructor (props) {
    super(props)

    this.increment = this.increment.bind(this)
    this.dataUpdated = this.dataUpdated.bind(this)

    const { connection, docId } = props
    const doc = connection.get('examples', docId)

    doc.on('op', () => this.dataUpdated())

    doc.fetch(err => {
      if (err) {
        alert(err.message)
        return
      }
      if (doc.type === null) {
        doc.create({ numClicks: 0 })
      }
      doc.subscribe(this.dataUpdated)
    })

    this.state = {
      doc
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return this.state.value !== nextState.value
  }
  increment () {
    this.state.doc.submitOp([{ p: ['numClicks'], na: 1 }])
  }
  dataUpdated (err) {
    if (err) {
      console.error(err)
      return
    }
    this.setState({ value: this.state.doc.data.numClicks })
  }
  render () {
    const { classes } = this.props
    const { doc } = this.state

    if (!doc.data) {
      return <CircularProgress />
    }

    const { name } = doc.data
    const times = this.state.value

    return (
      <div>
        <h1>{name}</h1>
        <p>{`Clicked ${times} times.`}</p>
        <div className={classes.buttons}>
          <Button
            variant='fab'
            color='primary'
            aria-label='add'
            onClick={this.increment}
          >
            <AddIcon />
          </Button>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Clicker)
