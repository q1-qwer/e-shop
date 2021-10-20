<template>
    <div class="tab-control">
        <!-- 传过来的数据有几个，就会遍历生成几个tab-control-item；
             给每一个绑定单击响应事件:把index传给父组件 -->
        <div  class="tab-control-item"
              v-for="(item,index) in titles" 
             :key="index" 
             @click="itemClick(index)"
             :class="{active:index == currentIndex}">
            <span>{{item}}</span>
        </div>
    </div>
</template>

<script>
    import {ref} from 'vue'
    export default {
        name: "TabControl",
        props:{
            titles:{
                type:Array,
                default(){
                    // 数组和对象最好使用方法的形式
                    return []
                }
            }
        },
        setup(props,{emit}) {  // 调用上下文对象中的emit方法来触发父组件中的方法

            let currentIndex = ref(0)
            const itemClick = (index) => {
                currentIndex.value = index // 选择哪个当前的index就会变成哪个
                console.log(currentIndex.value);
                emit('tabClick',index)
            }

            return {
                currentIndex,
                itemClick
            }
        },
        components: {
            
        }
    }
</script>

<style scope lang="scss">
    .tab-control{
        display: flex;
        height:40px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        background-color: #FFFFFF;
        width:100%;

        position: sticky; /*固定*/
        top:44px;
        z-index: 9;


        .tab-control-item{
            flex:1;
            span{
                padding: 6px;
            }
        }
        .active{
            color:var(--color-tint);
            span{
                border-bottom: 3px solid var(--color-tint);
            }
        }
    }
</style>