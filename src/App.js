import React, { Component } from 'react';
import CalendarGrid from './components/CalendarGrid';
import DetailBox from './components/DetailBox';
import fire from './utils/firebase';
import * as datemanip from './utils/datemanip';

class App extends Component {
  constructor(props) {
    super(props);
    this.dbRef = null;
    this.throttle = true;
    this.state = {
      alertType: 'info', //danger|warning|info
      alertMessage: '',
      currentEvent: null,
      events: [],
      editingEvent: false,
      addingEvent: false
    };
    this.emptyEvent = {
      title:'',
      startdatetime:'1970-01-01T00:00:00',
      enddatetime:'1970-01-01T00:00:00',
      category:'General Appointment'
    };
  }

  componentDidMount = () => {
    /* Create reference to the events in the  Firebase Database */
    this.dbRef = fire.database().ref('events').orderByChild('startdatetime').limitToLast(100); //get the latest 100

    /* Pull data - all events seem to additionally trigger value. Totally nonperformant, but for simplicity's sake using 'on' instead of 'once' for now:*/
    this.dbRef.on('value', snapshot => {
      //console.log('---value!!!', snapshot.val());
      let responsedata = snapshot.val();
      let evts = [];

      //because what we *actually* get back from val() is a list of <key, object> items... ??
      for (let key in responsedata) {
        evts.push({
          ...responsedata[key],
          key
        });
      }

      //because firebase doesn't actually sort anything, inspite of instructions to do so and an index to boot... GRRR!!!
      evts.sort((a,b) => {
        let rtnval = (a.startdatetime.localeCompare(b.startdatetime) < 0) ? -1 : 1;
        // console.log( 'comparing', a.startdatetime, 'against', b.startdatetime, 'yields:', rtnval);
        return (rtnval);
      });

      this.setState({ events: evts });
    });
  }

  clearAlert = () => {
    setTimeout(() => {
      this.setState({ alertType: 'info', alertMessage: '' });
    }, 3000);
  }

  beginAddEvent = () => {
    this.setState({ addingEvent: true });
  }

  dismissEvent = () => {
    this.setState({ addingEvent: false, currentEvent:null }, this.clearAlert);
  }

  //TODO: this should be abstracted away into datemanip instance
  validateEvent = (evt) => {
    let errormsgs = [];

    //>>> Input validations / sanity checks
    if(evt.title.trim() === '') {
      errormsgs.push('Please enter a brief title to describe your event.');
    }
    if(!datemanip.isValidDate(evt.startdatetime)) errormsgs.push('The starting date or time is not valid - please correct and try again.');
    if(!datemanip.isValidDate(evt.enddatetime)) errormsgs.push('The ending date or time is not valid - please correct and try again.');
    if(errormsgs.length > 0) {
      errormsgs = errormsgs.map( (e,k) => (<li key={k}>{e}</li>) );
      this.setState({
        alertType: 'danger',
        alertMessage: (<div><p>Please correct these issues: </p><ul>{errormsgs}</ul></div>)
      }, this.clearAlert);
      return false;
    }

    //<<< input validations

    //>>> Date validations
    if( datemanip.isHistoricaldate(evt.startdatetime) || datemanip.isHistoricaldate(evt.enddatetime) ) {
      this.setState({
        alertType: 'danger',
        alertMessage: 'Please ensure your event is not in the past! It must start and finish in the future.'
      }, this.clearAlert);
      return false;
    }
    if( datemanip.endIsAfterStart(evt.startdatetime) || datemanip.isHistoricaldate(evt.enddatetime) ) {
      this.setState({
        alertType: 'danger',
        alertMessage: 'Your event finishes before it starts! Please correct when it starts / when it ends.'
      }, this.clearAlert);
      return false;
    }
    //<<<

    return true;
  }

  saveEvent = (evt) => {
    // console.log('*** adding...', evt);
    if(this.validateEvent(evt)){
      fire.database().ref('events').push({title:evt.title, startdatetime:evt.startdatetime, enddatetime:evt.enddatetime, category:evt.category });
      this.setState({
        alertType: 'success',
        alertMessage: 'New event added'
      }, this.dismissEvent);
    }
  }

  updateEvent = (evt) => {
    // console.log('*** updating...', evt);
    if(this.validateEvent(evt)){
      fire.database().ref('events/' + evt.key).set({ title:evt.title, startdatetime:evt.startdatetime, enddatetime:evt.enddatetime, category:evt.category });
      this.setState({
        alertType: 'success',
        alertMessage: 'Event update'
      }, this.dismissEvent);
    }
  }

  deleteEvent = (evt) => {
    // console.log('*** deleting...', evt);
    fire.database().ref('events/' + evt.key).remove();
  }

  onCalendarEventClick = (evt) => {
    this.setState({
      currentEvent: evt,
    }, this.clearAlert);
  }

  render() {
    //let eventList = this.state.events.map((evt) => <p key={evt.key}>{evt.title}  </p>);
    return (
      <div className="container zcal-app">
        <div className="row align-items-start">
          <div className="col-4 zcal-userpanel">
            <div className="row zcal-header">
              <h1>Zen Cal</h1>
            </div>
            <div className="row zcal-intro">
              <p>Calmly take control of your schedule with Zen Calendar</p>
            </div>
            {(this.state.alertMessage !== '') ? (
              <div className={`alert alert-${this.state.alertType}`} role="alert">
                {this.state.alertMessage}
              </div>
            ) : null}
            {(this.state.currentEvent) ? (
              <div className="zcal-detailviewpane">
                <DetailBox event={this.state.currentEvent} onDismiss={this.dismissEvent} onSave={this.updateEvent} onDelete={this.deleteEvent} />
              </div>
            ):null}
            {(this.state.addingEvent) ? (
              <div className="zcal-detailviewpane">
                <DetailBox event={this.emptyEvent} onDismiss={this.dismissEvent} onSave={this.saveEvent} onDelete={this.deleteEvent} newevent={true}/>
              </div>
            ) : null}
            {(!this.state.addingEvent && !this.state.currentEvent) ? (
              <div className="row zcal-controls">
                <button type="button" className="btn btn-info" onClick={this.beginAddEvent}>Add a new event</button>
              </div>
            ):null}
          </div>
          <div className="col-8 zcal-viewpane">
            <div className="row zcal-header">
              <h1>Your Schedule</h1>
            </div>
            <CalendarGrid events={this.state.events} propagateClick={this.onCalendarEventClick} />
          </div>
        </div>
      </div>
    );
  }

}

export default App;
