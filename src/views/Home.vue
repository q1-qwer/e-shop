<template>
    <div class="home">
        {{banner}}
    </div>
</template>

<script>
import {ref,onMounted} from 'vue'
// 首页需要的方法，可以去home的js下导入
import {getHomeAllData} from 'network/home'
// 在模板初始化完，挂载的时候，加载网络请求接口，异步处理，使用onMounted
export default {
    name: "Home",
    setup() {
        const banner = ref([])

        onMounted(()=>{  // 页面创建完后会自动调用这个方法
            getHomeAllData().then(res=>{ //res中的data中是所有的商品数据
                banner.value = res.slides  //模板之外使用ref处理的数据时要加.value
            }).catch(err=>{
                console.log(err);
            })
        })

        return {
            banner
            // 用组合API时需要返回用到的banner
        }
    },
    components: {
    },
};
</script>

<style>
    #demo{
        /* 样式中想启用别名需要加上~ */
        background: url('~assets/images/ebook3.png');
        width: 100px;
        height: 100px;
    }
    .demo1{
        color:var(--color-high-text);
    }
</style>
