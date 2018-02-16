import React, { Component } from 'react';

export default class CalendarGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startdate: new Date('2018-02-01T00:00:00'), //this.props.startdate,
      enddate: new Date('2018-02-28T00:00:00'), //this.props.enddate,
      events: this.props.events //TODO: must be filtered to fit current time window and ORDERED.
    };
    this.cells = [];
    this.buildCells();
  }

  buildCells = () => {
    //0=sunday, 1=mon...
    // let wkdaynums[0,1,2,3,4,5,6];
    // let D = 6; //max days in 0..6
    let introdays = 7 - this.state.startdate.getDay(); // *idx* at cell prior to first day of month
    let displayDays = 41; //6 rows (weeks) displayed on mthly calendars usually, therefore 6x7 days = 42, i.e. 0..41
    let outrodaysStart = this.state.enddate.getDate() + introdays + 1; //cell at last valid day of month
    // let W = 5 //max number of display weeks is 6 (0...5).
    // let w = 0 //display week (0..W)
    let L = this.state.enddate.getDate(); // last day of the month is the Lth day out of 0..31.
    let d = 0; //day of the month
    let i = 0; //index display cells

    while (i <= displayDays) {//there are bunch of cells to display, regardless. loop thru 'em.
      let stylestr = '';
      if( (i > introdays) && (i < outrodaysStart) ) {//and some of these cells are relevant to the current month. css 'active'.
        stylestr = 'active';
        d++;
      } else {
        stylestr = 'inactive';
      }
      this.cells.push(
        <div className={`zcal-cell ${stylestr}`}>
          {d}
        </div>
      );
      i++;
    }
  }

  buildContent = () => {
    let j = 0; //index events list
    let evts = this.state.events.map((e) => {
      console.log('###',e);
      return ({ sdt: new Date(e.startdatetime), ...e });
    });
    console.log(evts);

  // let numEvents = evts.length;
  // while (i <= displayDays) {//there are bunch of cells to display, regardless. loop thru 'em.
  // let stylestr = '';
  // let eventsContent = [];
  // if( (i > introdays) && (i < outrodaysStart) ) {//and some of these cells are relevant to the current month. css 'active'.
  //   stylestr = 'active';
  //   d++;
  //   break;
  //   if (j < numEvents) {//safely check if we have matching events
  //     while(j<numEvents) {
  //       if(evts[j].sdt.getDate() == d) { //if an evt occurs on Nth day of month, and we're on cell for day N, display the event(s)!
  //         eventsContent.push(<p>{evts[j].title}</p>);
  //         j++;
  //       } else {
  //         break;  //no more matches, so bail; return to advancing through display cell matrix
  //       }
  //     }
  //   }
  // } else {
  //   stylestr = 'inactive';
  // }
  // {(d>0 && d<=L)? ({d}) : (<span>{i}</span>) }
  //   this.cells.push(
  //     <div class={`zcal-cell ${stylestr}`}>
  //       Hello {eventsContent}
  //     </div>
  //   );
  // }
  }

  render() {
    this.buildContent();
    return (
      <div className="zcal-grid">
        {this.cells}
      </div>
    );
  }
}