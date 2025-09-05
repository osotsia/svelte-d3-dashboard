// MODIFICATION: Import the 'Component' type from Svelte.
import type { Component } from 'svelte';

/** Defines the structure for a single parameter's range and default value. */
export interface ParameterConfig {
    min: number;
    max: number;
    step: number;
    default: number;
}

/** A map of parameter names to their configuration. */
export type ParameterRanges = Record<string, ParameterConfig>;

/** A map of parameter names to their current numerical values. */
export type Parameters = Record<string, number>;

/** Defines the structure of a saved or working scenario. */
export interface Scenario {
    parameters: Parameters;
    narrative: string;
    pinned: { id: string; title: string }[];
    pcpSelections: Record<string, [number, number]>;
}

/** Represents a collection of named scenarios. */
export type ScenarioMap = Record<string, Scenario>;

/** 
 * Defines the contract for a module configuration object.
 * These objects are used to dynamically construct the application's views.
 */
export interface ModuleConfig {
    id: string;
    title: string;
    // MODIFICATION: Use the 'Component' type. This is the correct type
    // for a Svelte 5 component definition.
    component: Component;
    layout?: 'default' | 'full-width';
    view: 'Key Drivers' | 'Surrogate Model' | 'Data';
    explanation?: string;
    props?: Record<string, any>;
    mapper?: (dataStore: any, workingState: Scenario) => Record<string, any>;
    updater?: (event: CustomEvent) => void;
}