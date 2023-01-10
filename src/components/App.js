import React, { useEffect, useReducer, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { auth } from '../firebase'
import Login from './Login'
import 'react-toastify/dist/ReactToastify.css';
import Layout from './Layout'
import { AppContext, initialState } from '../store'
import reducer from '../reducer'
import { toast } from 'react-toastify'
import { LoadingOverlay } from '../Elements'

toast.configure();

export default function App() {

    const [state, dispatch] = useReducer(reducer, initialState);

    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading })

        setTimeout(function () {
            setLoading(false);
        }, 1500)
        // eslint-disable-next-line
        auth.onAuthStateChanged(onAuthStateChanged);
        return
        // eslint-disable-next-line
    }, [loading]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            <LoadingOverlay loading={state.loading} />
            <Router>
                <Switch>
                    {user ?
                        <Route exact path="/" children={<Layout></Layout>} />
                        :
                        <Route exact path="/" component={Login} />
                    }
                </Switch>
            </Router>
        </AppContext.Provider>
    )
}
