<template>
  <div class="">
    <ul class="formTxt">
      <form id="Form">
        <li>
          <label for="deliveryNumber"><span>送货单号:</span> </label>
          <input id="deliveryNumber" name="deliveryNumber" value="">
          <i id="require"></i>
        </li>
        <li>
          <label><span>产品编号:</span> </label>
          <input id="partNumber" value="">
        </li>
        <li>
          <label><span>数量:</span> </label>
          <input id="quantity" value="">
        </li>
        <li>
          <label><span>最小包装量:</span></label>
          <input id="quantityPerPackage" value="">
        </li>

      </form>
      <button @click="query()">查询</button>
      <button id="print" @click="printTable()">打印</button>
    </ul>
    <div v-if="isShowTableList">
      <div :model="tableList" class="lists" v-for="(item,index) in tableList" :key="index">
        <table width='50%' border="1" cellspacing="0" cellpadding="5">
          <tr>
            <td><img class="logo" src="/image/logo.jpg" alt=""></td>
            <td rowspan="2"><img class="QRCode" :src="item.qr" alt=""></td>
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
        isShowTableList:false,
        form: {
          deliveryNumber: '',
        },
        tableList: [
          {
            partNumber:"11"
          }
        ],
        notSelect: [],  //不打印数组
      }
    },
    methods: {
      query() {
        if ($("#deliveryNumber").val().trim() !== '') {
          $("#require").html('');
          this.axios({
            url:'/api/storage/print/search',
            method:"get",
            data:{
              deliveryNumber: $("#deliveryNumber").val(),
              partNumber: $("#partNumber").val(),
              quantity: $("#quantity").val(),
              quantityPerPackage: $("#quantityPerPackage").val()
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
          $('#Form')[0].reset()
        } else {
          $("#require").html('送货单号必填');
        }
      },


      //判断是否勾选打印
      selectPrint(value) {
        if (value.checked) { //?
          let index = this.notSelect.indexOf($(value).attr('id'))
          if (index !== -1) {
            this.notSelect.splice(index, 1)
          }
        } else {
          this.notSelect.push($(value).attr('id'))
        }
      },

      //打印
      printTable() {
        $(".formTxt").hide();
        for (let k = 0; k < $(".selectContent").length; k++) {
          $(".selectContent").eq(k).hide()
        }
        for (let j = 0; j < this.notSelect.length; j++) {
          $(".table").eq(this.notSelect[j]).hide()
        }
        window.print();
        $(".formTxt").show()
        for (let j = 0; j < this.notSelect.length; j++) {
          $(".table").eq(this.notSelect[j]).show()
        }
        for (let k = 0; k < $(".selectContent").length; k++) {
          $(".selectContent").eq(k).show()
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
</style>
