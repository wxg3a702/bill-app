/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "RCTRootView.h"

#import "RCTPushNotificationManager.h"
#import "ReactNativeAutoUpdater.h"

#define JS_CODE_METADATA_URL @"http://192.168.64.205:9101/pub/rnupdate/meta?type=IOS_PATCH"

@interface AppDelegate() <ReactNativeAutoUpdaterDelegate>

@end

typedef enum{
  AutoUpdate,
  Local,
  Debug,
}AppStarMode;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  AppStarMode startType=AutoUpdate;
  
  NSURL* latestJSCodeLocation;
  if(startType==AutoUpdate){
    NSURL* defaultJSCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
    
    ReactNativeAutoUpdater* updater = [ReactNativeAutoUpdater sharedInstance];
    [updater setDelegate:self];
    [updater showProgress: NO];
    
    // We set the location of the metadata file that has information about the JS Code that is shipped with the app.
    // This metadata is used to compare the shipped code against the updates.
    
    NSURL* defaultMetadataFileLocation = [[NSBundle mainBundle] URLForResource:@"metadata" withExtension:@"json"];
    [updater initializeWithUpdateMetadataUrl:[NSURL URLWithString:JS_CODE_METADATA_URL]
                       defaultJSCodeLocation:defaultJSCodeLocation
                 defaultMetadataFileLocation:defaultMetadataFileLocation ];
    [updater setHostnameForRelativeDownloadURLs:@"http://192.168.64.205:9101"];
    [updater checkUpdate];
    
    latestJSCodeLocation = [updater latestJSCodeLocation];
  }else if(startType==Debug){
    latestJSCodeLocation=[NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios"];
  }else{
    latestJSCodeLocation=[[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  }


  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  self.window.rootViewController = rootViewController;
  RCTBridge* bridge = [[RCTBridge alloc] initWithBundleURL:latestJSCodeLocation moduleProvider:nil launchOptions:nil];
  RCTRootView* rootView = [[RCTRootView alloc] initWithBridge:bridge moduleName:@"FasApp" initialProperties:nil];
  self.window.rootViewController.view = rootView;
  [self.window makeKeyAndVisible];
  return YES;
}

- (void)createReactRootViewFromURL:(NSURL*)url {
  // Make sure this runs on main thread. Apple does not want you to change the UI from background thread.
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTBridge* bridge = [[RCTBridge alloc] initWithBundleURL:url moduleProvider:nil launchOptions:nil];
    RCTRootView* rootView = [[RCTRootView alloc] initWithBridge:bridge moduleName:@"FasApp" initialProperties:nil];
    self.window.rootViewController.view = rootView;
  });
}


#pragma mark - ReactNativeAutoUpdaterDelegate methods

- (void)ReactNativeAutoUpdater_updateDownloadedToURL:(NSURL *)url {
  UIAlertController *alertController = [UIAlertController
                                        alertControllerWithTitle:NSLocalizedString(@"版本升级", nil)
                                        message:NSLocalizedString(@"程序有新的版本更新，重新启动后生效", nil)
                                        preferredStyle:UIAlertControllerStyleAlert];
  
 
  
  UIAlertAction *okAction = [UIAlertAction
                             actionWithTitle:NSLocalizedString(@"确定", @"OK action")
                             style:UIAlertActionStyleDefault
                             handler:^(UIAlertAction *action)
                             {
                               NSLog(@"Cancel action");

                             }];
  
  
  [alertController addAction:okAction];
  
  // make sure this runs on main thread. Apple doesn't like if you change UI from background thread.
  dispatch_async(dispatch_get_main_queue(), ^{
    [self.window.rootViewController presentViewController:alertController animated:YES completion:nil];
  });
  
}

- (void)ReactNativeAutoUpdater_updateDownloadFailed {
  NSLog(@"Update failed to download");
}

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification
{
  [RCTPushNotificationManager didReceiveRemoteNotification:notification];
}
@end
