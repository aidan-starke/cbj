import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/antd.css'
import { ThemeSwitcherProvider } from 'react-css-theme-switcher'
import { MemoryRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`,
}

const prevTheme = window.localStorage.getItem('theme')

ReactDOM.render(
  <React.StrictMode>
    <Router
      initialEntries={['/', '/account', '/bag', '/play']}
    >
      <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme ? prevTheme : 'light'}>
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeSwitcherProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
