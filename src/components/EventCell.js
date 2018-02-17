import React, { Component } from 'react';

export default class EventCell extends Component {
  constructor(props) {
    super(props);
    this.state = {...this.props.evt };
  }

  showDetail = () => {
    this.props.propagateClick(this.state);
  }

  render(){
    return(
      <div className="zcal-evt" key={this.state.key} onClick={this.showDetail}>{this.state.title}
      </div>
    );
  }
}