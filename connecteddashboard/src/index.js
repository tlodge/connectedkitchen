import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


import {Provider} from 'react-redux'
import store from './app/store'

function MyApp({ Component, pageProps }) {
  return (<Provider store={store}>
    <Component {...pageProps} />
    </Provider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <MyApp Component={App} pageProps={{}} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
