import { ReactElement } from "react";

export interface RenderFun {
  (): JSX.Element;
}

export type ReactComponentType = ReactElement | string | number;
export type ReactComponentWithFunType =
  | ReactElement
  | RenderFun
  | string
  | number;

export interface ToggleFun {
  (value: any): void;
}

export interface CallbackFuns {
  success: ToggleFun;
  cancel: ToggleFun;
}
export interface RenderComponenetType {
  (callbacks: CallbackFuns): JSX.Element;
}

export type BodyType = RenderComponenetType;
export type FooterType = RenderComponenetType;

export interface ConfirmProps {
  heading?: ReactComponentType;
  message?: ReactComponentType;
  body?: BodyType;
  footer?: FooterType;
}

export interface OpenFun {
  (props: ConfirmProps): Promise<any>
}

export interface ConfirmState {
  visible: boolean;
}

export interface Config {
  container?: Element | HTMLElement;
}
export interface DestroyCallbackFun {
  (): Promise<void>;
}

export interface NewConfirmReturnType {
  show: OpenFun;
  destroy: DestroyCallbackFun;
}

export interface NewFun {
  (config: Config): Promise<NewConfirmReturnType>;
}

export interface PromiseCallbackFn {
  (value: any): void
}