import { ref } from 'vue'
import { useStore } from 'vuex'
import Icon from '../assets/icon/Icon'

export function useBaseMixin() {
  const store = useStore()
  
  const name = ref('')
  const locals = localStorage.getItem('LANG')

  const isButtonEnabled = (buttonName: string) => {
    return !store.state.buttons.has(buttonName)
  }

  return {
    name,
    Icon,
    locals,
    isButtonEnabled
  }
}