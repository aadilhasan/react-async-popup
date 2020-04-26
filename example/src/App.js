import React from 'react'

import { Confirm, Modal } from 'react-async-popup'
import 'react-async-popup/dist/index.css'

let showAlert;
Confirm.new({
  body: () => "HELLO ALERT"
}).then(({ show }) => {
  showAlert = show;
});

function alertbody({ cancel, success }) {
  return (
    <div>
      <h1> Are you a good boy </h1>
    </div>
  );
}

function alertFooter({ cancel, success }) {
  return (
    <div>
      <button onClick={success}> yes</button>
      <button onClick={cancel}> no </button>
    </div>
  );
}

export default function App() {
  const toggleAlert = async () => {
    const isSuccess = await showAlert();
    console.log(" alert is done ", isSuccess);
  };

  const toggleAlert2 = async () => {
    const isSuccess = await showAlert({ body: alertbody, footer: alertFooter });
    const secondResult = await showAlert({ body: () => <h1> why ? </h1> });
    console.log(" use said ", isSuccess, secondResult);
  };

  const showModal = async () => {
    const { show } = await Modal.new({
      heading: "Hi this is modal",
      body:  modalBody,
      footer: null
    });
    const name = await show();
    console.log(" use entered name is ", name);
  };

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <button onClick={toggleAlert}> SHOW Confirm </button>
      <button onClick={toggleAlert2}> SHOW Confirm 2 </button>
      <hr />
      <button onClick={showModal}> show modal </button>
    </div>
  );
}



const modalBody = ({success, cancel}) => {
  const onSubmit = (e) => {
    e.preventDefault();
    const {value: name}  = e.target.elements['name-input'];
    success(name)
  }
  return <div>
    <form onSubmit={onSubmit}>
      <h6> Enter your name </h6>
      <input name="name-input" type="text"/>
      <br/>
      <button type="submit"> Confirm </button>
      <button type="button" onClick={cancel}> Close </button>
    </form>
  </div>
}