import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import 'vant/lib/index.css'

// 导入第三方组件库中的组件，在全局都可以用，不用在页面中单独import
import { Image as VanImage, Swipe, SwipeItem, Lazyload, Badge, Sidebar, SidebarItem, 
         Collapse, CollapseItem,Tab, Tabs, Card, Tag, Button, Form, Field, SubmitBar,
         Checkbox, CheckboxGroup, SwipeCell ,Stepper, Icon, AddressEdit, AddressList,
         Popup, Grid, GridItem, List, PullRefresh, CellGroup, Uploader, Cell } from 'vant'


// 创建并挂载根实例
createApp(App)
    .use(Swipe).use(SwipeItem).use(Lazyload,{
        loading:require('./assets/images/default.png')
    }).use(Badge).use(Sidebar).use(SidebarItem).use(Collapse).use(CollapseItem)
    .use(Tab).use(Tabs).use(Card).use(VanImage).use(Card).use(Tag).use(Button)
    .use(Form).use(Field).use(SubmitBar).use(Checkbox).use(CheckboxGroup)
    .use(SwipeCell).use(Stepper).use(Icon).use(AddressEdit).use(AddressList)
    .use(Popup).use(Grid).use(GridItem).use(List).use(PullRefresh).use(CellGroup)
    .use(Uploader).use(Cell)
    // 数据库中的图片过来时会把默认图片替换掉
    .use(store).use(router).mount("#app");


// router实例、store实例 都在由createApp(App)创建的根实例app身上
// 【每个子组件中都有 this.$router 和 $route】
