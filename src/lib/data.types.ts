// lib/data.types.ts

/** 
 * Describes the metadata and performance of the surrogate model.
 * MODIFICATION: All metrics are now typed as `number` or `number | null`
 * instead of `string` to reflect the changes in the data generation script.
 * Keys have also been updated for clarity (e.g., `training_time_seconds`).
 */
export interface ModelCard {
    model_type: string;
    normalized_test_rmse: number;
    r2_score: number;
    raw_test_rmse: number;
    training_time_seconds: number | null; // Can be null if model is loaded from disk
    evaluation_speed_evals_per_sec: number;
    test_samples: number;
    training_samples: number | null; // Can be null if model is loaded from disk
    n_estimators: number;
}

/** Represents a single data point for the residuals plot. */
export interface ResidualPoint {
    fitted: number;
    residual: number;
}

/** Contains data for the residuals analysis. */
export interface Residuals {
    data: ResidualPoint[];
    rmse: number;
}

/** Represents a single Sobol index calculation for a parameter. */
export interface SobolIndex {
    param: string;
    S1: number;
    S1_conf: number;
    ST: number;
    ST_conf: number;
}

/** Contains data for Sobol sensitivity analysis. */
export interface Sobol {
    indices: SobolIndex[];
}

/** Represents a single feature's importance value. */
export interface FeatureImportance {
    feature: string;
    importance: number;
    importance_conf: number;
}

/** Contains data for the feature importance analysis. */
export interface FeatureImportanceData {
    data: FeatureImportance[];
}

/** Defines an axis for the Parallel Coordinates Plot. */
export interface PCPAxis {
    name: string;
    min: number;
    max: number;
}

/** A single data run/point for the Parallel Coordinates Plot. */
export type PCPDataPoint = Record<string, number>;

/** Contains the full dataset for the Parallel Coordinates Plot. */
export interface PCPData {
    axes: PCPAxis[];
    data: PCPDataPoint[];
}

/** The top-level interface for the entire data payload. */
export interface MainPayload {
    model_card: ModelCard;
    residuals: Residuals;
    sobol: Sobol;
    "feature-importance": FeatureImportanceData;
    pcp: PCPData;
}