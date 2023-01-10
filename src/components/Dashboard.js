
import React, { useEffect, useState } from 'react'

import { db } from '../firebase';
import { useContext } from 'react';
import { AppContext } from '../store';
import { collection, getDocs } from 'firebase/firestore/lite';

import dateFormat from 'dateformat';
import Clock from 'react-live-clock';
import BarChart from './charts/BarGraph';
import PieChart from './charts/PieChart';

import 'animate.css';

export default function Dashboard() {

    let today = new Date();

    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState([]);
    const [faqslist, setfaqslist] = useState([]);
    const { state, dispatch } = useContext(AppContext);

    useEffect(() => {
        dispatch({ type: "FETCH_DETAILS", payload: details })
    }, [details, dispatch])

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading })
        getICRDetails();
        getIFAQsDetails();

        setTimeout(function () {
            setLoading(false)
        }, 1200)
    }, [loading, dispatch])

    const getName = (day) => {
        if (day === 0) return 'Sunday';
        else if (day === 1) return 'Monday';
        else if (day === 2) return 'Tuesday';
        else if (day === 3) return 'Wednesday';
        else if (day === 4) return 'Thursday';
        else if (day === 5) return 'Friday';
        return 'Saturday';
    }

    const getICRDetails = async () => {
        const detailsCol = collection(db, "ICR")

        const detailsSnapshot = await getDocs(detailsCol);
        let details = [];
        detailsSnapshot.forEach((doc) => {
            let newArr = doc.data();
            newArr['id'] = doc.id;
            details.push(newArr)
        });

        setDetails(details)
    }

    const getIFAQsDetails = async () => {
        const detailsCol = collection(db, "FAQs")

        const detailsSnapshot = await getDocs(detailsCol);
        let details = [];
        detailsSnapshot.forEach((doc) => {
            let newArr = doc.data();
            newArr['id'] = doc.id;
            details.push(newArr)
        });

        setfaqslist(details);
    }

    const symptomscounter = (data, checker, text) => {
        let wsymp = 0;
        let wosymp = 0;

        if (data && data.length > 0) {
            data.map((row, i) => {
                if (row.symptoms) {
                    wsymp++;
                } else {
                    wosymp++;
                }
                if (checker === 1) {
                    return wsymp;
                } else {
                    return wosymp;
                }
            });
        }
        if (text === "getpercentage") {
            var percent;
            if (checker === 1) {
                percent = Math.round((wsymp / data.length) * 100);
                return (wsymp + " (" + percent + "%)");
            } else {
                percent = Math.round((wosymp / data.length) * 100);
                return (wosymp + " (" + percent + "%)");
            }
        } else {
            if (checker === 1) {
                return wsymp;
            } else {
                return wosymp;
            }
        }
    }

    const getgenderstat = () => {
        let male = 0;
        let female = 0;
        let genders = [];
        let data = state.details;

        if (data && data.length > 0) {
            data.map((row, i) => {
                if (row.gender === "MALE") {
                    male++;
                } else {
                    female++;
                }
                return (male, female);
            });
        }
        genders = [female, male];

        return genders;
    }

    const getrecostat = () => {
        let nia = 0;
        let oos = 0;
        let vlw = 0;
        let slw = 0;
        let results = [];
        let data = state.details;

        if (data && data.length > 0) {
            data.map((row, i) => {
                if (row.testingscreening) {
                    console.log(row.testingscreening)
                    if (row.testingscreening === "No Immediate Action") {
                        nia++;
                    } else if (row.testingscreening === "Out of Scope") {
                        console.log(row.testingscreening)
                        oos++;
                    } else if (row.testingscreening === "Voluntary Lab Work") {
                        vlw++;
                    } else {
                        slw++;
                    }
                }
                return (nia, oos, vlw, slw);
            });
        }
        results = [nia, oos, vlw, slw];

        return results;
    }

    const getagebracket = (checker) => {
        let allages = [];
        let data = state.details;

        if (data && data.length > 0) {
            data.map((row, i) => {
                allages.push(row.age);

                return allages;
            });
        }

        var results = countocurrences(allages);

        if (checker === 1) {
            return (results);
        } else {
            return Object.keys(results);
        }
    }

    const getFAQs = (type, rank) => {
        let i = 0;
        let faqs = [];
        let results = [];
        let tempresults = [];
        let finalresults = [];
        let faqname, frequency;

        if (faqslist && faqslist.length > 0) {
            faqslist.map((row, i) => {
                if (row.cointents) {
                    faqs = row.cointents
                }
                return faqs;
            });
        }

        results = countocurrences(faqs);
        tempresults = Object.entries(results);

        for (i = 0; i < tempresults.length; i++) {
            let tempdatares = [];
            tempdatares = tempresults[i];

            finalresults.push(tempdatares);
        }

        finalresults.sort(function (a, b) {
            return b[1] - a[1];
        });

        for (i = 0; i < 5; i++) {
            let temp = finalresults[i];
            if (temp) {
                faqname = temp[0];
                frequency = temp[1];
            }

            if (type === "text") {
                if (rank === 1 && i === 0) {
                    return faqname;
                } else if (rank === 2 && i === 1) {
                    return faqname;
                } else if (rank === 3 && i === 2) {
                    return faqname;
                } else if (rank === 4 && i === 3) {
                    return faqname;
                } else if (rank === 5 && i === 4) {
                    return faqname;
                }
            } else if (type === "stats") {
                let total = 0;

                if (faqslist[0]) {
                    total = faqslist[0].cointents.length;
                }
                let percent = Math.round((frequency / total) * 100);

                if (rank === 1 && i === 0) {
                    return <>Asked {frequency} times &#40;{percent}%&#41;</>;
                } else if (rank === 2 && i === 1) {
                    return <>Asked {frequency} times &#40;{percent}%&#41;</>;
                } else if (rank === 3 && i === 2) {
                    return <>Asked {frequency} times &#40;{percent}%&#41;</>;
                } else if (rank === 4 && i === 3) {
                    return <>Asked {frequency} times &#40;{percent}%&#41;</>;
                } else if (rank === 5 && i === 4) {
                    return <>Asked {frequency} times &#40;{percent}%&#41;</>;
                }
            }
        }
    }

    const countocurrences = (arr) => {
        return arr.reduce((aggregator, value, index, array) => {
            if (!aggregator[value]) {
                return aggregator = { ...aggregator, [value]: 1 };
            } else {
                return aggregator = { ...aggregator, [value]: ++aggregator[value] };
            }
        }, {})
    }

    return (
        <>
            <div className="mb-4">
                <h3 className="mb-0 text-gray-800">Dashboard</h3><br></br>
                <div className='container-fluid'>
                    <div className='card'>
                        <h2><b>Reproductive Health & Wellness Center RHWC</b></h2>
                        <h4>Jacinto Street, Davao City, Davao City, Philippines</h4>
                    </div><br />
                    <div className='row'>
                        <div className='col-8'>
                            <div className='card' style={{ width: 'auto' }}>
                                <h5>Today is:</h5>
                                <h3>{dateFormat(today, "mmmm dd, yyyy")}&nbsp;{getName(today.getDay())}</h3>
                            </div>
                        </div>
                        <div className='col'>
                            <div className='card' style={{ width: 'auto' }}>
                                <h5>Time:</h5>
                                <h3><Clock format={'HH:mm a'} ticking={true} /></h3>
                            </div>
                        </div>
                    </div>
                </div>
                <br></br>
                <h3 className="mb-0 text-gray-800">Activity</h3><br></br>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col'>
                            <div className='card' style={{ width: 'auto' }}>
                                Total Records:<br />
                                <h1 className='text-center animate__bounceIn'>{state.details.length}</h1>
                            </div>
                        </div>
                        <div className='col'>
                            <div className='card' style={{ width: 'auto' }}>
                                With symptoms:<br />
                                <h1 className='text-center animate__bounceIn'>{symptomscounter(state.details, 1, "getpercentage")}</h1>
                            </div>
                        </div>
                        <div className='col'>
                            <div className='card' style={{ width: 'auto' }}>
                                No symptoms:<br />
                                <h1 className='text-center animate__bounceIn'>{symptomscounter(state.details, 2, "getpercentage")}</h1>
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <div className='row'>
                        <div className='col-4'>
                            <div className='card pb-3'>
                                <h3 className='text-center pb-2'>Gender</h3>
                                <PieChart results={getgenderstat()} labels={['Female', 'Male']} />
                                <br></br>
                            </div>
                        </div>
                        <div className='col'>
                            <div className='card'>
                                <h3 className='text-center'>Age Bracket</h3>
                                <BarChart results={getagebracket(1)} labels={getagebracket(2)} />
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className='row'>
                        <div className='col-4'>
                            <div className='card pb-4'>
                                <h3 className='text-center pb-2'>Most Asked Questions</h3>
                                {faqslist.length > 0 ? (
                                    <>
                                        <div className="media mt-2">
                                            <div className="align-self-start mr-3 box one" alt="Color"></div>
                                            <div className="media-body">
                                                <h5 className="mt-0">{getFAQs("text", 1)}</h5>
                                                <small>{getFAQs("stats", 1)}</small>
                                            </div>
                                        </div>
                                        <div className="media mt-2">
                                            <div className="align-self-start mr-3 box two" alt="Color"></div>
                                            <div className="media-body">
                                                <h5 className="mt-0">{getFAQs("text", 2)}</h5>
                                                <small>{getFAQs("stats", 2)}</small>
                                            </div>
                                        </div>
                                        <div className="media mt-2">
                                            <div className="align-self-start mr-3 box three" alt="Color"></div>
                                            <div className="media-body">
                                                <h5 className="mt-0">{getFAQs("text", 3)}</h5>
                                                <small>{getFAQs("stats", 3)}</small>
                                            </div>
                                        </div>
                                        <div className="media mt-2">
                                            <div className="align-self-start mr-3 box four" alt="Color"></div>
                                            <div className="media-body">
                                                <h5 className="mt-0">{getFAQs("text", 4)}</h5>
                                                <small>{getFAQs("stats", 4)}</small>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <h5 className='text-center'>No data available</h5>
                                )}
                            </div>
                        </div>
                        <div className='col'>
                            <div className='card'>
                                <h3 className='text-center'>Recommendations</h3>
                                <BarChart results={getrecostat()} labels={["No Immediate Action", "Out of Scope", "Voluntary Lab Work", "Specified Lab Work"]} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
