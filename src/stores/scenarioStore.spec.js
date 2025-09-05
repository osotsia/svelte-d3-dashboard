import { describe, it, expect, beforeEach, vi } from 'vitest';
// MODIFICATION: Import the .ts file
import { scenarioStore } from './scenarioStore.svelte';
import { activeView } from './viewStore.svelte';

// Define a consistent default scenario for all tests
const defaultScenario = {
    parameters: { paramA: 1, paramB: 10 },
    narrative: '',
    pinned: [],
    pcpSelections: {}
};

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        removeItem: vi.fn((key) => {
            delete store[key];
        })
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});


describe('scenarioStore', () => {

    beforeEach(() => {
        localStorageMock.clear();
        localStorageMock.getItem.mockClear();
        localStorageMock.setItem.mockClear();
        scenarioStore.initialize(defaultScenario);
    });

    it('initializes with a default state when localStorage is empty', () => {
        expect(scenarioStore.scenarios).toEqual({});
        expect(scenarioStore.workingState).toEqual(defaultScenario);
        expect(scenarioStore.activeScenarioName).toBe(null);
        expect(scenarioStore.isDirty).toBe(false);
        expect(localStorageMock.getItem).toHaveBeenCalledWith('workbenchScenarios');
    });

    it('initializes and normalizes scenarios from localStorage', () => {
        // Arrange
        const storedScenarios = {
            'My Scenario': { parameters: { paramA: 5 } } // Incomplete scenario
        };
        localStorageMock.getItem.mockReturnValue(JSON.stringify(storedScenarios));

        // Act
        scenarioStore.initialize(defaultScenario);

        // Assert
        // MODIFICATION: The expected object must reflect that default parameters are MERGED, not replaced.
        const expectedNormalizedScenario = {
            ...defaultScenario,
            parameters: {
                ...defaultScenario.parameters, // paramA: 1, paramB: 10
                ...storedScenarios['My Scenario'].parameters // paramA: 5
            } // Result: { paramA: 5, paramB: 10 }
        };

        expect(scenarioStore.scenarios['My Scenario']).toEqual(expectedNormalizedScenario);
    });

    it('updates workingState and sets isDirty to true', () => {
        scenarioStore.updateWorkingState({ narrative: 'Test narrative' });
        expect(scenarioStore.workingState.narrative).toBe('Test narrative');
        expect(scenarioStore.isDirty).toBe(true);
    });

    it('saves the current scenario, updates localStorage, and resets isDirty', () => {
        const scenariosBeforeSave = { ...scenarioStore.scenarios };
        scenarioStore.updateWorkingState({ parameters: { paramA: 99 } });
        scenarioStore.saveCurrentScenario('Test Save');

        expect(scenarioStore.activeScenarioName).toBe('Test Save');
        expect(scenarioStore.isDirty).toBe(false);
        expect(scenarioStore.scenarios['Test Save']).toEqual(scenarioStore.workingState);

        const expectedStoredData = {
            ...scenariosBeforeSave,
            'Test Save': scenarioStore.workingState
        };
        expect(localStorageMock.setItem).toHaveBeenCalledWith('workbenchScenarios', JSON.stringify(expectedStoredData));
    });
    
    it('loads an existing scenario and resets isDirty', () => {
        // The loaded scenario must be a complete scenario object.
        const scenarioToLoad = {
            ...defaultScenario,
            parameters: { paramA: 123, paramB: 10 },
            narrative: 'loaded',
        };
        
        scenarioStore.initialize(defaultScenario);
        scenarioStore.updateWorkingState(scenarioToLoad);
        scenarioStore.saveCurrentScenario('Scenario to Load');
        scenarioStore.updateWorkingState({ narrative: 'dirty state' });

        scenarioStore.loadScenario('Scenario to Load');

        expect(scenarioStore.workingState).toEqual(scenarioToLoad);
        expect(scenarioStore.activeScenarioName).toBe('Scenario to Load');
        expect(scenarioStore.isDirty).toBe(false);
    });

    it('creates a new scenario, resetting the state', () => {
        scenarioStore.updateWorkingState({ narrative: 'Some changes' });
        scenarioStore.saveCurrentScenario('Old Scenario');
        scenarioStore.newScenario();
        
        expect(scenarioStore.workingState).toEqual(defaultScenario);
        expect(scenarioStore.activeScenarioName).toBe(null);
        expect(scenarioStore.isDirty).toBe(false);
    });

    it('deletes a scenario and updates localStorage', () => {
        scenarioStore.saveCurrentScenario('Scenario A');
        scenarioStore.saveCurrentScenario('Scenario B');
        const scenariosBeforeDelete = { ...scenarioStore.scenarios };
        scenarioStore.deleteScenario('Scenario A');
        
        expect(scenarioStore.scenarios['Scenario A']).toBeUndefined();
        expect(scenarioStore.scenarios['Scenario B']).toBeDefined();

        const expectedStoredData = { ...scenariosBeforeDelete };
        delete expectedStoredData['Scenario A'];
        expect(localStorageMock.setItem).toHaveBeenLastCalledWith('workbenchScenarios', JSON.stringify(expectedStoredData));
    });

    it('deletes the active scenario and resets workingState', () => {
        scenarioStore.saveCurrentScenario('Active Scenario');
        scenarioStore.deleteScenario('Active Scenario');

        expect(scenarioStore.scenarios['Active Scenario']).toBeUndefined();
        expect(scenarioStore.workingState).toEqual(defaultScenario);
        expect(scenarioStore.activeScenarioName).toBe(null);
        expect(scenarioStore.isDirty).toBe(false);
    });
});