import React, { Component } from 'react'
import { connect } from 'react-redux'
import Signup from '../components/Signup'
import {
  getFormState,
  getCurrentUser
} from '../selectors/commonSelectors.js'
import {
  formErrInit,
  passwordTooShort,
  passwordIsValid,
  passwordsInconsistent,
  passwordsConsistent,
  usernameIsRequired,
  usernameIsValid,
  phoneNumNotValid,
  phoneNumIsValid,
  smsCodeIsRequired,
  smsCodeIsValid
} from '../actions/formAction'
import propTypes from 'prop-types'

class SignupContainer extends Component {

  state = {
    phoneNum: '',
    smsCode: '',
    password: '',
    passwordConsistent: ''
  }

  componentWillMount(){
    this.props.formErrInit()
    this.setState({
      phoneNum: '',
      smsCode: '',
      password: '',
      passwordConsistent: ''
    })
  }

  getPhoneNum = (phoneNum) => {
    this.setState({
      phoneNum: phoneNum
    })
    this.checkPhoneNum(phoneNum)
  }

  getSmsCode = (smsCode) => {
    this.setState({
      smsCode: smsCode
    })
    this.checkSmsCode(smsCode)
  }

  getPassword = (password) => {
    this.setState({
    password: password
    })
    this.checkPassword(password)
  }

  getPasswordConsistent = (passwordConsistent) => {
    this.setState({
      passwordConsistent: passwordConsistent
    })
    this.checkpasswordConsistent()
  }

  checkUsername = (username) => {
    if (!username) {
      this.props.usernameIsRequired()
    } else {
      this.props.usernameIsValid()
    }
  }

  checkPhoneNum = (phoneNum) => {
    const phoneNumPattern =  /^1\d{10}$/
    if (!phoneNumPattern.test(phoneNum)) {
      this.props.phoneNumNotValid()
    } else {
      this.props.phoneNumIsValid()
    }
  }

  checkPassword = (password) => {
    if (password.length < 6) {
      this.props.passwordTooShort()
    } else {
      this.props.passwordIsValid()
    }
  }

  checkpasswordConsistent = () => {
    let {password, passwordConsistent} = this.state

    if (passwordConsistent !== password) {
      this.props.passwordsInconsistent()
    } else {
      this.props.passwordsConsistent()
    }
  }

  checkSmsCode = (smsCode) => {
    if (!smsCode) {
      this.props.smsCodeIsRequired()
    } else {
      this.props.smsCodeIsValid()
    }
  }

  recheckForm = function *() {
    let userInfo = yield

    let { username, phoneNum, password, passwordConsistent, smsCode } = userInfo
    this.checkUsername(username)
    this.checkPhoneNum(phoneNum)
    this.checkSmsCode(smsCode)
    this.checkPassword(password)
    this.checkpasswordConsistent({password, passwordConsistent})

    yield

    let { phoneNumIsValid, passwordIsValid, passwordConsistentIsValid, smsCodeIsValid } = this.props.signUpState

    if (phoneNumIsValid && smsCodeIsValid && passwordIsValid && passwordConsistentIsValid) {
      console.log('通过验证')
      // 此处可以进行登录操作，将合法数据 post 给登录接口，同时将其放入 redux store 的 currentUser
      // this.props.signup(userInfo)
    } else {
      console.log('未通过验证')
    }
  }


  handleSubmit = () => {
    let recheck = this.recheckForm()
    recheck.next()

    recheck.next(this.state)
    setTimeout(() => {
      recheck.next()
      // console.log(this.props.signUpState)
    }, 50)
  }

  render () {
    return (
      <Signup
        getPhoneNum={this.getPhoneNum}
        getSmsCode={this.getSmsCode}
        getPassword={this.getPassword}
        getPasswordConsistent={this.getPasswordConsistent}
        onSubmit={this.handleSubmit}
        errorText={this.props.signUpState.testErrObj}
        phoneNumIsValid={this.props.signUpState.phoneNumIsValid}
        phoneNum={this.state.phoneNum}
      />
    )
  }
}

SignupContainer.propTypes = {
  passwordTooShort: propTypes.func.isRequired,
  passwordIsValid: propTypes.func.isRequired,
  passwordsInconsistent: propTypes.func.isRequired,
  passwordsConsistent: propTypes.func.isRequired,
  usernameIsRequired: propTypes.func.isRequired,
  usernameIsValid: propTypes.func.isRequired,
  phoneNumNotValid: propTypes.func.isRequired,
  phoneNumIsValid: propTypes.func.isRequired,
  smsCodeIsRequired: propTypes.func.isRequired,
  smsCodeIsValid: propTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  signUpState: getFormState(state)
})

export default connect(mapStateToProps, {
  formErrInit,
  passwordTooShort,
  passwordIsValid,
  passwordsInconsistent,
  passwordsConsistent,
  usernameIsRequired,
  usernameIsValid,
  phoneNumNotValid,
  phoneNumIsValid,
  smsCodeIsRequired,
  smsCodeIsValid
})(SignupContainer)
