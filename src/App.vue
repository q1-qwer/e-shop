<template>
    <!-- 用router-view指定展示位置 -->
    <router-view />
    <!-- vue3的新写法，使组件不在切换时被销毁 ，缓存功能建议在所有页面开发完之后再加上-->
    <!-- keep-alive标签中可以添加include和except属性 -->
    <!-- <router-view v-slot="{ Component }">
      <transition>
        <keep-alive>  
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view> -->

    <div id="nav">
        <router-link class="tab-bar-item" to="/home">
          <div class="icon"><i class="iconfont icon-shouye"></i></div>
          <div>首页</div>
        </router-link>
        <router-link class="tab-bar-item" to="/category">
          <div class="icon"><i class="iconfont icon-leimupinleifenleileibie"></i></div>
          <div>分类</div>
        </router-link>
        <router-link class="tab-bar-item" to="/shopcart">
          <div class="icon">
            <van-badge :content="$store.state.cartCount" max="9">
              <i class="iconfont icon-cart"></i>
            </van-badge>
          </div>
          <div>购物车</div>
        </router-link>
        <router-link class="tab-bar-item" to="/profile">
          <div class="icon"><i class="iconfont icon-yonghu"></i></div>
          <div>我的</div>
        </router-link>
    </div>
</template>

<script>
    import { useStore } from 'vuex'
    import { onMounted } from 'vue'
    //  export default 暴露的配置项会交给入口文件main.js的createApp函数，
    //  这个实例对象app会挂载到主入口文件index.html中的容器app上
    export default{
      setup(){
        const store = useStore()
        onMounted(() => {
          // 任何页面刷新都会执行APP，所以，在任何页面购物车数量都会更新
          store.dispatch('updateCart')
          
        })
      }
    }
</script>

<style lang="scss">
    @import "assets/css/base.css"; /* 导入全局公共CSS：保证项目风格统一 */
    @import "assets/css/iconfont.css";
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
      background-color: #F6F6F6;
      display: flex;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      box-shadow: 0 -3px 1px rgba(100,100,100,0.1);

      a {
          color: var(--color-text);

          &.router-link-exact-active { /*选中导航链接的颜色*/ 
            color: var(--color-high-text); /* 应用到全局中声明的--color-high-text */
          }
      }
      .tab-bar-item{
          flex: 1; /* 每个图标均分位置 */
          text-align: center;
          height: 50px;
          font-size: var(--font-size);
      }
      .tab-bar-item .icon{
          width: 24px;
          height: 24px;
          margin-top: 5px;
          vertical-align: middle;  //垂直居中
          display: inline-block;
      }
}
</style>
