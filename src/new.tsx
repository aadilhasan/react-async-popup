  
import React from 'react'
import { getContainer } from './utils';
import { BaseProps, NewReturnType, OpenFun, DestroyCallbackFun } from './types';
import { Confirm } from '.';
import ReactDOM from 'react-dom';
import { ComponentType } from './enums';

export default function (Component: any): any {
    return (config?: BaseProps): Promise<NewReturnType> => {
        const { container, ...rest } = config || {} as BaseProps;
        const div = getContainer(container);
        let _ref: Confirm | null;
        const destroy = async () => {
            if (_ref) {
                await _ref.destroy()
                _ref = null;
            }
        }

        const show: OpenFun = (props) => {
            return _ref ? _ref.open(props) : Promise.resolve(null) as any;
        }

        return new Promise(resolve => {
            const getRef = (ref: Confirm) => {
                _ref = ref;
                resolve({
                    show: show as OpenFun,
                    destroy: destroy as DestroyCallbackFun
                });
            };
            ReactDOM.render(<Component {...rest} type={ComponentType.Confirm} parentNode={div} ref={getRef} />, div);
        });
    };
}