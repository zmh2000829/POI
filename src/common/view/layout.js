import React, {Component} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import Loadable from 'react-loadable';
import {ROUTER_PATHS} from 'common/constant';

import Sidebar from 'common/component/layout/sidebar';
import Header from 'common/component/layout/Header';
import Footer from 'common/component/layout/Footer';

import 'react-virtualized/styles.css';
import 'common/style/layout.less';

// pgi view
const PgiHomePage = Loadable({
    loader: () => import('pgi/view/homepage'),
    loading: () => null
});
const PgiCaseAdd = Loadable({
    loader: () => import('pgi/view/case/add'),
    loading: () => null
});
const PgiCaseStatus = Loadable({
    loader: () => import('pgi/view/case/status'),
    loading: () => null
});
const PgiCaseReport = Loadable({
    loader: () => import('pgi/view/case/report'),
    loading: () => null
});
const PgiExample = Loadable({
    loader: () => import('pgi/view/example'),
    loading: () => null
});
const PgiStatustics = Loadable({
    loader: () => import('pgi/view/statistics'),
    loading: () => null
});
const PgiFaq = Loadable({
    loader: () => import('pgi/view/faq'),
    loading: () => null
});

@inject('layout')
@observer
class Layout extends Component {
    render() {
        const {layout: {fold_sidebar}} = this.props;
        return (
            <div className={['layout', fold_sidebar ? 'fold' : undefined].join(' ')}>
                <Sidebar/>
                <div className="g-bd">
                    <Header/>
                    <div className="g-mn">
                        <Switch>
                            <Redirect exact from="/" to={ROUTER_PATHS.PGI_HOME_PAGE}/>
                            <Route path={ROUTER_PATHS.PGI_HOME_PAGE} component={PgiHomePage}/>
                            <Route path={ROUTER_PATHS.PGI_CASE_ADD} component={PgiCaseAdd}/>
                            <Route path={ROUTER_PATHS.PGI_STATISTICS} component={PgiStatustics}/>
                            <Route path={ROUTER_PATHS.PGI_FAQ} component={PgiFaq}/>
                            <Route path={ROUTER_PATHS.PGI_EXAMPLE} component={PgiExample}/>
                            <Route path={ROUTER_PATHS.PGI_CASE_STATUS} component={PgiCaseStatus}/>
                            <Route path={ROUTER_PATHS.PGI_CASE_REPORT} component={PgiCaseReport}/>
                        </Switch>
                    </div>
                    <Footer/>
                </div>
            </div>
        );
    }
}

export default Layout;


