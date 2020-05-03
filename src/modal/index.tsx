import Base from "../base";
import "./styles.scss";
import cerateNew from "../new"
import { ComponentType } from "../enums";

class Modal extends Base {
  get type() {
    return ComponentType.Modal
  }
}

Modal.new = cerateNew(Modal);
export default Modal;