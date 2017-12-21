import React, { Component } from 'react'
import { connect } from 'react-redux'
import SmsSend from '../components/SmsSend/SmsSend'
import { getSmsSendState } from '../selectors/commonSelectors.js'
import {
  sendMsg,
  countdown,
  readyToSendMsg,
  smsSendInit
} from '../actions/smsSendAction'
import propTypes from 'prop-types'

class SmsSendContainer extends Component {

  _mounted = false

  componentDidMount() {
    this._mounted = true
  }

  componentWillUnmount() {
    this._mounted = false
    this.props.smsSendInit()
  }

  timer = () => {
      let promise = new Promise((resolve, reject) => {
        let setTimer = setInterval(
          () => {
            this.props.countdown()
            if (this.props.smsSendState.second <= 0) {
              this.props.readyToSendMsg()
              // console.log(this.props.smsSendState)
              resolve(setTimer)
            }
            if (!this._mounted) {
              reject(setTimer)
            }
          }
          , 1000)
      })

      promise.then((setTimer) => {
        clearInterval(setTimer)
        console.log('CLEAR INTERVAL')
      })
      .catch(
        (setTimer) => {
          clearInterval(setTimer)
          console.log('CLEAR INTERVAL IN REJECTION')
        }
      )
  }

  sendMsg = () => {
    if (!this.props.phoneNumIsValid) {
      console.log('phoneNum is not valid')
      return
    }
    // action
    this.props.sendMsg(this.props.phoneNum)
    this.timer()
  }

  render () {
    return (
      <SmsSend
        label={this.props.smsSendState.alreadySendMsg ? this.props.smsSendState.second : '发送'}
        disabled={this.props.smsSendState.alreadySendMsg ? true : false}
        raised={this.props.smsSendState.alreadySendMsg ? true : false}
        onClick={this.sendMsg}
       />
    )
  }
}

SmsSendContainer.propTypes = {
  sendMsg: propTypes.func.isRequired,
  countdown: propTypes.func.isRequired,
  readyToSendMsg: propTypes.func.isRequired,
  smsSendInit: propTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  smsSendState: getSmsSendState(state)
})

export default connect(mapStateToProps, {
  sendMsg,
  countdown,
  readyToSendMsg,
  smsSendInit
})(SmsSendContainer)
