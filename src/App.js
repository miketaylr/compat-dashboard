import React from 'react';
import BugzillaTable from './BugzillaTable';
import WebCompatTable from './WebCompatTable';
import './App.css';

const App = () => {
  return (
    <div>
      <BugzillaTable type="Desktop"/>
      <BugzillaTable type="Mobile"/>
      <WebCompatTable/>
    </div>
  );
}

export default App;
