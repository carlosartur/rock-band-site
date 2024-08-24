import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const InternalAnchor = ({ to, text, redirectTo }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollTo = elementId => {
    if (elementId) {
      const element = document.getElementById(elementId.replace('#', ''));
      if (element) {
        const offset = 70;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleClick = () => {
    if (redirectTo && redirectTo !== location.pathname) {
      navigate(redirectTo);
      setTimeout(() => scrollTo(to), 0);

      return true;
    }
    scrollTo(to);
    return true;
  };

  return (
    <a onClick={handleClick}>
      {text}
    </a>
  );
};

export default InternalAnchor;
