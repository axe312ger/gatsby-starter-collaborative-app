import React from 'react'
import PropTypes from 'prop-types'
import { Link, push } from 'gatsby'

import { Form, Field } from 'react-final-form'
import slugify from 'slugify'
import nanoid from 'nanoid'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import withMobileDialog from '@material-ui/core/withMobileDialog'

import TextField from '../../components/form/TextField'
import Checkbox from '../../components/form/Checkbox'

const styles = {
  progress: {
    marginLeft: '0.5em'
  }
}

const validateName = value =>
  value && value.length < 6 && 'Come on! You can do 6 characters 🙃'

class ClickerForm extends React.PureComponent {
  static propTypes = {
    connection: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    fullScreen: PropTypes.bool.isRequired
  }
  state = {
    busy: false, // block form while async clicker creation
    error: null, // an error thrown to the error boundary
    submitError: null // an error displayed to the user within the form
  }
  constructor (props) {
    super(props)
    this.createClicker = this.createClicker.bind(this)
  }
  async createClicker (data) {
    const slug = slugify(data.name)
    const { connection } = this.props
    const docId = `${slug}~${nanoid(5)}`
    const doc = connection.get('examples', docId)
    try {
      await new Promise((resolve, reject) => {
        // @todo does this need to be client side?
        // See if clicker already exists
        doc.fetch(err => {
          if (err) return reject(err)
          // Create clicker
          doc.create({ ...data, slug, numClicks: 0 }, err => {
            if (err) return reject(err)
            resolve()
          })
        })
      })
      return doc
    } catch (err) {
      console.error(err)
      if (err.code && err.code === 4016) {
        // doc exists already, retry with different id
        return this.createClicker(data)
      }
      if (err.code && err.code >= 4000 && err.code < 5000) {
        this.setState({
          submitError: new Error('Unable to create Clicker. Please try again.')
        })
        return
      }
      throw err
    }
  }
  // Catch async errors and throw it to the error boundary
  componentWillUpdate () {
    const { error } = this.state
    if (error) {
      throw Error
    }
  }
  render () {
    const { fullScreen, classes } = this.props
    const { busy, submitError } = this.state

    // Submit handler to handle clicker creation
    const onSubmit = async values => {
      this.setState({ busy: true, submitError: null })
      try {
        const clickerDoc = await this.createClicker(values)
        push(`/app/clickers/${clickerDoc.id}`)
      } catch (error) {
        this.setState({ error })
      }

      this.setState({ busy: false })
    }

    return (
      <Dialog
        fullScreen={fullScreen}
        open
        onClose={this.handleClose}
        aria-labelledby='responsive-dialog-title'
      >
        <Form
          onSubmit={onSubmit}
          initialValues={{ private: false }}
          validate={data => {
            const errors = {}
            const nameResult = validateName(data.name)
            if (nameResult) {
              errors.name = nameResult
            }
            return errors
          }}
          render={({ handleSubmit, pristine, invalid }) => {
            return (
              <form onSubmit={handleSubmit}>
                <DialogTitle id='responsive-dialog-title'>
                  Create Clicker
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Use this form to create a new Clicker.
                  </DialogContentText>
                  {submitError && (
                    <DialogContentText>{submitError.message}</DialogContentText>
                  )}
                  <Field
                    name='name'
                    component={TextField}
                    type='text'
                    label='Clicker name'
                    autoFocus
                    margin='normal'
                    fullWidth
                    inputProps={{ maxLength: 25 }}
                    validate={validateName}
                  />
                  <FormControl component='fieldset' margin='normal'>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Field
                            name='private'
                            component={Checkbox}
                            label='Private'
                            type='checkbox'
                          />
                        }
                        label='Private Clicker'
                      />
                    </FormGroup>
                    <FormHelperText>
                      Private Clickers can only be seen and clicked by yourself.
                    </FormHelperText>
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button component={Link} to='/app'>
                    Back
                  </Button>
                  <Button
                    variant='contained'
                    color='primary'
                    type='submit'
                    disabled={pristine || invalid || busy}
                  >
                    {!busy ? (
                      'Create Clicker'
                    ) : (
                      <>
                        Creating...
                        <CircularProgress
                          className={classes.progress}
                          size={16}
                          color={'inherit'}
                        />
                      </>
                    )}
                  </Button>
                </DialogActions>
              </form>
            )
          }}
        />
      </Dialog>
    )
  }
}

export default withStyles(styles)(withMobileDialog()(ClickerForm))
