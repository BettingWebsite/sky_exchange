app.directive("toggleClass", function () {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {
      element.bind("click", function (e) {
        // e.stopPropagation();
        // console.log(element)
        if (element.parents(".game-wrap,.slip-wrap").hasClass("close")) {
          element.parents(".game-wrap,.slip-wrap").removeClass("close");
          // element.addClass(attrs.toggleClass);
        } else {
          // element.removeClass("glyphicon glyphicon-ok");
          element.parents(".game-wrap,.slip-wrap").addClass("close");
        }
        if (element.id == "livetv") {
          if (element.parents(".slip-wrap.live_tv").hasClass("close")) {
            $(".matched-wrap").css("height", "calc(100% - 30px)");
          } else {
            $(".matched-wrap").css("height", "calc(100% - 285px)");
          }
        }
      });
    },
  };
});
