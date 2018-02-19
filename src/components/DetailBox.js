import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-bootstrap-time-picker';
import * as moment from 'moment';
import {makeDateTimeString} from '../utils/datemanip' ;

import 'react-datepicker/dist/react-datepicker.css';

export default class DetailBox extends Component {
  constructor(props) {
    super(props);
    let _editing:false;
    if(this.props.event) {
      this.state = {
        startdate: moment(this.props.event.startdatetime),
        enddate: moment(this.props.event.enddatetime),
        starttime: '00:00', //todo
        endtime: '00:00',//todo
        editing: _editing,
        ...this.props.event
      };
    } else {
      this.state = {
        startdate: moment(),
        enddate: moment(),
        starttime: '00:00', //todo
        endtime: '00:00',//todo
        editing: _editing,
        title: '',
        startdatetime: moment().format('LL'),
        enddatetime: moment().format('LL'),
        category: 'General Appointment'
      };
    }
  }

  onInputChange = (e) => {
    let tmpState = {};
    let fieldName = e.target.name;
    tmpState[fieldName] = e.target.value;
    this.setState(tmpState);
  }

  onStartDateChange = (date) => { this.setState({startdate: date});  }
  onEndDateChange = (date) => { this.setState({enddate: date});  }

  startEdits = (e) => {
    e.preventDefault();
    this.setState({editing:true});
  }

  saveEdits = (e) => {
    e.preventDefault();
    
    //normalize:
    let startdatetime = makeDateTimeString(this.state.startdate, this.state.starttime);
    let enddatetime = makeDateTimeString(this.state.enddate, this.state.endtime);

    //TODO

    // let evt = {key: this.state.key, title:this.state.title, startdatetime:this.state.startdatetime, enddatetime:this.state.enddatetime, category:this.state.category};
    // this.props.onSave(evt);
  }

  delete = (e) => {
    e.preventDefault();
    let evt = {key: this.state.key, title:this.state.title, startdatetime:this.state.startdatetime, enddatetime:this.state.enddatetime, category:this.state.category};
    this.props.onDelete(evt);
    this.props.onDismiss();
  }

  render() {
    let labelCaption = (this.props.newevent) ? 'New Event: ' : 'Updating:' ;
    let labelAction = (this.props.newevent) ? 'Save' : 'Update Event';
    return (
      
      <div className="card zcal-detail">
        {(this.state.editing || this.props.newevent)?(
          <form>
            <div className="card-body form-group">
              <h5 className="card-title">{labelCaption} {this.state.title}</h5>
              <div className="card-text">
                <label htmlFor="title">Event Title</label>
                <input type="text" className="form-control" name="title" value={this.state.title} onChange={ this.onInputChange } />
                <label htmlFor="startdate">Event Start</label>
                <DatePicker className="form-control" name="startdate"
                  selected={this.state.startdate}
                  onChange={this.onStartDateChange}
                  dateFormat="LL"
                />
                <TimePicker start="00:00" end="23:59" step={5} name="starttime" onChange={this.onStartTimeChange}/>
                {/*<input type="text" className="form-control" name="startdatetime" value={this.state.startdatetime} onChange={ this.onInputChange } />*/}
                <label htmlFor="enddate">Event End</label>
                <DatePicker className="form-control" name="enddate"
                  selected={this.state.enddate}
                  onChange={this.onEndDateChange}
                  dateFormat="LL"
                />
                {/*<input type="text" className="form-control" name="enddatetime" value={this.state.enddatetime} onChange={ this.onInputChange } />*/}
                <label htmlFor="title">Category</label>
                <input type="text" className="form-control" name="category" value={this.state.category} onChange={ this.onInputChange } />
              </div>
            </div>
          </form>
        ) : (
          <div className="card-body">
            <h5 className="card-title">{this.props.event.title}</h5>
            <div className="card-text">
              <p>start: {this.props.event.startdatetime}</p>
              <p>end: {this.props.event.enddatetime}</p>
            </div>
          </div>
        )}
        {(this.state.editing || this.props.newevent)?(
          <div className="card-footer">
            <div className="row btn-toolbar zcal-controls" role="toolbar">
              <button type="button" className="btn btn-outline-secondary" onClick={this.props.onDismiss}>Cancel</button>
              <button type="button" className="btn btn-info" onClick={this.saveEdits}>{labelAction}</button>
            </div>
          </div>
        ):(
          <div className="card-footer">
            <div className="row btn-toolbar zcal-controls" role="toolbar">
              <button type="button" className="btn btn-outline-secondary" onClick={this.props.onDismiss}>Cancel</button>
              <button type="button" className="btn btn-info" onClick={this.startEdits}>Edit</button>
              <button type="button" className="btn btn-danger" onClick={this.delete}>Delete</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}