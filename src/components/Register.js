import React from 'react'
import { NavLink } from 'react-router-dom' 

export default function Register() {

    return (
        <>
            <div className="container register">
                <div className="card o-hidden border-0 shadow-lg my-5">
                    <div className="card-header border-0 bg-transparent">
                        <img src="assets/img/logo.png" className="img-fluid mb-4" alt="Logo" />
                    </div>
                    <div className="card-body p-0">
                        <div className="row">
                            <div className="col-lg-12">
                                <form className="user">
                                    <div className="form-group">
                                        <input type="text" className="form-control form-control-user" placeholder="Name"
                                            name="name" />
                                    </div>
                                    <div className="form-group">
                                        <input type="email" className="form-control form-control-user" placeholder="Email Address"
                                            name="email" />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control form-control-user" placeholder="Password"
                                            name="password" />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control form-control-user"
                                            placeholder="Confirm Password" name="confirmPassword" />
                                    </div>
                                    <button className="btn btn-palette-green btn-user btn-block">Register Account</button>
                                </form>
                                <hr />
                                <div className="text-center">
                                    <NavLink className="small" to="/">Already have an account?
                                        Login!</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
