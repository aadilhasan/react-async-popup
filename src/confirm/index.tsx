import React from "react";
import Base from "../base";
import ReactDOM from "react-dom";
import styles from "./style.module.scss";
import { HEADER_ID, CONTENT_ID } from "../const"
import {
  FooterType,
  Config,
  NewConfirmReturnType
} from "../types";

class Confirm extends Base {
  public render() {
    const { heading, message, body, footer, ...aria } = this.dynamicConfig || {}
    const { visible } = this.state;
    const { ariaLabelledby = HEADER_ID, ariaDescribedby = CONTENT_ID } = { ...this.props, ...aria };

    if (!visible) return null;

    return (
      //@ts-ignore
      <div className={styles.popupContainer} ref={this.myRef}>
        <div role="alertdialog" aria-modal="true" aria-labelledby={ariaLabelledby} aria-describedby={ariaDescribedby} className={styles.confirmContainer}>
          <header>
            <h3 id={HEADER_ID}> {heading} </h3>
          </header>
          {this.renderBody(message, body)}
          {this.renderFooter(footer)}
        </div>
      </div>
    );
  }

  private renderBody(message: any, body: any) {
    let contentToRender: any  = message;

    if (body && typeof body === "function") {
      contentToRender = body({ cancel: this.onCancel, success: this.onOk });
    } else if (body || body === null) {
      contentToRender = null;
    }

    return <div id={CONTENT_ID} className={styles.body}>{contentToRender}</div>;
  }

  private renderFooter(footer?: FooterType) {
    let contentToRender = null;

    if (footer === null) return null;

    if (footer && typeof footer === "function") {
      contentToRender = footer({ cancel: this.onCancel, success: this.onOk });
    }

    if (footer) {
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

Confirm.new = (config: Config): Promise<NewConfirmReturnType> => {
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
      if(div.parentNode){
        div.parentNode.removeChild(div);
      }
      resolve();
    });
  };

  return new Promise(resolve => {
    const getRef = (ref: Confirm) => {
      resolve({
        show: ref.open,
        destroy
      });
    };
    ReactDOM.render(<Confirm ref={getRef} />, div);
  });
};

export default Confirm;
