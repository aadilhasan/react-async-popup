import React from "react";
import Base from "../base";
import ReactDOM from "react-dom";
import styles from "./style.module.scss";
import {
  // ReactComponentType,
  // BodyType,
  FooterType,
  NewConfirmCofig,
  NewConfirmReturnType
} from "../types";

class Modal extends Base {
  render() {
    const { heading, message, body, footer } = {
      ...this.props,
      ...this.dynamicProps
    };
    const { visible } = this.state;

    if (!visible) return null;

    return (
      <div className={styles.popupContainer}>
        <div className={styles.modalContainer}>
          <header>
            <h3> {heading} </h3>
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

    return <div className={styles.modalBody}>{contentToRender}</div>;
  }

  private renderFooter(footer?: FooterType) {
    let contentToRender = null;

    if (footer === null) return null;

    if (footer && typeof footer === "function") {
      contentToRender = footer({ cancel: this.onCancel, success: this.onOk });
    }

    if (footer) {
      return <footer>{contentToRender}</footer>;
    }

    return (
      <footer>
        <button className={styles.action} onClick={this.onCancel}>
          {" "}
          Cancel{" "}
        </button>
        <button className={styles.action} onClick={this.onOk}>
          {" "}
          ok{" "}
        </button>
      </footer>
    );
  }
}

Modal.new = (config: NewConfirmCofig): Promise<NewConfirmReturnType> => {
  const { container, ...ConfirmProps } = config || {};
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
    const getRef = (ref: Modal) => {
      resolve({
        show: ref.open,
        destroy
      });
    };
    ReactDOM.render(<Modal {...ConfirmProps} ref={getRef} />, div);
  });
};

export default Modal;
