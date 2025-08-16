<template>
    <div>
        <!--Table Area-->
        <el-table :data="pageData" style="width: 100%">
            <el-table-column type="index" label="序号" width="80" v-if="showIndex"></el-table-column>
            <el-table-column v-for="item in columnData" :key="item.prop" :prop="item.prop" :formatter="item.format" :label="item.label" :width="item.width" v-if="item.show==null?true:item.show==null"></el-table-column>
            <el-table-column label="Vận hành" inline-template :context="_self" fixed="right" :width="btnWidth" v-if="showButton">
                <div>
                    <el-button v-for="item in buttonData" :key="item.name" :type="item.type" :size="item.size" class="compact-button" @click="item.click(row,item.params)">{{item.label}}</el-button>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination v-if="showPager" @size-change="handleSizeChange" :page-sizes="pageSizes" :layout="layout" :page-size.sync="pageSizeMirror" :current-page.sync="pageNumMirror" :total="total"></el-pagination>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
        props: {
            btnWidth: String,
            pageData: Array,
            columnData: Array,
            buttonData: Array,
            //
            pageNum:{type: Number,default: 1},
            pageSize:{type: Number,default: 5},
            total: {type: Number,default: 0},

            showButton: {type: Boolean,default: true},//true
            showIndex: {type: Boolean,default: true},//true
            showPager: {type: Boolean,default: true},//true
            pageSizes: {type: Array,default: ()=> [5,10,20,50]},//[5,10,20,50]
            layout: {type: String,default: 'total, prev, pager, next'},//"total, prev, pager, next" ："total, sizes, prev, pager, next, jumper"
        },
        watch: {
            //pageNum
            pageNum:function(value){this.$data.pageNumMirror=this.$props.pageNum},
            pageNumMirror:function(newValue){
                    this.$emit("update:pageNum",newValue);
                    this.$emit("current-change",newValue)
                    },
            //pageSize
            pageSize:function(value){this.$data.pageSizeMirror=this.$props.pageSize}
        }
    })
    export default class DataGrid extends Vue {
        pageNumMirror:number = 1;
        pageSizeMirror:number = 5;

        mounted() {
            this.pageNumMirror = this.$props.pageNum;
            this.pageSizeMirror = this.$props.pageSize;
        }
        handleSizeChange(newSize:any){
            this.$emit("update:pageSize",newSize);
            this.$emit("size-change",newSize);
        }
    }
</script>
<style>

</style>
