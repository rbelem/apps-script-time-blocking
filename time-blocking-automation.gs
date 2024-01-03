const HALF_HOUR = 30 * 60 * 1000;

function main() {
  var mainCalendar = CalendarApp.getDefaultCalendar();
  var timeBlockingCalendar = CalendarApp.getCalendarsByName('Slots')[0];

  const now = new Date() //.setHours(0, 0, 0, 0);
  const nextWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7)

  mainCalendar.getEvents(now, nextWeek).map((event) => {
    createCommuteEvents(timeBlockingCalendar, event);
  })
}

function commuteExistsForEvent(commuteCalendar, event) {
  // TODO: find a way to match commute events when using maps api to calculate time
  var commuteStartDate = new Date(event.getStartTime().getTime() - HALF_HOUR);
  var commuteEndDate = event.getStartTime();
  var commuteEventList = commuteCalendar.getEvents(commuteStartDate, commuteEndDate, {search: 'Commute'});

  var commuteHomeStartDate = event.getEndTime();
  var commuteHomeEndDate = new Date(event.getEndTime().getTime() + HALF_HOUR);
  var commuteHomeEventList = commuteCalendar.getEvents(commuteHomeStartDate, commuteHomeEndDate, {search: 'Commute home'});

  return (commuteEventList.length > 0 && commuteHomeEventList.length > 0) ? true : false;
}

function createCommuteEvents(commuteCalendar, event) {
  if (event.getLocation() === null || event.getLocation() === "") {
    return false;
  }

  if (commuteExistsForEvent(commuteCalendar, event)) {
    console.log('Evento já processado');
    return false;
  }

  // TODO: Check if event is recurrent and create commute events as recurrent as well
  var commuteStartDate = new Date(event.getStartTime().getTime() - HALF_HOUR);
  var commuteEndDate = event.getStartTime();
  commuteCalendar.createEvent('Commute', commuteStartDate, commuteEndDate);

  var commuteHomeStartDate = event.getEndTime();
  // TODO: Calculate time using the maps api
  // https://www.bpwebs.com/get-google-map-travel-time-and-distance/
  // https://gist.github.com/lankanmon/2c50ad3675c0c4a834fda4ce4f910582
  var commuteHomeEndDate = new Date(event.getEndTime().getTime() + HALF_HOUR);
  commuteCalendar.createEvent('Commute home', commuteHomeStartDate, commuteHomeEndDate);
}
