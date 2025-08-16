<template>
    <div class="infinite-list-wrapper" style="overflow:auto">
        <el-row type="flex" justify="center" class="appfooter" style="padding-bottom: 20px">
            <el-col :span="24">
                <div style="padding-bottom: 10px">VISITOR WEB V1.0.0</div>
              <div>Copyright © 2021 MK Group</div>
            </el-col>
        </el-row>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Language from './Language.vue'

@Component({
        components: {
            'app-language': Language
        }
    })
    export default class Footer extends Vue {
        props: any[];
    }
</script>
