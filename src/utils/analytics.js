import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-H8DVFHY48Y");
};

export const trackEvent = (action, label = "") => {
  ReactGA.event({
    category: "FabulosaPlay",
    action,
    label,
  });
};
