Capture the specified shortcut

### Usage
```typescript
import Keypress from 'keypress-event'

Keypress.registerShortcut(['ctrl', 'alt', 'u'], () => {
  console.log('Ctrl+Alt+u trigger')
})
Keypress.start()
```

When You press the shortcut at the sametime, the callback function will be executed.