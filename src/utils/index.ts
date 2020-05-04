import ReactDOM from "react-dom";

const KEYCODE_TAB = 9;

export const trapFocus = (element: any) => {

    if (!element) return () => { }
    const focusedBeforModalOpen = document.activeElement;
    const focusableEls = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
    if (focusableEls.length === 0) return () => { }
    const firstFocusableEl: any = focusableEls[0];
    const lastFocusableEl: any = focusableEls[focusableEls.length - 1];


    const handleFocusChange = (e: KeyboardEvent) => {

        var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

        if (!isTabPressed) {
            return;
        }
        // if focus element is not inside the trap element focus to first focusable element
        if (!element.contains(document.activeElement)) {
            firstFocusableEl.focus();
            e.preventDefault();
            return;
        }

        if (e.shiftKey) {
            if (document.activeElement === firstFocusableEl) {
                lastFocusableEl.focus();
                e.preventDefault();
            }
        } else /* tab */ {
            if (document.activeElement === lastFocusableEl) {
                firstFocusableEl.focus();
                e.preventDefault();
            }
        }

    }

    document.body.addEventListener('keydown', handleFocusChange);
    // focus first focusable element
    requestAnimationFrame(() => {
        firstFocusableEl.focus();
    })
    return () => {
        document.body.removeEventListener('keydown', handleFocusChange);
        // return focus back 
        //@ts-ignore
        focusedBeforModalOpen && focusedBeforModalOpen.focus()
    }
}

export const getContainer = (container?: HTMLElement) => {
    if (typeof document !== 'undefined') {
        const div = document.createElement("div");
        if (container && container instanceof Element) {
            container.appendChild(div);
        } else {
            document.body.appendChild(div);
        }
        return div;
    }
    return null
}

export const unmountReactComponent = (node: HTMLElement | null): Promise<void> => {

    if (!node) return Promise.resolve();

    return new Promise(resolve => {
        ReactDOM.unmountComponentAtNode(node);
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
        resolve();
    });
}