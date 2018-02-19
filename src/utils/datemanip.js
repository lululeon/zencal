//TODO: optimize by converting to class defn, take evt as constructor param, do all validation here => less moment() calls.
import * as moment from 'moment';

export function isValidDate (datetimestr) {
  return ( moment(datetimestr, moment.ISO_8601).isValid() );
}

export function isHistoricaldate (datetimestr) {
  let now = moment();
  let dt = moment(datetimestr, moment.ISO_8601);
  return (now.diff(dt) > 0) ? true : false; //huh: coulda used .isbefore(). refactor later.
}

export function endIsAfterStart (dtstrStart, dtstrEnd) {
  let start = moment(dtstrStart, moment.ISO_8601);
  let end = moment(dtstrEnd, moment.ISO_8601);
  return (end.diff(start) > 0) ? true : false; 
}

export function secondsToTimeString (tseconds) {
  //got this from stackoverflow!
  var minutes = Math.floor(tseconds / 60);
  tseconds = tseconds%60;
  var hours = Math.floor(minutes/60);
  minutes = minutes%60;
  return pad(hours)+':'+pad(minutes)+':'+pad(tseconds);
}


export function makeDateTimeString (momentDate, tseconds) {//normalize values
//TODO
}


function pad(num) {
  return ('0'+num).slice(-2);
}
