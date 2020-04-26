const KEYCODE_TAB = 9;

export const trapFocus = (element: any) => {

    if (!element) return () => { }
    const focusedBeforModalOpen = document.activeElement;
    const focusableEls = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
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

