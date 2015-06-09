// include gulp
var gulp  = require('gulp'),
    gutil = require('gulp-util');

// include plug-ins
var uglify    = require('gulp-uglify');
var rename    = require('gulp-rename');
var concat    = require('gulp-concat');
var uglifycss = require('gulp-uglifycss');

// Set source and destination dirs
var source      = './gulp/';
var destination = './public/resources/';
var vendorjs    = [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/swiper/dist/js/swiper.jquery.js',
                    'bower_components/fastclick/lib/fastclick.js'
                  ];

// define the default
gulp.task('default', ['watch'], function() {
    gulp.run('vendorJs');
    gulp.run('watch');
});

// Vendor js
gulp.task('vendorJs', function(){
    gulp.src(vendorjs, {base: 'bower_components/'})
        .pipe(uglify())
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest('public/resources/js/vendor'));
    gutil.log('Vendor files combined and minified.');

});

// App js
gulp.task('appJs', function(){
    gulp.src(['src/js/*.js'])
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/resources/js'));
    gutil.log('Javascript combined and minified.');
});

// App css
gulp.task('appCss', function(){
    gulp.src(['src/css/*.css'])
        .pipe(uglifycss())
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest('public/resources/css'));
    gutil.log('CSS combined and minified.');
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
    gulp.watch('src/js/*.js', ['appJs']);
    gulp.watch('src/css/*.css', ['appCss']);
});
