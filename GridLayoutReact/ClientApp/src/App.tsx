import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import { Suspense, lazy } from "react";
import './custom.css'

const gridLayout = lazy(() => import("./components/GridLayout/index"));

export default () => (
    <Suspense fallback={<h1>Loading�</h1>}>
        <Layout>
            <Route exact path='/' component={gridLayout} />
        </Layout>
    </Suspense>
);
