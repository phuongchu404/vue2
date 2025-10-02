import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useLocalePagination() {
  const { t } = useI18n()

  const localePagination = computed(() => ({
    el: {
      pagination: {
        goto: t('el.pagination.goto'),
        pagesize: t('el.pagination.pagesize'),
        total: t('el.pagination.total'),
        pageClassifier: t('el.pagination.pageClassifier'),
      }
    }
  }))

  return {
    localePagination
  }
}
