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
      <table>
        <caption>Tech Evangelism: {this.props.type}</caption>
        <thead>
        <tr>
          <th>Needs Triage</th>
          <th><a href={this.state.needsdiagnosisURL}>Needs Diagnosis</a></th>
          <th><a href={this.state.needscontactURL}>Needs Contact</a></th>
          <th><a href={this.state.contactreadyURL}>Contact Ready</a></th>
          <th><a href={this.state.sitewaitURL}>Site Wait</a></th>
        </tr>
        </thead>
        <tbody>
          <tr>
            <td>??</td>
            <td>{this.state.needsdiagnosis}</td>
            <td>{this.state.needscontact}</td>
            <td>{this.state.contactready}</td>
            <td>{this.state.sitewait}</td>
          </tr>
        </tbody>
      </table>
    )
  }
}

export default BugzillaTable;
