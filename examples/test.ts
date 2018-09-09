import {
  ThreeKeys,
  default as Keypress,
} from '../src/index'

Keypress.registerShortcut(['ctrl', 'alt', 'u'], () => {
  console.log('trigger')
})
Keypress.start()