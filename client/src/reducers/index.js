import form from './form'
// import notification from './notification'
import { combineReducers } from 'redux'
import smsSend from './smsSend'

const rootReducer = combineReducers({
  form,
  // notification,
  smsSend
})

export default rootReducer
