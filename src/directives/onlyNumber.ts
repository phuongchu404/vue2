import type { Directive } from 'vue'

export const vOnlyNumber: Directive = {
  mounted(el) {
    // Xử lý nhập liệu trực tiếp
    el.addEventListener('input', (e: Event) => {
      const input = e.target as HTMLInputElement
      input.value = input.value.replace(/\D+/g, '')
      input.dispatchEvent(new Event('input'))
    })

    // Chặn dán (paste)
    el.addEventListener('paste', (e: ClipboardEvent) => {
      e.preventDefault()
      const pasteData = e.clipboardData?.getData('text') ?? ''
      const onlyNumbers = pasteData.replace(/\D+/g, '') // loại bỏ ký tự không phải số
      const input = e.target as HTMLInputElement
      const start = input.selectionStart ?? 0
      const end = input.selectionEnd ?? 0

      // Chèn chuỗi số vào đúng vị trí con trỏ
      input.value =
        input.value.substring(0, start) +
        onlyNumbers +
        input.value.substring(end)

      input.dispatchEvent(new Event('input'))
    })

    // Chặn kéo-thả (drop)
    el.addEventListener('drop', (e: DragEvent) => {
      e.preventDefault()
    })
  }
}
