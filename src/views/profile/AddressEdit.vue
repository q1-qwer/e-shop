<template>
<!-- 地址管理需要请求服务器，添加到地址表里面； -->
<!-- 地址列表：获取到地址数据，按照第三方组件的规则提供给它，它会自动遍历，形成地址列表 -->
    <div class="address-edit-box">
        <nav-bar class="nav-bar">
            <template v-slot:default>
                {{title}}
            </template>
        </nav-bar>
        
        <van-address-edit
            class="edit"
            :area-list="areaList"
            :address-info="addressInfo"
            :show-delete="type == 'edit'"
            show-set-default
            show-search-result
            :search-result="searchResult"
            :area-columns-placeholder="['请选择', '请选择', '请选择']"
            @save="onSave"
            @delete="onDelete"
        />
    </div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'
    import { Toast } from 'vant'
    import { onMounted, reactive, toRefs, computed } from 'vue'
    import { addAddress, getAddressDetail, EditAddress, DeleteAddress} from 'network/address'
    import { useRouter, useRoute} from 'vue-router'
    import { tdist } from 'utils/address'
    import { setTimeout } from 'timers'
    
    export default {
        setup() {
            const route = useRoute()
            const router = useRouter()

            const state = reactive({
                areaList:{
                    province_list:{},
                    city_list:{},
                    county_list:{}
                },
                searchResult:[],
                addressInfo:{},
                type:'add',
                addressId:'',
                title:''  //————避免异步处理找不到变量报错
            })

            /* 从接口返回的数组遍历出省市县数据并存入状态 */
            onMounted(() => {
                // 省市区 列表 构造出来
                let _province_list = {}
                let _city_list = {}
                let _county_list = {}

                // 获取所有的省，遍历数据，拿到名称
                //     ————每一次遍历会把接收到的省作为实参传进函数，定义一个形参p来接收，然后在函数中使用p
                tdist.getLev1().forEach(p=>{
                    _province_list[p.id] = p.text
                    tdist.getLev2(p.id).forEach(c=>{
                        _city_list[c.id] = c.text
                        tdist.getLev3(c.id).forEach(q=>{
                            _county_list[q.id] = q.text
                        })
                    })
                })
                
                state.areaList.province_list = _province_list
                state.areaList.city_list = _city_list
                state.areaList.county_list = _county_list

                // 【编辑地址】
                // 解构接收参数————路由中（从路径中可以看出）传来的是类型和地址id
                const {type,addressId} = route.query
                // 把接收的参数赋给模型————本地也需要使用id数据
                state.type = type
                state.addressId = addressId

                // 编辑已有数据时需要加载参数
                if(type == 'edit'){
                    getAddressDetail(addressId).then(res=>{
                        const addressDetail = res  /*  当前用户信息  */

                        let _areaCode = ''  /* 当前用户地址区位码  */
                        const province = tdist.getLev1()  // 所有的省
                        // Object.entries中的参数是个对象，其中保存了所有的县，遍历这个对象可以传入这个对象中的键和值
                        Object.entries(state.areaList.county_list).forEach(([id,text]) => {
                            // 先找出当前对应的区
                            if(text == addressDetail.county) {
                                // console.log('province');
                                // console.log(province);
                                // 找到区对应的几个省份——如果当前对象前两位与遍历的数组中id的前两位，那么就确定了省
                                const provinceIndex = province.findIndex(item => item.id.substr(0,2) == id.substr(0,2))
                                // console.log('省');
                                // console.log(provinceIndex);
                                // 找到区对应的几个市区
                                const cityItem = Object.entries(state.areaList.city_list).filter(([cityId]) => cityId.substr(0,4) == id.substr(0,4))
                                // console.log('市');
                                // console.log(cityItem);
                                // console.log(province[provinceIndex].text);
                                // console.log(addressDetail.province);
                                // console.log(cityItem[0][1]);
                                // console.log(addressDetail.city);
                                // 对比找到的省份和接口返回的省份是否相等，因为有一些区会重名
                                if(province[provinceIndex].text == addressDetail.province && cityItem[0][1] == addressDetail.city) {
                                    _areaCode = id
                                    // console.log(_areaCode);
                                }
                            }
                        })

                        /* 把数据赋给模型后会自动挂载到页面上，和用户手动输入效果是一致的，也会走到onSave*/
                        // 想要显示省市县还需要区位码areaCode
                        //     ——根据省市县信息组合成区位码（地址选择后形成的就是区位码）
                        state.addressInfo = {
                            name : addressDetail.name,
                            tel : addressDetail.phone,
                            province : addressDetail.province,
                            city : addressDetail.city,
                            county : addressDetail.county,
                            areaCode : _areaCode,
                            addressDetail : addressDetail.address,
                            isDefault : !!addressDetail.is_default
                        }
                    })
                }
            })

            const title = computed(()=>{
                    return state.type  == 'add' ? '新增地址':'编辑地址'
            })

            // content是收集到的用户输入的数据，是一个对象
            const onSave=(content)=>{// 把用户输入的信息形成参数提交给服务器
                const params={
                    name : content.name,
                    phone : content.tel,
                    province : content.province,
                    city : content.city,
                    county : content.county,
                    address : content.addressDetail,
                    is_default : content.isDefault ? 1 : 0
                }
                if(state.type == 'edit'){
                    // 调用接口修改地址
                    EditAddress(state.addressId,params)
                }else if(state.type == 'add'){
                    // 调用接口添加数据
                    addAddress(params)
                }

                
                // 提示并返回
                Toast('保存成功')
                setTimeout(()=>{
                    router.back()
                },1000)
            }

            const onDelete=()=>{
                DeleteAddress(state.addressId).then(res=>{
                    console.log(res);
                    Toast('删除成功')
                    setTimeout(()=>{
                        router.back()
                    },1000)
                })
            }

            return {
                ...toRefs(state),
                onSave,
                onDelete,
                title,
            }
        },
        components: {
            NavBar
        }
    }


</script>

<style lang="scss" scoped>
    .edit{
        margin-top: 45px;
    }
    ::v-deep .van-button{
                background: var(--color-tint);
                border-color: var(--color-tint);
            }
</style>
