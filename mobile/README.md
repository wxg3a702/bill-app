## Naming collision of flux/node_modules/fbjs
> find . -name 'fbjs' -print
> manually remove all fbjs inside any node_module except one at top level
<!--> npm install fbjs@0.6.1-->

## TransformError: .babelrc.stage
> find ./node_modules -name react-packager -prune -o -name '.babelrc' -print | xargs rm -f

## Realm debug problem on Android: a problem occurred starting process 'command 'adb''
In file mobile/node_modules/realm/android/build.gradle
change line 20 from
    commandLine 'adb', 'forward', 'tcp:8082', 'tcp:8082'
to
    def adb = android.getAdbExe().toString()
    commandLine adb, 'forward', 'tcp:8082', 'tcp:8082'