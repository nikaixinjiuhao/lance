<template>
  <div>
    <div class="operation">
      <div class="operationBtn">
        <el-button type="primary" @click="scan()">扫一扫</el-button>
        <el-dialog
          title="提示"
          :visible.sync="ScanDialogVisible"
          width="30%"
          :before-close="ScanClose">
          <div class="scanCode">
            <label>扫描码：</label>
            <input type="text" v-model="scanCode" id="content" value=""/>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="ScanDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="getVal()">确 定</el-button>
          </span>
        </el-dialog>
        <el-button type="primary" @click="ExportDialogVisible=true">导入</el-button>
        <!-- 导入弹框Modal2 -->
        <el-dialog
          title="提示"
          :visible.sync="ExportDialogVisible"
          width="30%"
          :before-close="ScanClose">
          <form id="uploadForm">
            <input type="file" id="file" :model="files" value="">
            <span class="uploadTip"></span>
          </form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="ExportDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmUpload()">确 定</el-button>
          </span>
        </el-dialog>
        <el-button type="primary" class="printQRBtn" @click="saveExport()" :disabled="isSubmit">打印二维码</el-button>
        <el-dialog
          title="打印表格"
          :visible.sync="printDialogVisible"
          width="80%"
          :before-close="PrintClose">
          <div class="QRPrintContent">
<!--            <el-button v-show="isPrintBtn" size="mini" class="printQR" type="primary" @click="PrintTables()">打印</el-button>-->
            <div class="PrintTables">
              <div class="QRtable" v-for="(item,index) in multipleSelection" :key="index">
                <table width='420' border="1" cellspacing="0">
                  <tr>
                    <td><img class="logo" src="/image/logo.jpg" alt=""></td>
                    <td rowspan="2" style="text-align: center">
                      <img class="QRCode" :src="item.qr !== null ? item.qr : ''" alt=""></td>
                  </tr>
                  <tr>
                    <td><span>组件号</span>
                      <h3>{{item.partNumber !== null ? item.partNumber : ''}}</h3></td>
                  </tr>
                  <tr>
                    <td>
                      <span>采购订单</span>
                      <h3>{{item.purchaseOrder !== null ? item.purchaseOrder : ''}}</h3>
                    </td>
                    <td>
                      <span>数量</span>
                      <div class="amount">
                        <h3 class="quantities">{{item.quantity !== null ? item.quantity : ''}}</h3>
                        <p class="unit">个</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>供应商</span>
                      <h4>{{item.supplierSN !== null ? item.supplierSN : ''}}</h4>
                    </td>
                    <td>
                      <span>生产日期</span>
                      <h4>{{item.productionDate !== null ? item.productionDate : ''}}</h4>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <div class="last">
                        <div class="left">
                          <img :src="item.qrUrl !== null ? item.qrUrl : ''" alt="">
                          <p>{{item.batchNumber !== null ? item.batchNumber : ''}}</p>
                        </div>
                        <div class="right">
                          <span>名称</span>
                          <h4>{{item.partName !== null ? item.partName : ''}}</h4>
                          <span class="supplierNumber">供应商追溯号: {{item.supplierSN !== null ? item.supplierSN : ''}}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
                <div class="selectContent no-print">
                  <input class="check" type="checkbox" @click="selectPrint(index)" checked name="" :id="index" value=""><span>勾选打印</span>
                </div>
              </div>

            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="printDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="PrintTables()">确 定</el-button>
          </span>
        </el-dialog>
        <el-button type="danger" @click="cancel()">取消</el-button>
        <el-button type="success" @click="submit()">提交</el-button>
        <a href="/image/模版.xlsx">下载模版</a>
      </div>
    </div>
    <form id="form">
      <div class="form-group ipt">
        <label >送货日期:</label>
        <el-date-picker
          id="deliveryDate"
          v-model="datas.deliveryDate"
          @change="changeDate(this)"
          placeholder="选择日期">
        </el-date-picker>
      </div>
      <div class="form-group ipt">
        <label for="deliveryNumber">送货单号:</label>
        <el-input style="width: 220px" type="text" id="deliveryNumber" v-model="datas.deliveryNumber" placeholder="" @blur="deliveryNumberChange(datas.deliveryNumber)"></el-input>
      </div>
      <div class="table-responsive">
        <el-button type="text" class="btn btn-primary add" @click="AddDialogVisible = true">添加行</el-button>
        <!-- 添加行弹窗-->
        <el-dialog
          title="选择添加的行数"
          :visible.sync="AddDialogVisible"
          width="30%"
          :before-close="CloseAdd">
          <div class="modal-body">
            <input type="number" id="addNum" value="">
            <span class="tip"></span>
          </div>
          <span slot="footer" class="dialog-footer">
          <el-button @click="AddDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAdd()">确 定</el-button>
        </span>
        </el-dialog>
        <el-table
          ref="multipleTable"
          :data="datas.tableDefault"
          border
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="采购订单号" width="150" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.purchaseOrder"
                        @change="changePurchaseOrder(scope.$index, scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="采购订单行号" width="150" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.purchaseOrderLine"
                        @change="changePurchaseOrderLine(scope.$index, scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column  label="产品编号" width="150" align="center" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.partNumber" disabled></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="" label="产品名称" width="150" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.partName" disabled></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="" label="收货数量" width="150" align="center" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.quantity" @change="getMinPackageNum(scope.$index, scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="" label="最小包装数量" width="150" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.quantityPerPackage" disabled></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="" label="包装数量" width="150" align="center" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.quantityPackage" disabled></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="" label="生产日期" width="150" align="center">
            <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.productionDate"
                @change="getProductValidityPeriod(scope.$index, scope.row)"
                placeholder="">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column prop="" label="产品有效期（天）" width="150" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.days" disabled></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="" label="保质日期" width="150" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.bestDate" disabled></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="" label="DateCode（非电子料）与生产日期合并" width="150" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.dateCode" disabled></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="" label="供应商SN号（电子料）" width="150" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.supplierSN" @change="changeSupplierSN(scope.$index, scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="" label="BIN" width="150" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.bin" @change="getChargeNo(scope.$index, scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="" label="GROUP" width="150" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.group" @change="changeGroup(scope.$index, scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="" label="ChargeNo." width="150" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.chargeNumber" disabled></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="" label="BatchNo." width="150" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.batchNumber" disabled></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="delRow(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </form>
  </div>
</template>
<script>
  import 'bootstrap/dist/js/bootstrap.min'

  export default {
    name: 'purchase',
    data() {
      return {
        dataString: '',
        AddDialogVisible: false, //添加行弹窗
        ScanDialogVisible: false, //扫一扫弹窗
        scanCode: '', //扫一扫 扫描码
        ExportDialogVisible: false, //导入弹窗
        printDialogVisible:false,//打印弹窗
        files:{},
        isSubmit:false,//打印二维码按钮是否禁止
        multipleSelection: [],
        isPrintBtn: true,
        isShowPrintTables: false,
        PrintDialog: null,
        datas: {
          deliveryDate: '',
          deliveryNumber: '',
          tableData: [],
          tableDefault: []
        },
        defaultList: {
          purchaseOrder: '11',//采购订单号
          purchaseOrderLine: '',//采购订单行号
          partName: '', //产品名称
          partNumber: '',//产品编号
          quantity: null,//收货数量
          quantityPerPackage: null, //最小包装数量
          quantityPackage: null, //包装数量
          productionDate: '', //生产日期
          supplierSN: null, //供应商SN号
          bin: null,
          group: '',
          deliveryDate: '',
          deliveryNumber: '',
          batchNumber: '',//BatchNo
          days: '',
          bestDate: '',//保质日期
          dateCode: '',
          chargeNumber: ''//ChargeNo
        },
        list: {
          ProductNo: '',
          productName: '',
          ReceiveGoodsNum: '',
          manufactureDate: '',
          ChargeNo: null,
          isPrint: true
        },
        printTablesData: [],
        index: null,
        notSelect: [],
        oldPage: null,
        printPage: null
      }
    },
    mounted() {
      this.NowDate()
      $("#deliveryDate").val(this.NowDate());
    },
    created() {

      $(".QRPrintContent").hide();
      this.changeTime();
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //关闭扫一扫弹窗
      ScanClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      },
      //关闭添加行弹窗
      CloseAdd(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      },
      //关闭打印弹窗
      PrintClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {
        });
    },
      //获取当前时间
      NowDate() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        if (month < 10) {
          month = "0" + month;
        }
        if (day < 10) {
          day = "0" + day;
        }
        let nowDate = year + "-" + month + "-" + day;
        return nowDate
      },
      changeTime() {
        let date = $("#deliveryDate").val();
        if (date !== undefined) {
          this.dataString = date.split(' ')[0].split('-')[0] + date.split(' ')[0].split('-')[1] + date.split(' ')[0].split('-')[2];
        }
      },
      //改变日期
      changeDate(el) {
        if ($("#deliveryDate").val().trim() !== '') {
          for (let j = 0; j < this.datas.tableDefault.length; j++) {
            this.datas.tableDefault[j].deliveryDate = $("#deliveryDate").val()
          }
          this.changeTime();
          $(".dataTip").remove();
          for (let i = 0; i < this.datas.tableDefault.length; i++) {
            if (this.datas.tableDefault[i].bin !== null && this.datas.tableDefault[i].supplierSN !== null) {
              this.datas.tableData[i].ChargeNo = `<${this.dataString}><${this.datas.tableDefault[i].bin}><${this.datas.tableDefault[i].supplierSN}>`;
              $(".ChargeNo").eq(i).val(this.datas.tableData[i].ChargeNo)
            }
          }
        }
      },
      //删除行
      delRow(r) {
        this.datas.tableData.splice(r, 1);
        this.datas.tableDefault.splice(r, 1);

      },
      //确定添加行
      confirmAdd() {
        $(".dataTip").remove();
        const num = parseInt($("#addNum").val());
        if ($("#addNum").val().trim() === '') {
          $(".tip").html('请输入要添加的行数')
        } else {
          if (eval(num) > 0) {
            $(".tip").html('');
            for (let i = 0; i < num; i++) {
              this.datas.tableData.push(JSON.parse(JSON.stringify(this.list)));
              this.datas.tableDefault.push(JSON.parse(JSON.stringify(this.defaultList)))
            }
            //设置默认全选
            this.$nextTick(()=>{
              for(let i=0;i<this.datas.tableDefault.length;i++){
                this.$refs.multipleTable.toggleRowSelection(this.datas.tableDefault[i],
                true)
              }
            })
            this.AddDialogVisible = false;
            $('#addNum').val('');
            if ($("#deliveryNumber").val().trim() !== '') {
              for (let j = 0; j < this.datas.tableDefault.length; j++) {
                this.datas.tableDefault[j].deliveryNumber = $("#deliveryNumber").val()
              }
            }
            if ($("#deliveryDate").val().trim() !== '') {
              for (let j = 0; j < this.datas.tableDefault.length; j++) {
                this.datas.tableDefault[j].deliveryDate = $("#deliveryDate").val()
              }
            }
          } else {
            $(".tip").html('添加行数必须大于0');

          }
        }
      },
//扫一扫
      scan() {
        this.ScanDialogVisible = true;
      },
      getVal() {
        $(".dataTip").remove();
        if (this.scanCode.trim() !== '') {
          this.axios({
            url: 'api/storage/scan',
            method: 'get',
            data: {
                  info: this.scanCode
                },
          }).then(res => {
            if (res.code === 200) {
              if (res.data.storageList !== null) {
                  for (let i = 0; i < res.data.storageList.length; i++) {
                    this.datas.tableDefault.push(res.data.storageList[i]);
                    this.datas.tableData.push(JSON.parse(JSON.stringify(this.list)));
                  }
                this.changeTime();
                  //设置默认全选
                this.$nextTick(()=>{
                    for(let i=0;i<this.datas.tableDefault.length;i++){
                      this.$refs.multipleTable.toggleRowSelection(this.datas.tableDefault[i],
                        true)
                    }
                  })
                }
            }else{
              this.$message.error(res.message);
            }
          }).catch(error => {
            this.$message.error(error.message);
          });
          this.ScanDialogVisible = false
        }
      },
      //导入  上传文件
      confirmUpload() {
        this.ExportDialogVisible = false;
        $(".dataTip").remove();
        var fileObj = document.getElementById("file").files[0];
        if (fileObj !== undefined) {
          $(".uploadTip").html('')
          const form = new FormData();
          form.append("file", fileObj);
          this.axios({
            url:'/api/storage/excel',
            method:"post",
            headers: {
              "Content-Type": "multipart/form-data"
            },
            withCredentials:true,
            data:form,
          }).then(res=>{
            if (res.code === 200) {
              if (res.data !== null) {
                if (res.data.deliveryDate !== null) {
                  $("#deliveryDate").val(res.data.deliveryDate);
                }
                if (res.data.deliveryNumber !== null) {
                  $("#deliveryNumber").val(res.data.deliveryNumber);
                }
                for (let k = 0; k < res.data.storageList.length; k++) {
                  this.datas.tableDefault.push(res.data.storageList[k]);
                  this.datas.tableData.push(JSON.parse(JSON.stringify(this.list)));
                }
                //设置默认全选
                this.$nextTick(()=>{
                  for(let i=0;i<this.datas.tableDefault.length;i++){
                    this.$refs.multipleTable.toggleRowSelection(this.datas.tableDefault[i],
                      true)
                  }
                })
              }
            } else {
              this.$message.error(res.message);
            }
          }).catch(error=>{
            this.$message.error(error.message);
          })
          document.getElementById("uploadForm").reset();
        } else {
          $(".uploadTip").html('请上传文件')
        }
      },

      //填写采购订单号
      changePurchaseOrder(idx, row) {
        this.renderPartNumber(idx, row);
      },

      //填写采购订单行号
      changePurchaseOrderLine(idx, row) {
        this.renderPartNumber(idx, row)
      },

      //通过采购订单号和采购订单行号确认 产品编号、产品名称、最小包装数量
      renderPartNumber(num, row) {
        if (row.purchaseOrder !== '' && row.purchaseOrderLine !== '') {
          const that = this
          $.ajax({
            url: "http://10.0.0.81:8080/api/storage/getPartNumber",
            type: "get",
            data: {
              purchaseOrder: row.purchaseOrder,
              purchaseOrderLine: row.purchaseOrderLine
            },
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (data) {
              if (data.code === 200) {
                if (data.data !== null) {
                  that.datas.tableDefault[num].partNumber = data.data.partNumber;
                  that.datas.tableDefault[num].partName = data.data.description;
                  that.datas.tableDefault[num].quantityPerPackage = data.data.purchaseQuantityPerPackage;
                }
              } else {
                layer.msg(data.message)
              }
            },
          });
        }
      },

      //收货数量改变，包装数量也相应改变
      getMinPackageNum(idx, row) {
        if (row.quantityPerPackage !== null) {
          row.quantityPackage = Math.ceil(eval(row.quantity / row.quantityPerPackage));
        }
      },

      //ChargeNo
      getChargeNo(idx, row) {
        if (row.bin !== null && row.supplierSN !== null) {
          row.chargeNumber = `${this.dataString}|${row.bin}|${row.supplierSN}|`;
        } else {
          row.chargeNumber = ''
        }
      },

      //供应商SN号（电子料）
      changeSupplierSN(idx, row) {
        if (row.bin !== null && row.supplierSN !== null) {
          row.chargeNumber = `${this.dataString}|${row.bin}|${row.supplierSN}|`;
        } else {
          row.chargeNumber = ''
        }
      },

      //GROUP
      changeGroup(params) {
        // const m = parseInt($(params.parentNode.parentNode).attr('id'));
        // this.datas.tableDefault[m].group = $(params).val();
      },

      //生产日期
      getProductValidityPeriod(index,row) {
        if (row.productionDate !== '' && row.bestDate !== '') {
          row.days = this.getDays(row.productionDate, row.bestDate);
        }else{
          row.days=''
        }
      },

      //时间相减计算天数
      getDays(t1, t2) {
        var time1 = new Date(t1);
        var time2 = new Date(t2);
        const days = Math.floor((time2 - time1) / 1000 / 60 / 60 / 24);
        return days
      },

      //打印二维码
      saveExport() {
        if (this.datas.tableDefault.length > 0) {
          if (this.multipleSelection.length > 0) {
            this.printDialogVisible=true
          } else {
            layer.msg('暂无勾选打印列表！')
          }
        } else {
          layer.msg('请先添加列表数据')
        }
      },

      //判断是否勾选打印
      selectPrint(value) {
        if($(".selectContent").eq(value).checked){
          let index=this.notSelect.indexOf(value)
          if(index!==-1){
            this.notSelect.splice(index, 1)
          }
        }else{
            this.notSelect.push(value)
        }
      },

      //打印二维码表格
      PrintTables() {
        this.isPrintBtn = false;
        this.oldPage=document.getElementById("app");
        document.cookie=`deliveryNumber=${this.datas.deliveryNumber}`;
        this.printPage = document.getElementsByClassName("QRPrintContent")[0].innerHTML;
        document.body.innerHTML = this.printPage;
        for (let k = 0; k < $(".selectContent").length; k++) {
          $(".selectContent").eq(k).hide()
        }
        if (this.notSelect.length > 0) {
          for (let j = 0; j < this.notSelect.length; j++) {
            $(".QRtable").eq(this.notSelect[j]).hide()
          }
        }
        window.print();
        document.body.innerHTML=''
        document.body.appendChild(this.oldPage);
        this.printDialogVisible=false
      },

      //取消
      cancel() {
        window.location.reload();
      },

      //提交
      submit() {
        if (this.datas.tableDefault.length > 0) {
          if ($("#deliveryNumber").val().trim() === '') {
            this.$message.error('请填写送货单号');
          } else {
            const purchaseOrderName = this.datas.tableDefault.every(item => {
              return item.purchaseOrder !== ''
            })
            if (purchaseOrderName === false) {
              this.$message.error('采购订单号必填');
            } else {
              const purchaseOrderLineNmae = this.datas.tableDefault.every(item => {
                return item.purchaseOrderLine !== ''
              })
              if (purchaseOrderLineNmae === false) {
                this.$message.error('采购订单行号必填!');
              } else {
                const quantityNmae = this.datas.tableDefault.every(item => {
                  return item.quantity !== null && item.quantity !== ''
                })
                if (quantityNmae === false) {
                  this.$message.error('收货数量必填!');
                } else {
                  const re = /^[0-9]+$/
                  const quantityNumber = this.datas.tableDefault.every(item => {
                    return re.test(item.quantity)
                  })
                  if (quantityNumber === false) {
                    this.$message.error('收货数量必须为>0的整数!');
                  } else {
                    const productionDateNmae = this.datas.tableDefault.every(item => {
                      return item.productionDate !== ''
                    })
                    if (productionDateNmae === false) {
                      this.$message.error('生产日期必填!');
                    } else {
                      this.axios({
                        url:'/api/storage/purchase',
                        method:'post',
                        data:JSON.stringify(this.datas.tableDefault)
                      }).then((res)=>{
                        if(res.code===200){
                          this.$message('提交成功!');
                        }
                      }).catch((error)=>{
                          this.$message.error(error.message)
                      })
                    }
                  }
                }
              }
            }
          }
        } else {
          this.$message({
            message: '暂无可提交内容!',
            type: 'success'
          });
        }
      },
      deliveryNumberChange(val){
        this.search(val)
      },

      //由送货单号查询
      search(value) {
        if (value !== undefined && value !== '') {
          for (let i = 0; i < this.datas.tableDefault.length; i++) {
            this.datas.tableDefault[i].deliveryNumber = value
          }
          this.axios({
            url:'/api/storage/search',
            method:'get',
            data:{
              deliveryNumber: value
            }
          }).then((res)=>{
            if (res.code === 200) {
              if (res.data.length > 0) {
                this.datas.tableData.splice(0, this.datas.tableData.length - 1)
                for (let i = 0; i < res.data.length; i++) {
                  this.datas.tableDefault = res.data;
                  this.datas.tableData.push(JSON.parse(JSON.stringify(this.list)));
                }
                //设置默认全选
                this.$nextTick(()=>{
                  for(let i=0;i<this.datas.tableDefault.length;i++){
                    this.$refs.multipleTable.toggleRowSelection(this.datas.tableDefault[i],
                      true)
                  }
                })
              } else {
                this.datas.tableData.length = 0;
                this.datas.tableDefault.length = 0;
              }
            }
          }).catch((error)=>{
              this.$message.error(error.message)
          })
        }
      }
    }
  }
</script>
<style scoped>
  .ipt {
    width: 350px;
  }

  .ipt label {
    width: 70px;
  }

  .ipt input {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px 10px;
  }

  td {
    padding: 5px 3px;
    width: 210px;
    box-sizing: border-box;
  }

  .logo {
    width: 90px;
    height: auto;
  }

  .operation {
    height: 45px;
  }

  .operationBtn {
    float: right;
  }

  .add {
    margin: 15px 0 10px;
  }

  .tip {
    color: #ff0000;
    font-size: 12px;
  }

  .scanCode {
    margin: 20px;
  }

  .scanCode input {
    width: 80%;
    line-height: 35px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .QRPrintContent {
    padding: 25px;
  }

  .PrintTables {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .printQR {
    margin-bottom: 20px;
  }

  .QRtable {
    width: 500px;
    height: 500px;
    padding: 0;
    margin-bottom: 25px;
  }

  .QRtable table {
    height: 420px;
  }

  .check {
    width: 20px;
    height: 20px;
    vertical-align: sub;
    margin: 10px 0;
  }

  td h3, td h4 {
    margin: 0;
    font-weight: 400;
    padding-left: 5px;
  }

  td h3, .unit {
    font-size: 14px;
  }

  .unit {
    margin: 0 10px;
    display: inline-block;
  }

  td h4 {
    font-size: 14px;
  }

  td h6 {
    font-size: 20px;
    font-weight: 400;
    text-align: center;
    margin-bottom: 0;
    color: #555;
  }

  .last {
    display: flex;
    flex-direction: row;
  }

  .left {
    width: 145px;
  }

  .left img {
    width: 80px;
    height: 80px;
  }

  .left p {
    color: #666;
  }

  .right {
    width: 255px;
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
