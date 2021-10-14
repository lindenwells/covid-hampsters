import React from "react";
import { Button } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { makeStyles, createStyles, Theme, ThemeProvider, createTheme } from "@material-ui/core/styles";
import { auth, db } from "../firebase"
import { SignalCellularConnectedNoInternet2BarTwoTone } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        about: {
            color: "#ffffff",
        },
        str1: {
            textAlign: "left",
            paddingLeft: "80px",
            paddingRight: "80px",
            lineHeight: 1.5,
        },
        memberContainer: {
            width: "100%",
            height: "22px",
            display: "flex",
            flexDirection: "row",
            textAlign: "center",
        },
        members: {
            width: "25%",
        }
    }),
);

{/*
const userType = async () => {
    const authed = await db.collection("authedUser").where("uid", "==", auth.currentUser?.uid).get();
    if (authed) {
        return (
            <>
                You are authed.
            </>
        )
    } else {
        return (
            <>
                Nothing here
            </>
        )
    }
}*/}


export default function About() {
    //const authed = Promise.resolve(db.collection("authedUser").where("uid", "==", auth.currentUser?.uid).get());
    const classes = useStyles();
    const email = auth.currentUser?.email;
    const emailExp1 = /^\w+([-+.]\w+)*@uqconnect.edu.au$/;
    const emailExp2 = /^\w+([-+.]\w+)*@student.uq.edu.au$/;
    const emailExp3 = /^\w+([-+.]\w+)*@uq.net.edu.au$/;
    //const emailExp4 = /^\w+([-+.]\w+)*@uqconnect.edu.au$/;
    let valid = null;
    if (email) {
        valid = emailExp1.test(email) || emailExp2.test(email) || emailExp3.test(email);
    }
    if (valid) {
        return (
            <div>
                <div style={{ height: "20px" }} />
                <section className={classes.about}>
                    <div>
                        <div>
                            <div>
                                <h1>About this project</h1>
                            </div>
                        </div>
                        <div className={classes.str1}>
                            <p>This project is built for keeping track of hospital beds to help the health sector cope. It has a website, a database and a predictive model, which all work together to provide vital information such as dates patient beds will become available, the number of remaining beds, and statistics on space availability in the future.It is aim to help hospitals plan accordingly, and avoid running out of beds for patients.</p>
                        </div>
                    </div>
                </section>
                <div style={{ height: "20px" }} />
                <section className={classes.about}>
                    <div>
                        <div>
                            <div>
                                <h1>Know about us</h1>
                            </div>
                            <p>We are Team '); DROP_TABLE.</p>
                        </div>
                        <div className={classes.memberContainer}>
                            <div className={classes.members}>
                                <h3>Jason Hassell</h3>
                                <h6>Team Leader, Programmer</h6>
                                <p></p>
                            </div>
                            <div className={classes.members}>
                                <h3>Linden Wells</h3>
                                <h6></h6>
                                <p></p>
                            </div>
                            <div className={classes.members}>
                                <h3>James Guanzon</h3>
                                <h6></h6>
                                <p></p>
                            </div>
                            <div className={classes.members}>
                                <h3>Bowen Yuan</h3>
                                <h6></h6>
                                <p></p>
                            </div>
                            <div className={classes.members}>
                                <h3>Diya Shi</h3>
                                <h6></h6>
                                <p></p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    } else {
        return (
            <div className={classes.about}>
                <h1>
                    Nothing else.
                </h1>
            </div>
        )
    }
}



//export default About