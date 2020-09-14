import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import { Suspense, lazy } from "react";
import './custom.css'
import Loader from './components/Loader';

const gridLayout = lazy(() => import("./components/GridLayout/index"));

const appResult = lazy(() => import("./components/AppResult/index"));

export default () => (
    <Suspense fallback={<Loader isActive={true} />}>
        <Layout>
            <Route exact path='/' component={gridLayout} />
            <Route exact path='/QResults' component={appResult} />
        </Layout>
    </Suspense>
);
