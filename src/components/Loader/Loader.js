import React from 'react';
import Loader from 'react-loader-spinner';
import './Loader.css';

export default function LoaderSpinner() {
  return (
    <Loader
      className="Loader App-logo"
      type="Circles"
      color="#00BFFF"
      height={300}
      width={300}
      timeout={3000} //3 secs
    />
  );
}
