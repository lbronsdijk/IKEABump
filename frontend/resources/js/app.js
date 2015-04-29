Modernizr.load(
{
    load: 
    [  
        'resources/js/vendor/jquery.min.js',
        'resources/js/vendor/jquery.swiper.min.js',
        'resources/js/vendor/fastclick.min.js'
    ],
    complete: function()
    {
        initApp();
    }
});

function initApp()
{
    $(document).ready(function()
    {   
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
    })
}