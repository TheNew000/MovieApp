// Angular Routes are considered cross-origin.  cross-origin is only supported for: http, https, ftp, etc.  Our protocol when we load a page is 'file://' this requires something at the beginnig for the route to function.  Node.js is our answer!  With the connect module and the serveStatic module we can serve up at localhost:8000, etc
// This inolves:
// 1.npm init -- this will create a package.json file in your folder  Package.json
// 1b. No promopts are required you can just hit enter, otherwise it will fill the filends out
// 2. npm install connect - this will add the connect tmodule to a node modules folder.  If it doesn't exist it will be created
// 3. npm install serve-static.  tis will add the serve-static module to a ode module directory
// 4. node server.js - tells node you wat it to run the js file server.js (THIS FILE!)
// 5. Node will serve anything it finds like usual via http, at localhost:8000


var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8000, function(){
    console.log('listening on Port 8000...')
});
