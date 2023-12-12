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
  
  export { Shift, shiftNames };
