//Js Revealing module pattern
var core = function($) {

    var init = function() {
    	//List functions here
    	functionExample();
    };

	var functionExample = function() {

	};

    return {
    	init: init
    };

} (jQuery);

jQuery(function() { 
	core.init(); 
});