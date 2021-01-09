<template>
  <div class="bom">

      <div class="area ApprovalArea">
          <p>审批区域</p>
          <div class="approval"></div>
          <div class="approval"></div>
          <div class="approval"></div>
          <div class="approval"></div>
          <div>
            <el-button type="success">批准</el-button>
            <el-button type="danger">驳回</el-button>
          </div>
          <div>
              <el-input type="textarea" :rows="3" style="width: 300px"></el-input>
          </div>
      </div>
      <div class="area">
          <el-form :inline="true" :model="formInline" label-position="top"  class="demo-form-inline">
              <el-form-item label="组件号" style="margin-right: 30px">
                  <el-input v-model="formInline.partId" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="名称" style="margin-right: 30px">
                  <el-input v-model="formInline.name" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="BOM审批状态" style="margin-right: 30px">
                  <el-input v-model="formInline.BOMStatus" placeholder=""></el-input>
              </el-form-item>
              <el-form-item label="工艺审批状态" style="margin-right: 30px">
                  <el-input v-model="formInline.user" placeholder=""></el-input>
              </el-form-item>
          </el-form>
      </div>
      <div class="contentArea">
          <div class="area left">
              <el-table
                  :data="TreeTableData"
                  style="width: 100%;margin-bottom: 20px;"
                  row-key="id"
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                  <el-table-column
                      prop="type"
                      label="类型"
                      sortable
                      width="120">
                  </el-table-column>
                  <el-table-column
                      prop="part"
                      label="组件"
                      width="120">
                  </el-table-column>
                      <el-table-column
                        prop="name"
                        label="姓名">
                      </el-table-column>
              </el-table>
          </div>
          <div class="area right">
              <div class="common">
                  <p>通用</p>
                  <el-form :inline="true" label-position="left" label-width="90px">
                      <el-form-item label="组件号">
                          <el-input v-model="commonForm.partId" style="width: 300px; margin-right: 30px" placeholder=""></el-input>
                      </el-form-item>
                      <el-form-item label="图纸">
                          <el-input v-model="commonForm.file" style="width: 300px; margin-right: 30px" placeholder=""></el-input>
                      </el-form-item>
                      <el-form-item label="名称">
                          <el-input v-model="commonForm.partId" style="width: 300px; margin-right: 30px" placeholder=""></el-input>
                      </el-form-item>
                      <el-form-item label="版本">
                          <el-input v-model="commonForm.version" style="width: 300px; margin-right: 30px" placeholder=""></el-input>
                      </el-form-item>
                      <el-form-item label="组件类型">
                          <el-input v-model="commonForm.partId" style="width: 300px; margin-right: 30px" placeholder=""></el-input>
                      </el-form-item>
                      <el-form-item label="状态">
                          <el-input v-model="commonForm.status" style="width: 300px; margin-right: 30px" placeholder=""></el-input>
                      </el-form-item>
                      <el-form-item label="产品工程师">
                          <el-input v-model="commonForm.partId" style="width: 300px; margin-right: 30px" placeholder=""></el-input>
                      </el-form-item>
                      <el-form-item label="评论">
                          <el-input v-model="commonForm.comment" style="width: 300px; margin-right: 30px" placeholder=""></el-input>
                      </el-form-item>
                  </el-form>
              </div>
              <div class="process">
                  <p>工序</p>
                  <el-button
                    size="small"
                    @click="addProcess()">
                    添加
                  </el-button>
                  <el-table
                  :data="processTableData"
                  border
                  style="width: 100%">
                  <el-table-column
                      align="center"
                      fixed
                      prop="id"
                      label="行"
                      width="50">
                  </el-table-column>
                  <el-table-column
                      align="center"
                      prop="process"
                      label="工序">
                  </el-table-column>
                  <el-table-column
                      align="center"
                      prop="WC"
                      label="WC">
                  </el-table-column>
                  <el-table-column
                      align="center"
                      prop="processName"
                      label="工序名称">
                  </el-table-column>
                  <el-table-column
                      align="center"
                      prop="supplier"
                      label="供应商">
                  </el-table-column>
                  <el-table-column
                      align="center"
                      prop="setUpTime"
                      label="准备时间">
                  </el-table-column>
                  <el-table-column
                      align="center"
                      prop="UnitTime"
                      label="单位时间">
                  </el-table-column>
                  <el-table-column
                      align="center"
                      prop="unit"
                      label="单位">
                  </el-table-column>
                  <el-table-column
                      align="center"
                      prop="overlap"
                      label="重叠">
                  </el-table-column>
                  <el-table-column
                      align="center"
                      prop="waitTime"
                      label="等候时间">
                  </el-table-column>
                  <el-table-column
                      align="center"
                      prop="file"
                      label="文件"
                      width="100">
                  </el-table-column>
                  <el-table-column
                      align="center"
                      fixed="right"
                      label="操作"
                      width="100">
                      <template slot-scope="scope">
                          <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                      </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="materiel">
                  <p>物料</p>
                  <el-button
                      size="small"
                      @click="addMateriel()">
                      添加
                  </el-button>
                  <el-table
                  :data="MaterielTableData"
                  border
                  style="width: 100%">
                  <el-table-column
                    align="center"
                    fixed
                    prop="id"
                    label="行"
                    width="50">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="partId"
                    label="组件号">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="name"
                    label="名称">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="partType"
                    label="组件类型">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="version"
                    label="版本">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="setUpNumber"
                    label="准备数量">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="AssociatedProcess"
                    label="关联工序">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="overlap"
                    label="重叠">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="unit"
                    label="单位">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="additional"
                    label="附加%"
                    width="100">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="file"
                    label="文件"
                    width="100">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="danger"
                        @click="materielDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
  import VueDragResize from 'vue-drag-resize'
  export default {
      name: 'BOM',
      data() {
          return {
              width: 200,
              height: 200,
              top: 60,
              left: 240,
              formInline: {
                partId: '',
                name: '',
                BOMStatus: '',
                Status: ''
              },
              TreeTableData:[
                {
                  id:1,
                  type:'A',
                  part:'10024',
                  name: '12345',
                  children:[
                    {
                      id: 11,
                      type:'A',
                      part:'10024',
                      name: '半成品',
                    }
                  ]
                },
                {
                  id:2,
                  type:'B',
                  part:'10025',
                  name: '12345',
                  children:[
                    {
                      id: 21,
                      type:'B',
                      part:'10025',
                      name: '成品',
                      children:[
                        {
                          id: 211,
                          type:'B',
                          part:'10025',
                          name: '成品1',
                        },
                        {
                          id: 212,
                          type:'B',
                          part:'10025',
                          name: '成品2',
                        }
                      ]
                    },
                  ]
                }
              ],
              commonForm:{
                  partId:'',
                  name: '',
                  type: '',
                  engineer: '',
                  file: '',
                  version: '',
                  status: '',
                  comment: '',
              },
              ProcessTemplate:{
                id:null,
                process:'',
                WC:'',
                processName:'',
                supplier: '',
                setUpTime:'',
                UnitTime: '',
                unit:'',
                overlap: '',
                waitTime: '',
                file:''
              },
              processTableData:[
                  {
                      id:1,
                      process:10,
                      WC:'100',
                      processName:'',
                      supplier: '',
                      setUpTime:'',
                      UnitTime: '',
                      unit:'',
                      overlap: '',
                      waitTime: '',
                      file: ''
                  },
                  {
                      id:2,
                      process:10,
                      WC:'',
                      processName:'',
                      supplier: '',
                      setUpTime:'',
                      UnitTime: '',
                      unit:'',
                      overlap: '',
                      waitTime: '',
                      file: ''

                  }
              ],
              MaterielTemplate:{
                id: null,
                partId: '',
                name: '',
                partType: '',
                version:'',
                setUpNumber: '',
                AssociatedProcess:'',
                overlap:'',
                unit:'',
                additional:'',
                file: ''
              },
              MaterielTableData:[
                  {
                      id: 11,
                      partId: '',
                      name: '',
                      partType: '',
                      version:'',
                      setUpNumber: '',
                      AssociatedProcess:'',
                      overlap:'',
                      unit:'',
                      additional:'',
                      file: ''
                  }
              ]
          }
      },
      methods: {
          handleDelete(index, row) {
              this.processTableData.splice(index, 1)
          },
          addProcess(){
              if (this.processTableData.length > 0) {
                this.ProcessTemplate.id = this.processTableData[this.processTableData.length - 1].id + 1
              } else {
                this.ProcessTemplate.id = 1
              }
              this.processTableData.push(JSON.parse(JSON.stringify(this.ProcessTemplate)));
          },
          addMateriel(){
              if (this.MaterielTableData.length > 0) {
                this.MaterielTemplate.id = this.MaterielTableData[this.MaterielTableData.length - 1].id + 1
              } else {
                this.MaterielTemplate.id = 1
              }
              this.MaterielTableData.push(JSON.parse(JSON.stringify(this.MaterielTemplate)));
          },
          materielDelete(index){
              this.MaterielTableData.splice(index, 1)
          },

      }
  }
</script>

<style scoped>
  .area{
      margin-bottom: 20px;
  }
  .ApprovalArea{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
  }
  .ApprovalArea div{
      margin-left: 15px;
  }
  .approval{
      width: 100px;
      height: 40px;
      border: 1px solid #666;
    border-radius: 10px;
  }
  .contentArea{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
  }
  .left{
      width: 27%;
      margin-right: 25px;
      border: 1px solid #333;
  }
  .right{
      width: 68%;
  }
  .common{
      /*height: 300px;*/
  }
  .common , .process , .materiel{
      border: 1px solid #333;
      padding: 15px;
      margin-bottom: 25px;
  }

</style>
