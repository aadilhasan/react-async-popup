import React from "react";
import Base from "../base";
import ReactDOM from "react-dom";
import { HEADER_ID, CONTENT_ID } from "../const"
import styles from "./style.module.scss";
import {
  FooterType,
  Config,
  NewConfirmReturnType
} from "../types";

class Modal extends Base {
  render() {
    const { heading, message, body, footer, ...aria } = this.dynamicConfig || {};
    const { visible } = this.state;
    const { ariaLabelledby = HEADER_ID, ariaDescribedby = CONTENT_ID } = { ...this.props, ...aria };

    if (!visible) return null;

    return (
      //@ts-ignore
      <div className={styles.popupContainer} ref={this.myRef}>
        <div role="dialog" aria-modal="true" aria-labelledby={ariaLabelledby} aria-describedby={ariaDescribedby} className={styles.modalContainer}>
          <h3 id={HEADER_ID}> {heading} </h3>
          {this.renderBody(message, body)}
          {this.renderFooter(footer)}
        </div>
      </div>
    );
  }

  private renderBody(message: any, body: any) {
    let contentToRender = this.getRenderableWithProps(body);
    return <div id={CONTENT_ID} className={styles.modalBody}>{contentToRender || message}</div>;
  }

  private renderFooter(footer?: FooterType) {

    let contentToRender = this.getRenderableWithProps(footer);

    if (contentToRender !== undefined) {
      return <div className={styles.footer}>{contentToRender}</div>;
    }

    return (
      <div className={styles.footer}>
        <button className={styles.action} onClick={this.onCancel}>
          {" "}
          Cancel{" "}
        </button>
        <button className={styles.action} onClick={this.onOk}>
          {" "}
          ok{" "}
        </button>
      </div>
    );
  }

}

Modal.new = (config: Config): Promise<NewConfirmReturnType> => {
  const { container } = config || {};
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
    const getRef = (ref: Modal) => {
      resolve({
        show: ref.open,
        destroy
      });
    };
    ReactDOM.render(<Modal ref={getRef} />, div);
  });
};

export default Modal;
