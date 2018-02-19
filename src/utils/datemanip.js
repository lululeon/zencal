//TODO: optimize by converting to class defn, take evt as constructor param, do all validation here => less moment() calls.
import * as moment from 'moment';

export function isValidDate (datetimestr) {
  return ( moment(datetimestr, moment.ISO_8601).isValid() );
}

export function isHistoricaldate (datetimestr) {
  let now = moment();
  let dt = moment(datetimestr, moment.ISO_8601);
  return (now.diff(dt) > 0) ? true : false; 
}

export function endIsAfterStart (dtstrStart, dtstrEnd) {
  let start = moment(dtstrStart, moment.ISO_8601);
  let end = moment(dtstrEnd, moment.ISO_8601);
  return (end.diff(start) > 0) ? true : false; 
}
