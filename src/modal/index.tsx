import React from "react";
import Base from "../base";
import ReactDOM from "react-dom";
import cssStyles from "./style.module.scss";
import {
  NewConfirmReturnType,
  OpenFun,
  BaseProps,
  DestroyCallbackFun
} from "../types";
import { ComponentType } from "../enums";
import { getContainer, unmountReactComponent } from "../utils";

class Modal extends Base {
  get styles() { return cssStyles; }
}

Modal.new = (config?: BaseProps): Promise<NewConfirmReturnType> => {
  const { container, ...rest } = config || {} as BaseProps;
  const div = getContainer(container);

  const destroy = (): Promise<void> => unmountReactComponent(div);

  return new Promise(resolve => {
    const getRef = (ref: Modal) => {
      resolve({
        show: ref.open as OpenFun,
        destroy: destroy as DestroyCallbackFun
      });
    };
    ReactDOM.render(<Modal {...rest} type={ComponentType.Modal} ref={getRef} />, div);
  });
};

export default Modal;
