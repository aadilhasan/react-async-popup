import React from "react";
import ReactDOM from "react-dom";

interface AnimateProps {
    show: boolean;
    classNames: {
        beforeEnter?: string;
        enter?: string;
        active?: string;
        exit?: string;
    };
    onExit?: Function;
    onEnter?: Function;
}

interface AnimateState {
    visible: boolean;
}

export default class Animate extends React.Component<
    AnimateProps,
    AnimateState
    > {
    entering = false;
    exiting = false;
    node: any = null;
    transitonEnded = false;

    state = {
        visible: false
    };

    componentDidUpdate({ show }: AnimateProps) {
        const { enter, active, exit } = this.classNames;

        if (!show && this.props.show) {
            if (this.exiting) {
                this.onEntering();
                return;
            }
            this.setState({ visible: true });
        }
        if (show && !this.props.show) {
            if (this.entering) {
                this.removeClass(enter);
                this.addClass(exit);
                this.exiting = true;
                this.entering = false;
                return;
            }
            this.exiting = true;
            this.transitonEnded = false;
            this.removeClass(active);
            this.addClass(exit);
        }
    }

    onChildrenMount = (node: HTMLElement) => {
        this.node = node;
        this.onEntering();
    };

    onEntering() {
        const { beforeEnter, enter, exit } = this.classNames;
        this.entering = true;
        this.exiting = false;
        this.transitonEnded = false;
        console.log("this.node.classList", this.node.classList);
        this.removeClass(exit);
        this.addClass(beforeEnter);
        setTimeout(() => {
            if (!this.node) return;
            const { onEnter } = this.props;
            this.removeClass(beforeEnter);
            this.addClass(enter);
            onEnter && onEnter();
        }, 0);
    }

    addClass(className: any) {
        className && this.node.classList.add(className);
    }

    removeClass(className: any) {
        className && this.node.classList.remove(className);
    }

    get classNames() {
        return this.props.classNames || {};
    }

    onTransitonEnd = () => {
        const { enter, active, exit } = this.classNames;
        // transition ended gets fired multiple time, depending on no of properties being
        // transitioned, we only wait for first transition, as we don't know how many properties are transitioning
        if (this.transitonEnded) {
            return;
        }
        this.transitonEnded = true;
        if (this.entering) {
            this.node.classList.remove(enter);
            this.addClass(active);
            this.entering = false;
        } else {
            this.node.classList.remove(exit);
            this.node = null;
            this.exiting = false;
            this.setState({ visible: false }, this.afterExit);
        }
    };

    afterExit() {
        const { onExit } = this.props;
        this.entering = false;
        this.exiting = false;
        this.node = null;
        this.transitonEnded = false;
        onExit && onExit();
    }

    render() {
        if (!this.state.visible) return null;

        return (
            <AnimationHelper
                children={this.props.children}
                onMount={this.onChildrenMount}
                onTransitonEnd={this.onTransitonEnd}
            />
        );
    }
}

interface AnimationHelperProps {
    onMount: Function;
    onTransitonEnd: Function;
}

class AnimationHelper extends React.Component<AnimationHelperProps> {
    componentDidMount() {
        const node = ReactDOM.findDOMNode(this) as HTMLElement;
        node.addEventListener("transitionend", this.handleTransitionEnd);
        this.props.onMount(node);
    }

    componentWillUnmount() {
        const node = ReactDOM.findDOMNode(this) as HTMLElement;
        node.removeEventListener("transitionend", this.handleTransitionEnd);
    }

    handleTransitionEnd = (e: TransitionEvent) => {
        // only call onTransitonEnd for tansitions happening on the top element
        // as childrend my be transitioning even ofter the parent has stopped
        if (e.target === e.currentTarget) {
            this.props.onTransitonEnd();
        }
    };

    render() {
        const { children } = this.props;
        const child = React.Children.only(children) as React.ReactElement;
        return React.cloneElement(child);
    }
}
