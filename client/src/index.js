import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/antd.css'
import { ThemeSwitcherProvider } from 'react-css-theme-switcher'
import { MemoryRouter as Router } from 'react-router-dom'

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`,
}

const prevTheme = window.localStorage.getItem('theme')

ReactDOM.render(
  <React.StrictMode>
    <Router
      initialEntries={['/', '/create', '/dashboard', '/home', '/assets']}
    >
      <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme ? prevTheme : 'light'}>
        <App />
      </ThemeSwitcherProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
