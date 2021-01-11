<template>
  <div class="printPage">
    <ul class="formTxt">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="送货单号：" prop="deliveryNumber">
          <el-input v-model="ruleForm.deliveryNumber" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="产品编号：" prop="partNumber">
          <el-input v-model="ruleForm.partNumber" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="数量：" prop="quantity">
          <el-input v-model="ruleForm.quantity" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="最小包装量：" prop="quantity">
          <el-input v-model="ruleForm.quantityPerPackage" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query('ruleForm')">查询</el-button>
          <el-button @click="printTable('ruleForm')">打印</el-button>
        </el-form-item>
      </el-form>
    </ul>
    <div class="PrintTables" v-if="isShowTableList">
      <div  class="lists" v-for="(item,index) in tableList" :key="index">
        <table width="450px" border="1" cellspacing="0" cellpadding="5">
          <tr>
            <td><img class="logo" src="../assets/image/logo.jpg" alt=""></td>
            <td rowspan="2" style="text-align: center"><img class="QRCode" :src="item.qr" alt=""></td>
          </tr>
          <tr>
            <td><span>组件号</span>
              <h3>{{item.partNumber}}</h3></td>
          </tr>
          <tr>
            <td>
              <span>采购订单</span>
              <h3>{{item.purchaseOrder}}</h3>
            </td>
            <td>
              <span>数量</span>
              <div class="amount">
                <h3 class="quantities">{{item.quantity}}</h3>
                <p class="unit">个</p>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <span>供应商</span>
              <h4>{{item.supplierSN}}</h4>
            </td>
            <td>
              <span>生产日期</span>
              <h4>{{item.productionDate}}</h4>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <div class="last">
                <div class="left">
                  <img src="" alt="">
                  <p>{{item.batchNumbe}}</p>
                </div>
                <div class="right">
                  <span>名称</span>
                  <h4>{{item.partName}}</h4>
                  <span class="supplierNumber">供应商追溯号: {{item.supplier}}</span>
                </div>
              </div>

            </td>
          </tr>
        </table>
        <div class="selectContent">
          <input class="check" type="checkbox" @click="selectPrint(index)" checked name="" :id="index"
                 value=""><span>勾选打印</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'print',
    data() {
      return {
        ruleForm: {
          deliveryNumber: '',
          partNumber:'',
          quantity:'',
          quantityPerPackage:''
        },
        rules:{
          deliveryNumber:[
            { required: true, message:'送货单号必填',trigger: 'blur' }
          ]
        },
        isShowTableList:false,
        tableList: [],//打印表格数据
        notSelect: [],  //不打印数组
        oldPage:null,
        PrintPage:null
      }
    },
    methods: {
      query(formName) {
        this.$refs[formName].validate((valid)=>{
          if(valid){
            this.axios({
              url:'/api/storage/print/search',
              method:"get",
              data:{
                deliveryNumber: this.ruleForm.deliveryNumber,
                partNumber: this.ruleForm.partNumber,
                quantity: this.ruleForm.quantity,
                quantityPerPackage: this.ruleForm.quantityPerPackage
              }
            }).then((res)=>{
              if (res.code === 200) {
                if (res.data.length > 0) {
                  $("#print").show()
                  this.tableList = res.data;
                  this.isShowTableList=true;
                }
              }
            }).catch((err)=>{
              this.$message.error(err.message)
            })
            // $('#Form')[0].reset()
          }
        })
      },


      //判断是否勾选打印
      selectPrint(value) {
        if ($(".check").eq(value)[0].checked) {
          let index = this.notSelect.indexOf(value)
          if (index !== -1) {
            this.notSelect.splice(index, 1)
          }
        } else {
          this.notSelect.push(value)
        }
      },

      //打印
      printTable() {
        if(this.tableList.length>0){
          if(this.tableList.length!==this.notSelect.length){
            this.oldPage=document.getElementById("app");
            this.PrintPage = document.getElementsByClassName("PrintTables")[0].innerHTML;
            document.body.innerHTML = this.PrintPage;
            for (let k = 0; k < $(".selectContent").length; k++) {
              $(".selectContent").eq(k).hide()
            }
            for (let j = 0; j < this.notSelect.length; j++) {
              $(".table").eq(this.notSelect[j]).hide()
            }
            window.print();
            document.body.innerHTML=''
            document.body.appendChild(this.oldPage);
            for (let j = 0; j < this.notSelect.length; j++) {
              $(".table").eq(this.notSelect[j]).show()
            }
            for (let k = 0; k < $(".selectContent").length; k++) {
              $(".selectContent").eq(k).show()
            }
          }else{
            this.$message.error("暂无可打印内容！")
          }
        }else{
          this.$message.error("请先查询")
        }
      },

    }
  }
</script>
<style>
  .list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .table {
    width: 450px;
    padding: 0;
    margin-bottom: 25px;
  }

  table {
    border: 1px solid #444;
    /*border: none;*/
  }

  label span {
    width: 85px;
    display: inline-block;
  }

  li {
    list-style: none;
    line-height: 45px;
  }

  li input {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px 10px;
  }

  .QRCode {
    vertical-align: middle;
  }

  td {
    height: 65px;
    width: 50%
  }

  td span {
    font-size: 16px;
  }

  td h3, td h4 {
    margin: 0;
    font-weight: 400;
    padding-left: 5px;
  }

  td h3, .unit {
    font-size: 23px;
  }
  .logo {
    width: 90px;
    height: auto;
  }

  .amount {
    width: auto;
    display: flex;
  }

  .unit {
    margin: 0 10px;
  }

  td h4 {
    font-size: 18px;
  }

  td h6 {
    font-size: 20px;
    font-weight: 400;
    text-align: center;
    margin-bottom: 0;
    color: #555;
  }

  .check {
    width: 20px;
    height: 20px;
    vertical-align: sub;
    margin: 10px 0;
  }

  #require {
    font-size: 12px;
    color: red;
  }

  ul button {
    color: #fff;
    background-color: #2D93CA;
    border: none;
    border-radius: 5px;
    padding: 5px 15px;
    letter-spacing: 5px;
    margin: 15px 20px 15px 0;
  }

  .last {
    display: flex;
    flex-direction: row;
  }

  .left {
    width: 140px;
  }

  .left img {
    width: 80px;
    height: 80px;
    margin: 30px 30px 0;
  }

  .left p {
    color: #666;
    margin: 14px 0 0;
  }

  .right {
    width: 285px;
    position: relative;
  }

  .right .supplierNumber {
    position: absolute;
    bottom: 30px;
    color: #666;
  }
  .QRCode {
    width: 145px;
  }
</style>
