import {useState, useEffect} from "react"
import { DestroyCallbackFun, ShowFun, BaseProps } from "./types";
import Modal from "./modal";
import Confirm from "./confirm";
import { ComponentType } from "./enums";

type State = [ShowFun | null, DestroyCallbackFun | null];

function useComponent(componentType: ComponentType): any {
    
    return function(config?: BaseProps) {

      const [callbacks, setCallbacks] = useState<State>([null, null]);
      useEffect(() => {
        create();
        return destroy;
      }, []);
  
      const create = async () => {
          const Component = componentType === ComponentType.Modal ?  Modal : Confirm;
          const newConfig: BaseProps = {
              destroyOnClose: false,
            ...config
          };
        const { show, destroy } = await Component.new({...newConfig});
        setCallbacks([show, destroy]);
      };
  
      const destroy = () => {
        if (callbacks[1] !== null) {
          (callbacks[1] as any).destroy();
        }
      };
  
      return [...callbacks];
    };
  }
  
  export const useModal = useComponent(ComponentType.Modal);
  export const useConfirm = useComponent(ComponentType.Confirm);