enum Shift {
    Tiet_1_2,
    Tiet_3_4,
    Tiet_5_6,
    Tiet_7_8,
    Tiet_9_10,
    Tiet_11_12,
  }
  
  const shiftNames: { [key in Shift]: string } = {
    [Shift.Tiet_1_2]: "Tiết 1 - Tiết 2",
    [Shift.Tiet_3_4]: "Tiết 3 - Tiết 4",
    [Shift.Tiet_5_6]: "Tiết 5 - Tiết 6",
    [Shift.Tiet_7_8]: "Tiết 7 - Tiết 8",
    [Shift.Tiet_9_10]: "Tiết 9 - Tiết 10",
    [Shift.Tiet_11_12]: "Tiết 11 - Tiết 12",
  };

  // function mapShiftTime(shiftTimeString: string): Shift {
  //   switch(shiftTimeString) {
  //       case "Tiet_1_2":
  //         return Shift.Tiet_1_2;
  //       case "Tiet_3_4":
  //         return Shift.Tiet_3_4;
  //       case "Tiet_5_6":
  //         return Shift.Tiet_5_6;
  //       case "Tiet_7_8":
  //         return Shift.Tiet_7_8;
  //       case "Tiet_9_10":
  //         return Shift.Tiet_9_10;
  //       default:
  //         return Shift.Tiet_11_12;
  //     }
  // }
  
  export { Shift, shiftNames };
