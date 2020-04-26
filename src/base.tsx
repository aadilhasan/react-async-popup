import React from "react";
import { ConfirmProps, ConfirmState, NewFun, OpenFun, PromiseCallbackFn, RenderFun } from "./types";
import { trapFocus } from "./utils";

const asyncWrap = (promise: Promise<any>): Promise<any> =>
  promise.then(res => res || true).catch(error => error || false);

const KEYCODE_ESC = 27;

export default class BasePopC extends React.Component<
  ConfirmProps,
  ConfirmState
> {
  promise: null | Promise<any> = null;
  reject:PromiseCallbackFn |  null = null;
  resolve:PromiseCallbackFn | null = null;

  dynamicConfig: ConfirmProps | null = null;

  myRef = React.createRef();

  removeFocusListener: Function | null;

  state = {
    visible: false
  };

  static new: NewFun;

  static render: RenderFun

  componentDidMount(){
    document.addEventListener('keyup', this.handleEscape);
  }

  componentWillMount(){
    document.removeEventListener('keyup', this.handleEscape);
  }

  handleEscape =  (event: KeyboardEvent) => {
    var key = event.which || event.keyCode;
    if (key === KEYCODE_ESC) {
      this.onCancel();
      event.stopPropagation();
    }
  };

  getRenderableWithProps (component: any) {
    let contentToRender;

    if(component === null) return null;

    if (component && typeof component === "function") {
      contentToRender = component({ cancel: this.onCancel, success: this.onOk });
    }else if (React.isValidElement(component)){
      contentToRender = <component.type cancel={this.onCancel} success={this.onOk} />
    }else{
      contentToRender = component;
    }

    return contentToRender;
  }

  open:OpenFun = (dynamicProps: ConfirmProps) => {
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
