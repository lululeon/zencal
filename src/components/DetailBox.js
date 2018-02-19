import React, {Component} from 'react';

export default class DetailBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.event,
      editing:false
    };
  }

  onInputChange = (e) => {
    let tmpState = {};
    let fieldName = e.target.name;
    tmpState[fieldName] = e.target.value;
    this.setState(tmpState);
  }
  startEdits = (e) => {
    e.preventDefault();
    this.setState({editing:true});

  }

  saveEdits = (e) => {
    e.preventDefault();
    let evt = {key: this.state.key, title:this.state.title, startdatetime:this.state.startdatetime, enddatetime:this.state.enddatetime, category:this.state.category};
    this.props.onSave(evt);
    //this.props.onDismiss();
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
                <label htmlFor="startdatetime">Event Start</label>
                <input type="text" className="form-control" name="startdatetime" value={this.state.startdatetime} onChange={ this.onInputChange } />
                <label htmlFor="enddatetime">Event End</label>
                <input type="text" className="form-control" name="enddatetime" value={this.state.enddatetime} onChange={ this.onInputChange } />
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