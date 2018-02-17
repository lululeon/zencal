import React, { Component } from 'react';
import EventCell from './EventCell';

export default class CalendarGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startdate: new Date('2018-02-01T00:00:00'), //this.props.startdate,
      enddate: new Date('2018-02-28T00:00:00'), //this.props.enddate,
      cells: [],
      showDetail:false
    };
    this.events = this.props.events || [];
    this.introdays = 7 - this.state.startdate.getDay(); // *idx* at cell prior to first day of month
    this.displayDays = 41; //6 rows (weeks) displayed on mthly calendars usually, therefore 6x7 days = 42, i.e. 0..41
    this.outrodaysStart = this.state.enddate.getDate() + this.introdays + 1; //cell at last valid day of month
    this.buildCells();
  }

  componentWillReceiveProps = (nextprops) => {
    if(this.events !== nextprops.events) {
      console.log('--- new props!');
      this.events = nextprops.events;
      let newcells = this.buildCells();
      this.setState({cells: newcells});
    }
  }
  buildCells = () => {
    //0=sunday, 1=mon...
    // let wkdaynums[0,1,2,3,4,5,6];
    // let D = 6; //max days in 0..6
    let introdays = this.introdays;
    let displayDays = this.displayDays;
    let outrodaysStart = this.outrodaysStart;
    // let W = 5 //max number of display weeks is 6 (0...5).
    // let w = 0 //display week (0..W)
    // let L = this.state.enddate.getDate(); // last day of the month is the Lth day out of 0..31.
    let d = 0; //day of the month
    let i = 0; //index display cells
    let j = 0; //index events list

    //FUTURE TODO: filter to time window only
    let evts = this.events.map((e) => {
      return ({ sdt: new Date(e.startdatetime), edt: new Date(e.enddatetime), ...e });
    });
    let numEvents = evts.length;

    let cells = [];
    let eventCells = [];    
    while (i <= displayDays) {//there are bunch of cells to display, regardless. loop thru 'em.
      let stylestr = '';
      if( (i > introdays) && (i < outrodaysStart) ) {//and some of these cells are relevant to the current month. css 'active'.
        stylestr = 'active';
        d++;
        if (j < numEvents) {//safely check if we have matching events
          while(j<numEvents) {
            let evtDate = evts[j].sdt.getDate();
            // console.log('==============', evts[j].startdatetime, evtDate, d, evts[j].title);
            if(evtDate === d) { //if an evt occurs on Nth day of month, and we're on cell for day N, display the event(s)!
              eventCells.push(<EventCell key={evts[j].key} evt={evts[j]} propagateClick={this.props.propagateClick} />);
              j++;
            } else {
              break;  //no more matches, so bail; return to advancing through display cell matrix
            }
          }
        }
      } else {
        stylestr = 'inactive';
      }
      cells.push(
        <div className={`zcal-cell ${stylestr}`} key={i}>
          {d}
          {eventCells}
        </div>
      );
      eventCells = [];
      i++;
    }//end while

    return(cells);
  }

  render() {
    return (
      <div className="zcal-grid">
        {this.state.cells}
      </div>
    );
  }
}