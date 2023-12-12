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

export {DayOfWeek, DayOfTheWeek};
