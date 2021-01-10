<template>
  <div class="box">
    <div class="form">
      <div class="formIpt">
        <label for="pickNumber">拣货单:</label>
        <input type="text" @change="pickQuery(this)" id="pickNumber" th:value="${pickNumber}">
        <hr>
        <label for="serialNumber">批次号:</label>
        <input type="text" @change="changeData()" id="serialNumber" placeholder=""><br>
        <label for="fromName">从库位:</label>
        <input type="text" id="fromName"><br>
        <label for="quantity">数量:</label>
        <input type="number" id="quantity" placeholder="">
      </div>
      <div class="formBtn">
        <div>
          <button type="button" class="btn btn-danger cancel" @click="cancel()">取 消</button>
          <button type="button" class="btn btn-success submit" @click="submit()">提 交</button>
          <br/>
        </div>
        <div class="checkbox">
          <input type="checkbox" name="" id="" value=""><span>自动提交/打勾后自动提交</span>
        </div>
      </div>
    </div>
    <div class="tableList">

    </div>
  </div>
</template>
<script>
  export default {
    name: 'sendMaterial',
    data() {
      return {
         tableListIdx: [],//分组后对应数据的下标
         storageList: [], //由批次号获取的数据
         getData: [],//由拣货单获取的数据
      }
    },
    methods: {
      //由拣货单获取的数据 分类
      trans(data) {
        const cache = {}//cache存储的键是eid，值是这个eid在indices数组中的下标
        const indices = []//原数组中相同eid的下标
        data.forEach((item, i) => {
          let eid = item.name
          let index = cache[eid]
          if (index !== undefined) {
            indices[index].push(i)
          } else {
            cache[eid] = indices.length
            indices.push([i])
          }
        })
        return indices
      },
      //渲染表格
      renderTable() {
        $(".tableList").empty();
        for (let m = 0; m < this.tableListIdx.length; m++) {
          if (this.tableListIdx[m].length > 0) {
            $(".tableList").append(`
                        <div>
                            <div class="surplus">
                                <span class="title">库位${this.getData[this.tableListIdx[m][0]].name}</span>
                                <span class="rows">剩余: ${this.tableListIdx[m].length} 行</span>
                            </div>
                            <table class="list${m}" border="1">
                                <tr>
                                    <td>工单号</td>
                                    <td>物料号</td>
                                    <td>批次号</td>
                                    <td>剩余数量</td>
                                </tr>
                            </table>
                        </div>
                    `)
          }
          for (let n = 0; n < this.tableListIdx[m].length; n++) {
            let ele = `.list${m}`
            $(ele).append(`
                    <tr>
                        <td>${this.getData[this.tableListIdx[m][n]].orderNumber}</td>
                        <td>${this.getData[this.tableListIdx[m][n]].partNumber}</td>
                        <td>${this.getData[this.tableListIdx[m][n]].serialNo}</td>
                        <td>${this.getData[this.tableListIdx[m][n]].quantity}</td>
                    </tr>
                `)
          }
        }
      },
      //拣货单号发生改变
      pickQuery(number) {
        const pickNumber = document.getElementById('pickNumber').value;
        if ($(number).val().trim() !== '') {
          this.axios({
            url:"/api/storage/pick/scan",
            method:"get",
            params:{
              pickNumber:pickNumber
            }
          }).then((res)=>{
            if (res.code === 200) {
              if (res.data.length > 0) {
                this.getData = res.data
                this.tableListIdx = this.trans(this.getData);
                this.renderTable()
              }
            } else {
              this.$message.error(res.message)
            }
          }).catch((err)=>{
            this.$message.error(err.message)
          })
        }
      },
      //partNumber过滤数据
      filterData() {
        for (let j = 0; j < this.tableListIdx.length; j++) {
          for (let k = 0; k < this.tableListIdx[j].length; k++) {
            let ii = this.storageList.findIndex(item => item.batchNumber === this.getData[this.tableListIdx[j][k]].serialNo);
            if (ii === -1) {
              const idx = this.tableListIdx[j].findIndex(item => item === this.tableListIdx[j][k]);
              this.tableListIdx[j].splice(idx, 1);
              k--;
            }
          }
        }
      },
      changeData() {
        const info = document.getElementById('serialNumber').value;
        if (info !== '' && $("#pickNumber").val().trim() !== '') {
          this.axios({
            url:"/api/storage/scan",
            method:"get",
            params:{
              info:info
            }
          }).then((res)=>{
            if (res.code === 200) {
              if (res.data.storageList.length > 0) {
                this.storageList = res.data.storageList;
                let storage = this.storageList[0];
                $('#quantity').val(storage.quantity);
                this.filterData();
                this.renderTable();
              }
            }else{
              this.$message.error(res.message)
            }
          }).catch((err)=>{
            this.$message.error(err.message)
          })
        }
      },
      //取消
      cancel() {

      },
      //提交
      submit() {

      },


    }
  }
</script>
<style scoped>
  .box {
    width: 100%;
    display: flex;
  }

  @media screen and (min-width: 765px) {

    .form input {
      width: 240px;
    }
  }

  .form label {
    width: 65px;
  }

  .form input {
    border: 1px solid #ccc;
    border-radius: 5px;
    height: 35px;
    margin-bottom: 20px;
    padding-left: 15px;
  }

  .form {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
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
    vertical-align: sub;
    margin-left: 15px;
  }

  .surplus {
    margin: 20px 0;
    color: cornflowerblue;
    /* color: deepskyblue; */
  }

  .surplus .title {
    font-size: 16px;
    margin-right: 20px;
  }

  .tr {
    height: 45px;
  }

  td {
    text-align: center;
    padding: 10px 15px;
  }
</style>
