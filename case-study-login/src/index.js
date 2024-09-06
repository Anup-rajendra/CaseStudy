import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { ApolloProvider } from '@apollo/client';
import client from './Apollo/ApolloClient'; 
import { BrowserRouter as Router  } from 'react-router-dom';
 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     
    <AuthProvider>
    <ApolloProvider client={client}>
    <Router>
        <App />
        </Router>
    </ApolloProvider>
    </AuthProvider>
   
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
