var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        this.initDOM();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    initDOM: function () {
        /*
         * Set fast scroll for mobile devices.
         * Removes delay on click.
         */
        $(function() {
            FastClick.attach(document.body);
        });


        var products = $('.swiper-container');
        var productSlider = products.swiper({
            mode:'horizontal',
            loop: false
        });

        /*
         * Replace all SVG images with inline SVG
         */
        $('img.svg').each(function(){
            var $img = jQuery(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');

            jQuery.get(imgURL, function(data) {
                // Get the SVG tag, ignore the rest
                var $svg = jQuery(data).find('svg');

                // Add replaced image's ID to the new SVG
                if(typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }
                // Add replaced image's classes to the new SVG
                if(typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass+' replaced-svg');
                }

                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns:a');

                // Replace image with new SVG
                $img.replaceWith($svg);

            }, 'xml');

        });
    }
};

Modernizr.load(
{
    load: 
    [  
        '/resources/js/vendor/jquery.min.js',
        '/resources/js/vendor/jquery.swiper.min.js',
        '/resources/js/vendor/fastclick.min.js',
        '/resources/js/vibrate.js',
        '/resources/js/index.js'
    ],
    complete: function() {
        $(document).ready(app.initialize());
    }
});