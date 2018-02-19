import React, { Component } from 'react';

export default class EventCell extends Component {

  showDetail = () => {
    this.props.propagateClick(this.props.evt);
  }

  render(){
    return(
      <div className="zcal-evt" key={this.props.evt.key} onClick={this.showDetail}>{this.props.evt.title}
      </div>
    );
  }
}