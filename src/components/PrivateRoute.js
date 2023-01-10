import React from 'react'
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'
import Layout from './Layout';

export default function PrivateRoute({ component: Component, ...rest }) {
    const { currentUser } = useAuth();

    return (
        <Route
            {...rest}
            render={props => {
                return currentUser ? (
                    <Layout><Component {...props} /></Layout>
                ) : (
                    <Redirect to={{
                        pathname: "/",
                        state: { from: props.location }
                    }} />
                )
            }}
        />
    )
}
