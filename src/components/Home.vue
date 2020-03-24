<template>
    <el-container class="home-container">
        <el-header>
            <div class="logo">
                <img src="@/assets/1.jpg" alt="logo">
                <span>电商后台管理系统</span>
            </div>
             <el-button type="info" @click="logout">退出</el-button> 
        </el-header>     
        <el-container>
            <el-aside :width="isCollapse?'64px':'200px'">
                <div class="toggle-botton" @click="toggleCollapse">|||</div>
                <el-menu
                background-color="#333744"
                text-color="#fff"
                active-text-color="#409Eff"
                :unique-opened="true"
                :collapse="isCollapse"
                :collapse-transition="false"
                router
                :default-active="activePath"
                >
                <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
                    <template slot="title">
                        <i :class="iconObj[item.id]"></i>
                        <span>{{item.authName}}</span>
                    </template>
                    <!-- 二级菜单 -->
                     <el-menu-item 
                     :index="'/'+subItem.path"
                      v-for="subItem in item.children" :key="subItem.id"
                      @click="saveNavState('/'+subItem.path)"
                       >
                          <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                        </template>
                     </el-menu-item>
                </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
    
</template>

<script>
    export default {
        data(){
            return {
                menulist:[],

                iconObj:{
                    '125':'iconfont icon-users',
                    '103':'iconfont icon-kongjian',
                    '101':"iconfont icon-shangpingouwudai2",
                    '102':"iconfont icon-danju-tianchong",
                    '145':"iconfont icon-baobiao"
                },
                isCollapse:false,
                activePath:""
            }
        },
        created(){
            this.getMenuList()
            this.activePath=window.sessionStorage.getItem("activePath")
        },
        methods:{
            logout(){
                window.sessionStorage.clear()
                this.$router.push("/login")
            },
            // 获取菜单列表
           async getMenuList(){
               const {data:res}=await this.$http.get("menus")
               if(res.meta.status !=200) return this.$message.error(res.meta.msg)
              
               this.menulist=res.data
            },
            // 点击按钮切换菜单的折叠与展开
            toggleCollapse(){
                this.isCollapse=! this.isCollapse
            },
            // 存储点击路径到sessionStorage
            saveNavState(activePath){
                window.sessionStorage.setItem("activePath",activePath)
                this.activePath=activePath
            }
        }
    }
</script>

<style  scoped>
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color:#fff;
    font-size:20px;
}
.el-aside{
    background-color: #333744;
    /* height:100%; */
}
.el-main{
    background-color:#EAEDF1 ;

    
}
.logo{
    display: flex;
    align-items: center;
}
.logo img{
    width:61px;
    height:56px;
    border-radius: 50%;
    margin-right: 15px;
}
.home-container{
    height:100%;
}
.iconfont{
    margin-right: 10px;
}
.el-menu{
    border-right: none;
}
.toggle-botton{
    background-color: #4a5064;
    color:#fff;
    text-align: center;
    line-height: 24px;
    font-size: 10px;
    letter-spacing: .2em;
    cursor:pointer;
}
</style>