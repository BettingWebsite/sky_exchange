app.directive('disableRightClick', function() {  
    return {  
        restrict: 'A',  
        link: function(scope, element, attr) {  
            element.bind('contextmenu', function(e) {  
                e.preventDefault();  
            })  
        }  
    }  
})  

app.directive('numbersOnly', function() {
    return {
        link: function(scope, ele) {
            ele.bind('keypress', function(e) {
                var newVal = $(this).val() + (e.charCode !== 0 ? String.fromCharCode(e.charCode) : '');
                if (!(/^\d{1,9}(\.$|\.\d{1,2}$|$)/).test(newVal)) {
                    e.preventDefault();
                }
            });
        }
    };
});