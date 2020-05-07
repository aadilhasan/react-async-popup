import React from 'react'
import ReactTestUtils, { act } from 'react-dom/test-utils';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';

const waitForPromise = ((callback) => {
    setTimeout(() => {
        callback();
    })
})

export default function (Component: any, name: string) {
    describe(name + ' hooks', () => {
        let container = null;
        let confirmButton = null
        let modalButton = null
        let confirmResult = null
        let modalResult = null
        beforeEach(() => {
            container = document.createElement("div");
            act(() => {
                ReactDOM.render(<Component config={{
                    container
                }} />, document.body);
            });
            confirmButton = container.querySelectorAll('#confirm-button');
            modalButton = container.querySelectorAll('#confirm-button');
            confirmResult = container.querySelectorAll('#confirm-result');
            modalResult = container.querySelectorAll('#confirm-result');
        });
        afterEach(() => {
            unmountComponentAtNode(container);
            container.remove();
            container = null;
            confirmButton = null
            modalButton = null
            confirmResult = null
            modalResult = null
        })

        it('should open', () => {
            expect(container.querySelectorAll('[role=\'alertdialog\']')).toHaveLength(0);
            act(() => {
                ReactTestUtils.Simulate.click(confirmButton);
                // wait for promise to resolve
                waitForPromise(() => {
                    expect(container.querySelectorAll('[role=\'alertdialog\']')).toHaveLength(1)
                })
            })
        })

        it('should update state on cancel', () => {
            expect(container.querySelectorAll('[role=\'alertdialog\']')).toHaveLength(0);
            act(() => {
                ReactTestUtils.Simulate.click(confirmButton);
                // wait for promise to resolve
                waitForPromise(() => {
                    expect(container.querySelectorAll('[role=\'alertdialog\']')).toHaveLength(1);
                    const closeButton = container.querySelectorAll('[aria-label=\'close\']')
                    ReactTestUtils.Simulate.click(closeButton);
                    waitForPromise(() => {
                        expect(confirmResult.textContent).toBe('false');
                    })
                });
            })
        })

        it('should update state on ok', () => {
            expect(container.querySelectorAll('[role=\'alertdialog\']')).toHaveLength(0);
            act(() => {
                ReactTestUtils.Simulate.click(confirmButton);
                // wait for promise to resolve
                waitForPromise(() => {
                    expect(container.querySelectorAll('[role=\'alertdialog\']')).toHaveLength(1);
                    const buttons = container.querySelectorAll('button')
                    ReactTestUtils.Simulate.click(buttons[buttons.length]);
                    waitForPromise(() => {
                        expect(confirmResult.textContent).toBe('true');
                    })
                });
            })
        })


    })
}