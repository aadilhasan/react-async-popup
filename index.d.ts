declare namespace ReactAsyncPopup {

    interface Show {
        (config?: NewConfig): Promise<any>
    }

    interface Destroy {
        (): Promise<void>;
    }

    interface NewReturnType {
        show: Show;
        destroy: Destroy;
    }

    interface BaseConfig {
        title?: React.ReactNode;
        content?: React.ReactNode;
        footer?: React.ReactNode;
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

    interface Config extends BaseConfig {
        destroyOnClose?: boolean,
        container?: HTMLElement;
    }

    interface New {
        (config?: Config): Promise<NewReturnType>;
    }

    type NewConfig = BaseConfig;

    class Modal {
        static new: New
    }

    class Confirm {
        static new: New
    }

    function useModal(config: Config): [Show | null, Destroy | null];

    function useConfirm(config: Config): [Show | null, Destroy | null];
}

export as namespace ReactAsyncPopup;
export = ReactAsyncPopup;