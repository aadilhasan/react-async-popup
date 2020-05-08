import { useConfirm, useModal } from "../dist";
import React, { useState } from "react";

let confirmCalled = false;

export default function ComponentWithHooks({ config, ...rest }: any) {
    const [showConfirm, destroyConfirm] = useConfirm({ title: "Confirm using hooks", ...config });
    const [showModal, destroyModal] = useModal({ title: "Modal from hooks", ...config });
    const [confirmResult, setConfirmResult] = useState(null);
    const [modalResult, setModalResult] = useState(null);

    React.useEffect(() => {
        confirmCalled = false;
    }, [])

    React.useEffect(() => {
        if (showModal) {
            config.modalCallback && config.modalCallback();
        }
        if (showConfirm) {
            config.confirmCallback && config.confirmCallback();
        }
    }, [showConfirm, showModal])

    const onConfirmPopup = async () => {
        // somehow on click simlation callback is getting called twice
        if (confirmCalled) return;
        confirmCalled = true;
        console.log(" confirm clicked ");
        const result = await showConfirm();
        console.log(" confirm result ", result);
        config.confirmResolvedCallback && config.confirmResolvedCallback(result);
        setConfirmResult(result);
    }

    const showModalPopup = async () => {
        console.log(" modal clicked");
        const result = await showModal();
        console.log(" modal result ", result);
        config.modalResolvedCallback && config.modalResolvedCallback(result);
        setModalResult(result);
    }

    return (<div>
        <div>
            <button id="confirm-button" onClick={onConfirmPopup}> Confirm Hook </button>
            <button id="modal-button" onClick={showModalPopup}> Modal Hook </button>
        </div>
        <div>
            <p id="confirm-result">{confirmResult}</p>
            <p id="modal-result">{modalResult}</p>
        </div>
    </div>)
}