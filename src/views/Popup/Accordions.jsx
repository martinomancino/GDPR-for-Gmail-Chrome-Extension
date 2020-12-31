import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "./App.css";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const Accordions = () => {
  const classes = useStyles();

  return (
    <div className="accordions">
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>How it works</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Colours legend</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div>
              <b>Personal names:</b>{" "}
              <mark data-entity="B-person">Name Surname</mark>
            </div>
            <div>
              <b>Locations:</b>{" "}
              <mark data-entity="B-location">Address, Postal Code, City</mark>
            </div>
            <div>
              <b>Businesses: </b>{" "}
              <mark data-entity="B-corporation">Business Name Ltd.</mark>
            </div>
            <div>
              <b>Sensitive data: </b>{" "}
              <mark data-entity="I-sensitive">
                Phone Number, Credit Card Number, Medical Condition
              </mark>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Accordions;
