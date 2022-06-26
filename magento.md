# 13 May 2020

## Common Commands

```bash
# AFFIRM STUFF
php bin/magento module:status
php bin/magento module:enable Astound_Affirm
php bin/magento setup:upgrade

# compile code
bin/magento setup:di:compile

# reindex
bin/magento indexer:reindex

# see modules status
php bin/magento module:status

# enable a module
php bin/magento module:enable <Module_NAME>
# then upgrade
bin/magento setup:upgrade
```

### Create PHP Info file

One issue we noticed was the version of PHP Apache was using, was different than what was on the PATH. Apache2 was using `/usr/bin/php`, while 7.3 was using `usr/local/bin`.

#### Create the file

```bash
$ echo "<?php phpinfo(); ?>" > /var/www/html/phpinfo.php
```

This creates a PHP diagnostic display in your browser at `http://<IP>/phpinfo.php`.

### Another Issue

When running `php bin/magento module:status` getting:

`Fatal error: Uncaught Error: Undefined class constant 'PDO::MYSQL_ATTR_SSL_KEY' in /var/www/html/magento/setup/src/Magento/Setup/Model/ConfigOptionsList.php:179`

Updated proxy.

Was able to run sudo apt-get install php7.3-mysql

### Issue: Permissions Issue on Compliation

When the `/var/cache` file gets recreated from running a PHP command as root, it creates a folder `www-data` user does not have access to. It is owned by `root`.

Command line user does not have read and write permissions on generated directory.

Temporary solution: `chmod 777 -R var/cache/`

### Issue: Cannot add launchpad.net PPA

Cannot get packages like `php7.2-mysql` from `apt-get`.

Solution: Add `launchpad.net` to Squid proxy

## PHP/Magento command reference

```bash
# AFFIRM STUFF
php bin/magento module:status
php bin/magento module:enable Astound_Affirm
php bin/magento setup:upgrade

# compile code
bin/magento setup:di:compile

# reindex
bin/magento indexer:reindex

# see modules status
php bin/magento module:status

# enable a module
php bin/magento module:enable <Module_NAME>
# ...then upgrade
bin/magento setup:upgrade

# flush the cache
php bin/magento cache:flush

# force manual static content deployment
php bin/magento setup:static-content:deploy -f

# upgrades and caching issues
php bin/magento setup:upgrade
php bin/magento cache:flush
php bin/magento setup:static-content:deploy
# ...if prod, run
php bin/magento setup:di:compile
```

## Install module

If composer does not work, you can `git clone` a repo into `app/code` directory.

```bash
root@ip-10-3-2-240:/var/www/html/magento/app/code/Yiero
$ git clone https://github.com/yireo-training/Yireo_ReactMinicart.git
```

## Magento Error Resolution

### Error: 500 for entire Magento Site

When you get a 500 it's because of file permissions in the `generated/var` folder cannot be written to by the current group. It's executed by root but owned by `www-data`.

### Error: ``An error has happened during application run.`

When you see `An error has happened during application run. See exception log for details.`

When you check `var/log/exception.log` you'll find

```
[2020-05-13 19:35:03] main.CRITICAL: Class Magento\Framework\App\Http\Interceptor does not exist {"exception":"[object] (ReflectionException(code: -1): Class Magento\\Framework\\App\\Http\\Interceptor does not exist at /var/www/html/magento/lib/internal/Magento/Framework/Code/Reader/ClassReader.php:26)"} []
```

Solution: run `php bin/magento setup:di:compile`.

You'll need to fix permissions again after this.

```bash
root@ip-10-3-2-240:/var/www/html/magento$ bin/magento module:enable Yireo_ReactMinicart
The following modules have been enabled:
- Yireo_ReactMinicart

To make sure that the enabled modules are properly registered, run 'setup:upgrade'.
Cache cleared successfully.
Generated classes cleared successfully. Please run the 'setup:di:compile' command to generate classes.
Info: Some modules might require static view files to be cleared. To do this, run 'module:enable' with the --clear-static-content option to clear them.
```

## Issues

### Main Bundle path incorrect

```
GET http://10.3.2.240/js/react.bundle.js net::ERR_ABORTED 500 (Internal Server Error)
```

This should be located at `http://10.3.2.240/js/react.bundle.js`
Update main react bundle path

```php
<?php
declare(strict_types=1);

use Magento\Framework\View\Element\Template;

/** @var $block Template */
?>
<script src="<?= '/magento/pub/js/react.bundle.js' ?>"></script>
```

Now returns 200 for `http://10.3.2.240/magento/pub/js/react.bundle.js`.

### Issue: Sub pack bundle path incorrect

```
http://10.3.2.240/js/app_code_Yiero_Yireo_ReactMinicart_view_frontend_react_source_Minicart_js.react.bundle.js
```

Returning a 500

It should be looking in

```
http://10.3.2.240/magento/pub/js/app_code_Yiero_Yireo_ReactMinicart_view_frontend_react_source_Minicart_js.react.bundle.js
```

## Getera

bin/magento setup:upgrade

`There has been an error processing your request`
