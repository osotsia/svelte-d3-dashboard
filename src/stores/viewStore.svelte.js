let view = $state('Report');
// Note: Using a getter/setter object maintains a similar API to the original store's $activeView = value assignment pattern.
export const activeView = {
    get value() { return view; },
    set(v) { view = v; }
};