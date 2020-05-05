# react-async-popup

> A promise based popup (confirm and modal) library for react, to reduce extra state management needed for popups. checkout the docs here - https://www.aadilhasan.dev/react-async-popup

## Install

```bash
npm install --save react-async-popup
```

or

```bash
yarn add react-async-popup
```

## Usage

```tsx
import React from 'react'

import { Confirm } from 'react-async-popup'

function App() {

  async function onDelete() {

    const { show } = await Confirm.new();

    const result = await show({
      title: ' Are you sure you want to delete the file ?'
    });

    if (result) {
      console.log(" Yes, Delete the file ")
    }else{
      console.log(" Don't delete ")
    }

  }

  return <button onClick={onDelete}> Delete File </button>
}
```
Find more examples here - https://aadil.dev/react-async-popup/examples

## License

MIT © [aadilhasan](https://github.com/aadilhasan)
