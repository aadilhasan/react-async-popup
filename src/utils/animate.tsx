import React, { ReactNode } from "react";
import ReactDOM from "react-dom";

interface ChildrenRenderFun {
    ({ visible }: { visible: boolean }): ReactNode;
}

interface AnimateProps {
    show: boolean,
    visibleClassName: string,
    transitionDuration: number,
    unmountOnHide?: boolean;
    afterVisible?: Function;
    beforeHide?: Function,
    afterHide?: Function,
    children: ChildrenRenderFun;
}

interface AnimateState {
    visible: boolean
}

export class Animate extends React.Component<AnimateProps, AnimateState> {
    state = {
        visible: false
    };

    componentDidUpdate({ show, visibleClassName, transitionDuration = 250 }: AnimateProps, { visible }: AnimateState) {
        if (this.props.show && !show) {
            this.setState({ visible: true });
        }

        if (!this.props.show && show) {
            const el = ReactDOM.findDOMNode(this) as HTMLElement;
            el && el.classList.remove(visibleClassName);
            // wait for transition to complete
            setTimeout(() => {
                this.hide();
            }, transitionDuration + 50);
            return;
        }

        if (!visible && this.state.visible) {
            this.addVisibleClass()
        }
    }

    addVisibleClass() {
        // use timeout, the callback will run in next event loop
        // so we add visible class after the element has already rendered, so the transition can run smoothtly 
        setTimeout(() => {
            const { visibleClassName, afterVisible } = this.props;
            const el = ReactDOM.findDOMNode(this) as HTMLElement;
            el && el.classList.add(visibleClassName);
            afterVisible && afterVisible(el);
        }, 50);
    }

    hide() {
        const { afterHide } = this.props;
        this.setState({ visible: false }, () => {
            afterHide && afterHide();
        });
    }

    render() {
        const { children, unmountOnHide } = this.props;
        if (unmountOnHide && !this.state.visible) return null;
        return children ? children({ visible: this.state.visible }) : null;
    }
}
