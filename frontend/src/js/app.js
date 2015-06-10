/*
 * Modernizr load
 */
Modernizr.load(
{
    load: 
    [  
        'resources/js/vendor/vendor.min.js'
    ],
    complete: function()
    {
        // Debug switch
        logger.enableLogger();
        //logger.disableLogger();

        // Go go go!
        this.app.initialize();
    }
});

/*
 * Basic app logic
 */
var app = {
    /*
     * Initialize app
     */
    initialize: function() {

        // Init shopping bag
        shopping.initialize();

        // Init time
        app.currentTime(0);

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
        });
    },
    currentTime: function(delay) {
        setTimeout(function(){ 
            // Current time
            var DateTime = new Date();
            var currentTime = DateTime.getHours() + ":" + DateTime.getMinutes();

            $('.time span').html(currentTime);

            app.currentTime(60000);
        }, delay); 
    }
};

/*
 * Shopping logic
 */
var shopping = {

    /*
     * Initialize shopping card
     */
    initialize: function() {
        var amount = 0;
        var json;
        this.productsContainer = $('.swiper-container');
        this.productsWrapper = $('.swiper-wrapper');

        // Fill and call product slider object
        this.productSlider = this.productsContainer.swiper({
            mode:'horizontal',
            loop: false
        });

        // Fill var product slider for eachloop
        var productSlider = this.productSlider;

        // Clear out shopping list
        this.productSlider.removeAllSlides();

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
        $.each(json.slice(0,4), function() {
            var itemNode = '<div class="swiper-slide" id="' + this.id + '">' +
                           '<span class="product-name">' + this.name + '</span>' +
                           '<div class="mask"><img src="resources/images/' + this.image + '"></div>' +
                           '<span class="price">€' + this.price.amount + ' <small>p.s.</small></span>' +
                           '</div>';

            // Append to slide
            productSlider.appendSlide(itemNode);

            // Fill and count total amount 
            amount += parseFloat(this.price.amount.replace(',', '.'));
        });

        console.log('All products inserted');

        // Update amount
        this.totalAmount = this.updateTotalAmount(amount);
        // Fill objects
        this.json = json;
    },

    /*
     * An item can be removed by calling the following method: shopping.removeItem({ product ID })
     * Keep in mind that the used id must exists within the json file AND the product slider. It is used as index.
     *
     * @param int id
     * @return boolean
     */
    removeItem: function(id) {
        // Check if id is empty
        if(typeof id === 'undefined') {
            console.log('No id entered');

            return false;
        }
        // Check if entry exists
        if(!this.json[id]) {
            console.log('Entry ' + id + ' not found');

            return false;
        }

        $('.swiper-slide#' + id).addClass('animated bounceOut');
        $('.swiper-slide#' + id).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            // Go to previous slide
            this.productSlider.slidePrev();

            // Kill it with fire
            this.productSlider.removeSlide(id);

            console.log('Product item ' + id + ' removed');

            // Update amount
            itemAmount = parseFloat(this.json[id].price.amount.replace(',', '.'));
            this.totalAmount = this.updateTotalAmount((parseFloat(this.totalAmount) - parseFloat(itemAmount)).toFixed(2));
        }.bind(this));

        return true;
    },

    /*
     * A new item can be added by calling the following method: shopping.addItem({ product ID })
     * Keep in mind that the used id must exists within the json file
     *
     * @param int id
     * @return boolean
     */
    addItem: function(id) {
        // Check if id is empty
        if(typeof id === 'undefined') {
            console.log('No id entered');

            return false;
        }
        // Check if entry exists
        if(!this.json[id]) {
            console.log('Entry ' + id + ' not found');

            return false;
        }

        var itemNode = '<div class="swiper-slide" id="' + this.json[id].id + '">' +
                       '<span class="product-name">' + this.json[id].name + '</span>' +
                       '<div class="mask"><img src="resources/images/' + this.json[id].image + '"></div>' +
                       '<span class="price">€' + this.json[id].price.amount + ' <small>p.s.</small></span>' +
                       '</div>';

        // Append to slide
        this.productSlider.appendSlide(itemNode);
        $('.swiper-slide#' + this.productSlider.slides.length).hide(0);

        // Update amount
        itemAmount = parseFloat(this.json[id].price.amount.replace(',', '.'));
        this.totalAmount = this.updateTotalAmount((parseFloat(this.totalAmount) + parseFloat(itemAmount)).toFixed(2));


        // Go to last slide
        this.productSlider.slideTo(this.productSlider.slides.length);

        this.productsWrapper.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            //$('.swiper-slide#' + this.productSlider.slides.length).show();
            $('.swiper-slide#' + this.productSlider.slides.length).addClass('animated bounceIn');
        }.bind(this));

        console.log('Product item ' + id + ' added');

        return true;
    },

    /*
     * Amount can be updated by calling the following method: shopping.updateTotalAmount({ (int) amount })
     * Keep in mind that substracts and sum requires an integer (parseFloat())
     *
     * @param int amount
     * @return int amount
     */
    updateTotalAmount: function(amount) {
        // Update total price
        $('.total-price').html('€ ' + amount.toString().replace('.', ','));

        console.log('Amount updated: €' + amount);

        return amount;
    }
};

/*
 * Debug logic
 *
 * @return object pub
 */
var logger = function() {
    var oldConsoleLog = null;
    var pub = {};

    pub.enableLogger = function enableLogger() {
        if(oldConsoleLog === null)
            return;

        window['console']['log'] = oldConsoleLog;
    };

    pub.disableLogger = function disableLogger() {
        oldConsoleLog = console.log;
        window['console']['log'] = function() {};
    };

    return pub;
}();
