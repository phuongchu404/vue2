<template>
  <div class="permissions" v-loading="loading">
    <el-row class="mb-3">
      <el-col :span="6">{{ $t('permission.menus') }}</el-col>
      <el-col :span="18">{{ $t('permission.options') }}</el-col>
    </el-row>

    <el-row gutter="16">
      <!-- Left: Menus tree -->
      <el-col :span="6">
        <el-tree
          :data="allMenus"
          :props="treeProps"
          node-key="id"
          default-expand-all
          highlight-current
          @node-click="onNodeClick"
          class="h-full"
        />
      </el-col>

      <!-- Right: Options table -->
      <el-col :span="18">
        <el-card shadow="never">
          <template #header>
            <div class="flex-between">
              <span>{{ $t('permission.options') }}</span>
              <span class="text-muted" v-if="selectedMenuName">{{ selectedMenuName }}</span>
            </div>
          </template>

          <el-table :data="allButtons" border stripe>
            <el-table-column prop="name" :label="$t('common.name')" min-width="160" />
            <el-table-column :label="$t('permission.request')" min-width="240">
              <template #default="{ row }">
                <code>{{ row.method }} {{ row.url }}</code>
              </template>
            </el-table-column>
            <el-table-column prop="description" :label="$t('common.description')" min-width="220" show-overflow-tooltip />
            <!-- actions slot kept for future edit/delete if needed -->
            <!--
            <el-table-column :label="$t('common.actions')" width="140" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="handleEdit(row)">{{ $t('common.edit') }}</el-button>
                <el-button size="small" type="danger" @click="handleDelete(row)">{{ $t('common.delete') }}</el-button>
              </template>
            </el-table-column>
            -->
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

/**
 * Types — adjust to your real payload if different
 */
interface ButtonOption {
  id?: string | number
  name: string
  method: string
  url: string
  description?: string
}

interface MenuNode {
  id: string | number
  name: string
  children?: MenuNode[]
  // In your backend, leaf menus seem to expose their actions under `buttons`
  buttons?: ButtonOption[]
}

const loading = ref(false)
const allMenus = ref<MenuNode[]>([])
const allButtons = ref<ButtonOption[]>([])
const selectedMenuName = ref('')

const treeProps = { children: 'children', label: 'name' }

const loadMenus = async () => {
  try {
    loading.value = true
    // Swap axios for your Utils.doGet if you prefer
    const { data } = await axios.get('/api/sessions/permissions')
    // Expecting { success: boolean, data: MenuNode[] }
    if (data?.success && Array.isArray(data.data)) {
      const menus: MenuNode[] = data.data
      // Normalize: move leaf `children` to `buttons`
      menus.forEach((group: any) => {
        group?.children?.forEach((menu: any) => {
          if (Array.isArray(menu.children)) {
            menu.buttons = menu.children
            menu.children = undefined
          }
        })
      })
      allMenus.value = menus
    } else {
      throw new Error('Invalid response structure')
    }
  } catch (e: any) {
    ElMessage.error(e?.message || 'Failed to load permissions')
  } finally {
    loading.value = false
  }
}

// Element Plus tree passes (data, node)
const onNodeClick = (data: MenuNode, node: any /* TreeNode */) => {
  // In Element Plus, `node.level` starts at 1 for roots
  if (node?.level === 2 && Array.isArray((data as any).buttons)) {
    allButtons.value = (data as any).buttons
    selectedMenuName.value = (data as any).name || ''
  } else {
    allButtons.value = []
    selectedMenuName.value = ''
  }
}

const handleEdit = (row: ButtonOption) => {
  // TODO: implement edit
  console.debug('edit', row)
}

const handleDelete = (row: ButtonOption) => {
  // TODO: implement delete
  console.debug('delete', row)
}

onMounted(loadMenus)
</script>

<style scoped>
.permissions { padding: 8px; }
.mb-3 { margin-bottom: 12px; }
.flex-between { display: flex; align-items: center; justify-content: space-between; }
.text-muted { color: var(--el-text-color-secondary); font-size: 12px; }
.h-full { min-height: 420px; }
code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
</style>
