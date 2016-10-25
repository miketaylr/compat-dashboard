import React, { Component } from 'react';
import $ from 'jquery';

const WEBCOMPAT_URL = "https:/webcompat.com/issues?";
const GITHUB_API_URL = "https://api.github.com/repos/webcompat/web-bugs/issues?per_page=100&";

const queries = {
  needsdiagnosis: "state=open&labels=status-needsdiagnosis",
  needscontact: "state=open&labels=status-needscontact",
  needstriage: "state=open&labels=status-needstriage",
  contactready: "state=open&labels=status-contactready",
  sitewait: "state=open&labels=status-sitewait"
};

class BugzillaTable extends Component {
  constructor(props) {
    super(props);
    // TODO: read from localStorage, unless needs to be invalidated.
    this.state = {
      needstriage: "0",
      needsdiagnosis: "0",
      needscontact: "0",
      contactready: "0",
      sitewait: "0"
    };

    this.convertURL = this.convertURL.bind(this);
  }

  convertURL(queryURL) {
    //convert from labels=status-needsdiagnosis to stage=needsdiagnosis
    let status = queryURL.split('&')[1];
    return `stage=${status.replace('labels=status-', '')}`;
  }

  componentDidMount() {
    Object.getOwnPropertyNames(queries).forEach((bugState) => {
      let query = queries[bugState];

      $.ajax({
        url: `${GITHUB_API_URL}${query}`,
        crossDomain:true,
        dataType: 'json',
        ifModified: true,
        success: (data, status) => {
          if (status === 'success') {
            //TODO: if data.length > 100, traverse pagination.
            // wowowow
            this.setState({
              [bugState]: data.length === 100 ? "100+" : data.length,
              [`${bugState}URL`]: `${WEBCOMPAT_URL}${this.convertURL(query)}`
            });
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          alert(textStatus);
        }
      });
    });
  }

  render() {
    return (
      <div className="App-item">
        <h2 className="App-item-title">Webcompat.com</h2>
        <div className="App-item-cards">
          <div className="App-card App-card--needsTriage">
            <div className="App-card-number">{this.state.needstriage}</div>
            <div className="App-card-title">Needs Triage</div>
          </div>
          <a className="App-card App-card--link App-card--needsDiagnosis" href={this.state.needsdiagnosisURL}>
            <div className="App-card-number">{this.state.needsdiagnosis}</div>
            <div className="App-card-title">Needs Diagnosis</div>
          </a>
          <a className="App-card App-card--link App-card--needsContact" href={this.state.needscontactURL}>
            <div className="App-card-number">{this.state.needscontact}</div>
            <div className="App-card-title">Needs Contact</div>
          </a>
          <a className="App-card App-card--link App-card--contactReady" href={this.state.contactreadyURL}>
            <div className="App-card-number">{this.state.contactready}</div>
            <div className="App-card-title">Contact Ready</div>
          </a>
          <a className="App-card App-card--link App-card--siteWait" href={this.state.sitewaitURL}>
            <div className="App-card-number">{this.state.sitewait}</div>
            <div className="App-card-title">Site Wait</div>
          </a>
        </div>
      </div>
    )
  }
}

export default BugzillaTable;
