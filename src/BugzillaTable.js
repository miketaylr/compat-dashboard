import React, { Component } from 'react';
import $ from 'jquery';

const BUGZILLA_URL = "https://bugzilla.mozilla.org/buglist.cgi?";
const BUGZILLA_REST_URL = "https://bugzilla.mozilla.org/rest/bug?";

const queries = {
  desktop: {
    needsdiagnosis: "list_id=13129840&status_whiteboard_type=anywordssubstr&status_whiteboard=needsdiagnosis&priority=--&priority=P1&priority=P2&priority=P3&priority=P4&resolution=---&query_format=advanced&bug_status=UNCONFIRMED&bug_status=NEW&bug_status=ASSIGNED&bug_status=REOPENED&component=Desktop&product=Tech%20Evangelism",
    needscontact: "list_id=13129839&status_whiteboard_type=anywordssubstr&status_whiteboard=needscontact&priority=--&priority=P1&priority=P2&priority=P3&priority=P4&resolution=---&query_format=advanced&bug_status=UNCONFIRMED&bug_status=NEW&bug_status=ASSIGNED&bug_status=REOPENED&component=Desktop&product=Tech%20Evangelism",
    contactready: "list_id=13129836&status_whiteboard_type=anywordssubstr&status_whiteboard=contactready&priority=--&priority=P1&priority=P2&priority=P3&priority=P4&resolution=---&query_format=advanced&bug_status=UNCONFIRMED&bug_status=NEW&bug_status=ASSIGNED&bug_status=REOPENED&component=Desktop&product=Tech%20Evangelism",
    sitewait: "list_id=13129830&status_whiteboard_type=anywordssubstr&status_whiteboard=sitewait&priority=--&priority=P1&priority=P2&priority=P3&priority=P4&resolution=---&query_format=advanced&bug_status=UNCONFIRMED&bug_status=NEW&bug_status=ASSIGNED&bug_status=REOPENED&component=Desktop&product=Tech%20Evangelism"
  },
  mobile: {
    needsdiagnosis: "list_id=13129841&status_whiteboard_type=anywordssubstr&bug_status=UNCONFIRMED&bug_status=NEW&bug_status=ASSIGNED&bug_status=REOPENED&component=Mobile&product=Tech%20Evangelism&status_whiteboard=needsdiagnosis&priority=--&priority=P1&priority=P2&priority=P3&priority=P4&resolution=---&query_format=advanced",
    needscontact: "list_id=13129837&status_whiteboard_type=anywordssubstr&status_whiteboard=needscontact&priority=--&priority=P1&priority=P2&priority=P3&priority=P4&resolution=---&query_format=advanced&bug_status=UNCONFIRMED&bug_status=NEW&bug_status=ASSIGNED&bug_status=REOPENED&component=Mobile&product=Tech%20Evangelism",
    contactready: "list_id=13129835&status_whiteboard_type=anywordssubstr&status_whiteboard=contactready&priority=--&priority=P1&priority=P2&priority=P3&priority=P4&resolution=---&query_format=advanced&bug_status=UNCONFIRMED&bug_status=NEW&bug_status=ASSIGNED&bug_status=REOPENED&component=Mobile&product=Tech%20Evangelism",
    sitewait: "list_id=13129833&status_whiteboard_type=anywordssubstr&status_whiteboard=sitewait&priority=--&priority=P1&priority=P2&priority=P3&priority=P4&resolution=---&query_format=advanced&bug_status=UNCONFIRMED&bug_status=NEW&bug_status=ASSIGNED&bug_status=REOPENED&component=Mobile&product=Tech%20Evangelism"
  },
}

class BugzillaTable extends Component {
  constructor(props) {
    super(props);
    // TODO: read from localStorage, unless needs to be invalidated.
    this.state = {
      needsdiagnosis: "0",
      needscontact: "0",
      contactready: "0",
      sitewait: "0"
    };
  }

  componentDidMount() {
    let queryType = this.props.type.toLowerCase();

    Object.getOwnPropertyNames(queries[queryType]).forEach((bugState) => {
      let query = queries[queryType][bugState];

      $.ajax({
        url: `${BUGZILLA_REST_URL}${query}&count_only=1`,
        crossDomain:true,
        dataType: 'json',
        ifModified: true,
        success: ({bug_count}, status) => {
          if (status === 'success') {
            // wowowow
            this.setState({
              [bugState]: bug_count,
              [`${bugState}URL`]: `${BUGZILLA_URL}${query}`
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
        <h2 className="App-item-title">Tech Evangelism: {this.props.type}</h2>
        <div className="App-item-cards">
          <div className="App-card App-card--needsTriage">
            <div className="App-card-number">???</div>
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
