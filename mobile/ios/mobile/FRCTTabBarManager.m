/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "FRCTTabBarManager.h"

#import "RCTBridge.h"
#import "FRCTTabBar.h"

@implementation FRCTTabBarManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [FRCTTabBar new];
}

RCT_EXPORT_VIEW_PROPERTY(tintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(barTintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(translucent, BOOL)

@end
