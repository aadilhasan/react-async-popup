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
export interface RnderComponenetType {
  (callbacks: CallbackFuns): JSX.Element;
}

export type BodyType = RnderComponenetType;
export type FooterType = RnderComponenetType;

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

export interface NewConfirmCofig extends ConfirmProps {
  container: Element;
}
export interface DestroyCallbackFun {
  (): Promise<void>;
}

export interface NewConfirmReturnType {
  show: OpenFun;
  destroy: DestroyCallbackFun;
}

export interface NewFun {
  (config: NewConfirmCofig): Promise<NewConfirmReturnType>;
}

export interface PromiseCallbackFn {
  (value: any): void
}