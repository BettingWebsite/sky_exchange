app.filter("removeSpace", function () {
  return function (str = "") {
    var txt = "";
    txt = str.replace(/[^a-z0-9\s]/gi, "").replace(/[_\s]/g, "_");
    return txt;
  };
});
