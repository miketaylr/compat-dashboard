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
      <table>
        <caption>webcompat.com</caption>
        <thead>
        <tr>
          <th><a href={this.state.needstriageURL}>Needs Triage</a></th>
          <th><a href={this.state.needsdiagnosisURL}>Needs Diagnosis</a></th>
          <th><a href={this.state.needscontactURL}>Needs Contact</a></th>
          <th><a href={this.state.contactreadyURL}>Contact Ready</a></th>
          <th><a href={this.state.sitewaitURL}>Site Wait</a></th>
        </tr>
        </thead>
        <tbody>
          <tr>
            <td>{this.state.needstriage}</td>
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
