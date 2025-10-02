import { onBeforeUnmount } from 'vue'
import {throttle} from "lodash";

export function useInfiniteSelect(loadMore: () => void) {
  let dropdown: HTMLElement | null = null
  let scrollHandler: ((e: Event) => void) | null = null
  const throttledLoadMore = throttle(loadMore, 1000);

  // Khi dropdown hiển thị
  const onVisibleChange = (visible: boolean) => {
    if (visible) {
      // DOM cuộn trong el-select dropdown
      dropdown = document.querySelector('.el-select-dropdown .el-scrollbar__wrap')

      if (dropdown) {
        let isLoading = false
        let lastScrollHeight = 0

        scrollHandler = async (e: Event) => {
          const target = e.target as HTMLElement
          const nearBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 2

          if (nearBottom && !isLoading && target.scrollHeight !== lastScrollHeight) {
            isLoading = true
            lastScrollHeight = target.scrollHeight
            try {
              throttledLoadMore()
            } finally {
              isLoading = false
            }
          }
        }
        dropdown.addEventListener('scroll', scrollHandler)
      }
    } else {
      cleanup()
    }
  }

  // cleanup khi đóng dropdown hoặc destroy component
  const cleanup = () => {
    if (dropdown && scrollHandler) {
      dropdown.removeEventListener('scroll', scrollHandler)
    }
    dropdown = null
    scrollHandler = null
  }

  onBeforeUnmount(() => cleanup())

  return { onVisibleChange }
}
