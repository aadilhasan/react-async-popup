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

        if (e.shiftKey) /* shift + tab */ {
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

    element.addEventListener('keydown', handleFocusChange);
    // focus first focusable element
    firstFocusableEl.focus();
    return () => {
        element.removeEventListener('keydown', handleFocusChange);
        // return focus back 
        //@ts-ignore
        focusedBeforModalOpen && focusedBeforModalOpen.focus()
    }
}

export const getContainer = (container?: HTMLElement) => {
    const div = document.createElement("div");
    if (container && container instanceof Element) {
        container.appendChild(div);
    } else {
        document.body.appendChild(div);
    }
    return div;
}

export const unmountReactComponent = (div: HTMLElement): Promise<void> => {
    return new Promise(resolve => {
        ReactDOM.unmountComponentAtNode(div);
        if (div.parentNode) {
            div.parentNode.removeChild(div);
        }
        resolve();
    });
}