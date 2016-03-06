var async = require('async'), 
    _ = require('underscore'), 
    fs = require('fs'), 
    p = require('path'), 
    mkdirp = require('mkdirp')  

//Suppress no_config warnings since this is a global app
//that can be run from any directory...
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y'             
//now we can require config: 
var config = require('config')

module.exports = function(appNameOrObject, pathOrCallback, callback) {

  //Parse the arguments: 
  if(_.isObject(appNameOrObject)) {
    path = appNameOrObject.path
    appName = appNameOrObject.appName
    callback = pathOrCallback
  } else {
    appName = appNameOrObject
    //Default to the user's home directory:     
    path = process.env.HOME + '/.' + appName
    callback = pathOrCallback    
  }

  //Make sure path ends with '/'
  if( path.substr(-1) != '/') path = path + '/'

  //Operate on the user's filesystem to load an existing DB or create a new one, and then return the object.
  async.series([
    function(seriesCallback) {

      //If there already exists an app config file in the user's directory, use that
      fs.exists(path, function (exists) {
        //Override config directory:
        if(exists) {
          return seriesCallback()
        }
        //Otherwise, do a first run setup!
        console.log('Performing first run setup...')
        mkdirp(path, function(err) {
          if(err) return console.log(err)
          //Now make a new sub-folder for the config
          //and copy the template config file we have created in our node app:  
          var configFile = fs.readFileSync(p.dirname(module.parent.filename) + '/config/default.json', 'utf-8')
          fs.mkdir(path + 'config', function(err) {
            if(err) return console.log(err)
            fs.writeFileSync(path + 'config/local.json', configFile, 'utf-8')           
            return seriesCallback()
          })
        })
      }) 
    }, 
    function(seriesCallback) {
      //Ensures the proper node config is used
      //(workaround pertaining to node-config issue #201). 
      delete require.cache[require.resolve('config')]
      process.env.NODE_CONFIG_DIR = path + 'config'     
      //Require config now that we have 'pre-set' the NODE_CONFIG_DIR:      
      var config = require('config')
      return callback(path, config)
    }
  ])   
}
