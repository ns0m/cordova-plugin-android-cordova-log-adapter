cordova-plugin-android-cordova-log-adapter
===============================

If your Cordova project contains plugins/libraries which reference both `android.util.Log` and `org.apache.cordova.LOG`, only the second one will integrate well with the [Cordova Android platform logging system](https://github.com/apache/cordova-android/blob/master/framework/src/org/apache/cordova/LOG.java).

This plugin provides a shim to migrate references to `android.util.Log` to `org.apache.cordova.LOG` in a Cordova Android platform project.

The plugin uses a hook script to replace any `android.util.Log` references:
- Class name and methods in the Java source code (of Cordova plugins) with `org.apache.cordova.LOG`.

# Requirements

This plugin requires a minimum of [`cordova@8`](https://github.com/apache/cordova-cli) and [`cordova-android@8`](https://github.com/apache/cordova-android).
 
# Installation

    $ cordova plugin add cordova-plugin-android-cordova-log-adapter
    
**IMPORTANT:** This plugin relies on a [Cordova hook script](https://cordova.apache.org/docs/en/latest/guide/appdev/hooks/) so will not work in Cloud Build environments such as Phonegap Build which do not support Cordova hook scripts.

# Usage

Once the plugin is installed it will run on each `after_prepare` hook in the Cordova build lifecycle, scanning and migrating any references to `android.util.Log` in the Java source code.
 
Note: this plugin operates only during the build process and contains no code which is bundled with or executed inside of the resulting Android app produced by the Cordova build process.

# Origin

Inspired by [cordova-plugin-androidx-adapter](https://github.com/dpa99c/cordova-plugin-androidx-adapter).

License
================

The MIT License

Copyright (c) 2019 Dave Alden / Working Edge Ltd.\
Copyright (c) 2020 ns0m

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
