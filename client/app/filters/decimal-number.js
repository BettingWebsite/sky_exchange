app.filter("decimalNumber", function () {
  return function (value) {
    // if (value==null) {
    //     return
    // }
    return value == null || value == "" || parseFloat(value) > 19.5
      ? value
      : parseFloat(value) > 9.5
      ? parseFloat(value).toFixed(1)
      : parseFloat(value).toFixed(2);
  };
});
