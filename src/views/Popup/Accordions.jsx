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
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightBold,
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
          <Typography className={classes.heading}>Instructions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <ul className="list">
              <li>Enable the extension with the switch above</li>
              <li>
                Check if in the top-right part of the email body, there is this
                icon
                <img
                  className="extensionWatchingIcon"
                  src="/icons/loading-icon.png"
                  alt="Watching icon"
                />
              </li>
              <li>
                If this icon is NOT there, click on the <b>CHECK EMAIL</b>{" "}
                button below
              </li>
              <li>
                The email content is anaylsed every time you stop typing for 1.5
                seconds
              </li>
              <li>
                The protected data will be{" "}
                <mark data-entity="B-PER">highlighted</mark> with{" "}
                <mark data-entity="B-PII">different colours</mark> depending on
                the type of data as described in the colours legend below
              </li>
              <li>
                When you think you are ready to provide your feedback please
                click on the related button below
              </li>
            </ul>
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
              <mark data-entity="B-PER">
                Name Surname, Locations, Business Names, emails{" "}
              </mark>
            </div>
            <div>
              <b>Sensitive data: </b>{" "}
              <mark data-entity="B-PII">
                Phone Numbers, Credit Card Numbers, Medical Conditions
              </mark>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Limitations</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            This prototype has been tested only on new emails and not on reply
            emails.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Accordions;
