/**
 * @fileoverview Provides a control panel that can be filled with controls to
 * manipulate options in a demo.
 */

/**
 * Represents the set of options used by a control panel. This is used to set
 * the initial state of the options, and is also supplied to the
 * ControlPanelListener when an option is modified.
 */
export declare interface OptionMap {
  [key: string]: unknown;
}

/**
 * We support several ways to get image inputs.
 */
export type InputImage = HTMLVideoElement|HTMLImageElement|HTMLCanvasElement;

/**
 * Base interface for any control that can be added to a control panel.
 */
export declare interface Control {
  create(fire: FireFn, options: OptionMap, parent: HTMLElement): void;
  update(): void;
}

/**
 * A rectangle (units dictated by usage).
 */
export interface Rectangle {
  width: number;
  height: number;
}

/**
 * Supply one of these to a control panel to get notified when the set of
 * options changes.
 */
export declare type ControlPanelListener = (options: OptionMap) => void;

/**
 * Provided to create. Control can call this to update options when control has
 * been manipulated by the user.
 */
export type FireFn = () => void;

/**
 * Construct and add this to a ControlPanel to represent header text that will
 * not change.
 */
export declare class StaticText implements Control {
  constructor(config: {title: string});
  create(fire: FireFn, options: OptionMap, parent: HTMLElement): void;
  update(): void;
}

/**
 * Construct and add this to a ControlPanel to represent a boolean value in
 * a set of options.
 */
export declare class Toggle implements Control {
  constructor(config: {title: string, field: string});
  create(fire: FireFn, options: OptionMap, parent: HTMLElement): void;
  update(): void;
}

/**
 * Configuration options when constructing a Slider control.
 */
export declare interface SliderConfig {
  title: string;
  field: string;
  range?: [number, number];
  step?: number;
  discrete?: string[]|{[key: string]: string};
}

/**
 * Construct and add this to a ControlPanel to represent a finite range in a set
 * of options.
 */
export declare class Slider implements Control {
  constructor(config: SliderConfig);
  create(fire: FireFn, options: OptionMap, parent: HTMLElement): void;
  update(): void;
}

/**
 * A dropdown option for the DropDownControl
 */
export declare interface DropDownControlOption {
  name: string;
  value: string;
}

/**
 * Configuration options when constructing a DropDownControl.
 */
export declare interface DropDownControlConfig {
  title: string;
  field: string;
  options: ReadonlyArray<DropDownControlOption>;
  onselectionchanged?: () => void;
}

/**
 * Construct and add this to a ControlPanel to represent a finite range in a set
 * of options.
 */
export declare class DropDownControl implements Control {
  constructor(config: DropDownControlConfig);
  create(fire: FireFn, options: OptionMap, parent: HTMLElement): void;
  update(): void;
}

/**
 * User specified camera options.
 */
export interface CameraOptions {
  onFrame: () => Promise<void>| null;
  facingMode?: 'user'|'environment';
  width?: number;
  height?: number;
}

interface NamedSource {
  name: string;
  src: string;
}

/**
 * Provides an interface for example videos and images.
 */
interface ExampleOptions {
  videos: NamedSource[];
  images: NamedSource[];
}

/**
 * The type of source, which tells us the sort of icon to use in the
 * dropdown, and allows the user to take different actions when the
 * source is changed.
 */
export type SourceType = 'image'|'video'|'webcam';

/**
 * Options to control the behavior of File Picker.
 */
export interface SourcePickerConfig {
  allowVideo?: boolean;
  allowImage?: boolean;
  cameraOptions?: CameraOptions;
  onFrame?: (image: InputImage, size: Rectangle) => Promise<void>| null;
  onSourceChanged?: (name: string, type: SourceType) => Promise<void>| void;
  examples?: ExampleOptions;
}

/**
 * Construct and add this to a ControlPanel to provide a File Picker that can be
 * listened to.  Also allows a set of files to be attached to a drop down for
 * easy access.
 */
export declare class SourcePicker implements Control {
  constructor(config: SourcePickerConfig);
  create(fire: FireFn, options: OptionMap, parent: HTMLElement): void;
  update(): void;
}

/**
 * Classes must implement an interface to get around Google obfuscators.
 */
export declare interface FPSControl extends Control {
  tick(): void;
}

/**
 * Construct this and call tick() on it to drive it. Attach it to a
 * ControlPanel to get FPS stats.
 */
export declare class FPS implements FPSControl {
  constructor();
  create(fire: FireFn, options: OptionMap, parent: HTMLElement): void;
  update(): void;
  tick(): void;
}

/**
 * ControlPanel class will satisfy this interface. Required to keep the
 * optimizer from chopping off methods.
 */
export declare interface ControlPanelInterface {
  add(controls: Control[]): ControlPanel;
  on(listener: ControlPanelListener): ControlPanel;
}

/**
 * This is a stack of controls that are shown to the user on a web page and
 * allow the user to modify a dictionary of options. The user can connect a
 * listener to detect changes to the options. Use `add` to attach instances of
 * Control -- several control types are already provided.
 */
export declare class ControlPanel implements ControlPanelInterface {
  constructor(parent: HTMLElement, options: OptionMap);
  add(controls: Control[]): ControlPanel;
  on(listener: ControlPanelListener): ControlPanel;
}
