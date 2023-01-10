import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { notify } from '../Elements';
import { auth } from '../firebase';

import ICR from './ICR'
import Dashboard from './Dashboard'

document.body.style.background = "background-color: #fff !important;";

export default function Layout({ children }) {

    const [hidesidebar, sethidesidebar] = useState(true);
    const [showdash, setshowdash] = useState(true);
    const [showICR, setshowICR] = useState(false);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                notify("You have successfully logout", "success")
            })
            .catch(error => toast(error))
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const sidebar = () => {
        sethidesidebar(!hidesidebar);

        if(hidesidebar){
            document.getElementById('sidebar').style.display = 'none';
        } else {
            document.getElementById('sidebar').style.display = 'inline';
        }
    }

    return (
        <>
            <div id="wrapper">
                <ul className="navbar-nav bg-white sidebar sidebar-dark accordion" id="sidebar">
                    <NavLink className="sidebar-brand d-flex align-items-center justify-content-center my-3" to="/">
                        <img src="assets/img/logo.png" className="img-fluid" alt="Logo" />
                    </NavLink>
                    <hr className="sidebar-divider my-0" />
                    <li className="nav-item active">
                        <NavLink className="nav-link ml-2" to="/" onClick={event => { event.preventDefault(); setshowdash(true); setshowICR(false); }}>
                            <i className="fa fa-th-large"></i>&nbsp;
                            <span>Dashboard</span></NavLink>
                    </li>
                    <li className="nav-item active">
                        <a className="nav-link ml-2" href="/" onClick={event => { event.preventDefault(); setshowICR(true); setshowdash(false); }}>
                        <i className="fa fa-folder" aria-hidden="true"></i>&nbsp;
                            <span>IC Records</span>
                        </a>
                    </li>
                    <li className="nav-item active">
                        <a className="nav-link ml-2" href="/" onClick={event => { event.preventDefault(); }} data-toggle="modal" data-target="#logoutModal">
                            <i className="fas fa-sign-out-alt"></i>&nbsp;
                            <span>Logout</span>
                        </a>
                    </li>
                    <hr className="sidebar-divider d-none d-md-block" />
                </ul>
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                            <button id="sidebarToggleTop" className="btn btn-palette-green rounded-circle mr-3"  onClick={() => { sidebar() }}>
                                <i className="fa fa-bars"></i>
                            </button>

                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item dropdown no-arrow d-sm-none">
                                    <a className="nav-link dropdown-toggle" href="/" onClick={event => { event.preventDefault() }} id="searchDropdown" role="button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="fas fa-search fa-fw"></i>
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                                        aria-labelledby="searchDropdown">
                                        <form className="form-inline mr-auto w-100 navbar-search">
                                            <div className="input-group">
                                                <input type="text" className="form-control bg-light border-0 small"
                                                    placeholder="Seach Client Record" aria-label="Search"
                                                    aria-describedby="basic-addon2" />
                                                <div className="input-group-append">
                                                    <button className="btn btn-palette-green" type="button">
                                                        <i className="fas fa-search fa-sm"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </li>
                                <div className="topbar-divider d-none d-sm-block"></div>
                                <li className="nav-item dropdown no-arrow">
                                    <a className="nav-link dropdown-toggle" href="/" onClick={event => { event.preventDefault() }} id="userDropdown" role="button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">{auth.currentUser?.email}</span>
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                        aria-labelledby="userDropdown">
                                        <a className="dropdown-item" href="/" onClick={event => { event.preventDefault() }} data-toggle="modal" data-target="#logoutModal">
                                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                            Logout
                                        </a>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                        <div className="container-fluid">
                            {showdash && 
                            <Dashboard/>
                            }
                            {showICR &&
                            <ICR/>}
                        </div>
                    </div>
                    <footer className="sticky-footer bg-light">
                        <div className="container my-auto">
                            <div className="copyright text-center my-auto">
                                <span>Copyright &copy; Repro 2022</span>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
            <div className="scroll-to-top rounded" href="/" onClick={() => scrollToTop()}>
                <i className="fas fa-angle-up"></i>
            </div>
            <div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                            <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                            <Button className="btn btn-palette-green" onClick={handleLogout} data-dismiss="modal">Logout</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
