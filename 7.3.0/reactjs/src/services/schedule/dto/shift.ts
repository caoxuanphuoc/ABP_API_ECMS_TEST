enum Shift {
    Tiet_1_2 = 1,
    Tiet_3_4 = 2,
    Tiet_5_6 = 3,
    Tiet_7_8 = 4,
    Tiet_9_10 = 5,
    Tiet_11_12 = 6,
  }
  
  const shiftNames: { [key in Shift]: string } = {
    [Shift.Tiet_1_2]: "Tiết 1 - Tiết 2",
    [Shift.Tiet_3_4]: "Tiết 3 - Tiết 4",
    [Shift.Tiet_5_6]: "Tiết 5 - Tiết 6",
    [Shift.Tiet_7_8]: "Tiết 7 - Tiết 8",
    [Shift.Tiet_9_10]: "Tiết 9 - Tiết 10",
    [Shift.Tiet_11_12]: "Tiết 11 - Tiết 12",
  };
  
  export { Shift, shiftNames };
