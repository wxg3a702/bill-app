/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.mobile.views.viewpager;

import java.util.Map;

import android.support.v4.view.ViewPager;
import android.view.View;

import com.facebook.infer.annotation.Assertions;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewManager;
import com.mobile.views.viewpager.*;
import com.mobile.views.viewpager.PageScrollEvent;
import com.mobile.views.viewpager.PageSelectedEvent;
import com.mobile.views.viewpager.ZXReactViewPager;

import javax.annotation.Nullable;

/**
 * Instance of {@link ViewManager} that provides native {@link ViewPager} view.
 */
public class ZXViewPagerManager extends ViewGroupManager<com.mobile.views.viewpager.ZXReactViewPager> {

  private static final String REACT_CLASS = "ZXViewPager";

  public static final int COMMAND_SET_PAGE = 1;
  public static final int COMMAND_SET_PAGE_WITHOUT_ANIMATION = 2;

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  protected com.mobile.views.viewpager.ZXReactViewPager createViewInstance(ThemedReactContext reactContext) {
    return new com.mobile.views.viewpager.ZXReactViewPager(reactContext);
  }

  @Override
  public boolean needsCustomLayoutForChildren() {
    return true;
  }

  @Override
  public Map getExportedCustomDirectEventTypeConstants() {
    return MapBuilder.of(
        com.mobile.views.viewpager.PageScrollEvent.EVENT_NAME, MapBuilder.of("registrationName", "onPageScroll"),
        PageScrollStateChangedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onPageScrollStateChanged"),
        com.mobile.views.viewpager.PageSelectedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onPageSelected")
    );
  }

  @Override
  public Map<String,Integer> getCommandsMap() {
    return MapBuilder.of(
        "setPage",
        COMMAND_SET_PAGE,
        "setPageWithoutAnimation",
        COMMAND_SET_PAGE_WITHOUT_ANIMATION);
  }

  @Override
  public void receiveCommand(
      com.mobile.views.viewpager.ZXReactViewPager viewPager,
      int commandType,
      @Nullable ReadableArray args) {
    Assertions.assertNotNull(viewPager);
    Assertions.assertNotNull(args);
    switch (commandType) {
      case COMMAND_SET_PAGE: {
        viewPager.setCurrentItemFromJs(args.getInt(0), true);
        return;
      }
      case COMMAND_SET_PAGE_WITHOUT_ANIMATION: {
        viewPager.setCurrentItemFromJs(args.getInt(0), false);
        return;
      }
      default:
        throw new IllegalArgumentException(String.format(
            "Unsupported command %d received by %s.",
            commandType,
            getClass().getSimpleName()));
    }
  }

  @Override
  public void addView(com.mobile.views.viewpager.ZXReactViewPager parent, View child, int index) {
    parent.addViewToAdapter(child, index);
  }

  @Override
  public int getChildCount(com.mobile.views.viewpager.ZXReactViewPager parent) {
    return parent.getViewCountInAdapter();
  }

  @Override
  public View getChildAt(com.mobile.views.viewpager.ZXReactViewPager parent, int index) {
    return parent.getViewFromAdapter(index);
  }

  @Override
  public void removeViewAt(com.mobile.views.viewpager.ZXReactViewPager parent, int index) {
    parent.removeViewFromAdapter(index);
  }
}
