var async = require('async'), 
    config = require('config'), 
    PouchDB = require('pouchdb'), 
    _ = require('underscore'), 
    fs = require('fs')

module.exports = function(appNameOrObject, pathOrCallback, callback) {

  //Parse the arguments: 
  if(_.isObject(appNameOrObject)) {
    path = appNameOrObject.path
    appName = appNameOrObject.appName
  } else {
    appName = appNameOrObject
    //Default to the user's home directory:     
    path = process.env.HOME + '/.' + appName    
    callback = pathOrCallback    
  }

  //Operate on the user's filesystem to load an existing DB or create a new one, and then return the object.
  async.series([
    function(seriesCallback) {

      //If there already exists an app config file n the user's directory, use that
      fs.exists(path, function (exists) {
        //Override config directory:
        if(exists) {
          process.env.NODE_CONFIG_DIR = path + '/config'
          return seriesCallback()
        }
        //Otherwise, do a first run setup!
        console.log('Performing first run setup...')
        //Create .appName folder in the directory:
        fs.mkdir(path, function(err) {
          if(err) return console.log(err)
          //Now make a new sub-folder for the config
          //and copy the template config file we have created in our node app: 
          var configFile = fs.readFileSync(__dirname + '/config/default.json', 'utf-8')
          fs.mkdir(path + '/config', function(err) {
            if(err) return console.log(err)
            fs.writeFileSync(path + '/config/local.json', configFile, 'utf-8')
            process.env.NODE_CONFIG_DIR = path + '/config'
            return seriesCallback()
          })
        })
      }) 
    }, 
    function(seriesCallback) {
      //Require config now that we have 'pre-set' the NODE_CONFIG_DIR:
      var config = require('config')
      //Create a database, if necessary:
      db = new PouchDB( path + '/' + config.get('db_path') )
      return callback(db)
    }
  ])   
}
