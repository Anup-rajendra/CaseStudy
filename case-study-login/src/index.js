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

     
    <AuthProvider>
    <ApolloProvider client={client}>
    <Router>
        <App />
        </Router>
    </ApolloProvider>
    </AuthProvider>
   
  
);

reportWebVitals();
