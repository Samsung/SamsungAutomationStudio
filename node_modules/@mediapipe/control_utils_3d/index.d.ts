/**
 * @fileoverview This module provides types for normalized landmarks and the
 * LandmarkGrid widget.
 */

/**
 * Represents a single normalized landmark.
 */
export declare interface NormalizedLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

/**
 * Configuration for the landmark grid.
 */
interface LandmarkGridConfig {
  axesColor?: number;
  axesWidth?: number;
  backgroundColor?: number;
  /**
   * The "centered" attribute describes whether the grid should use the center
   * of the bounding box of the landmarks as the origin.
   */
  centered?: boolean;
  connectionColor?: number;
  connectionWidth?: number;
  definedColors?: Array<{name: string; value: number;}>;
  /**
   * The "fitToGrid" attribute describes whether the grid should dynamically
   * resize based on the landmarks given.
   */
  fitToGrid?: boolean;
  labelPrefix?: string;
  labelSuffix?: string;
  landmarkColor?: number;
  landmarkSize?: number;
  margin?: number;
  minVisibility?: number;
  nonvisibleLandmarkColor?: number;
  numCellsPerAxis?: number;
  /**
   * The "range" attribue describes the default numerical boundaries of the
   * grid. The grid ranges from [-range, range] on every axis.
   */
  range?: number;
  showHidden?: boolean;
}

/**
 * A connection between two landmarks
 */
type Connection = number[];

/**
 * A list of connections between landmarks
 */
type ConnectionList = Connection[];

/**
 * An interface for specifying colors for lists (e.g. landmarks and connections)
 */
type ColorMap<T> = Array<{color: string | undefined; list: T[]}>;

/**
 * Provides a 3D grid that is rendered onto a canvas where landmarks and
 * connections can be drawn.
 */
export class LandmarkGrid {
  constructor(parent: HTMLElement, config?: LandmarkGridConfig);
  updateLandmarks(
      landmarks: NormalizedLandmark[],
      colorConnections?: ConnectionList|ColorMap<Connection>,
      colorLandmarks?: ColorMap<number>): void;
}
