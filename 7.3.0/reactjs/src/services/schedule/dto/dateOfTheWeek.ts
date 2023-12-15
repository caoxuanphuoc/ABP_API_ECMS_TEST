enum DayOfTheWeek {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

const DayOfWeek: { [key in DayOfTheWeek]: string } = {
  [DayOfTheWeek.Monday]: "Monday",
  [DayOfTheWeek.Tuesday]: "Tuesday",
  [DayOfTheWeek.Wednesday]: "Wednesday",
  [DayOfTheWeek.Thursday]: "Thursday",
  [DayOfTheWeek.Friday]: "Friday",
  [DayOfTheWeek.Saturday]: "Saturday",
  [DayOfTheWeek.Sunday] : "Sunday"
};

// function mapDayOfWeek(dayOfWeekString: string): DayOfTheWeek {
//   switch(dayOfWeekString) {
//     case "Monday" : 
//       return DayOfTheWeek.Monday; 
//     case "Tuesday" : 
//       return DayOfTheWeek.Tuesday;
//     case "Wednesday" :
//       return DayOfTheWeek.Wednesday;
//     case "Thursday" :
//       return DayOfTheWeek.Thursday;
//     case "Friday" :
//       return DayOfTheWeek.Friday;
//     case "Saturday" :
//       return DayOfTheWeek.Saturday;
//     default:
//       return DayOfTheWeek.Sunday;
//   }
// }

export {DayOfWeek, DayOfTheWeek};
