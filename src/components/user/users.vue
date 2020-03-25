<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片试图区域 -->
        <el-card>
           
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <el-table
                border
                stripe
                :data="userlist"
                style="width: 100%">
                <el-table-column
                label="序号"
                   type="index"
                    >
                </el-table-column>
                <el-table-column
                    prop="username"
                    label="姓名"
                    >
                </el-table-column>

                <el-table-column
                    prop="email"
                    label="邮箱"
                >
                </el-table-column>

                <el-table-column
                    prop="mobile"
                    label="电话"
                >
                </el-table-column>

                <el-table-column
                    prop="role_name"
                    label="角色"
                >
                </el-table-column>

                <el-table-column
                    label="状态"
                >
                    <template slot-scope="scope">
                       <el-switch
                        v-model="scope.row.mg_state"
                        @change="userSateChanged(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>

                 <el-table-column
                    label="操作" width="190px">
                    <template slot-scope="scope">
                         
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
                             <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                            </el-tooltip>
                       
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        <!-- 添加用户对话框 -->
            <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            @close="addDialogClosed"
            width="50%">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="adduser">确 定</el-button>
            </span>
            </el-dialog>
    <!-- 修改用户对话框 -->
            <el-dialog
                title="修改信息"
                :visible.sync="editDialogVisible"
                width="50%"
                @close="editDialogReset"
               >
                
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" >
                    <el-form-item label="用户名" >
                        <el-input v-model="editForm.username" disabled></el-input>
                    </el-form-item>
                     <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                     <el-form-item label="手机" prop="mobile">
                        <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                </el-form>



                <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
            </el-dialog>
    <!-- 分配角色对话框 -->
            <el-dialog
                title="分配角色"
                :visible.sync="setRoledialogVisible"
                width="50%"
                @close="setRoleDialogClosed"
                >
                <div>
                    <p>当前的用户:{{userInfo.username}}</p>
                    <p>当前的角色:{{userInfo.role_name}}</p>
                    <p>分配新角色:
                         <el-select v-model="selectedRoleId" placeholder="请选择">
                            <el-option
                            v-for="item in rolesList"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </p>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRoledialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    export default {
        data(){
            // 验证邮箱规则
            var checkEmail=(rele,value,cb)=>{
                const regEmail= /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                if(regEmail.test(value)){
                    return cb()
                }
                cb(new Error("请输入合法的邮箱"))

            }
            // 验证手机号的规则
            var checkMobile=(rele,value,cb)=>{
                const regMobile= /^1[34578]\d{9}$/;
                if(regMobile.test(value)){
                    return cb()
                }
                cb(new Error("请输入合法的手机号"))
            }
            return {
                // 获取用户列表的参数对象
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:2
                },
                userlist:[],
                total:0,
                addDialogVisible:false,
                addForm:{
                    username:"",
                    password:"",
                    mobile:"",
                    email:""
                },
                editDialogVisible:false,
                editForm:{},
                setRoledialogVisible:false,
                userInfo:{},
                rolesList:[],
                selectedRoleId:"",
                addFormRules:{
                    username:[
                        {required: true, message:'请输入用户名', trigger: 'blur'},
                        {min:3,max:10,message:"请输入3-10个字符之间",trigger:"blur"}
                    ],
                    password:[
                        {required: true, message:'请输入密码', trigger: 'blur'},
                        {min:6,max:15,message:"请输入6-15个字符之间",trigger:"blur"}
                    ],
                    mobile:[
                        {required: true, message:'请输入手机号', trigger: 'blur'},
                        {validator:checkMobile,trigger:"blur"}
                        
                    ],
                    email:[
                        {required: true, message:'请输入邮箱', trigger: 'blur'},
                        {validator:checkEmail,trigger:"blur"}
                       
                    ]
                },
                editFormRules:{
                   email:[
                        {required: true, message:'请输入邮箱', trigger: 'blur'},
                        {validator:checkEmail,trigger:"blur"}
                       
                    ],
                    mobile:[
                        {required: true, message:'请输入手机号', trigger: 'blur'},
                        {validator:checkMobile,trigger:"blur"} 
                    ]
                },


            }
        },
        created(){
            this.getUserList()
        },
        methods:{
          async  getUserList(){
             const {data:res}= await  this.$http.get("users",{params:this.queryInfo})
             console.log(res)
             if(res.meta.status !== 200) return this.$message.error("获取数据失败")
             this.userlist=res.data.users
             this.total=res.data.total
            },

            // 监听pagesize改变的事件
            handleSizeChange(newSize){
                this.queryInfo.pagesize=newSize
                this.getUserList()
            },
            // 监听页码值改变的事件
            handleCurrentChange(newPage){
                this.queryInfo.pagenum=newPage
                this.getUserList()
            },
            // 监听开关状态的改变
          async  userSateChanged(userinfo){
               
                const {data:res} =await   this.$http.put(`users/${userinfo.id}/state/${userinfo.msg_state}`)
                if(res.meta.status !==200){
                    userinfo.msg_state=!userinfo.msg_state
                  return  this.$message.error("更新用户状态失败")
                }
                this.$message.success("更新用户状态成功")
            },
            addDialogClosed(){
                this.$refs.addFormRef.resetFields()
            },
            adduser(){
                this.$refs.addFormRef.validate(async valid=>{
                    if(!valid) return 
                  const {data:res} = await this.$http.post("users",this.addForm)
                  if(res.meta.status !== 201){
                      this.$message.error("添加用户失败")
                  }
                  this.$message.success("添加用户成功")
                  this.addDialogVisible=false
                  this.getUserList()
                })
            },
            // 展示编辑对话框
           async showEditDialog(id){
                
                this.editDialogVisible=true
              const {data:res}= await this.$http.get(`users/${id}`)
            //   console.log(res)
              if(res.meta.status !==200) return this.$message.error("查询用户信息失败")
              this.editForm=res.data
            },
            editDialogReset(){
                this.$refs.editFormRef.resetFields()
            },
            editUserInfo(){
                this.$refs.editFormRef.validate( async valid=>{
                    console.log(valid)
                    if(!valid) return 
                  const {data:res}  = await this.$http.put("users/"+this.editForm.id,{
                        email:this.editForm.email,
                        mobile:this.editForm.mobile
                    })
                    console.log(res.meta)
                    if(res.meta.status !== 200) return this.$message.error("更新用户信息失败")
                    this.editDialogVisible=false
                    this.getUserList()
                    this.$message.success("更新用户信息成功")
                })
            },
          async  removeUserById(id){
              const confirmResult=await  this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                                }).catch(err=>err)

            if(confirmResult !== "confirm") return this.$message.info("已取消删除")
            const {data:res}= await this.$http.delete(`users/${id}`)
            if(res.meta.status !== 200) return this.$message.error("删除用户失败")
            this.$message.success("删除用户成功")
            this.getUserList()
            },
            
           async setRole(userInfo){
                this.userInfo=userInfo
             const {data:res}=await  this.$http.get("roles")
             if(res.meta.status !==200){
                 return this.$message.error("获取角色列表失败")
             }
             this.rolesList=res.data
                this.setRoledialogVisible=true
            },
           async saveRoleInfo(){
                 if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
                const {data:res}=await this.$http.put(`users/${this.userInfo.id}/role`,{
                    rid:this.selectedRoleId
                })
                console.log(res)
                if(res.meta.status !== 200){
                    return this.$message.error("更新角色失败")
                }
                this.$message.success("更新角色成功")
                this.getUserList()
                this.setRoledialogVisible=false

            },
            setRoleDialogClosed(){
                this.selectedRoleId=''
                this.userInfo={}
            }
        }
    }
</script>

<style  scoped>

</style>