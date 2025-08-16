<template>
<div>
    <el-row>
        <el-col :span="6">
            {{ $t("permission.menus") }}
        </el-col>
        <el-col :span="18">
            {{ $t("permission.options") }}
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="6">
            <el-tree
                :data="allMenus"
                default-expand-all
                node-key="id"
                :expand-on-click-node="false"
                :props="defaultTreeProps"
                ref="tree"
                :default-checked-keys="['index','session:all']"
                @node-click="handleNodeClick"
                hightlight-current>
            </el-tree>
        </el-col>
        <el-col :span="18">
            <el-table :data="allButtons" style="width: 100%;margin-top: 10px">
                <el-table-column prop="name" :label="$t('permission.name')" width="120"></el-table-column>
                <el-table-column prop="description" :label="$t('permission.description')" width="180"></el-table-column>
                <el-table-column prop="url" :label="$t('permission.url')" :formatter="urlFormatter"></el-table-column>
            </el-table>
        </el-col>
    </el-row>
</div>
</template>
<script lang="ts">
import Vue, {ComponentOptions} from 'vue';
import Component from 'vue-class-component';
import * as Utils from '../../utils';

@Component
export default class Permissions extends Vue {
    allMenus = [];
    allButtons = [];
    // default permissions tree properties
    defaultTreeProps = {label:'name', children: 'children'};
    async mounted() {
        await this.loadAllMenus();
    };
    async handleNodeClick(data: any) {
        if (data.level==1 && data.buttons) {
            this.allButtons = data.buttons;
        } else {
            this.allButtons = [];
        }
    };
    // 角色格式化函数
    urlFormatter(row: any, column: any) {
        return row.method + ' ' + row.url;
    };
    async handleEdit() {
    };
    async handleDelete() {
    };
    async handleAdd() {
    };
    async loadAllMenus() {
        let result = await Utils.doGet(this, '/api/sessions/permissions');
        if (result.success) {
            this.allMenus = result.data;
            for (var i=0; i<this.allMenus.length; i++) {
                let menuGroup = this.allMenus[i] as any;
                for (var j=0; j<menuGroup.children.length; j++) {
                    let menu = menuGroup.children[j];
                    menu.buttons = menu.children;
                    menu.children = undefined;
                }
            }
        }
    };
}
</script>
