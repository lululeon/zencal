import React, { Component } from 'react';
import CalendarGrid from './components/CalendarGrid';
import DetailBox from './components/DetailBox';
import fire from './utils/firebase';

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
      title:'Event name',
      startdatetime:'1970-01-01T00:00:00',
      enddatetime:'1970-01-01T00:00:00',
      category:'General Appointment'
    };
  }

  componentDidMount = () => {
    /* Create reference to the events in the  Firebase Database */
    this.dbRef = fire.database().ref('events').orderByChild('startdatetime').limitToLast(100); //get the latest 100

    /* Pull data */
    this.dbRef.on('value', snapshot => {//'once' instead of 'on' listener... else gets hella noisy in here.
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

    //listen for adds
    this.dbRef.on('child_added', newEvt => {
      if (!this.throttle) this.setState({ events: [...this.state.events, newEvt] });
    });

    this.clearThrottle();
  }

  clearThrottle = () => {
    setTimeout(() => {
      this.throttle = false;
    }, 3000);
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
    this.setState({ addingEvent: false, currentEvent:null });
  }

  validateEvent = (evt) => {
    let valid = false;
    valid = true;

    //TODO: validation

    //save or reject submission.
    if (valid) {
      this.saveEvent(evt);
    } else {
      this.setState({
        alertType: 'warning',
        alertMessage: 'Please update your event'
      }, this.clearAlert);
    }
  }

  saveEvent = (evt) => {
    console.log('*** adding...', evt);
    fire.database().ref('events').push({title:evt.title, startdatetime:evt.startdatetime, enddatetime:evt.enddatetime, category:evt.category });
  }

  updateEvent = (evt) => {
    console.log('*** updating...', evt);
    fire.database().ref('events/' + evt.key).set({ title:evt.title, startdatetime:evt.startdatetime, enddatetime:evt.enddatetime, category:evt.category });
  }

  deleteEvent = (evt) => {
    console.log('*** deleting...', evt);
    fire.database().ref('events/' + evt.key).remove();
  }

  onCalendarEventClick = (evt) => {
    this.setState({
      currentEvent: evt,
    }, this.clearAlert);
  }

  render() {
    //let eventList = this.state.events.map((evt, idx) => <CalendarEvent evt={evt} key={idx} />);
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
