/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "FRCTTabBar.h"

#import "RCTEventDispatcher.h"
#import "RCTLog.h"
#import "RCTTabBarItem.h"
#import "RCTUtils.h"
#import "RCTView.h"
#import "RCTViewControllerProtocol.h"
#import "RCTWrapperViewController.h"
#import "UIView+React.h"

@interface FRCTTabBar() <UITabBarControllerDelegate>

@end

@implementation FRCTTabBar
{
  BOOL _tabsChanged;
  UITabBarController *_tabController;
  NSMutableArray<RCTTabBarItem *> *_tabViews;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if ((self = [super initWithFrame:frame])) {
    _tabViews = [NSMutableArray new];
    _tabController = [UITabBarController new];
    _tabController.delegate = self;
    [self addSubview:_tabController.view];
  }
  return self;
}

RCT_NOT_IMPLEMENTED(- (instancetype)initWithCoder:(NSCoder *)aDecoder)

- (UIViewController *)reactViewController
{
  return _tabController;
}

- (void)dealloc
{
  _tabController.delegate = nil;
  [_tabController removeFromParentViewController];
}

- (NSArray<RCTTabBarItem *> *)reactSubviews
{
  return _tabViews;
}

- (void)insertReactSubview:(RCTTabBarItem *)view atIndex:(NSInteger)atIndex
{
  if (![view isKindOfClass:[RCTTabBarItem class]]) {
    RCTLogError(@"subview should be of type RCTTabBarItem");
    return;
  }
  [_tabViews insertObject:view atIndex:atIndex];
  _tabsChanged = YES;
}

- (void)removeReactSubview:(RCTTabBarItem *)subview
{
  if (_tabViews.count == 0) {
    RCTLogError(@"should have at least one view to remove a subview");
    return;
  }
  [_tabViews removeObject:subview];
  _tabsChanged = YES;
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  [self reactAddControllerToClosestParent:_tabController];
  _tabController.view.frame = self.bounds;
  
  for (UIView *viewTab in _tabController.tabBar.subviews) {
    for (UIView *subView in viewTab.subviews) {
      NSString *strClassName = [NSString stringWithUTF8String:object_getClassName(subView)];
      if ([strClassName isEqualToString:@"UITabBarButtonBadge"] || // **** iOS 6 prior is UITabBarButtonBadge
          [strClassName isEqualToString:@"_UIBadgeView"]) {
        // **** iOS posterior is UITabBarButtonBadge
        bool isRedDot=false;
        for (id Labelview in subView.subviews) {
          if ([Labelview isKindOfClass:[UILabel class]]) {
            UILabel *numLabel = (UILabel *)Labelview;
            isRedDot=[numLabel.text isEqualToString:@" "];
            break;
          }
        }
        if(isRedDot){
        
        CGRect badgeFrame = subView.frame;
        badgeFrame.size = CGSizeMake(8, 8);
        subView.frame = badgeFrame;
        
        subView.layer.masksToBounds = YES;
        subView.layer.cornerRadius = 4;
        subView.backgroundColor = [UIColor redColor];
        [subView.subviews makeObjectsPerformSelector:@selector(removeFromSuperview)];
        return ;
        }
      }
    }
  }
}

- (void)reactBridgeDidFinishTransaction
{
  // we can't hook up the VC hierarchy in 'init' because the subviews aren't
  // hooked up yet, so we do it on demand here whenever a transaction has finished
  [self reactAddControllerToClosestParent:_tabController];

  if (_tabsChanged) {

    NSMutableArray<UIViewController *> *viewControllers = [NSMutableArray array];
    for (RCTTabBarItem *tab in [self reactSubviews]) {
      UIViewController *controller = tab.reactViewController;
      if (!controller) {
        controller = [[RCTWrapperViewController alloc] initWithContentView:tab];
      }
      [viewControllers addObject:controller];
    }

    _tabController.viewControllers = viewControllers;
    _tabsChanged = NO;
  }

  [_tabViews enumerateObjectsUsingBlock:
   ^(RCTTabBarItem *tab, NSUInteger index, __unused BOOL *stop) {
    UIViewController *controller = _tabController.viewControllers[index];
    controller.tabBarItem = tab.barItem;
    if (tab.selected) {
      _tabController.selectedViewController = controller;
    }
  }];
}

- (UIColor *)barTintColor
{
  return _tabController.tabBar.barTintColor;
}

- (void)setBarTintColor:(UIColor *)barTintColor
{
  _tabController.tabBar.barTintColor = barTintColor;
}

- (UIColor *)tintColor
{
  return _tabController.tabBar.tintColor;
}

- (void)setTintColor:(UIColor *)tintColor
{
  _tabController.tabBar.tintColor = tintColor;
}

- (BOOL)translucent {
  return _tabController.tabBar.isTranslucent;
}

- (void)setTranslucent:(BOOL)translucent {
  _tabController.tabBar.translucent = translucent;
}

#pragma mark - UITabBarControllerDelegate

- (BOOL)tabBarController:(UITabBarController *)tabBarController shouldSelectViewController:(UIViewController *)viewController
{
  NSUInteger index = [tabBarController.viewControllers indexOfObject:viewController];
  RCTTabBarItem *tab = _tabViews[index];
  if (tab.onPress) tab.onPress(nil);
  return NO;
}

@end
