<template>
<!-- 地址管理需要请求服务器，添加到地址表里面； -->
    <div class="address-box">
        <nav-bar class="nav-bar">
            <template v-slot:default>
                地址管理
            </template>
        </nav-bar>
        
        <div v-show="list.length == 0" style="margin-top:200px;">
            还没有地址信息，去添加吧！
        </div>

        <div class="address-item">
            <van-address-list
                v-model="chosenAddressId"
                :list="list"
                default-tag-text="默认"
                @add="onAdd"
                @edit="onEdit"
            />
        </div>
    </div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'
    import { reactive, onMounted, toRefs, } from 'vue'
    import { getAddressList } from 'network/address'
    import { useRouter } from 'vue-router'

    export default {
        name: "Address",
        setup() {
            // const route = useRoute()
            const router = useRouter()
            const state = reactive({
                chosenAddressId:'1',  // 组件默认提供的id
                list:[]  // 从接口获取的地址列表
            })

            onMounted(() => {
                getAddressList().then(res=>{
                    // console.log(res);
                    if(res.data.length == 0){
                        state.list = []
                        return
                    }
                    // 使用map方法遍历数组,挑选数据，将需要的数据直接返回给list
                    state.list = res.data.map(item=>{
                        // console.log(res)
                        // console.log('item.is_default ：');
                        // console.log(item.is_default);
                        return {
                            // 需要按照组件要求的格式返回数据
                            id : item.id,
                            name : item.name,
                            tel : item.phone,
                            address : `${item.province}${item.city}${item.county}${item.address}`,
                            isDefault : !!item.is_default //将01转为布尔值
                        }
                    })
                })
            })

            // 当前页面的添加按钮
            const onAdd=()=>{
                router.push({path:'/addressedit',query:{type:'add'}})
            }
            // 每一个地址的编辑选项————item是组件自动传入的当前地址对象
            const onEdit=(item)=>{
                router.push({path:'/addressedit',query:{type:'edit',addressId:item.id}})
            }

            return {
                ...toRefs(state),
                onAdd,
                onEdit,
            }
        },
        components: {
            NavBar
        },
    }
</script>

<style lang="scss" scoped>
    .address-box{
        height: 300px;
        .van-radio__icon{
            display: none;
        }
        ::v-deep .van-radio-group{
            overflow: auto;
            height: 443px;
        }
        .address-item{
            margin-top: 45px;
            ::v-deep .van-button{
                background: var(--color-tint);
                border-color: var(--color-tint);
                
            }
        }
    }
    .van-address-list{
        position: relative;
    }
    ::v-deep .van-address-list__bottom{
        bottom: 100px !important;
    }
</style>
