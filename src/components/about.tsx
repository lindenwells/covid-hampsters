import { Grid, Paper, Avatar } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { auth } from "../firebase";
import avatar1 from "./avatar/12.png";
import avatar2 from "./avatar/10.png";
import avatar3 from "./avatar/36.png";
import avatar4 from "./avatar/13.png";
import avatar5 from "./avatar/23.png";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        about: {
            width: "90%",
            background: "#2B2C3E",
            padding: "5px",
            marginBottom: "20px",
            marginTop: "20px",
            color: "#ffffff",
        },
        str1: {
            textAlign: "left",
            marginLeft: "60px",
            marginRight: "60px",
            lineHeight: 1.5,
        },
        team: {
            width: "90%",
            background: "#2B2C3E",
            color: "#ffffff",
            justify: "center",
            textAlign: "center",
            alignContent: "center",
            margin: "0 auto"
        },
        memberContainer: {
            width: "100%",
            display: "flex",
            flexDirection: "row",
        },
        members: {
            width: "20%",
            justifyContent: "center",
            margin: "0 auto"
        },
        avatar: {
            width: 100,
            height: 100,
            margin: "0 auto"
        }
    }),
);

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
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minWidth: "100%" }}
            >
                <Paper className={classes.about}>
                    <div>
                        <div>
                            <div>
                                <h1>About this application</h1>
                            </div>
                        </div>
                        <div className={classes.str1}>
                            <p>This application is built for keeping track of hospital beds to help the health sector cope. It has a website, a database and a predictive model, which all work together to provide vital information such as dates patient beds will become available, the number of remaining beds, and statistics on space availability in the future. It is aim to help hospitals plan accordingly, and avoid running out of beds for patients.</p>
                        </div>
                    </div>
                </Paper>
                <Paper className={classes.team}>
                    <div>
                        <div>
                            <h1>Team '); DROP_TABLE</h1>
                        </div>
                        <div className={classes.memberContainer}>
                            <div className={classes.members}>
                                <Avatar className={classes.avatar} src={avatar1} />
                                <h3>Jason Hassell</h3>
                                <h6>Team Leader, Programming</h6>
                                <p></p>
                            </div>
                            <div className={classes.members}>
                                <Avatar className={classes.avatar} src={avatar2} />
                                <h3>Linden Wells</h3>
                                <h6>Firebase stuff, devOps (github), react</h6>
                                <p></p>
                            </div>
                            <div className={classes.members}>
                                <Avatar className={classes.avatar} src={avatar3} />
                                <h3>James Guanzon</h3>
                                <h6>UI/UX work, programming</h6>
                                <p></p>
                            </div>
                            <div className={classes.members}>
                                <Avatar className={classes.avatar} src={avatar4} />
                                <h3>Bowen Yuan</h3>
                                <h6>Programming, constructing database</h6>
                                <p></p>
                            </div>
                            <div className={classes.members}>
                                <Avatar className={classes.avatar} src={avatar5} />
                                <h3>Diya Shi</h3>
                                <h6>Webpage Design</h6>
                                <p></p>
                            </div>
                        </div>
                    </div>
                </Paper>
            </Grid>
        )
    } else {
        return (
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minWidth: "100%" }}
            >
                <Paper className={classes.about}>
                    <div>
                        <div>
                            <div>
                                <h1>About this application</h1>
                            </div>
                        </div>
                        <div className={classes.str1}>
                            <p>This application is built for keeping track of hospital beds to help the health sector cope. It has a website, a database and a predictive model, which all work together to provide vital information such as dates patient beds will become available, the number of remaining beds, and statistics on space availability in the future. It is aim to help hospitals plan accordingly, and avoid running out of beds for patients.</p>
                        </div>
                    </div>
                </Paper>
                <Paper className={classes.team}>
                    <div>
                        <div>
                            <h1>Team '); DROP_TABLE</h1>
                        </div>
                        <div className={classes.memberContainer}>
                            <div className={classes.members}>
                                <Avatar className={classes.avatar} src={avatar1} />
                                <h3>Jason Hassell</h3>
                                <h6>Team Leader, Programming</h6>
                                <p></p>
                            </div>
                            <div className={classes.members}>
                                <Avatar className={classes.avatar} src={avatar2} />
                                <h3>Linden Wells</h3>
                                <h6>Firebase stuff, devOps (github), react</h6>
                                <p></p>
                            </div>
                            <div className={classes.members}>
                                <Avatar className={classes.avatar} src={avatar3} />
                                <h3>James Guanzon</h3>
                                <h6>UI/UX work, programming</h6>
                                <p></p>
                            </div>
                            <div className={classes.members}>
                                <Avatar className={classes.avatar} src={avatar4} />
                                <h3>Bowen Yuan</h3>
                                <h6>Programming, constructing database</h6>
                                <p></p>
                            </div>
                            <div className={classes.members}>
                                <Avatar className={classes.avatar} src={avatar5} />
                                <h3>Diya Shi</h3>
                                <h6>Webpage Design</h6>
                                <p></p>
                            </div>
                        </div>
                    </div>
                </Paper>
            </Grid>
        )
    }
}



//export default About