import { EventEmitter } from 'events'
import ioHook from 'iohook'
import { KEY_MAP } from './key-map'



const KEY_NAME = {
  'ctrl'    : 'lym',
  'Ctrl'    : 'lym',
  'shift'   : 'lym',
  'Shift'   : 'lym',
  'alt'     : 'lym',
  'Alt'     : 'lym'
}

// interface IOHookEvent {
//   shiftKey      : boolean,
//   altKey        : boolean,
//   ctrlKey       : boolean,
//   metaKey       : boolean,
//   keychar       : number,
//   keycode       : number,
//   rawcode       : boolean,
//   type          : string,
// }

type KEY_TYPE   = keyof typeof KEY_NAME

type KEYBOARD_TYPE = keyof typeof KEY_MAP

type TwoKeys    = [KEY_TYPE,  string]
type ThreeKeys  = [KEY_TYPE, KEY_TYPE, string]

export class Keypress {

  private static shortcutEvent: EventEmitter = new EventEmitter()
  
  private static shortcuts: (TwoKeys | ThreeKeys)[] = new Array<TwoKeys | ThreeKeys>()

  public static registerShortcut(keys: TwoKeys | ThreeKeys, callback: Function) {
    Keypress.shortcuts.push(keys)
    Keypress.shortcutEvent.on(keys.join('+'), callback)
  }

  public unRegisterShortcut(keys: TwoKeys | ThreeKeys) {
    
    Keypress.shortcuts.forEach((shortcut, index) => {
      if(keys.join('+') === shortcut.join('+')) {
        Keypress.shortcuts.splice(index, 1)
        Keypress.shortcutEvent.removeAllListeners(keys.join('+'))
      }
    })
  }

  public static start() {
    /**
     * { shiftKey: false,
     *   altKey: false,
     *   ctrlKey: false,
     *   metaKey: false,
     *   keychar: 8,
     *   keycode: 0,
     *   rawcode: 65288,
     *   type: 'keypress' 
     * }
     */
    ioHook.on('keypress', (event: any)  => {
      if (event.keychar === 0) {
        return   
      }
      if (!event.shiftKey && !event.ctrlKey && !event.altKey){
        return
      }
      Keypress.shortcuts.forEach((value) => {
        // TwoKeys: ['ctrl', 'a']
        // ThreeKeys: ['ctrl', 'shift', 'a']
        switch(value.length) {
          case 2: {
            const firstKey = value[0].toLowerCase() + 'Key'
            const lastKey = Keypress.getLastKey(value)
            const lastKeyCode = event.shiftKey ? KEY_MAP[lastKey] + 32 : KEY_MAP[lastKey]
            if (event[firstKey] && lastKeyCode === event.rawcode) {
              Keypress.shortcutEvent.emit(value.join('+'))
            }
            break
          }
          case 3: {
            const firstKey = value[0].toLowerCase() + 'Key'
            const secodeKey = value[1].toLowerCase() + 'Key'
            const lastKey = Keypress.getLastKey(value)
            const lastKeyCode = event.shiftKey ? KEY_MAP[lastKey] + 32 : KEY_MAP[lastKey]
            if (event[firstKey] && event[secodeKey]) {
              Keypress.shortcutEvent.emit(value.join('+'))
            }
            break
          }
          default: {
            throw new Error('Shortcut must have two keys at least')
          }
        }      
      })
    })
    ioHook.start(false)
  }

  public static getLastKey(shortcut: TwoKeys | ThreeKeys): KEYBOARD_TYPE {
    if (shortcut.length === 2) {
      return shortcut[1]  as KEYBOARD_TYPE
    }
    return shortcut[2] as KEYBOARD_TYPE
  }
}