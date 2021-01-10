<template>
    <div class="">
      <div class="form">
        <div class="formIpt">
          <label for="fromName">从库位:</label>
          <input type="text" id="fromName" th:value="${fromName}"><br>
          <label for="serialNumber_scan">批次号:</label>
          <input type="text" @change="changeData()" id="serialNumber_scan" placeholder=""><br>
          <input type="hidden" id="serialNumber"/>
          <label for="quantity">数量:</label>
          <input type="number" id="quantity" placeholder=""><br>
          <label for="toName">至库位:</label>
          <input type="text" id="toName" th:value="${toName}"><br>
        </div>
        <div class="formBtn">
          <div>
            <button type="button" class="btn btn-danger cancel" @click="cancel()">取 消</button>
            <button type="button" class="btn btn-success submit" @click="submit()">提 交</button>
            <br/>
          </div>
          <div class="checkbox">
            <input type="checkbox" @click="selects()" name="" id="" value=""><span>自动提交/打勾后自动提交</span>
          </div>
        </div>
      </div>
      <ul>
        <li>
          <span>物料号:</span>
          <p id="partNumber"></p>
        </li>
        <li>
          <span>物料名称:</span>
          <p id="partName"></p>
        </li>
        <li>
          <span>数量:</span>
          <p id="quantity_show"></p>
        </li>
        <li>
          <span>采购订单:</span>
          <p id="purchaseOrder"></p>
        </li>
        <li>
          <span>供应商名称:</span>
          <p id="supplierName"></p>
        </li>
        <li>
          <span>供应商SN号:</span>
          <p id="supplierSN"></p>
        </li>
      </ul>
    </div>
</template>
<script>
  export default {
    name: 'move',
    data() {
      return {
        storageList:[]
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
              this.$message('参数错误!')
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
</style>
