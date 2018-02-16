import React, { Component } from 'react';
import AddEventForm from './components/AddEventForm';
import CalendarGrid from './components/CalendarGrid';
import fire from './utils/firebase';

// const CalendarEvent = ({ evt }) => {
//   return (
//     <div>
//       <h3>{evt.title}</h3>
//       <p>{evt.startdatetime}</p>
//       <p>{evt.enddatetime}</p>
//       <p>{evt.category}</p>
//     </div>
//   );
// };


class App extends Component {
  constructor(props) {
    super(props);
    this.dbRef = null;
    this.throttle = true;
    this.state = {
      alertType: 'info', //danger|warning|info
      alertMessage: '',
      currentEvent: {},
      events: [],
      addingEvent: false
    };
  }

  componentDidMount = () => {
    /* Create reference to the events in the  Firebase Database */
    this.dbRef = fire.database().ref('events').orderByChild('startdatetime').limitToLast(100); //get the latest 100

    /* Pull data */
    this.dbRef.once('value', snapshot => {//'once' instead of 'on' listener... else gets hella noisy in here.
      let responsedata = snapshot.val();
      let evts = [];

      //because what we *actually* get back from val() is a list of <key, object> items... ??
      for (let key in responsedata) {
        evts.push({
          ...responsedata[key],
          key
        });
      }
      this.setState({ events: evts });
    });

    //listen for adds
    this.addListenerRef = this.dbRef.on('child_added', newEvt => {
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

  cancelAddEvent = () => {
    this.setState({ addingEvent: false });
  }

  handleEventEdits = (evt) => {
    let newEdits = Object.assign(this.state.currentEvent, evt);
    this.setState({ currentEvent: newEdits });
  }

  validateEvent = (e) => {
    e.preventDefault();
    let valid = false;

    // let evt = this.state.currentEvent;

    //dummy evt for now
    let evt = {
      title: 'An amazing thing will happen',
      startdatetime: '2018-02-23T13:30:00.000',
      enddatetime: '2018-02-23T15:00:00.000',
      category: 'business',
    };

    valid = true;

    //save or reject submission.
    if (valid) {
      fire.database().ref('events').push(evt);
    } else {
      this.setState({
        alertType: 'warning',
        alertMessage: 'Please update your event'
      }, this.clearAlert);
    }
  }

  updateEvent = (e) => {
    e.preventDefault();
    let evt = this.state.currentEvent;
    fire.database().ref('events/' + evt.key).set({ ...evt });
  }

  render() {
    //let eventList = this.state.events.map((evt, idx) => <CalendarEvent evt={evt} key={idx} />);
    return (
      <div className="container zcal-app">
        <div className="row align-items-start">
          <div className="col-3 zcal-userpanel">
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
            <div className="row zcal-controls">
              <button type="button" className="btn btn-info" onClick={this.beginAddEvent}>Add a new event</button>
            </div>
            {(this.state.addingEvent) ? (
              <React.Fragment>
                <div className="row zcal-add-panel">
                  <AddEventForm notifyOnChange={this.handleEventEdits} />
                </div>
                <div className="row btn-toolbar zcal-controls" role="toolbar">
                  <button type="button" className="btn btn-light" onClick={this.cancelAddEvent}>Cancel</button>
                  <button type="button" className="btn btn-info" onClick={this.validateEvent}>Add to Calendar</button>
                </div>
              </React.Fragment>
            ) : null}
          </div>
          <div className="col-9 zcal-viewpane">
            <div className="row zcal-header">
              <h1>Your Schedule</h1>
            </div>
            <CalendarGrid events={this.state.events}/>
          </div>
        </div>
      </div>
    );
  }

}

export default App;
