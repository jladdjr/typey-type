import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import GoogleAnalytics from 'react-ga';
import PseudoContentButton from './PseudoContentButton';
import { IconExternal } from './Icon';
import { Tooltip } from 'react-tippy';
import {
  createWordListFromMetWords,
  loadPersonalPreferences,
  parseWordList,
} from './../utils/typey-type';
import {
  generateListOfWordsAndStrokes
} from './../utils/transformingDictionaries';

class CustomLessonSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customLessonWordsAndStrokes: [],
      customWordList: '',
      myWords: ''
    }
  }

  componentDidMount() {
    if (this.mainHeading) {
      this.mainHeading.focus();
    }

    if (this.props.globalLookupDictionary && this.props.globalLookupDictionary.size < 2 && !this.props.globalLookupDictionaryLoaded) {
      this.props.fetchAndSetupGlobalDict()
        .catch(error => {
          console.error(error);
          // this.showDictionaryErrorNotification();
        });
    }

    let metWords = loadPersonalPreferences()[0];
    this.addWordListToPage(metWords, this.props.globalLookupDictionary);

    this.setState({
      customLessonWordsAndStrokes: []
    });
  }

  handleWordsForDictionaryEntries(value, globalLookupDictionary = this.props.globalLookupDictionary) {
    let result = parseWordList(value);
    if (result && result.length > 0) {
      let customLessonWordsAndStrokes = generateListOfWordsAndStrokes(result, globalLookupDictionary);
      if (customLessonWordsAndStrokes && customLessonWordsAndStrokes.length > 0) {
        this.setState({
          customLessonWordsAndStrokes: customLessonWordsAndStrokes,
          customWordList: value
        });
      }
    }
  }

  handleWordListTextAreaChange(event) {
    if (event && event.target && event.target.value) {
      this.handleWordsForDictionaryEntries(event.target.value);
    }
    return event;
  }

  addWordListToPage(metWords, globalLookupDictionary) {
    let myWords = createWordListFromMetWords(metWords).join("\n");
    this.handleWordsForDictionaryEntries(myWords, globalLookupDictionary);
    this.setState({myWords: myWords});
  }

  render() {
    let filledPre = '';
    if (this.state.customLessonWordsAndStrokes.length > 0) {
      filledPre = "quote ";
    }

    let validationStateStyle = "";
    let listOfValidationMessages;
    switch (this.props.customLessonMaterialValidationState) {
      case "success":
        validationStateStyle = "b-success";
        break;
      case "fail":
        validationStateStyle = "b-danger";
        let listItemsOfValidationMessages = this.props.customLessonMaterialValidationMessages.map( (entry, index) => {
          return( <li key={index}>{ entry }</li>);
        });
        listOfValidationMessages = (
          <ul id="customLessonMaterialValidationMessages" className="unstyled-list bg-danger">{listItemsOfValidationMessages}</ul>
        );
        break;
      default:
        validationStateStyle = "";
    }

    const dictionaryEntries = this.state.customLessonWordsAndStrokes.map( (entry, index) => {
      return( `${entry.phrase}	${entry.stroke}`)
    }).join('\n');

    return (
      <main id="main">
        <div className="subheader">
          <div className="flex items-baseline mx-auto mw-1024 justify-between p3">
            <div className="flex mr1 self-center">
              <header className="flex items-baseline">
                <h2 ref={(heading) => { this.mainHeading = heading; }} tabIndex="-1" id="about-typey-type-for-stenographers">Create a custom lesson</h2>
              </header>
            </div>
          </div>
        </div>

          <div className="bg-info landing-page-section">
            <div className="p3 mx-auto mw-1024">
              <div className="mw-584 mt3">
                <div>
                  <p>To start a custom lesson, supply a list of words and their strokes. An easy way to create a lesson is to copy columns from a spreadsheet. See the&nbsp;&#8203;
                    <GoogleAnalytics.OutboundLink
                      eventLabel="community’s lessons"
                      to="https://docs.google.com/spreadsheets/d/1AlO2SSUwuv3yrz7RI9ix_z1Efbiu_j50c_ibGYwdsgc/edit?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      community’s lessons
                      <Tooltip
                        title="Opens in a new tab"
                        animation="shift"
                        arrow="true"
                        className=""
                        duration="200"
                        tabIndex="0"
                        tag="span"
                        theme="didoesdigital"
                        trigger="mouseenter focus click"
                        onShow={this.props.setAnnouncementMessage}
                      >
                        <IconExternal ariaHidden="true" role="presentation" iconWidth="24" iconHeight="24" className="ml1 svg-icon-wrapper svg-baseline" iconTitle="" />
                      </Tooltip>
                    </GoogleAnalytics.OutboundLink>.
                  </p>
                  <ul id="custom-material-format" className="text-small ml1 mt0 mb3">
                    <li>Each word must be on its own line.</li>
                    <li>Each word must be separated from its stroke by a "Tab" character.</li>
                    <li>If you skip strokes, multi-stroke words may count as misstrokes.</li>
                  </ul>
                  <label htmlFor="your-material">Enter your material here:</label>
                  <textarea
                    id="your-material"
                    aria-describedby="customLessonMaterialValidationMessages"
                    className={ "input-textarea mw100 w-100 mb3 h-168 overflow-scroll " + validationStateStyle }
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    placeholder="example	KP-PL
consisting of	KAOFG
examples.	KP-PLS TP-PL"
                    rows="8"
                    wrap="off"
                    onChange={this.props.createCustomLesson}
                    value={this.props.customLessonMaterial}
                    >
                  </textarea>
                  {listOfValidationMessages}
                  <div className="text-right">
                    {this.props.customLessonMaterialValidationState === "fail" ?
                      <button disabled={ true } className="link-button dib" style={{lineHeight: 2}}>Start custom lesson</button>
                        :
                      <Link to='/lessons/custom?study=practice&newWords=1&seenWords=1&retainedWords=1&sortOrder=sortOff&startFromWord=1' className="link-button dib text-right" style={{lineHeight: 2}} >Start custom lesson</Link>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white landing-page-section">
            <div className="p3 mx-auto mw-1024">
              <h3>Create Plover lesson using a word list</h3>
              <div className="gtc-4fr-3fr">
                <div>
                  <label htmlFor="your-words-for-dictionary-entries">Paste a word list without strokes here to create a custom lesson using Plover theory:</label>
                  <textarea
                    id="your-words-for-dictionary-entries"
                    className="input-textarea mw100 w-100 mb1 overflow-scroll"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    placeholder="capitalise
excluded
plover"
                    rows="8"
                    wrap="off"
                    onChange={this.handleWordListTextAreaChange.bind(this)}
                    >
                  </textarea>
                </div>
                <div>
                  <pre id="js-custom-lesson-dictionary-entries" className={filledPre + "h-168 overflow-scroll mw-384 mt1 mb3"}><code>{dictionaryEntries}</code></pre>
                  <PseudoContentButton className="js-clipboard-button link-button copy-to-clipboard" dataClipboardTarget="#js-custom-lesson-dictionary-entries">Copy custom lesson to clipboard</PseudoContentButton>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-info landing-page-section">
            <div className="p3 mx-auto mw-1024">
              <h3>Revise words you have seen</h3>
              <div className="gtc-4fr-3fr">
                <div>
                  <p>{this.state.myWords && this.state.myWords.length > 0 ? "Use your seen words to create a custom lesson:" : "Once you’ve made some progress, your words will appear here."}</p>
                  <pre
                    id="js-your-words-for-dictionary-entries"
                    className="quote h-168 overflow-scroll mw-384 mt1 mb3"
                    tabIndex="0"
                  ><code>{this.state.myWords}</code></pre>
                  <PseudoContentButton className="js-select-all-my-words link-button js-clipboard-button copy-to-clipboard" dataClipboardTarget="#js-your-words-for-dictionary-entries">Copy your words to clipboard</PseudoContentButton>
                </div>
                <div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white landing-page-section mb3">
            <div className="p3 mx-auto mw-1024">
              <div className="text-center">
                <h3>Share your lessons</h3>
                <p className="mb0">To help Typey Type grow even faster, add to the{' '}
                  <GoogleAnalytics.OutboundLink
                    aria-label="Community’s lessons (external link opens in new tab)"
                    eventLabel="community’s lessons"
                    to="https://docs.google.com/spreadsheets/d/1AlO2SSUwuv3yrz7RI9ix_z1Efbiu_j50c_ibGYwdsgc/edit?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    community’s lessons
                    <Tooltip
                      title="Opens in a new tab"
                      animation="shift"
                      arrow="true"
                      className=""
                      duration="200"
                      tabIndex="0"
                      tag="span"
                      theme="didoesdigital"
                      trigger="mouseenter focus click"
                      onShow={this.props.setAnnouncementMessage}
                    >
                      <IconExternal ariaHidden="true" role="presentation" iconWidth="24" iconHeight="24" className="ml1 svg-icon-wrapper svg-baseline" iconTitle="" />
                    </Tooltip>
                  </GoogleAnalytics.OutboundLink>.
                </p>{
                }
                <GoogleAnalytics.OutboundLink
                    aria-label="Community’s lessons (external link opens in new tab)"
                    eventLabel="Community’s lessons"
                    to="https://docs.google.com/spreadsheets/d/1AlO2SSUwuv3yrz7RI9ix_z1Efbiu_j50c_ibGYwdsgc/edit?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-button dib mt3"
                    style={{lineHeight: 2}}
                  >
                    Community’s lessons
                    <Tooltip
                      title="Opens in a new tab"
                      animation="shift"
                      arrow="true"
                      className=""
                      duration="200"
                      tabIndex="0"
                      tag="span"
                      theme="didoesdigital"
                      trigger="mouseenter focus click"
                      onShow={this.props.setAnnouncementMessage}
                    >
                      <IconExternal ariaHidden="true" role="presentation" iconWidth="24" iconHeight="24" className="ml1 svg-icon-wrapper svg-baseline" iconTitle="" />
                    </Tooltip>
                  </GoogleAnalytics.OutboundLink>
              </div>
            </div>
          </div>

      </main>
    )
  }

}

export default CustomLessonSetup;
