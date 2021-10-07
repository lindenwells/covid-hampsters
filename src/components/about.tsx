import { Button } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import {auth, db} from "../firebase"

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
                <h1>
                You are authed.
                </h1>
            </div>
        )
    } else {
        return (
            <div>
            <h1>
            Nothing here.
            </h1>
        </div>
        )
    }
}



//export default About