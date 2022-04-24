import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'mobx-react';
import store from 'common/store';
import App from './app';

ReactDOM.render(
    <Provider {...store}>
        <App/>
    </Provider>,
    document.getElementById('app')
);
