var app = {
    initialize: function() {
        this.bindEvents();
        shoppingCartOverview.initialize();
        this.initDOM();
    },
    bindEvents: function() {
        FastClick.attach(document.body);
        $(".app-container").pagecontainer();
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        console.log('Device is ready!');
    },
    initDOM: function () {
        
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

        $('.splashscreen').bind('tap', function() {
            $(this).fadeOut(function(){
                this.remove();
            });
        });

        $('.navigation-icon').bind('tap', function() {
            
            $('.navigation-container').fadeToggle('fast', 'linear', function(){
            
            });
            
            $('.app-container').toggleClass('blur');
        });
        
        $('.lost').bind('tap', function() {
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

        $('.food').bind('tap', function() {
            window.open('http://wessalicious.com/wp-content/uploads/2014/12/Vegetarische-zweedse-balletjes2.jpg');
        });
        
        $('#add-item').bind('tap', function(){
            var id = parseInt(shoppingCartOverview.productSlider.slides[shoppingCartOverview.productSlider.slides.length - 1].id) + 1;
            shoppingCartOverview.addItem(id);
        });
        
        $('#delete-item').bind('tap', function(){
            shoppingCartOverview.removeItem(shoppingCartOverview.productSlider.slides[shoppingCartOverview.getActiveIndex()].id);
        });
        
        $('#vibrate').bind('tap', function(){
            var vibration = new Vibration();
            vibration.play(0, false);
        });
        
        var vibration = new Vibration();
        var loop = false;
        
        $('#vibrate-loop').bind('tap', function(){

            if(loop){
                vibration.stop();
                loop = false;
                $('#vibrate-loop').text('Start Vibrate Loop');
            } else {
                vibration.play(1000, true);
                loop = true;
                $('#vibrate-loop').text('Stop Vibrate Loop');
            }
            
        });
    }
};

var shoppingCartOverview = {

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
            url: 'http://lloydkeijzer.nl/products.json',
            dataType: 'json',
//            contentType: 'application/json',
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

            
            var vibration = new Vibration();
            vibration.play(0, false);
            
            var vibration2 = new Vibration();
            vibration2.play(1000, false);
            
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

        var vibration = new Vibration();
        vibration.play(0, false);
        
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
    },
    getActiveIndex: function(){
    
        return this.productSlider.activeIndex;
    }
};

/*
 * Debug logic
 */
var logger = function() {
    var oldConsoleLog = null;
    var pub = {};

    pub.enableLogger = function enableLogger() {
        if(oldConsoleLog == null)
            return;

        window['console']['log'] = oldConsoleLog;
    };

    pub.disableLogger = function disableLogger() {
        oldConsoleLog = console.log;
        window['console']['log'] = function() {};
    };

    return pub;
}();

Modernizr.load(
{
    load:
    [
        'resources/js/vendor/jquery.min.js',
        'resources/js/vendor/jquery.swiper.min.js',
        'resources/js/vendor/jquery.mobile-1.4.5.min.js',
        'resources/js/vendor/fastclick.min.js',
        'resources/js/vibrate.js'
    ],
    complete: function() {
        $(document).ready(app.initialize());
    }
});