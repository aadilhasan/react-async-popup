import React from "react";
import Base from "../base";
import ReactDOM from "react-dom";
import styles from "./style.module.scss";
import {
  // ReactComponentType,
  // BodyType,
  FooterType,
  Config,
  NewConfirmReturnType
} from "../types";

class Modal extends Base {
  render() {
    const { heading, message, body, footer } = this.dynamicConfig || {};
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
    let contentToRender = this.getRenderableWithProps(body);

    return <div className={styles.modalBody}>{contentToRender || message }</div>;
  }

  private renderFooter(footer?: FooterType) {

    let contentToRender = this.getRenderableWithProps(footer);

    if (contentToRender !== undefined) {
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
    ReactDOM.render(<Modal ref={getRef} />, div);
  });
}; 

export default Modal;
