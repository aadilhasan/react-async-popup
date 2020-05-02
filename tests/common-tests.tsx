import React from 'react';
import { unmountComponentAtNode } from "react-dom";
import { HEADER_ID, CONTENT_ID } from "../src/const"

export default function (Component: any, name: string, moreTests?: Function) {
    let container = null;
    let promise = null;
    beforeEach(() => {
        // setup a DOM element as a render target
        container = document.createElement("div");
        document.body.appendChild(container);
        promise = Component.new({});
    });

    afterEach(() => {
        // cleanup on exiting
        unmountComponentAtNode(container);
        container.remove();
        container = null;
        promise = null;
    });


    describe(name + " component", () => {
        let promise;

        it(" on new, must return a promise  ", () => {
            promise = Component.new({});
            expect(promise instanceof Promise).toBe(true);
        });

        it(" on new must resolve with show callback  ", async () => {
            const { show } = await promise;
            expect(typeof show).toBe('function');
        });

        it(" show callback funtion must return a promise ", async () => {
            const { show } = await promise;
            expect(typeof show).toBe('function');
            let _promise = show({})
            expect(_promise instanceof Promise).toBe(true);
        });

        it(" mounted at the container  ", async () => {
            expect(container.children.length).toBe(0);
            await Component.new({ container });
            expect(container.children.length).toBe(1);

        });

        it(" should render header", async () => {
            const title = "This is Heading";
            // })
            const { show } = await Component.new({ container });
            show({
                title,
            })
            let header = container.querySelector("#" + HEADER_ID);
            expect(title).toBe(header.textContent.trim());
        });

        it(" should render header and body", async () => {
            const title = "This is Heading";
            const body = "This is alert body";
            // })
            const { show } = await Component.new({ container });
            show({
                title,
                content: () => <>{body}</>,
            });
            let header = container.querySelector("#" + HEADER_ID);
            expect(header.textContent.trim()).toBe(title);
            let content = container.querySelector("#" + CONTENT_ID);
            expect(content.textContent.trim()).toBe(body);
        });

        it(" should close on cancel ", async () => {
            const { show } = await Component.new({ container });
            setTimeout(() => {
                let buttons = container.querySelectorAll("button");
                buttons[0].click();
            }, 500);
            const result = await show();
            expect(result).toBe(false);
        });

        it(" should close on ok ", async () => {
            const { show } = await Component.new({ container });
            setTimeout(() => {
                let buttons = container.querySelectorAll("button");
                // click on ok button
                buttons[buttons.length - 1].click();
            }, 100);
            const result = await show({});
            expect(result).toBe(true);
        });

        it(" should auto destory on close if destroyOnClose is not false ", async () => {
            const { show } = await Component.new({ container });
            setTimeout(() => {
                let buttons = container.querySelectorAll("button");
                // click on ok button
                buttons[buttons.length - 1].click();
            }, 100);
            const result = await show({});
            expect(result).toBe(true);
            const result2 = await show({});
            expect(result2).toBe(null);
        });

        it(" should not auto destory if destroyOnClose is false ", async () => {
            const { show } = await Component.new({ container, destroyOnClose: false });
            setTimeout(() => {
                let buttons = container.querySelectorAll("button");
                // click on ok button
                buttons[buttons.length - 1].click();
            }, 100);
            const result = await show({});
            expect(result).toBe(true);
            setTimeout(() => {
                let buttons = container.querySelectorAll("button");
                // click on ok button
                buttons[buttons.length - 1].click();
            }, 100);
            const result2 = await show({});
            expect(result2).toBe(true);
        });

        it(" should resolve promise with provided value ", async () => {
            const promiseResult = "CLOSED"
            const { show } = await Component.new({ container });
            setTimeout(() => {
                let button = container.querySelector("#custom-close-btn");
                button.click();
            }, 100);
            const result = await show({
                content: ({ cancel }) => <button id="custom-close-btn" onClick={() => cancel(promiseResult)}></button>
            });
            expect(result).toBe(promiseResult);
        });

        moreTests && moreTests();
    })
}