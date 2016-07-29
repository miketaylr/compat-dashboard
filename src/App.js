import React, { Component } from 'react';
import BugzillaTable from './BugzillaTable';
import WebCompatTable from './WebCompatTable';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <BugzillaTable type="Desktop"/>
        <BugzillaTable type="Mobile"/>
        <WebCompatTable/>
      </div>
    );
  }
}

export default App;
