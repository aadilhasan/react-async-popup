import React from "react";
import { ConfirmProps, ConfirmState, NewFun, OpenFun, PromiseCallbackFn, RenderFun } from "./types";

const asyncWrap = (promise: Promise<any>): Promise<any> =>
  promise.then(res => res || true).catch(error => error || false);

export default class BasePopC extends React.Component<
  ConfirmProps,
  ConfirmState
> {
  promise: null | Promise<any> = null;
  reject:PromiseCallbackFn |  null = null;
  resolve:PromiseCallbackFn | null = null;

  dynamicProps: ConfirmProps | null = null;

  state = {
    visible: false
  };

  static new: NewFun;

  static render: RenderFun

  open:OpenFun = (dynamicProps: ConfirmProps) => {
    this.dynamicProps = null;
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    if (dynamicProps) {
      this.dynamicProps = dynamicProps;
    }
    this.setState({ visible: true }, this.disableBodyScroll);
    return asyncWrap(this.promise);
  };

  afterAction = () => {
    this.dynamicProps = null;
    this.promise = null;
    this.resolve = null;
    this.reject = null;
    this.enableBodyScroll();
  };

  onOk = (value: any) => {
    this.setState(
      {
        visible: false
      },
      () => {
        this.resolve && this.resolve(value);
      }
    );
  };

  onCancel = (value: any) => {
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
