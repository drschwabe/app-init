## App Init

Creates a directory (if not already existing) on the local filesystem for storing end user data and customizeable app config.

use cases: 
- you want to expose some configuration values to the end user
- you want to make it easy for users to find and make backups of key application data (ie- a database)

app-init, by default, will put these files in a hidden folder in the user's home directory (ex: ~/.coolApp). 


#### Usage
```
var appInit = require('app-init')
appInit('coolApp', function(path, config) {
    console.log(path) // > /home/steve/.coolApp
    console.log(config) // > node-config object
})
```

```callback``` returns a path to your shiny new application folder and a config object that lives in said application directory.  The directory will be a hidden folder in user's home (ex: '~/.coolApp' ).

#### Options

Provide an object as the first param to specify a different application directory (provide also the appName): 

```
appInit({ appName: 'coolApp', path: '/var/etc/coolApp }, callback)
```

### Features

#### Mirrored config

To expose configuration to the new user-friendly application folder, create a config directory in the root of your application itself (ie- your node repository) along with a file with the config valus you want to expose.  For example: 

~/myNodeApp/config/default.json

```
{
  "db_path" : "db"
}
```

This part uses [node-config](https://github.com/lorenwest/node-config) so theorectically you can use any of their supported formats, but that's not supported yet - just use json and make sure the basename of your file is "default"

When a user runs your app for the first time, app-init (when invoked) will mirror this default config file into the new user-friendly application folder as "local.json".  


#### TODO
- remove the need to manually create '/config/default.json'
- consider removing the default config file
- test on Mac, Windows
- support formats other than JSON
- add another example, this one more detailed showing how you'd call it in your app and then how npm install and first run would have the directory and config appear.
