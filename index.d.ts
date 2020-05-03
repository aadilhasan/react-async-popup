declare namespace ReactAsyncPopup {

    interface Show {
        (props: ShowParam): Promise<any>
    }

    interface Destroy {
        (): Promise<void>;
    }

    interface NewReturnType {
        show: Show;
        destroy: Destroy;
    }

    interface BaseConfig {
        popupStyle?: React.CSSProperties,
        okText?: string,
        cancelText?: string,
        maskClosable?: boolean,
        closable?: boolean,
        closeOnEscape?: boolean,
        wrapClassName?: string;
        aria?: {
            labelledby?: string;
            describedby?: string;
        }
    }

    interface BaseProps extends BaseConfig {
        destroyOnClose?: boolean,
        container?: HTMLElement;
    }

    interface New {
        (config?: BaseProps): Promise<NewReturnType>;
    }

    interface ShowParam extends BaseConfig {
        title?: React.ReactNode;
        content?: React.ReactNode;
        footer?: React.ReactNode;
    }

    class Modal {
        static new: New
    }

    class Confirm {
        static new: New
    }
}

export as namespace ReactAsyncPopup;
export = ReactAsyncPopup;