import { ComponentType } from "./enums";

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

export interface OpenFun {
  (props: OpenConfig): Promise<any>
}

export interface DestroyCallbackFun {
  (): Promise<void>;
}

export interface NewConfirmReturnType {
  show: OpenFun;
  destroy: DestroyCallbackFun;
}

export interface NewFun {
  (config?: BaseConfig): Promise<NewConfirmReturnType>;
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
  type?: ComponentType;
}


export interface OpenConfig extends BaseConfig {
  title?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
}