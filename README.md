## Pouch App Init

Initializes a PouchDB and application directory (if not already existing) on the local filesystem which will serve as home for said database files and additional config (JSON). 

#### Usage
```
var pouchAppInit = require('pouch-app-init')

pouchAppInit('coolApp', callback)
```

```callback``` returns a PouchDB object that lives in the new application directory.   By default, directory will be in user's home (ex: '~/.coolApp' ).

#### Options

Provide an object as the first param to specify a different application directory (provide also the appName): 

```
pouchAppInit({ appName: 'coolApp', path: '/var/etc/coolApp }, callback)
```

#### App specific config

A config folder will be created in the application directory with a file called default.json (in convention with the dependency [node-config](https://github.com/lorenwest/node-config)).

This is the default config file; just one config value which specifies the path to the database 

```
{
  "db_path" : "db"
}
```

(config file is relative to the application directory, so the database here will live in "db" in the root of said application directory )

Note: The file "/config/default.json" must exist in your node application. 

#### TODO
- remove the need to manually create '/config/default.json'
- test on Mac, Windows
