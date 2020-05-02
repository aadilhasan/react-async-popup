import React from "react";
import { NewFun, OpenFun, PromiseCallbackFn, RenderFun, BaseProps, OpenConfig } from "./types";
import { trapFocus, unmountReactComponent } from "./utils";
import { CONTENT_ID, HEADER_ID } from "./const";
import { ComponentType } from "./enums";
import { Animate } from "./utils/animate";

const asyncWrap = (promise: Promise<any>): Promise<any> =>
  promise.then(res => res || true).catch(error => error || false);

const KEYCODE_ESC = 27;

const DEFAULTS = {
  closeOnEscape: true,
}

const MODAL_DEFAULTS_PROPS = {
  maskClosable: true,
}

const CONFIRM_DEFAULTS_PROPS = {
  maskClosable: false,
}

export interface State {
  visible: boolean;
}

interface DialogProps extends BaseProps {
  parentNode: HTMLElement
}

export default class Dialog extends React.Component<
  DialogProps,
  State
  > {
  promise: null | Promise<any> = null;
  reject: PromiseCallbackFn | null = null;
  resolve: PromiseCallbackFn | null = null;

  dynamicConfig: OpenConfig | null = null;
  removeFocusListener: Function | null;

  promiseState = {
    rejected: false,
    result: null
  }

  state = {
    visible: false
  };

  static new: NewFun;

  static render: RenderFun

  componentDidMount() {
    document.addEventListener('keyup', this.handleEscape);
  }

  componentWillMount() {
    document.removeEventListener('keyup', this.handleEscape);
  }

  render() {
    const { popupStyle, wrapClassName, aria } = this.allProps;
    const { visible } = this.state;
    const { labelledby = HEADER_ID, describedby = CONTENT_ID } = aria || {};
    const styles = this.styles
    const role = this.type === ComponentType.Confirm ? 'alertdialog' : 'dialog';

    return (
      <Animate
        show={visible}
        transitionDuration={300}
        unmountOnHide={true}
        visibleClassName={styles.show}
        afterVisible={this.handleModalVisible}
        afterHide={this.handleModalExit}
      >
        {() => {
          return (<>
            <div
              className={`${styles.popup}${wrapClassName ? " " + wrapClassName : ''}`}>
              <div role={role}
                aria-modal="true"
                aria-labelledby={labelledby}
                aria-describedby={describedby}
                style={popupStyle || {}}
                className={styles.popupContent}>
                <div className={styles.content}>
                  {this.renderCloseButton(styles)}
                  {this.renderHeader(styles)}
                  {this.renderContent(styles)}
                  {this.renderFooter(styles)}
                </div>
              </div>
            </div>
            <div className={styles.mask} onClick={this.handleMaskClick} />
          </>)
        }}
      </Animate>
    )
  }

  get allProps() {
    const componentDefaults = this.type === ComponentType.Confirm ? CONFIRM_DEFAULTS_PROPS : MODAL_DEFAULTS_PROPS;
    return { ...DEFAULTS, ...componentDefaults, ...this.props, ...(this.dynamicConfig || {}) };
  }

  renderHeader(styles: any) {
    const { title } = this.allProps;
    if (!title) {
      return null
    }

    // some screen reader read text from text container elments only so use it
    if (typeof title !== 'object' || typeof title !== 'function') {
      return (
        <div className={styles.titleContainer}>
          <h3 className={styles.title} id={HEADER_ID}>{title}</h3>
        </div>
      )
    }

    return (
      <div className={styles.titleContainer} id={HEADER_ID}>
        {title}
      </div>
    )
  }

  renderCloseButton(styles: any) {
    const { closable } = this.allProps;
    const isModal = this.type === ComponentType.Modal;
    if (!isModal || closable === false) {
      return null
    }
    return (
      <div className={styles.closeButtonContainer}>
        <CloseIcon className={styles.closeButton} onClick={this.handleCancel} />
      </div>
    );
  }


  renderContent(styles: any) {
    const { content } = this.allProps;
    if (content === null) return null;
    let contentToRender = this.getRenderableWithProps(content);
    return contentToRender ? <div id={CONTENT_ID} className={styles.body}>{contentToRender}</div> : null;
  }

  renderFooter(styles: any) {
    const { footer, okText, cancelText, closable } = this.allProps;

    if (footer === null) return null;

    let contentToRender = this.getRenderableWithProps(footer);

    if (contentToRender !== undefined) {
      return <div className={styles.footer}>{contentToRender}</div>;
    }

    return (
      <div className={styles.footer}>
        {closable !== false && <button className={styles.action} onClick={this.handleCancel}>
          {cancelText || 'Cancel'}
        </button>}
        <button className={styles.action} onClick={this.handleOK}>
          {okText || 'Ok'}
        </button>
      </div>
    );
  }

  get styles() {
    return {} as any
  }

  get type() {
    return ComponentType.Confirm
  }


  handleEscape = (event: KeyboardEvent) => {
    const key = event.which || event.keyCode;
    const { closeOnEscape, closable } = this.allProps
    if ((closable !== false || closeOnEscape !== false) && key === KEYCODE_ESC) {
      this.onCancel();
      event.stopPropagation();
    }
  };

  getRenderableWithProps(component: any) {
    let contentToRender;
    const props = { cancel: this.onCancel, ok: this.onOk };
    if (component === null) return null;
    if (component && typeof component === "function") {
      contentToRender = component(props);
    } else if (React.isValidElement(component)) {
      contentToRender = React.cloneElement(component, props)
    } else {
      contentToRender = component;
    }

    return contentToRender;
  }

  open: OpenFun = (dynamicProps?: OpenConfig) => {
    this.dynamicConfig = null;
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    if (dynamicProps) {
      this.dynamicConfig = dynamicProps;
    }
    this.setState({ visible: true }, this.disableBodyScroll);
    return asyncWrap(this.promise);
  };

  handleModalVisible = (el: HTMLElement) => {
    setTimeout(() => {
      this.removeFocusListener = trapFocus(el)
    })
  }

  handleModalExit = () => {
    const { rejected, result } = this.promiseState;
    if (rejected == true) {
      this.reject && this.reject(result);
    } else {
      this.resolve && this.resolve(result);
    }
    this.afterAction();
  }

  afterAction = () => {
    this.dynamicConfig = null;
    this.promise = null;
    this.resolve = null;
    this.reject = null;
    this.enableBodyScroll();
    this.removeFocusListener && this.removeFocusListener();
    this.removeFocusListener = null;
    this.promiseState = {
      rejected: false,
      result: null
    }
    if (this.props.destroyOnClose != false) {
      this.destroy();
    }
  };

  handleMaskClick = () => {
    const { maskClosable, closable } = this.allProps;
    if (closable === false) return
    if (maskClosable !== false) {
      this.onCancel();
    }
  }

  onOk = (value: any = true) => {
    this.setState(
      {
        visible: false
      }
    );
    this.promiseState = {
      rejected: false,
      result: value
    }
  };

  onCancel = (value: any = false) => {
    this.setState(
      {
        visible: false
      },
    );
    this.promiseState = {
      rejected: true,
      result: value
    }
  };

  handleOK = () => {
    this.onOk(true)
  }

  handleCancel = () => {
    this.onCancel(false)
  }

  disableBodyScroll() {
    let { body } = window.document;
    body.style.overflow = "hidden";
  }

  enableBodyScroll() {
    let { body } = window.document;
    body.style.overflow = "";
  }

  destroy() {
    const { parentNode } = this.props;
    let parent = parentNode ? parentNode : null;
    return unmountReactComponent(parent);
  }
}

interface CloseIcon {
  onClick: any;
  className: string;
}

const CloseIcon = ({ onClick, className }: CloseIcon) => {
  return (
    <button autoFocus aria-label="close" onClick={onClick} className={className} >
      <svg fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
    </button>
  );
}