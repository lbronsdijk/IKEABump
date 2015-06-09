### Updating the CSS and JS
***
The CSS files are generated using [Gulp.js](http://gulpjs.com). Gulp watches, combines and minifies the CSS and JS files.
The uncompressed source files are located in `frontend/src/css` and `frontend/src/js`. The combined and minified files are stored in `frontend/public/resources/css` and `frontend/public/resources/js`.

** Installing NodeJS **
Install [NodeJS](http://nodejs.org/) and NPM (Node Package Manager) globally.

** Installing Bower **
Install Bower to manage our resources. Use `$ npm install -g bower` to install Bower globally.

** Installing Gulp.js **
To install Gulp.js simply go to the `frontend` dir and run `$ npm install`. Gulp (and it's dependencies) will now be installed
into `frontend/node_modules/`. Make sure to add the `node_modules/` dir to your global gitignore.

** Running Gulp.js **
To Run Gulp go to the `frontend/` dir en run `$ gulp`. Gulp will now monitor the Css and JS dirs for changes. When it detects any changes the files will be combined and minfified.
