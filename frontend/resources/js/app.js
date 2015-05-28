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
        // Init app
        this.app.initialize();
    }
});

var app = { 
    initialize: function() {

        // Init shopping bag
        shopping.initialize();

        $(document).ready(function()
        {   
            // Set fast scroll for mobile devices. Removes delay on click.
            $(function() {
                FastClick.attach(document.body);
            });

            // Replace all SVG images with inline SVG
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
        
            // Click event for splashscreen
            $('.splashscreen').click(function() {
                $(this).fadeOut(function(){
                    this.remove();
                });
            });

            // Click event for mini navigation
            $('.navigation-icon').click(function() {
                $('.navigation-container').fadeToggle('fast', 'linear', function() {
                    // Do nothing
                });
                // Blur app container when mini navigation active
                $('.app-container').toggleClass('blur');
            });

            // Click event for lost method
            $('.lost').click(function() {
                $('.lost, .food').removeClass('bounceIn').addClass('bounceOut');
                $('.lost').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                    $('.spinner').show();
                    setTimeout(function() {
                        $('.spinner').hide(0, '', function(){
                            $('.find-bumpie').show();
                        });

                    }, 3000);
                });
            });

            $('.food').click(function() {
                window.open('http://wessalicious.com/wp-content/uploads/2014/12/Vegetarische-zweedse-balletjes2.jpg');
            });
        })
    }
}

var shopping = { 
    initialize: function() {
        var json;
        var products = $('.swiper-container');
        var amount = 0;

        // Clear out shopping list
        $('.swiper-wrapper').empty();

        // Get some data
        $.ajax({
            type: 'GET',
            async: false,
            url: 'resources/products.json',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                json = data;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Request shoppinglist failed: ' + errorThrown);
            }
        });

        // Loop data
        $.each(json, function() {
            var itemNode = '<div class="swiper-slide" id="' + this.id + '">' +
                           '<span class="product-name">' + this.name + '</span>' +
                           '<div class="mask"><img src="resources/images/' + this.image + '"></div>' +
                           '<span class="price">€' + this.price.amount + ' <small>p.s.</small></span>' +
                           '</div>';

            // Append HTML node
            $('.swiper-wrapper').append(itemNode);

            // Fill and count total amount 
            amount += parseFloat(this.price.amount.replace(',', '.'));
        });

        // Update total price
        $('.total-price').html('€ ' + amount.toString().replace('.', ','));

        // Fill amount object
        this.amount = amount;
        // Fill and call product slider object
        this.productSlider = products.swiper({
            mode:'horizontal',
            loop: false
        });
    },
    removeItem: function(id) {
        // Check if id is empty
        if(!id) {
            console.log('No id entered');

            return false;
        }

        // Find current product item node
        var productItem = $('.swiper-slide#' + id);
        var 
        
        // Kill it with fire
        productItem.remove();

        console.log('Product item ' + id + ' removed');

        return true;
    }
}
