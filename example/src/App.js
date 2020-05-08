import React from 'react'

import { Confirm, Modal, useConfirm, useModal } from 'react-async-popup'

let showAlert
let showModal
Confirm.new({
  destroyOnClose: false
}).then(({ show }) => {
  showAlert = show
})

function alertbody() {
  return <div>Are you a good boy</div>
}

function alertFooter({ cancel, ok }) {
  return (
    <div>
      <button onClick={ok}> yes</button>
      <button onClick={cancel}> no </button>
    </div>
  )
}

Modal.new({
  destroyOnClose: false
}).then(({ show }) => {
  showModal = show
})

export default function App() {
  const refContainer = React.useRef(null)
  const [confirmHook,] = useConfirm({title: "Confirm using hooks"});
  const [modalHook, destroyModal] = useModal({title: "Modal from hooks"});

  const toggleAlert = async () => {
    const isSuccess = await showAlert({
      title: 'Confirm',
      content: () => 'Are you sure you want to delete your account ?'
    })
    console.log(' alert is done ', isSuccess)
  }

  const toggleAlert2 = async () => {
    const isSuccess = await showAlert({
      content: alertbody,
      footer: alertFooter,
      popupStyle: {
        borderColor: 'red'
      }
    })
    const secondResult = await showAlert({
      content: () => <h3> Are you sure ? </h3>,
      okText: 'Yes I am',
      cancelText: 'Not at all'
    })
    console.log(' you said ', isSuccess, secondResult)
  }

  const openModal = async () => {
    const name = await showModal({
      title: 'Hi this is fully accessible modal',
      content: 'Modal Body',
      wrapClassName: 'modal-container'
      // footer: null
    })
    console.log(' use entered name is ', name)
  }

  const openModalWithContainer = async () => {
    const { show } = await Modal.new({
      container: refContainer.current
    })
    const name = await show({
      title: 'Modal with different container ',
      content: <ModalBody />,
      footer: null,
      closeOnEscape: false
    })
    console.log(' use entered name is ', name)
  }

  const notClosableAlert = async () => {
    const { show } = await Confirm.new()
    const name = await show({
      title: ' I am not closable Alert',
      // footer: null,
      closable: false,
      okText: 'CLOSE'
    })
  }

  const showConfirmFromHook = async () => {
    const result = await confirmHook();
    console.log(" show confirm ", result);
  }

  const showModalFromHook = async () => {
    const result = await modalHook({
      title: "Modal Hook Test",
      content: "Some Content"
    });
    console.log(" show confirm ", result);
  }

  return (
    <div className='App' ref={refContainer}>
      <br />
      <br />
      <button onClick={toggleAlert}> Delete account Confirm </button>
      <hr />
      <button onClick={toggleAlert2}> SHOW Confirm 2 </button>
      <hr />
      <button onClick={openModal}> show modal </button>
      <hr />
      <button onClick={openModalWithContainer}>
        {' '}
        mount modal to diffent container{' '}
      </button>
      <button onClick={notClosableAlert}>notClosableAlert</button>
      <br/>
      <h2> Hook example </h2>
      <button onClick={showConfirmFromHook}> Confirm Hook </button>
      <button onClick={showModalFromHook}> Modal Hook </button>
    </div>
  )
}

const ModalBody = ({ ok, cancel }) => {
  const onSubmit = (e) => {
    e.preventDefault()
    const { value: name } = e.target.elements['name-input']
    ok(name)
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <h6 id='desc'> Please enter your name </h6>
        <input name='name-input' type='text' />
        <br />
        <button type='submit'> Confirm </button>
        <button type='button' onClick={cancel}>
          {' '}
          Close{' '}
        </button>
      </form>
    </div>
  )
}
