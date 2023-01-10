
import React, { useEffect, useState } from 'react'

import 'animate.css';
import Swal from 'sweetalert2';
import dateFormat from 'dateformat';
import CHOlogo from "./img/cho-dvo.jpg";
import html2PDF from 'jspdf-html2canvas';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadIcon from '@mui/icons-material/Download';

import { db } from '../firebase';
import { useContext } from 'react';
import { notify } from '../Elements';
import { AppContext } from '../store';
import { useHistory } from 'react-router-dom';
import { collection, getDocs, doc, deleteDoc, query, where } from 'firebase/firestore/lite';


export default function ICR() {

    let history = useHistory();
    let today = new Date();
    let checker = 0;
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailsName, setDetailsName] = useState("");
    const { state, dispatch } = useContext(AppContext);

    const [modal, setModal] = useState(false);
    const [identity, setidentity] = useState('');

    const toggleModal = (e) => {
        setModal(false);
        e.preventDefault();
        console.log(modal)
    };

    if (modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

    const onDownload = () => {
        const element = document.getElementById("ICR");

        if (element) {
            html2PDF(element, {
                jsPDF: {
                    format: 'a4',
                    orientation: 'portrait'
                },
                imageType: 'image/jpeg',
                output: 'ICR.pdf'
            });
        }
    }

    async function getDetails() {
        const detailsCol = collection(db, "ICR")

        const detailsSnapshot = await getDocs(detailsCol);
        let details = [];
        detailsSnapshot.forEach((doc) => {
            let newArr = doc.data();
            newArr['id'] = doc.id;
            details.push(newArr)
        });

        details.sort((a, b) => {
            var adate = new Date(a.datesent);
            var bdate = new Date(b.datesent);

            return bdate - adate;
        });
        setDetails(details)
    }

    useEffect(() => {
        if (detailsName) {
            search()
        } else {
            getDetails()
        }
        // eslint-disable-next-line 
    }, [detailsName])

    useEffect(() => {
        dispatch({ type: "FETCH_DETAILS", payload: details })
    }, [details, dispatch])

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading })
        getDetails()

        setTimeout(function () {
            setLoading(false)
        }, 1200)
    }, [loading, dispatch])

    const onDelete = (data) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Deleting this will be permanent.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d32f2f",
            cancelButtonColor: "#717384",
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                const detailsCol = doc(db, "ICR", data.id);
                const detailsSnapshot = deleteDoc(detailsCol);

                if (detailsSnapshot) {
                    notify("Deleted successfully", "success")

                    setTimeout(function () {
                        history.go(0)
                    }, 1200)
                } else {
                    notify("Something went wrong!", "error")
                }
            }
        });
    }

    const search = async () => {
        const q = query(collection(db, 'ICR'), where('fullname', '==', detailsName.toUpperCase()));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let search = [];
            search.push(doc.data());
            setDetails(search);
        });
    }

    async function onSearch() {
        const q = query(collection(db, 'ICR'), where('fullname', '==', detailsName.toUpperCase()));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let search = [];
            search.push(doc.data());
            setDetails(search);
            checker = 1;
        });

        if (checker === 1) {
        } else {
            Swal.fire({
                title: 'Not found!',
                text: 'Please try searching for the full name.',
                icon: 'warning',
                confirmButtonColor: '#717384',
                confirmButtonText: 'OK'
            })
        }

        checker = 0;
    }

    const convertlabtest = (text) => {
        text = text.replaceAll("\"", "");

        if (text.includes("labtest")) {
            text = text.replaceAll("{", "");
            text = text.replaceAll("}", "");
            text = text.replaceAll("labtest", "");
            text = text.replaceAll(":", "");

            var temp = text + " (UNFINISHED)";
            text = temp;
        }

        return text.toUpperCase();
    }

    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Individual Client Records</h1>
                <form onSubmit={(e) => e.preventDefault()}
                    className="d-none d-sm-inline-block shadow-sm form-inline rounded ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                    <div className="input-group">
                        <input type="text" className="form-control bg-light border-0 small"
                            placeholder="Seach Client Record" aria-label="Search" onChange={(e) => setDetailsName(e.target.value)} />
                        <div className="input-group-append">
                            <button className="btn btn-palette-green" type="button" onClick={() => onSearch()}>
                                <i className="fas fa-search fa-sm"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-6'>Name (Given name/s, Middle Name, Surname)</div>
                    <div className='col text-center'>Date Sent</div>
                    <div className='col-1 text-center'>Action</div>
                </div>
            </div>
            <div className="row">
                {state.details.length > 0 ? (
                    state.details.map((row, i) =>
                        <details key={i} className='container-fluid' closed="true">
                            <summary>
                                <div className='row' style={{ marginLeft: '15px', marginTop: '-23px' }}>
                                    <div className='col-6'>
                                        <b>{row.fullname}</b>
                                        {(today.getMonth() + 1 === parseInt(dateFormat(row.datesent, "m")) && today.getFullYear() === parseInt(dateFormat(row.datesent, "yyyy"))) && (today.getDate() - 2 < parseInt(dateFormat(row.datesent, "d") || today.getDate() + 1 > new Date(row.datesent))) && <span className='new'>NEW</span>}
                                    </div>
                                    <div className='col text-center'>
                                        {dateFormat(row.datesent, "yyyy-dd-mm")}
                                    </div>
                                    <div className='col-1 text-right'>
                                        <Tooltip title="View" className="float-end">
                                            <IconButton aria-label="View" color="primary" onClick={() => { setidentity(row.fullname); setModal(true); }}>
                                                <RemoveRedEyeIcon style={{ fontSize: '18px' }} />
                                            </IconButton>
                                        </Tooltip>
                                        {identity === row.fullname && modal && (
                                            <>
                                                <div onClick={toggleModal} className="modaloverlay"></div>
                                                <div className="modalbox animate__bounceIn">
                                                    <div className="modal-content web">
                                                        <div className="scrollbox">
                                                            <div style={{ width: '850px', margin: 'auto', paddingTop: '30px', fontSize: '11px' }} id="ICR">
                                                                <div className='container' id="ICR">
                                                                    <div className="row">
                                                                        <div className="col">
                                                                            <img className="float-right" src={CHOlogo} width="75px" alt="CHO Logo" />
                                                                        </div>
                                                                        <div className="col-7">
                                                                            <div className="text-left">
                                                                                REPUBLIC OF THE PHILIPPINES<br />
                                                                                <h5 className="m-0"><b>CITY HEALTH OFFICE</b></h5>
                                                                                <h6 className="m-0">Reproductive Health and Wellness Center</h6>
                                                                                <p className="m-0">CITY OF DAVAO, Region XI</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <br></br>
                                                                    <div className="row">
                                                                        <div className="col-4">File Number</div>
                                                                        <div className="col-3">U.I.C.</div>
                                                                        <div className="col">Type</div>
                                                                        <div className="col">Date</div>
                                                                        <div className="col">Contact Number</div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-4"><hr /></div>
                                                                        <div className="col-3"><hr /></div>
                                                                        <div className="col">
                                                                            <input type="checkbox" readOnly checked />&nbsp;Online Visit:<br />
                                                                            <input type="checkbox" disabled />&nbsp;Onsite Visit:
                                                                        </div>
                                                                        <div className="col">
                                                                            <p className="mb-0 hr">{dateFormat(row.datesent, "yyyy-dd-mm")}</p>
                                                                            <hr className="mt-3 mb-0" />
                                                                        </div>
                                                                        <div className="col">
                                                                            <p className="mb-0 hr">{row.phonenumber}</p>
                                                                        </div>
                                                                    </div>
                                                                    <br />
                                                                    <div className="row">
                                                                        <div className="col-7">Fullname</div>
                                                                        <div className="col">Sex</div>
                                                                        <div className="col">Age</div>
                                                                        <div className="col">Date of Birth</div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-7"><p className="hr">{row.fullname}</p></div>
                                                                        <div className='col'>
                                                                            <form>
                                                                                {row.gender === "MALE" ? (<>
                                                                                    <input type="radio" id="F" name="sex" defaultValue="F" disabled />&nbsp;F&nbsp;&nbsp;&nbsp;
                                                                                    <input type="radio" id="M" name="sex" defaultValue="M" readOnly checked />&nbsp;M
                                                                                </>) : (<>
                                                                                    <input type="radio" id="F" name="sex" defaultValue="F" readOnly checked />&nbsp;F&nbsp;&nbsp;&nbsp;
                                                                                    <input type="radio" id="M" name="sex" defaultValue="M" disabled />&nbsp;M
                                                                                </>)}
                                                                            </form>
                                                                        </div>
                                                                        <div className="col"><p className="hr">{row.age} YEARS OLD</p></div>
                                                                        <div className="col"><p className="hr">{dateFormat(row.birthdate, "mmm dd, yyyy").toUpperCase()}</p></div>
                                                                    </div>
                                                                    <br />
                                                                    <div className="row">
                                                                        <div className="col-7">Group</div>
                                                                        <div className="col">Marital Status</div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-7">
                                                                            <form>
                                                                                {row.group === "RSW" ? (<input type="radio" id="RSW" name="group" defaultValue="RSW" readOnly checked />) : (<input type="radio" id="RSW" name="group" defaultValue="RSW" disabled />)
                                                                                }&nbsp;RSW&nbsp;&nbsp;&nbsp;
                                                                                {row.group === "FLSW" ? (<input type="radio" id="FLSW" name="group" defaultValue="FLSW" readOnly checked />) : (<input type="radio" id="FLSW" name="group" defaultValue="FLSW" disabled />)
                                                                                }&nbsp;FLSW&nbsp;&nbsp;&nbsp;
                                                                                {row.group === "MWS" ? (<input type="radio" id="MWS" name="group" defaultValue="MWS" readOnly checked />) : (<input type="radio" id="MWS" name="group" defaultValue="MWS" disabled />)
                                                                                }&nbsp;MWS&nbsp;&nbsp;&nbsp;
                                                                                {row.group === "MSM" ? (<input type="radio" id="MSM" name="group" defaultValue="MSM" readOnly checked />) : (<input type="radio" id="MSM" name="group" defaultValue="MSM" disabled />)
                                                                                }&nbsp;MSM&nbsp;&nbsp;&nbsp;
                                                                                {row.group === "RSPSW" ? (<input type="radio" id="RSPSW" name="group" defaultValue="RSPSW" readOnly checked />) : (<input type="radio" id="RSPSW" name="group" defaultValue="RSPSW" disabled />)
                                                                                }&nbsp;RSPSW&nbsp;&nbsp;&nbsp;
                                                                                {row.group === "PREGNANT" ? (<input type="radio" id="P" name="group" defaultValue="P" readOnly checked />) : (<input type="radio" id="P" name="group" defaultValue="P" disabled />)
                                                                                }&nbsp;Pregnant&nbsp;&nbsp;&nbsp;
                                                                                {row.group === "CSW" ? (<input type="radio" id="CSW" name="group" defaultValue="CSW" readOnly checked />) : (<input type="radio" id="CSW" name="group" defaultValue="CSW" disabled />)
                                                                                }&nbsp;Client of SW&nbsp;&nbsp;&nbsp;
                                                                            </form>
                                                                        </div>
                                                                        <div className="col">
                                                                            <form>
                                                                                {row.civilstatus === "SINGLE" ? (<input type="radio" id="S" name="sex" defaultValue="S" readOnly checked />) : (<input type="radio" id="S" name="sex" defaultValue="S" disabled />)
                                                                                }&nbsp;Single&nbsp;&nbsp;&nbsp;
                                                                                {row.civilstatus === "LIVE-IN" ? (<input type="radio" id="L" name="sex" defaultValue="L" readOnly checked />) : (<input type="radio" id="L" name="sex" defaultValue="L" disabled />)
                                                                                }&nbsp;Live-in&nbsp;&nbsp;&nbsp;
                                                                                {row.civilstatus === "MARRIED" ? (<input type="radio" id="M" name="sex" defaultValue="M" readOnly checked />) : (<input type="radio" id="M" name="sex" defaultValue="M" disabled />)
                                                                                }&nbsp;Married&nbsp;&nbsp;&nbsp;
                                                                                {row.civilstatus === "SEPARATED" ? (<input type="radio" id="S" name="sex" defaultValue="S" readOnly checked />) : (<input type="radio" id="S" name="sex" defaultValue="S" disabled />)
                                                                                }&nbsp;Separated&nbsp;&nbsp;&nbsp;
                                                                                {row.civilstatus === "WIDOW" ? (<input type="radio" id="W" name="sex" defaultValue="W" readOnly checked />) : (<input type="radio" id="W" name="sex" defaultValue="W" disabled />)
                                                                                }&nbsp;Widow
                                                                            </form>
                                                                        </div>
                                                                    </div>
                                                                    <br />
                                                                    <div className="row">
                                                                        <div className="col">Residential Address in past 6 months (non-CSW)</div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col"><p className="hr">{row.address.toUpperCase()}</p></div>
                                                                    </div>
                                                                    <br />
                                                                    <table className="table table-bordered">
                                                                        <tbody>
                                                                            <tr className="text-center">
                                                                                <td>Date of Visit</td>
                                                                                <td>Complaints/Physical Laboratory Findings</td>
                                                                                <td colSpan={8}>Diagnosis<br />(Check Appropriate Disease)</td>
                                                                                <td>Remarks/Treatment<br />Date of Follow-up</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td> </td>
                                                                                <td> </td>
                                                                                <td className='vertical'>Gonorrhea (G)</td>
                                                                                <td className='vertical'>Syphilis (S)</td>
                                                                                <td className='vertical'>Trichomonas (T)</td>
                                                                                <td className='vertical'>Bacterial Vaginosis (B)</td>
                                                                                <td className='vertical'>Nan-Gono Inf (NGI)</td>
                                                                                <td className='vertical'>Genital Herpes (H)</td>
                                                                                <td className='vertical'>Genital Warts (W)</td>
                                                                                <td className='vertical'>Other Specify to Include HIV</td>
                                                                                <td> </td>
                                                                            </tr>
                                                                            {row.symptoms != null ?
                                                                                row.symptoms.map((data, i) =>
                                                                                    <tr key={i}>
                                                                                        <td className="text-center">{dateFormat(row.datesent, "yyyy-dd-mm")} (ONLINE)</td>

                                                                                        <td>
                                                                                            {data.affectedarea ?
                                                                                                (<p>{data.symptoms.toUpperCase()} ON {data.affectedarea.toUpperCase()}</p>) :
                                                                                                (<p>{data.symptoms.toUpperCase()}</p>)}
                                                                                        </td>
                                                                                        <td></td>
                                                                                        <td></td>
                                                                                        <td></td>
                                                                                        <td></td>
                                                                                        <td></td>
                                                                                        <td></td>
                                                                                        <td></td>
                                                                                        <td></td>
                                                                                        <td></td>
                                                                                    </tr>
                                                                                ) : (<></>)
                                                                            }
                                                                        </tbody>
                                                                    </table>
                                                                    <p className="text-center">In case client was found to be without any of the specified disease indicate findings and write “normal” in the remark’s column</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col">
                                                                <div className="btn btn-block btn-primary" onClick={() => { onDownload() }}>
                                                                    <Tooltip title="Download" className="float-end">
                                                                        <IconButton aria-label="Download" color="primary">
                                                                            <DownloadIcon style={{ fontSize: '18px', color: '#fff' }} />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <a href="#download" id="download" className="text-white">DOWNLOAD</a>
                                                                </div>
                                                            </div>
                                                            <div className="col">
                                                                <div className="btn btn-block btn-secondary" onClick={toggleModal}>
                                                                    <Tooltip title="Close" className="float-end">
                                                                        <IconButton aria-label="Close" onClick={() => { setModal(true) }}>
                                                                            <CloseIcon style={{ fontSize: '18px', color: '#fff' }} />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <a href="#download" className="text-white">CANCEL</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        <Tooltip title="Delete" className="float-end">
                                            <IconButton aria-label="Delete" color="error" onClick={() => { onDelete(row) }}>
                                                <DeleteIcon style={{ fontSize: '18px' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                            </summary>
                            <div className="content">
                                <h5><b>Personal Details</b></h5>
                                <div className="row">
                                    <div className="col">
                                        <small>Age:</small><br />{row.age}&nbsp;YEARS OLD
                                        <br />
                                        <small>Sex:</small><br />{row.gender}
                                        <br />
                                        <small>Group:</small><br />{row.group}
                                        <br />
                                    </div>
                                    <div className="col">
                                        <small>Birthdate:</small><br />{dateFormat(row.birthdate, "mmmm dd, yyyy").toUpperCase()}
                                        <br />
                                        <small>Civil Status:</small><br />{row.civilstatus}
                                        <br />
                                        <small>Contact Number:</small><br />{row.phonenumber}
                                        <br />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <small>Address:</small><br />{row.address.toUpperCase()}
                                    </div>
                                </div>
                                {row.symptoms != null &&
                                    <><br></br><h5><b>Medical Information</b></h5></>}
                                {row.symptoms != null ?
                                    row.symptoms.map((data, i) =>
                                        <div key={i}>
                                            <div className="row">
                                                <div className="col">
                                                    <small>Symptoms:</small><br />{data.symptoms.toUpperCase()}
                                                </div>
                                                {data.affectedarea &&
                                                    <div className="col">
                                                        <small>Affected Area:</small><br />{data.affectedarea.toUpperCase()}
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    ) : ""}
                                {row.testingscreening != null &&
                                    <small>Testing Screening:</small>}
                                {row.testingscreening != null && Array.isArray(row.testingscreening) ?
                                    row.testingscreening.map((data, i) =>
                                        <div key={i}>
                                            {convertlabtest(JSON.stringify(data))}
                                        </div>
                                    ) : (
                                        <div>
                                            {row.testingscreening && 
                                            row.testingscreening.toUpperCase()}
                                        </div>
                                    )}
                            </div>
                        </details>
                    )) : (
                    <div className='container-fluid'>
                        <h3 className='text-center mt-5'>
                            No Data
                        </h3>
                    </div>
                )}
            </div>
        </>
    )
}
