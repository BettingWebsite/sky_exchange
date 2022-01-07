app.filter('removeSpace', function() {
    return function(str) {
        var txt = "";
        txt = str? str.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '_'): '';
        return txt;
    };
});

app.filter('oddDecimal', function() {
    return function(value) {
    	if (value=="" || value==null) {
    		return "";
    	}
    	else{
        	return ((parseFloat(value) > 19.5)) ? (parseFloat(value)).toFixed(0) : ((parseFloat(value) > 9.5) ? parseFloat(value).toFixed(1) : parseFloat(value).toFixed(2));

    	}
    };
});

app.filter('volume', function($filter) {
    return function(input, limit) {
        if (!input) return;
        var num = parseInt(input)
        if (num > 500000) {
            input = 500000;
            return input;
        }

        return $filter('limitTo')(input, limit) + '';
    };
});

app.filter('capitalize',function($filter){
	return function(input){
		input=input.toLowerCase();
		return input.charAt(0).toUpperCase()+input.slice(1);
	}
})

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input? input.slice(start): 0;
    }
});

app.filter("titlecase", function () {
    return function (input) {
      input = input || "";
      return input.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    };
  });
  