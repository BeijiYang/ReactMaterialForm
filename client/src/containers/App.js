import React, { Component } from 'react'
import SignupContainer from './SignupFormContainer'
import { Provider } from 'react-redux'
import store from '../store/store'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import cyan from 'material-ui/colors/cyan'
import green from 'material-ui/colors/green'
import red from 'material-ui/colors/red'

const theme = createMuiTheme({
  palette: {
    primary: {
      ...cyan,
      A500: '#00BCD4'
    },
    secondary: {
      ...green,
      A400: '#00e677'
    },
    error: red
  }
})

class App extends Component {
  render () {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <SignupContainer />
        </Provider>
      </MuiThemeProvider>
    )
  }
}

export default App
