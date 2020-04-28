import React from "react";
import { NewFun, OpenFun, PromiseCallbackFn, RenderFun, BaseProps, OpenConfig } from "./types";
import { trapFocus } from "./utils";
import { CONTENT_ID, HEADER_ID } from "./const";
import { ComponentType } from "./enums";

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

export default class BasePopC extends React.Component<
  BaseProps,
  State
  > {
  promise: null | Promise<any> = null;
  reject: PromiseCallbackFn | null = null;
  resolve: PromiseCallbackFn | null = null;

  dynamicConfig: OpenConfig | null = null;

  myRef = React.createRef();

  removeFocusListener: Function | null;

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
    const { title, popupStyle, wrapClassName, aria } = this.allProps;
    const { visible } = this.state;
    const { labelledby = HEADER_ID, describedby = CONTENT_ID } = aria || {};
    const styles = this.styles
    const role = this.props.type === ComponentType.Confirm ? 'alertdialog' : 'dialog';

    if (!visible) return null;

    return (
      <div
        className={`${styles.popupContainer}${wrapClassName ? wrapClassName : ''}`}
        onClick={this.handleMaskClick}
        //@ts-ignore
        ref={this.myRef}>
        <div
          role={role}
          aria-modal="true"
          aria-labelledby={labelledby}
          aria-describedby={describedby}
          className={styles.container}
          style={popupStyle || {}} >
          {title && <div className={styles.title} id={HEADER_ID}> {title} </div>}
          {this.renderContent(styles)}
          {this.renderFooter(styles)}
        </div>
      </div>
    );
  }

  get allProps() {
    const componentDefaults = this.props.type === ComponentType.Confirm ? CONFIRM_DEFAULTS_PROPS : MODAL_DEFAULTS_PROPS;
    return { ...DEFAULTS, ...componentDefaults, ...this.props, ...(this.dynamicConfig || {}) };
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
        {closable !== false && <button className={styles.action} onClick={this.onCancel}>
          {cancelText || 'Cancel'}
        </button>}
        <button className={styles.action} onClick={this.onOk}>
          {okText || 'Ok'}
        </button>
      </div>
    );
  }

  renderContent(styles: any) {
    const { content } = this.allProps;
    if (content === null) return null;
    let contentToRender = this.getRenderableWithProps(content);
    return contentToRender ? <div id={CONTENT_ID} className={styles.content}>{contentToRender}</div> : null;
  }

  get styles() {
    return {} as any
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
    if (component === null) return null;
    if (component && typeof component === "function") {
      contentToRender = component({ cancel: this.onCancel, ok: this.onOk });
    } else if (React.isValidElement(component)) {
      contentToRender = <component.type cancel={this.onCancel} ok={this.onOk} />
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
    this.setState({ visible: true }, () => {
      this.disableBodyScroll();
      this.removeFocusListener = trapFocus(this.myRef.current)
    });
    return asyncWrap(this.promise);
  };

  afterAction = () => {
    this.dynamicConfig = null;
    this.promise = null;
    this.resolve = null;
    this.reject = null;
    this.enableBodyScroll();
    this.removeFocusListener && this.removeFocusListener();
    this.removeFocusListener = null;
  };

  handleMaskClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { maskClosable, closable } = this.allProps;
    if (closable === false) return
    if (maskClosable !== false && this.myRef.current === e.target) {
      this.onCancel();
    }
  }

  onOk = (value: any = true) => {
    this.setState(
      {
        visible: false
      },
      () => {
        this.resolve && this.resolve(value);
        this.afterAction();
      }
    );
  };

  onCancel = (value: any = false) => {
    this.setState(
      {
        visible: false
      },
      () => {
        this.reject && this.reject(value);
        this.afterAction();
      }
    );
  };

  disableBodyScroll() {
    let { body } = window.document;
    body.style.overflow = "hidden";
  }

  enableBodyScroll() {
    let { body } = window.document;
    body.style.overflow = "";
  }
}
