// This is pure eye candy based on https://codepen.io/Libor_G/pen/JyJzjb

import React from 'react'
import propTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'

class Card extends React.PureComponent {
  static propTypes = {
    digit: propTypes.number.isRequired,
    classNames: propTypes.array.isRequired
  }
  render () {
    const { classNames, digit } = this.props
    return (
      <div className={classNames.join(' ')}>
        <span>{digit}</span>
      </div>
    )
  }
}

export class FlipDisplay extends React.Component {
  static propTypes = {
    digit: propTypes.number,
    classes: propTypes.object.isRequired
  }

  static defaultProps = {
    digit: 0
  }

  state = {
    shuffle: false
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.digit !== this.props.digit
  }
  shuffle () {
    this.setState(state => ({
      shuffle: !state.shuffle
    }))
  }
  componentDidMount () {
    this.shuffle()
  }

  componentDidUpdate () {
    this.shuffle()
  }

  render () {
    const { digit, classes } = this.props
    const { shuffle } = this.state

    const now = digit
    const before = digit > 1 ? digit - 1 : 0

    // shuffle digits
    const digit1 = shuffle ? before : now
    const digit2 = !shuffle ? before : now

    // shuffle animations
    const animation1 = shuffle ? classes.fold : classes.unfold
    const animation2 = !shuffle ? classes.fold : classes.unfold

    return (
      <div className={classes.flipDisplay}>
        <Card
          classNames={[classes.card, classes.staticCard, classes.upperCard]}
          digit={now}
        />
        <Card
          classNames={[classes.card, classes.staticCard, classes.lowerCard]}
          digit={before}
        />
        <Card
          classNames={[
            classes.card,
            classes.animatedCard,
            classes.upperCard,
            animation1
          ]}
          digit={digit1}
        />
        <Card
          classNames={[
            classes.card,
            classes.animatedCard,
            classes.lowerCard,
            animation2
          ]}
          digit={digit2}
        />
      </div>
    )
  }
}

const styles = theme => ({
  flipDisplay: {
    display: 'block',
    position: 'relative',
    height: '2em',
    fontSize: '5em',
    fontFamily:
      '"Lucida Console", Monaco, "Roboto Mono", "Droid Sans Mono", monospace',
    perspectiveOrigin: '50% 50%',
    perspective: 300,
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3]
  },
  card: {
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: '50%',
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
    '& > span': {
      padding: '0 0.3em',
      minWidth: '2em',
      textAlign: 'center'
    }
  },
  upperCard: {
    alignItems: 'flex-end',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    '& > span': {
      transform: 'translateY(50%)'
    }
  },
  lowerCard: {
    alignItems: 'flex-start',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    '& > span': {
      transform: 'translateY(-50%)'
    }
  },
  animatedCard: {
    justifyContent: 'center',
    position: 'absolute',
    left: '0',
    width: '100%',
    height: '50%',
    overflow: 'hidden',
    backfaceVisibility: 'hidden'
  },
  unfold: {
    top: '50%',
    alignItems: 'flex-start',
    transformOrigin: '50% 0%',
    transform: 'rotateX(180deg)',
    backgroundColor: 'white',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderTopColor: 'transparent',
    animation:
      'unfold 0.6s cubic-bezier(0.455, 0.03, 0.515, 0.955) 0s 1 normal forwards',
    transformStyle: 'preserve-3d',
    '& > span': {
      transform: 'translateY(-50%)'
    }
  },
  fold: {
    top: '0%',
    alignItems: 'flex-end',
    transformOrigin: '50% 100%',
    transform: 'rotateX(0deg)',
    backgroundColor: 'white',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    borderBottomColor: 'transparent',
    animation:
      'fold 0.6s cubic-bezier(0.455, 0.03, 0.515, 0.955) 0s 1 normal forwards',
    transformStyle: 'preserve-3d',
    '& > span': {
      transform: 'translateY(50%)'
    }
  },
  '@global': {
    '@keyframes fold': {
      '0%': {
        W: 'rotateX(0deg)',
        transform: 'rotateX(0deg)'
      },
      '100%': {
        W: 'rotateX(-180deg)',
        transform: 'rotateX(-180deg)'
      }
    },
    '@keyframes unfold': {
      '0%': {
        W: 'rotateX(180deg)',
        transform: 'rotateX(180deg)'
      },
      '100%': {
        W: 'rotateX(0deg)',
        transform: 'rotateX(0deg)'
      }
    }
  }
})

export default withStyles(styles)(FlipDisplay)
