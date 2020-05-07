export interface RenderFun {
  (): JSX.Element;
}

export interface ToggleFun {
  (value: any): void;
}

export interface CallbackFuns {
  ok: ToggleFun;
  cancel: ToggleFun;
}
 
export interface ShowFun {
  (props: ShowConfig): Promise<any>
}

export interface DestroyCallbackFun {
  (): Promise<void>;
}

export interface NewReturnType {
  show: ShowFun;
  destroy: DestroyCallbackFun;
}

export interface NewFun {
  (config?: BaseConfig): Promise<NewReturnType>;
}

export interface PromiseCallbackFn {
  (value: any): void
}

export interface BaseConfig {
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

export interface BaseProps extends BaseConfig {
  destroyOnClose?: boolean,
  container?: HTMLElement;
}


export interface ShowConfig extends BaseConfig {
  title?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
}