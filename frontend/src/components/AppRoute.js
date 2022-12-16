import React from "react";
import { Redirect, Route } from "react-router-dom";
 
import { useAuthState } from '../services/auth_service/context'
 
const AppRoutes = ({ component: Component, path, isPrivate, isExact, ...rest }) => {
 
    const userDetails = useAuthState()
    return (
        <Route
            exact
            path={path}
            render={props =>
                isPrivate && !Boolean(userDetails.token) ? (
                    <Redirect
                        to={{ pathname: "/users/sign_in" }}
                    />
                ) : (
                        <Component {...props} />
                    )
            }
            {...rest}
        />
    )
}
 
export default AppRoutes