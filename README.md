# Node Registry Changer

The goal of this VSCode extension is to automatically configure your yarn.lock with your specified registry when a project is loaded.

#### Available Commands
* `Select registry` - Allows you to change the registry in the yarn.lock.

#### Supported VSCode Settings

* `yarn.default.registry` - The default yarn registry that will be auto configured when a project is loaded. It will automatically change whatever registries are used in your yarn.lock to use this registry.

* `yarn.registries` - A list of yarn registries that can be selected from
