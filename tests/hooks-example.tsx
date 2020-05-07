import { useConfirm, useModal, BaseProps } from "../dist";
import React, { useState } from "react";

export default function ComponentWithHooks({ config }: { config?: BaseProps }) {
    const [showConfirm, destroyConfirm] = useConfirm({ title: "Confirm using hooks", ...config });
    const [showModal, destroyModal] = useModal({ title: "Modal from hooks", ...config });
    const [confirmResult, setConfirmResult] = useState(null);
    const [modalResult, setModalResult] = useState(null);

    const onConfirmPopup = async () => {
        const result = await showConfirm();
        setConfirmResult(result);
    }

    const showModalPopup = async () => {
        const result = await showModal();
        setModalResult(result);
    }

    return (<div>
        <div>
            <button id="confirm-button" onClick={onConfirmPopup}> Confirm Hook </button>
            <button id="modal-button" onClick={showModalPopup}> Modal Hook </button>
        </div>
        <div>
            <p id="confirm-result">{confirmResult}</p>
            <p id="modal-button">{modalResult}</p>
        </div>
    </div>)
}