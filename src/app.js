import React from 'react';
import {HashRouter, Route} from 'react-router-dom';
import Index from 'common/view';
import 'common/lib/echarts-local';
import 'common/style/common.less';

const App = () => {
    return (
        <HashRouter>
            <Route component={Index}/>
        </HashRouter>
    );
};

export default App;
