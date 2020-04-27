import React from "react";
import Base from "../base";
import ReactDOM from "react-dom";
import styles from "./style.module.scss";
import { HEADER_ID, CONTENT_ID } from "../const"
import {
  NewConfirmReturnType,
  OpenFun,
  BaseProps,
  DestroyCallbackFun
} from "../types";

class Confirm extends Base {
  public render() {
    const { title, content, footer, ...aria } = this.dynamicConfig || {}
    const { visible } = this.state;
    const { ariaLabelledby = HEADER_ID, ariaDescribedby = CONTENT_ID } = { ...this.props, ...aria };

    if (!visible) return null;

    return (
      //@ts-ignore
      <div className={styles.popupContainer} ref={this.myRef}>
        <div role="alertdialog" aria-modal="true" aria-labelledby={ariaLabelledby} aria-describedby={ariaDescribedby} className={styles.container}>
          {title && <div className={styles.title} id={HEADER_ID}> {title} </div>}
          {this.rendercontent(styles, content)}
          {this.renderFooter(styles, footer)}
        </div>
      </div>
    );
  }
}

Confirm.new = (config?: BaseProps): Promise<NewConfirmReturnType> => {
  const { container, ...rest } = config || {} as BaseProps;
  const div = document.createElement("div");
  if (container && container instanceof Element) {
    container.appendChild(div);
  } else {
    document.body.appendChild(div);
  }

  const destroy = (): Promise<void> => {
    return new Promise(resolve => {
      ReactDOM.unmountComponentAtNode(div);
      if (div.parentNode) {
        div.parentNode.removeChild(div);
      }
      resolve();
    });
  };

  return new Promise(resolve => {
    const getRef = (ref: Confirm) => {
      resolve({
        show: ref.open as OpenFun,
        destroy: destroy as DestroyCallbackFun
      });
    };
    ReactDOM.render(<Confirm {...rest} ref={getRef} />, div);
  });
};

export default Confirm;
