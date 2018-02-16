import React from 'react';

class DetailBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.event
    };
  }

  render() {
    return (
      <div className="card zcal-detail">
        <div className="card-body">
          <h5 className="card-title">{this.props.event.title}</h5>
          <div className="card-text">
            <p>start: {this.props.event.startdatetime}</p>
            <p>end: {this.props.event.enddatetime}</p>
          </div>
        </div>
        <div className="card-footer">
        </div>
      </div>
    );
  }
}

export default DetailBox;