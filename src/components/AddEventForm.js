import React, { Component } from 'react';
import DatePicker from 'react-date-picker';

export default class AddEventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromDate: new Date(),
      toDate: new Date()
    };
  }

  updateFromDate = fromDate => {
    this.setState({ fromDate });
    this.props.notifyOnChange(this.state);
  }

  updateToDate = toDate => {
    this.setState({ toDate });
    this.props.notifyOnChange(this.state);
  }

  render() {
    return(
      <div className="card zcal-add-form">
        <div className="card-body">
          <h5 className="card-title">New event</h5>
          <p className="card-text">Enter a brief title for the event</p>
          <DatePicker onChange={this.updateFromDate} value={this.state.fromDate} />
          <DatePicker onChange={this.updateToDate} value={this.state.toDate} />
        </div>
        <div className="card-body">
        </div>
      </div>
    );
  }
}