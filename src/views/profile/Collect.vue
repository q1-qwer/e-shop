<template>
    <div>
        <nav-bar class="nav-bar">
            <template v-slot:default>
                我的收藏
            </template>
        </nav-bar>
        <div  class="content">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list
                    v-model:loading="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
                    @offset="10"
                >
                    <van-card  v-for="item in list" :key="item" @click="goTo(item.goods_id)"
                        :price="item.goods.price+'.00'"
                        :desc="item.goods.description"
                        :title="item.goods.title"
                        :thumb="item.goods.cover_url"
                    />
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'
    import { ref, onMounted } from 'vue'
    import { addCollectList } from 'network/collect'
    import { useRouter } from 'vue-router';

    export default {
        components:{NavBar},
        setup() {
            const router = useRouter()

            const list = ref([])
            const page = ref(1)
            const totalPage = ref(0)

            const loading = ref(false)
            const finished = ref(false)
            const refreshing = ref(false)

            onMounted(()=>{
                onRefresh()
            })

            const loadData = () => {
                // 加载数据进入模型，更新到页面
                addCollectList({page:page.value}).then(res=>{
                    list.value = list.value.concat(res.data)
                    console.log(list.value);
                    // 设置数据加载完成
                    loading.value = false

                    totalPage.value = res.meta.pagination.total_pages
                    console.log('总页数：');
                    console.log(totalPage.value);
                    // 判断当前类型的数据是否全部加载完成
                    page.value >= totalPage.value
                    if(page.value >= totalPage.value){
                        finished.value = true
                    }
                    console.log('当前页数：');
                    console.log(page.value);
                })
            }
            // 实现加载每一页数据
            const onLoad = () => {
                if(!refreshing.value && page.value < totalPage.value){
                    page.value += 1
                }
                if(refreshing.value){
                    // 清空列表数据
                    list.value = []
                    refreshing.value = false
                }
                loadData()
                
            }

            const onRefresh = () => {
                // 开始刷新时将刷新状态设置为真
                refreshing.value = true
                // 将加载状态设置为未完成，可以加载数据
                finished.value = false;
                // 重新加载数据，将loading设置为true，可以加载数据
                loading.value = true
                onLoad()
            }

            const goTo=(id)=>{
                router.push({path:'/detail',query:{id}})
            }

            return {
            list,
            onLoad,
            loading,
            finished,
            onRefresh,
            refreshing,
            goTo
            }
        }
        }
</script>

<style scoped>
    .content{
        margin-top: 45px;
    }
</style>
