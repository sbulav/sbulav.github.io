---
title: "TIL - WebRTC landing page for testing webcam and screen sharing"
date: 2025-12-22
categories:
  - til
tags:
  - webrtc
  - webcam
  - screen-sharing
  - wayland
comments: true
---

I discovered a useful WebRTC testing page created by Mozilla: [https://mozilla.github.io/webrtc-landing/gum_test.html](https://mozilla.github.io/webrtc-landing/gum_test.html).

This page is designed to demonstrate and test the `getUserMedia` (gUM) API — part of the WebRTC suite of browser APIs that let web applications access a user's camera and microphone directly from the browser (with user permission).

The page provides a simple interface to:
- Test webcam and microphone access
- Test screen sharing functionality
- View video constraints and capabilities
- Debug media stream issues

I found this particularly useful for troubleshooting screen sharing issues on Wayland. When screen sharing wasn't working properly in Firefox on my Wayland desktop, I used this page to test and verify that the browser could actually access screen sharing capabilities.

The page helped me confirm that the issue was with specific applications rather than the browser itself, and it provided clear error messages when permissions were missing or when there were compatibility issues with Wayland's screen sharing mechanisms.

If you're developing WebRTC applications or troubleshooting media access issues, this Mozilla demo page is a great tool for testing and debugging.