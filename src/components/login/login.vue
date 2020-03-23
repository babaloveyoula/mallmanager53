<template>
   <div class="login-wrap">
       <div class="login-box">
           <div class="avatar">
               <img src="@/assets/1.jpg" alt="photo">
           </div>
           <!-- 登录表单区域 -->
            <el-form ref="loginFormRef" class="login-form" :model="form" :rules="loginFormRules">
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user_login"
                    v-model="form.username"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-mimasuo"
                    type="password"
                    v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                   <el-button type="primary" @click="login">登录</el-button>
                   <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
       </div>
   </div>
</template>

<script>
    export default {
        data(){
            return {
                form:{
                    username:"",
                    password:""
                },
                loginFormRules:{
                    username:[{
                        required: true, message: '请输入用户名', trigger: 'blur'
                    },{
                         min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' 
                    }],
                    password:[
                        {
                        required: true, message: '请输入登录密码', trigger: 'blur'
                    },{
                         min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' 
                    }
                    ]
                }
            }
        },
        methods:{
            resetLoginForm(){
                this.$refs.loginFormRef.resetFields();
            },
            login(){
                this.$refs.loginFormRef.validate( async valid=>{
                   if(!valid) return;
                  const {data:res}=await this.$http.post("login",this.form)
                  
                 if(res.meta.status !=200) return this.$message.error(res.meta.msg)
                 this.$message.success("登录成功")
                 console.log(res);
                 window.sessionStorage.setItem("token",res.data.token)
                 this.$router.push("/home")
                   
                })
            }
        }
    }
</script>

<style  scoped>
.login-wrap{
    background-color:#2b4b6b;
    height:100%;
    
}
.login-box{
    width:450px;
    height:300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%)
}
.avatar{
    height:130px;
    width:130px;
    border-radius: 50%;
    padding:10px;
    
    border:1px solid #eee;
    position: absolute;
    left:50%;
    transform: translate(-50%,-50%);
    box-shadow: 0 0 10px #ccc;
    background-color: #fff;
}
.avatar img{
    width:100%;
    height:100%;
    border-radius: 50%;
    background-color: #eee;
}
.btns{
    display: flex;
    justify-content: center;
}
.login-form{
    position: absolute;
    bottom:0;
    width:100%;
    padding: 0 20px;
    box-sizing: border-box;
}
</style>