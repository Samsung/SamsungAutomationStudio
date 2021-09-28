/**
 * @fileoverview Provides a simple camera with a callback when a frame
 * is available.
 */

/**
 * Can send an instance to the Camera constructor to receive callbacks when a
 * frame is available.
 */
export declare interface CameraOptions {
  onFrame: () => Promise<void>| null;
  facingMode?: 'user'|'environment';
  width?: number;
  height?: number;
}

/**
 * Represents a mediadevice camera. It will start a camera and then run an
 * animation loop that calls the user for each frame. If the user spends too
 * much time in the callback, then animation frames will be dropped.
 */
export declare class Camera {
  constructor(video: HTMLVideoElement, options: CameraOptions);
  start(): Promise<void>;
  stop(): Promise<void>;
}
