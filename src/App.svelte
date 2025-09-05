<script>
    import { onMount } from 'svelte';
    import { activeView } from './stores/viewStore.svelte.js';
    import { scenarioStore } from './stores/scenarioStore.svelte.js';
    import { parameterRanges } from './lib/model.js';
    import { viewRegistry } from './views/view-registry.js';

    import Header from './components/Header.svelte';
    import ReportView from './views/ReportView.svelte';
    import GenericView from './views/GenericView.svelte';

    let initialized = $state(false);

    const viewComponents = {
        'Report': { component: ReportView, props: {} },
        'Key Drivers': { component: GenericView, props: { analysisModules: viewRegistry['Key Drivers'] } },
        'Surrogate Model': { component: GenericView, props: { analysisModules: viewRegistry['Surrogate Model'] } },
        'Data': { component: GenericView, props: { analysisModules: viewRegistry['Data'] } }
    };

    const ActiveViewConfig = $derived(viewComponents[activeView.value]);
    const ActiveComponent = $derived(ActiveViewConfig?.component);
    const activeProps = $derived(ActiveViewConfig?.props || {});

    onMount(() => {
        const defaultParams = Object.fromEntries(
            Object.entries(parameterRanges).map(([key, value]) => [key, value.default])
        );
        
        const defaultScenario = {
            parameters: defaultParams,
            narrative: '',
            pinned: [],
            pcpSelections: {}
        };
        scenarioStore.initialize(defaultScenario);

        initialized = true;
    });
</script>

<main>
    <Header />
    {#if initialized && ActiveComponent}
        <ActiveComponent {...activeProps} />
    {/if}
</main> 

<!--

## Code Quality Evaluation

| Dimension | Score | Assessment |
|-----------|-------|------------|
| **Architecture & Organization** | 8/10 | Well-structured with clear separation of concerns. Good use of modules, stores, and components. The module registry pattern with dynamic imports is elegant. Minor deduction for some coupling between stores and views. |
| **Component Design** | 7/10 | Components are reasonably modular and reusable. Good use of props and event dispatching. Some components like `AnalysisLoader` handle multiple responsibilities. The migration to Svelte 5's `$props()` and `$state()` is mostly clean. |
| **State Management** | 7/10 | The reactive store pattern using `$state` is functional but the `scenarioStore` implementation is complex with many responsibilities. Good persistence layer abstraction. The direct property access pattern works but could be more elegant. |
| **Code Maintainability** | 8/10 | Clear naming conventions, good documentation with JSDoc comments, and helpful inline explanations. The dynamic module loading system is well-documented. Test coverage exists for critical stores. |
| **Performance Considerations** | 7/10 | Good use of `$derived` for computed values, proper lifecycle management with `onMount`. D3 integration could be optimized to reduce re-renders. The ResizeObserver pattern is properly implemented. |
| **Error Handling** | 6/10 | Basic error handling in localStorage operations and some user confirmations. Missing comprehensive error boundaries and validation for user inputs. File reading operations need error handling as noted in comments. |
| **Accessibility** | 5/10 | Basic semantic HTML and ARIA labels on some buttons. Missing keyboard navigation support, ARIA descriptions for complex visualizations, and screen reader considerations for charts. |
| **Testing** | 6/10 | Has unit tests for the scenario store with good coverage of key functionality. Missing tests for components, other stores, and integration scenarios. Mock implementations are adequate. |
| **Type Safety** | 4/10 | Limited TypeScript usage despite having `vite-env.d.ts`. Heavy use of `@ts-ignore` comments. Props are not typed, which could lead to runtime errors. |
| **CSS & Styling** | 8/10 | Consistent use of CSS variables, responsive design with grid layouts, good visual hierarchy. Clean and maintainable styles with proper scoping. |

## Overall Rating: **6.8/10**

### Key Strengths:
- Clean architectural patterns with good separation of concerns
- Effective use of Svelte 5's reactive features
- Well-organized module system with dynamic loading
- Consistent styling approach with CSS variables
- Good documentation and code comments

### Areas for Improvement:
- Add proper TypeScript types throughout the codebase
- Implement comprehensive error handling and validation
- Enhance accessibility features for all interactive elements
- Expand test coverage to include components and integration tests
- Refactor complex state management logic into smaller, focused stores
- Add error boundaries and loading states for data operations

The codebase demonstrates solid engineering practices and would benefit most from improved type safety and more comprehensive testing to move from good to excellent.

-->
