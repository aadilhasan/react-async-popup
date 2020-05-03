# react-async-popup

> A promise based React Popup.

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
import 'react-async-popup/index.css'

function App() {

  async function onDelete() {

    const { show } = await Confirm.new();

    const result = await show({
      title: ' Are you sure you want to delete the file ?'
    });

    if (result) {
      ....
    }

  }

  return <button onClick={onDelete}> Delete File </button>
}
```

## License

MIT © [aadilhasan](https://github.com/aadilhasan)
