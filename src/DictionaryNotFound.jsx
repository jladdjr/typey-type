import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router-dom';

class DictionaryNotFound extends Component {
  componentDidMount() {
    if (this.mainHeading) {
      this.mainHeading.focus();
    }
  }

  prefillSurveyLink() {
    // TODO: create a new feedback form just for dictionary feedback
    // fullURL = "https://docs.google.com/forms/d/e/1FAIpQLSda64Wi5L-eVzZVo6HLJ2xnD9cu83H2-2af3WEE2atFiaoKyw/viewform?usp=pp_url&entry.1884511690=dictionary&entry.1202724812&entry.936119214";
    let googleFormURL = "https://docs.google.com/forms/d/e/1FAIpQLSda64Wi5L-eVzZVo6HLJ2xnD9cu83H2-2af3WEE2atFiaoKyw/viewform?usp=pp_url&entry.1884511690="
    let param = "&entry.1202724812&entry.936119214";
    let prefillDictionary = '';
    if (this.props.location && this.props.location.pathname) {
      prefillDictionary = this.props.location.pathname;
    }
    if (this.surveyLink) {
      this.surveyLink.href = googleFormURL + encodeURIComponent(prefillDictionary) + param;
    }
  }

  render() {
    return (
      <DocumentTitle title={'Typey Type | Missing dictionary'}>
        <main id="main">
          <div className="subheader">
            <div className="flex flex-wrap items-baseline mx-auto mw-1024 justify-between p3">
              <div className="flex mr1 self-center">
                <header className="flex items-baseline">
                  <h2 className="table-cell mr2" ref={(heading) => { this.mainHeading = heading; }} tabIndex="-1">Missing dictionary</h2>
                </header>
              </div>
            </div>
          </div>
          <div className="mx-auto mw-1024 p3">
            <div className="mw-568">
              <p className="mt3">That dictionary couldn’t be found. Try another:</p>
              <ul>
                <li><Link to="/dictionaries">All dictionaries</Link></li>
              </ul>
              <p>Or <a href={this.prefillSurveyLink()} target="_blank" ref={(surveyLink) => { this.surveyLink = surveyLink; }} onClick={this.prefillSurveyLink.bind(this)} id="ga--dictionary--give-feedback">let me know (form opens in a new tab)</a></p>
            </div>
          </div>
        </main>
      </DocumentTitle>
    );
  }
}

export default DictionaryNotFound;
