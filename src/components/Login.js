import React, { useContext, useEffect, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useForm } from 'react-hook-form';
import { notify } from '../Elements';
import { AppContext } from '../store';

document.body.style.background = "background-color: #9fc7aa !important;";

export default function Login() {

    const { dispatch } = useContext(AppContext)

    const [loading, setLoading] = useState(true)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        if (data.email === '') {
            notify("Email cannot be blank!", "error");
        } else if (data.password === '') {
            notify("Password cannot be blank!", "error");
        } else {
            signInWithEmailAndPassword(auth, data.email, data.password)
                .then((res) => {
                    notify("Successfully Login", "success");
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        notify("Email address is already in use!", "error");
                    }
                    if (error.code === 'auth/invalid-email') {
                        notify("Email address is invalid!", "error");
                    }
                    if (error.code === 'auth/user-not-found') {
                        notify("User not found!", "error");
                    }
                    if (error.code === 'auth/wrong-password') {
                        notify("Password is invalid!", "error");
                    }
                    notify(error, "error");
                })
        }
    }

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading });

        setTimeout(function () {
            setLoading(false);
        }, 1500);
    }, [loading, dispatch]);

    return (
        <>
            <div className="container">
                <div className="container login">

                    <div className="card o-hidden border-0 shadow-lg my-5">
                        <div className="card-header border-0 bg-transparent">
                            <img src="assets/img/logo.png" className="img-fluid mb-4" alt="Logo" />
                        </div>
                        <div className="card-body p-0">
                            <div className="row">
                                <div className="col-lg-12">
                                    <form className="user" onSubmit={handleSubmit(onSubmit)}>
                                        <div className="form-group">
                                            <input type="email" className="form-control form-control-user" placeholder="name@example.com" autoComplete="email"
                                                {...register("email", { required: true })}
                                            />
                                            {errors.email &&
                                                (<div className="form-text text-danger ps-error-message">
                                                    This field is required.
                                                </div>)}
                                        </div>
                                        <div className="form-group">
                                            <input type="password" className="form-control form-control-user" placeholder="Password"
                                                name="password" autoComplete="current-password"
                                                {...register("password", { required: true })}
                                            />
                                            {errors.password &&
                                                (<div className="form-text text-danger ps-error-message">
                                                    This field is required.
                                                </div>)}
                                        </div>
                                        <button className="btn btn-palette-green btn-user btn-block"  >Login</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
