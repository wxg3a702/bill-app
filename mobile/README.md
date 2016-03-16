## Naming collision of flux/node_modules/fbjs
> find . -name 'fbjs' -print
> manually remove all fbjs inside any node_module except one at top level
<!--> npm install fbjs@0.6.1-->

## TransformError: .babelrc.stage
> find ./node_modules -name react-packager -prune -o -name '.babelrc' -print | xargs rm -f