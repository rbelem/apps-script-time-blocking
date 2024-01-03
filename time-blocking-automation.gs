const HALF_HOUR = 30 * 60 * 1000;

function main() {
  var mainCalendar = CalendarApp.getDefaultCalendar();
  var timeBlockingCalendar = CalendarApp.getCalendarsByName('Slots')[0];

  const now = new Date() //.setHours(0, 0, 0, 0);
  const nextWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);

  mainCalendar.getEvents(now, nextWeek).map((event) => {
    createCommuteEvents(timeBlockingCalendar, event);
  })
}

// var slotEvents = [
//   {
//     title: 'Slot Event 1',
//     duration: (30 * 60 * 1000),
//     when: 'before'
//   },
//   {
//     title: 'Slot Event 2',
//     duration: (30 * 60 * 1000),
//     when: 'after'
//   }
// ]
//
function slotExistsForEvent(slotsCalendar, event, slotEvents) {
  // TODO: find a way to match commute events when using maps api to calculate time
  var eventList = [];
  for (const slot of slotEvents) {
    var slotStartDate = slot.when === 'before'
      ? new Date(event.getStartTime().getTime() - slot.duration)
      : event.getEndTime();

    var slotEndDate = slot.when === 'before'
      ? event.getStartTime()
      : new Date(event.getEndTime().getTime() + slot.duration);

    eventList.push(slotsCalendar.getEvents(slotStartDate, slotEndDate, {search: slot.title}).length);
  }

  return !eventList.some((item) => item !== 1);
}

function createSlotEvents(slotsCalendar, event, slotEvents) {
  if (event.getLocation() === null || event.getLocation() === "") {
    return false;
  }

  if (slotExistsForEvent(slotsCalendar, event, slotEvents)) {
    console.log('Evento já processado');
    return false;
  }

  for (const slot of slotEvents) {
    var slotStartDate = slot.when === 'before'
      ? new Date(event.getStartTime().getTime() - slot.duration)
      : event.getEndTime();

    var slotEndDate = slot.when === 'before'
      ? event.getStartTime()
      : new Date(event.getEndTime().getTime() + slot.duration);

    slotsCalendar.createEvent(slot.title, slotStartDate, slotEndDate);
  }
}

function createCommuteEvents(commuteCalendar, event) {
  var slotEvents = [
    {
      title: 'Commute',
      duration: (30 * 60 * 1000),
      when: 'before'
    },
    {
      title: 'Commute home',
      duration: (30 * 60 * 1000),
      when: 'after'
    }
  ];

  // TODO: Check if event is recurrent and create commute events as recurrent as well
  // TODO: Calculate time using the maps api
  // https://www.bpwebs.com/get-google-map-travel-time-and-distance/
  // https://gist.github.com/lankanmon/2c50ad3675c0c4a834fda4ce4f910582
  createSlotEvents(commuteCalendar, event, slotEvents);
}
