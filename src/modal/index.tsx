import Base from "../base";
import "./styles.scss";
import createNew from "../new"
import { ComponentType } from "../enums";

class Modal extends Base {
  get type() {
    return ComponentType.Modal
  }
}

Modal.new = createNew(Modal);
export default Modal;