<template>
    <div class="">
      <div class="form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="formIpt">
          <el-form-item label="从库位:" prop="fromName">
            <el-input id="fromName" v-model="ruleForm.fromName"></el-input>
          </el-form-item>
          <el-form-item label="批次号:" prop="serialNumber">
            <el-input id="serialNumber_scan" @change="changeData()" v-model="ruleForm.serialNumber"></el-input>
          </el-form-item>
          <el-form-item label="数量:" prop="quantity">
            <el-input id="quantity" v-model="ruleForm.quantity"></el-input>
          </el-form-item>
          <el-form-item label="至库位:" prop="toName">
            <el-input id="toName" v-model="ruleForm.toName" ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" class="cancel" @click="submit('ruleForm')">提 交</el-button>
            <el-button class="submit" type="danger" @click="cancel('ruleForm')">取 消</el-button>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="autoChecked" @click="selects()">自动提交/打勾后自动提交</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <el-form :model="form" :rules="formRules" ref="ruleForm" label-width="100px" class="formIpt">
        <el-form-item label="物料号:" prop="partNumber">
          <p v-model="form.partNumber">{{form.partNumber}}</p>
        </el-form-item>
        <el-form-item label="物料名称:" prop="partName">
          <p id="partName" @change="changeData()" v-model="form.partName">{{form.partName}}</p>
        </el-form-item>
        <el-form-item label="数量:" prop="quantity_show">
          <p id="quantity_show" v-model="form.quantity_show">{{form.quantity_show}}</p>
        </el-form-item>
        <el-form-item label="采购订单:" prop="purchaseOrder">
          <p id="purchaseOrder" v-model="form.purchaseOrder" >{{form.purchaseOrder}}</p>
        </el-form-item >
        <el-form-item label="供应商名称:">
          <p id="supplierName" v-model="form.supplierName" >{{form.supplierName}}</p>
        </el-form-item>
        <el-form-item label="供应商SN号:">
          <p id="supplierSN" v-model="form.supplierSN" >{{form.supplierSN}}</p>
        </el-form-item>
      </el-form>
    </div>
</template>
<script>
  export default {
    name: 'move',
    data() {
      return {
        ruleForm:{
          fromName:'',
          serialNumber:'',
          quantity:null,
          toName:''
        },
        rules:{

        },
        form:{
          partNumber:'',
          partName:'',
          quantity_show:null,
          purchaseOrder:'',
          supplierName:'',
          supplierSN:''
        },
        formRules:{

        },
        storageList:[],
        autoChecked:true,//默认自动提交
      }
    },
    methods: {
      //勾选自动提交
      selects(t) {
        if (t.checked) {
          // submit()
        }
      },

      //取消
      cancel() {
        window.location.reload();
      },
      //提交
      submit() {
        this.axios({
          url:"/api/storage/move",
          method:"post",
          data:{
            serialNumber: $("#serialNumber").val(),
            quantity: $("#quantity").val(),
            fromName: $("#fromName").val(),
            toName: $("#toName").val()
          }
        }).then((res)=>{
          if(res.code===200){
            this.$message("提交成功！")
          }
        }).catch((err)=>{
          this.$message.error(err.message)
        })
      },
      //批次号
      changeData() {
        const info = document.getElementById('serialNumber_scan').value;
        if (info !== '' && $("#serialNumber_scan").val().trim() !== '') {
          this.axios({
            url:"/api/storage/scan?info=" + info,
            post:"get"
          }).then((res)=>{
            if (res.code === 200) {
              if (res.data.storageList !== null) {
                this.storageList = res.data.storageList;
                let storage = this.storageList[0];
                $("#serialNumber").val(storage.batchNumber);
                $("#partNumber").html(storage.partNumber);
                $("#partName").html(storage.partName);
                $("#quantity_show").html(storage.quantity);
                $("#purchaseOrder").html(storage.purchaseOrder);
                $("#supplierName").html(storage.supplierName);
                $("#supplierSN").html(storage.supplierSN);
              }
            }else{
              this.$message.error(res.message)
            }
          }).catch((err)=>{
            this.$message.error(err.message)
          })
        }
      }
    }
  }
</script>
<style>
  .form {
    display: flex;
    flex-direction: column;
  }

  @media screen and (min-width: 765px) {
    .form input {
      width: 240px;
    }
  }

  .form label {
    display: inline-block;
    width: 65px;
  }

  .form input {
    border: 1px solid #ccc;
    border-radius: 5px;
    height: 35px;
    margin-bottom: 20px;
    padding-left: 15px;
  }

  .cancel, .submit {
    letter-spacing: 5px;
    margin-bottom: 15px;
  }

  .cancel {
    margin-right: 35px;
  }

  .checkbox input {
    width: 20px;
    height: 20px;
  }

  .checkbox span {
    margin-left: 15px;
    vertical-align: sub;
  }

  ul {
    padding: 0;
    margin-top: 20px;
  }

  li {
    list-style: none;
  }
  .el-form-item{
    margin: 0;
  }
</style>
