import React from 'react';
import PropTypes from 'prop-types';
import './Section.css';

export default function Section({ children }) {
  return <div className="Section">{children}</div>;
}

Section.propTypes = {
  children: PropTypes.node,
};
