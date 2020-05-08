
import React from 'react'
import ReactTestUtils, { act } from 'react-dom/test-utils';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import Component from "./hooks-example"

// use this to wait for async tasks to be done
function wait() {
    return new Promise(resolve => {
        setTimeout(resolve, 100);
    })
}

function testHooks(type) {
    describe(type + ' hook', () => {
        let container = null;
        let button = null
        let body = document.body;
        let popupButtonsQuery = `.react-async-popup.${type} button`;
        let openButtonQuery = `#${type}-button`;
        let resultTextQuery = `#${type}-result`;
        let popupQuery = `.react-async-popup.${type} [role=\'${type === 'confirm' ? 'alert' : ''}dialog\']`;

        let callbackKey = `${type}Callback`;
        let resolveCallbackKey = `${type}ResolvedCallback`;

        const query = (_query, container = body) => {
            return container.querySelector(_query)
        }

        const queryAll = (_query, container = body) => {
            return container.querySelectorAll(_query)
        }

        beforeEach(() => {
            container = document.createElement("div");
            body.appendChild(container);
        });
        afterEach(() => {
            act(() => {
                unmountComponentAtNode(container);
            })
            body.removeChild(container);
            body.innerHTML = "";
            container = null;
            button = null
        })

        it('should open', async (done) => {
            let callback = async () => {
                act(() => {
                    ReactTestUtils.Simulate.click(query(openButtonQuery));
                })
                await wait();
                expect(queryAll(popupQuery)).toHaveLength(1)
                done();
            }
            act(() => {
                ReactDOM.render(<Component config={{
                    [callbackKey]: callback
                }} />, container);
            });
            expect(queryAll(popupQuery)).toHaveLength(0);
        })

        it('on close should work', async (done) => {
            let callback = async () => {
                act(() => {
                    ReactTestUtils.Simulate.click(query(openButtonQuery));
                })
                await wait();
                expect(queryAll(popupQuery)).toHaveLength(1)
                act(() => {
                    ReactTestUtils.Simulate.click(queryAll(popupButtonsQuery)[0]);
                });
            }

            const onClose = (result) => {
                expect(result).toBe(false);
                done();
            }

            act(() => {
                ReactDOM.render(<Component config={{
                    [callbackKey]: callback,
                    [resolveCallbackKey]: onClose
                }} />, container);
            });
            expect(query(resultTextQuery).innerHTML).toBe('');
        })

        it('on ok should work', async (done) => {
            let callback = async () => {
                act(() => {
                    ReactTestUtils.Simulate.click(query(openButtonQuery));
                })
                await wait();
                expect(queryAll(popupQuery)).toHaveLength(1)
                const buttons = queryAll(popupButtonsQuery)
                act(() => {
                    ReactTestUtils.Simulate.click(buttons[buttons.length - 1]);
                });
            }

            const onClose = (result) => {
                expect(result).toBe(true);
                done();
            }

            act(() => {
                ReactDOM.render(<Component config={{
                    [callbackKey]: callback,
                    [resolveCallbackKey]: onClose
                }} />, container);
            });
            expect(query(resultTextQuery).innerHTML).toBe('');
        })

        it('should resolve promise with provided value ', async (done) => {
            let callback = async () => {
                act(() => {
                    ReactTestUtils.Simulate.click(query(openButtonQuery));
                })
                await wait();
                expect(queryAll(popupQuery)).toHaveLength(1)
                const buttons = queryAll(popupButtonsQuery)
                act(() => {
                    ReactTestUtils.Simulate.click(buttons[buttons.length - 1]);
                });
            }

            const onClose = (result) => {
                expect(result).toBe('ok');
                done();
            }

            act(() => {
                ReactDOM.render(<Component config={{
                    [callbackKey]: callback,
                    [resolveCallbackKey]: onClose,
                    footer: ({ ok }) => (<button onClick={() => ok("ok")}></button>)
                }} />, container);
            });
            expect(query(resultTextQuery).innerHTML).toBe('');
        })

    })
}

testHooks('modal');
testHooks('confirm');