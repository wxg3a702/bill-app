/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.mobile.views.viewpager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.mobile.views.viewpager.ZXReactViewPager;

/**
 * Event emitted by {@link ZXReactViewPager} when selected page changes.
 *
 * Additional data provided by this event:
 *  - position - index of page that has been selected
 */
/* package */ class PageSelectedEvent extends Event<com.mobile.views.viewpager.PageSelectedEvent> {

  public static final String EVENT_NAME = "topPageSelected";

  private final int mPosition;

  protected PageSelectedEvent(int viewTag, long timestampMs, int position) {
    super(viewTag, timestampMs);
    mPosition = position;
  }

  @Override
  public String getEventName() {
    return EVENT_NAME;
  }

  @Override
  public void dispatch(RCTEventEmitter rctEventEmitter) {
    rctEventEmitter.receiveEvent(getViewTag(), getEventName(), serializeEventData());
  }

  private WritableMap serializeEventData() {
    WritableMap eventData = Arguments.createMap();
    eventData.putInt("position", mPosition);
    return eventData;
  }
}
