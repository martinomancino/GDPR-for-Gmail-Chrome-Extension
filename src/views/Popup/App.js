import React, { useEffect } from "react";
import $ from "jquery";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import Accordions from "./Accordions";
import "./App.css";

let currentDomain = "";
const cookieName = "gdpr-highlighter-enabled";
let gdprHighlighterEnabled;
const containerSelector = ".Ar.Au";
const container = $(containerSelector);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

/**
 *  sendCookie
 *
 *  @param {String} featureName   feature flag name
 *  @param {String} expires       cookie expiration time in seconds
 */
function sendCookie(value) {
  var now = new Date();
  var exHours = 24;
  var expires = new Date(
    now.getTime() + exHours * 60 * 60 * 1000
  ).toUTCString();

  chrome.tabs.executeScript({
    code:
      'var domain = window.location.hostname.split(".").slice(1).join(".");' +
      'document.cookie="gdpr-highlighter-enabled=' +
      value +
      "; expires=" +
      expires +
      ';domain="+domain+"; path=/";',
  });
}

function readCookie(cb) {
  var activeTab;

  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    function (arrayOfTabs) {
      activeTab = arrayOfTabs[0];
      currentDomain =
        activeTab && arrayOfTabs[0].url ? arrayOfTabs[0].url : currentDomain;

      chrome.cookies.get(
        {
          url: currentDomain,
          name: cookieName,
        },
        function (cookie) {
          gdprHighlighterEnabled =
            cookie && cookie?.value ? JSON.parse(cookie?.value) : false;

          return cb(gdprHighlighterEnabled);
        }
      );
    }
  );
}

function realodExtension() {
  window.close();
  chrome.runtime.sendMessage({ action: "reload" });
}

function App() {
  const [checked, setChecked] = React.useState(gdprHighlighterEnabled);
  const classes = useStyles();
  const showResetButton = checked && container;

  const toggleChecked = () => {
    setChecked((prev) => !prev);
  };

  readCookie(setChecked);

  useEffect(() => {
    if (checked !== gdprHighlighterEnabled) {
      sendCookie(checked);
      realodExtension();

      if (!checked) {
        chrome.tabs.reload();
      }
    }
  }, [checked]);

  if (checked === null || checked === undefined) {
    return (
      <img
        className="badge"
        src="/icons/badge-white.png"
        alt="GDPR highlighter logo"
      />
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <img
          className="badge"
          src="/icons/badge-white.png"
          alt="GDPR highlighter logo"
        />
        <FormGroup className="switch">
          <FormControlLabel
            control={
              <Switch
                checked={checked}
                onChange={toggleChecked}
                color="primary"
              />
            }
            label="Enabled"
          />
        </FormGroup>
        <Accordions />
        {showResetButton && (
          <Button
            className={classes.margin}
            variant="contained"
            color="primary"
            onClick={realodExtension}
          >
            Check email
          </Button>
        )}
        <Button className={classes.margin} variant="outlined" color="primary">
          Leave Feedback
        </Button>
      </header>
    </div>
  );
}

export default App;
