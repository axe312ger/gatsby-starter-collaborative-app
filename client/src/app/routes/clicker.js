import React from 'react'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/ExposurePlus1'
import LockIcon from '@material-ui/icons/Lock'
import GroupIcon from '@material-ui/icons/Group'
import { withStyles } from '@material-ui/core/styles'

import ProgressIndicator from '../../components/progress-indicator'
import AppLayout from '../components/app-layout'
import FlipDisplay from '../components/flip-display'

// https://material-ui.com/customization/css-in-js/
// https://material-ui.com/customization/default-theme/
const styles = theme => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.unit * 2,
    '& > h1': {
      marginBottom: 0
    }
  },
  icon: {
    width: '1.25em',
    height: '1.25em',
    padding: theme.spacing.unit,
    margin: '0 0.3em 0 0',
    color: theme.palette.background.paper,
    background: theme.palette.grey.A400,
    borderRadius: '100%'
  },
  subline: {
    color: theme.palette.grey.A700,
    fontSize: '0.8rem'
  },
  buttons: {
    display: 'grid',
    gridGap: '24px',
    justifyContent: 'center',
    justifyItems: 'center'
  },
  times: {
    display: 'flex',
    justifyContent: 'center',
    margin: `${theme.spacing.unit * 4}px 0`
  }
})

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
      return (
        <AppLayout>
          <ProgressIndicator text='Loading Clicker...' />
        </AppLayout>
      )
    }

    const { name, private: prvt } = doc.data
    const times = this.state.value

    return (
      <AppLayout>
        <div className={classes.header}>
          {prvt ? (
            <LockIcon className={classes.icon} />
          ) : (
            <GroupIcon className={classes.icon} />
          )}
          <h1>{name}</h1>
        </div>

        <div className={classes.subline}>
          {prvt ? 'This is your private Clicker' : 'This is a public Clicker'}
        </div>
        <div className={classes.times}>
          <FlipDisplay digit={times} />
        </div>
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
      </AppLayout>
    )
  }
}

export default withStyles(styles)(Clicker)
