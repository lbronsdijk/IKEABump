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
    }
};

var shoppingCartOverview = { 
    initialize: function() {
        
        var products = $('.swiper-container');
        var amount = 0;

        $('.swiper-wrapper').empty();
        
        $.get("http://lloydkeijzer.nl/products.json", function(json){
            
            $.each(json, function() {
                
                var itemNode =  '<div class="swiper-slide" id="' + this.id + '">' +
                                    '<span class="product-name">' + this.name + '</span>' +
                                    '<div class="mask"><img src="resources/images/' + this.image + '"></div>' +
                                    '<span class="price">€' + this.price.amount + ' <small>p.s.</small></span>' +
                                '</div>';
                $('.swiper-wrapper').append(itemNode);

                amount += parseFloat(this.price.amount.replace(',', '.'));
            });

            $('.total-price').html('€ ' + amount.toString().replace('.', ','));

            this.amount = amount;
            this.productSlider = products.swiper({
                mode:'horizontal',
                loop: false
            });
        }, "json");
    },
    removeItem: function() {
        console.log('derp');
        //$('.swiper-slide#1').remove();
    }
};

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