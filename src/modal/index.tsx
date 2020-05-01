import Base from "../base";
import cssStyles from "./style.module.scss";
import cerateNew from "../new"
import { ComponentType } from "../enums";

class Modal extends Base {
  get styles() { return cssStyles; }
  get type() {
    return ComponentType.Modal
  }
}

Modal.new = cerateNew(Modal);
export default Modal;
