/**
 * Observes the DOM for a parent element, then observes that parent
 * for specific child elements. If the parent is removed, it resumes
 * searching for the parent.
 *
 * @param {string} parentSelector - CSS selector for the parent element to find.
 * @param {string} childSelector - CSS selector for the child element(s) to find within the parent.
 * @param {function(Element): void} callback - Function to execute for each found child element.
 *                                             Receives the found child element as an argument.
 * @param {Element} [observeRoot=document.body] - The root element for the initial observation.
 * @param {MutationObserverInit} [parentObserverConfig={ childList: true, subtree: true }] - Configuration for the parent observer.
 * @param {MutationObserverInit} [childObserverConfig={ childList: true, subtree: true }] - Configuration for the child observer.
 * @returns {function(): void} A function to disconnect both observers.
 */
export function observeForNestedElement(
    parentSelector,
    childSelector,
    callback,
    observeRoot = document.body,
    parentObserverConfig = { childList: true, subtree: true },
    childObserverConfig = { childList: true, subtree: true }
) {
    let parentObserver = null;
    let childObserver = null;
    let currentParentNode = null; // Keep track of the currently observed parent

    // --- Function to start observing for children ---
    const startChildObserver = (parentNode) => {
        // Prevent starting multiple observers on the same parent
        if (childObserver && currentParentNode === parentNode) {
            return;
        }
        // Stop existing child observer if target parent changes
        stopChildObserver();

        currentParentNode = parentNode;

        // --- Check for existing children first ---
        const existingChildren = parentNode.querySelectorAll(childSelector);
        existingChildren.forEach(callback); // Trigger callback for already present children

        // --- Set up the child observer ---
        childObserver = new MutationObserver((mutations) => {
            // Safety check: If parent somehow got disconnected between mutations, stop
            if (!currentParentNode || !currentParentNode.isConnected) {
                stopChildObserver();
                // The parentObserver will detect the removal on its next run
                return;
            }

            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.matches(childSelector)) {
                                callback(node);
                            }
                            node.querySelectorAll(childSelector).forEach(callback);
                        }
                    }
                }
                // Add other mutation type handling (e.g., attributes) if needed for children
            }
        });

        try {
            childObserver.observe(parentNode, childObserverConfig);
        } catch (error) {
            stopChildObserver(); // Clean up if observe fails
        }
    };

    // --- Function to stop observing for children ---
    const stopChildObserver = () => {
        if (childObserver) {
            childObserver.disconnect();
            childObserver = null;
        }
        // Don't nullify currentParentNode here, parentObserver needs it for comparison
    };

    // --- Function to handle the state based on parent presence ---
    const checkAndManageObservers = () => {
        const parentElement = observeRoot.querySelector(parentSelector);

        if (parentElement && parentElement.isConnected) {
            // Parent exists and is in the DOM
            if (currentParentNode !== parentElement) {
                // Found the parent, or it changed - start/restart child observer
                startChildObserver(parentElement);
            } else {
                // Parent still the same, child observer should be running (do nothing)
            }
        } else {
            // Parent doesn't exist or is disconnected
            if (currentParentNode) {
                // Parent was previously found but is now gone
                stopChildObserver();
                currentParentNode = null; // Clear the reference, we are searching again
            } else {
                // Parent still not found (initial state or after removal)
                // console.log(`Observer: Parent "${parentSelector}" not found. Continuing search.`); // Can be noisy
            }
        }
    };

    // --- Set up the main parent observer ---
    parentObserver = new MutationObserver((mutations, observer) => {
        // Check the state on any relevant DOM change within observeRoot
        // We could optimize by checking mutations first, but querying is robust.
        checkAndManageObservers();
    });

    // --- Initial Check ---
    // Run the check once immediately in case the parent/children already exist
    checkAndManageObservers();

    // --- Start the main observer ---
    parentObserver.observe(observeRoot, parentObserverConfig);

    // --- Return a disconnect function ---
    return function disconnectAll() {
        if (parentObserver) {
            parentObserver.disconnect();
            parentObserver = null;
        }
        stopChildObserver(); // Ensure child observer is stopped
        currentParentNode = null;
    };
}