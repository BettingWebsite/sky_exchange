app.directive("accordionToggle", function () {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {
      element.bind("click", function (e) {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
          panel.style.display = "none";
        } else {
          panel.style.display = "block";
        }
      });
    },
  };
});
