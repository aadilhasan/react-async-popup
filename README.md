# react-async-popup

> A 1kb promise based popup (confirm and modal) library for react, to reduce extra state management needed for popups. checkout the docs here - https://aadil.dev/react-async-popup

## Install

```bash
npm install --save react-async-popup
```

or

```bash
yarn add react-async-popup
```

## Usage

With Hooks -

```tsx
import React from 'react'
import { useConfirm } from 'react-async-popup'

export default function App() {
  const [showConfirm] = useConfirm({
    title: 'Are you sure ?'
  })

  const openConfirm = async () => {
    const result = await showConfirm()

    if (result === true) {
      console.log('I am sure')
    } else {
      console.log('not sure')
    }
  }

  return <button onClick={openConfirm}> Open Confirm </button>
}
```

Without Hooks -

```tsx
import React from 'react'

import { Confirm } from 'react-async-popup'

function App() {
  const onDelete = async () => {
    const { show } = await Confirm.new()

    const result = await show({
      title: ' Are you sure you want to delete the file ?'
    })

    if (result === true) {
      console.log(' Yes, Delete the file ')
    } else {
      console.log(" Don't delete ")
    }
  }

  return <button onClick={openConfirm}> Open Confirm </button>
}
```

Find more examples here - https://aadil.dev/react-async-popup/examples

## License

MIT © [aadilhasan](https://github.com/aadilhasan)
