import React, { Component } from 'react';
import { Button, Col, InputNumber, Layout, Radio, Row } from 'antd';
import '../css/canvas.css';
import ColorPicker from 'react-color';
import reactCSS from 'reactcss';


const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Header, Sider, Content } = Layout;

class MyCanvas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      siderWidth: '400',
      canvasWidth: '1200',
      colorVisible: false,
      displayColorPicker: false,    // 是否显示颜色选择器
      drawColor: {
        hex: '#F14E4E',         // 颜色选择器 颜色
      },
      img: new Image(),         // 填充的图片
      drawType: 'line',        // 画笔类型
      preDrawAry: [],          // 画布之前的状态
      isFill: 'true',        //图形内部是否填充
      flag: false,          // 是否开始作画
      cxt: null,           // 画布实例
      c: null,            // 画布节点
      preX: 0,           // 起始点x坐标
      preY: 0,          // 起始点y坐标
    };
  };

  // 初始化画布的各种属性，赋予画笔默认颜色，型号
  componentDidMount() {
    let context = this.refs.myCanvas.getContext('2d');
    context.shadowColor = '#F14E4E';
    context.strokeStyle = '#F14E4E';
    context.fillStyle = '#F14E4E';
    context.shadowBlur = 0;
    context.lineWidth = 1;

    // 线段端点: butt/无效果,round/补充半径为线段宽度一半的半圆,square/补充高度为线段宽度一半的长方形  默认值为butt
    context.lineCap = 'round';
    // 线段连接处: round/边角磨圆, bevel/割去尖角,miter/线段会在连接处外侧延伸直至交于一点，延伸效果受miterLimit影响。默认是 miter。
    context.lineJoin = 'round';

    this.setState({
      c: this.refs.myCanvas,
      cxt: context,           //获得渲染上下文和它的绘画功能 参数表示2D绘图
    });
    this.state.img.src = 'src/image/58.png';

    // 挂载浏览器窗口大小变化事件
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();

  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize = () => {
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
      let winWidth = document.documentElement.clientWidth - 200;
      console.log(winWidth);
      this.setState({
        canvasWidth: winWidth
      });
      // 变化canvas的长宽会导致画布重新生成，重新填充画布的内容
      let popData = this.state.preDrawAry[this.state.preDrawAry.length - 1];
      this.state.cxt.putImageData(popData, 0, 0);
    }
  };

  // 修改画笔线条大小
  penSizeChange = (value) => {
    this.state.cxt.lineWidth = value;
  };

  // 修改绘画的阴影大小
  shadowBlurChange = (value) => {
    this.state.cxt.shadowBlur = value;
  };


  changeDrawType = (e) => {
    this.setState({
      drawType: e.target.value,
    });
    console.log(e.target.value);
    console.log(this.state.drawColor.hex);
  };

  changeFill = (e) => {
    this.setState({
      isFill: e.target.value
    });
  };

  // 移动鼠标开始绘图
  canvasMouseMove = (e) => {
    if (this.state.flag) {
      const color = this.state.drawColor;
      const cxt = this.state.cxt;
      const canvas = this.state.c;
      const rect = canvas.getBoundingClientRect();
      let x = e.clientX - rect.left * (canvas.width / rect.width);
      let y = e.clientY - rect.top * (canvas.height / rect.height);

      cxt.shadowColor = color.hex;
      cxt.strokeStyle = color.hex;
      cxt.fillStyle = color.hex;

      // 根据drawType决定作画的类型
      if (this.state.drawType === 'line') {
        cxt.lineTo(x, y);
        cxt.stroke();
      } else if (this.state.drawType === 'arc') {
        let popData = this.state.preDrawAry[this.state.preDrawAry.length - 1];
        this.state.cxt.putImageData(popData, 0, 0);
        // 清除之前绘制的圆形路径
        cxt.beginPath();
        let x1 = (this.state.preX + x) / 2;
        let y1 = (this.state.preY + y) / 2;
        let r = Math.sqrt(Math.pow((this.state.preX - x) / 2, 2) + Math.pow((this.state.preY - y) / 2, 2));
        cxt.arc(x1, y1, r, 0, 2 * Math.PI);
        if (this.state.isFill === 'true') {
          cxt.fill();
        } else {
          cxt.stroke();
        }
      } else if (this.state.drawType === 'rect') {
        // 绘图之前清除掉上次移动鼠标绘制出的长方形，重新绘制
        let popData = this.state.preDrawAry[this.state.preDrawAry.length - 1];
        this.state.cxt.putImageData(popData, 0, 0);
        let x1 = this.state.preX;
        let y1 = this.state.preY;

        if (this.state.isFill === 'true') {
          cxt.fillRect(x1, y1, x - x1, y - y1);
        } else {
          cxt.strokeRect(x1, y1, x - x1, y - y1);
        }
      }
    }
  };

  // 鼠标在画布按下时，根据state修改画笔属性，并启动绘画
  canvasMouseDown = (e) => {
    this.state.cxt.beginPath();
    const canvas = this.state.c;

    const rect = canvas.getBoundingClientRect();
    this.setState({
      preX: e.clientX - rect.left * (canvas.width / rect.width),
      preY: e.clientY - rect.top * (canvas.height / rect.height),
    });

    this.setState({
      flag: true,
    });
    // 保存绘画记录
    let preData = this.state.cxt.getImageData(0, 0, this.state.canvasWidth, 700);
    this.state.preDrawAry.push(preData);
  };

  canvasMouseUp = () => {
    this.setState({
      flag: false,
    });
    let preData = this.state.cxt.getImageData(0, 0, this.state.canvasWidth, 700);
    this.state.preDrawAry.push(preData);
  };


  // 鼠标移除画布的时候取消绘画
  canvasMouseOut = () => {
    this.setState({
      flag: false,
    });
  };

  // 清空画布
  clearCxt = () => {
    const c = this.state.c;
    this.state.cxt.clearRect(0, 0, c.width, c.height);
  };

  // 在画布上展示图片
  addImage = () => {
    this.state.cxt.drawImage(this.state.img, 0, 0, 300, 300);
    console.log('填充图片');
  };

  // 通过这里修改strokeColor,以及控件中color绑定strokeColor，使得颜色选择器失去了焦点之后会不变回默认颜色
  handleChangeColor = (color) => {
    this.setState({
      drawColor: color
    });
  };

  handleCloseColor = () => {
    this.setState({
      colorVisible: false,
    });
  };

  handleClickColor = () => {
    this.setState({
      colorVisible: !this.state.colorVisible,
    });
  };

  render() {
    const styles = reactCSS({
      'default': {
        color: {
          width: '50px',
          height: '20px',
          borderRadius: '2px',
          background: this.state.drawColor.hex,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <div className="myDiv">
        <Layout style={{ backgroundColor: 'rgba(255,255,255,0)' }}>
          <Layout>
            <Header style={{ backgroundColor: 'rgba(255,255,255,0)' }}>
              <h1 style={{ backgroundColor: 'rgba(255,255,255,0)' }}>HTML5 canvas 画板</h1>
            </Header>
          </Layout>


          <Layout style={{ backgroundColor: 'rgba(255,255,255,0)' }}>
            <Sider style={{ backgroundColor: 'white', width: this.state.siderWidth }}>

              <Row style={{ paddingTop: 10, paddingBottom: 10 }}>
                <Col offset={2} span={9}>
                  <Button onClick={this.clearCxt}>清空画布</Button>
                </Col>
                <Col offset={2} span={9}>
                  <Button onClick={this.addImage}>填充图片</Button>
                </Col>
              </Row>
              <hr />
              <Row style={{ paddingTop: 10 }}>
                <Col offset={3} span={8}>
                  <label>Pen Size :</label>
                </Col>
                <Col offset={1} span={12}>
                  <InputNumber min={1} max={20} defaultValue={1} onChange={this.penSizeChange} />
                </Col>
              </Row>

              <Row style={{ paddingTop: 10 }}>
                <Col offset={3} span={8}>
                  <label>ShadowBlur:</label>
                </Col>
                <Col offset={1} span={12}>
                  <InputNumber min={0} max={10} defaultValue={0} onChange={this.shadowBlurChange} />
                </Col>
              </Row>

              {/*<Row style={{ paddingTop: 10 }}>*/}
              {/*<Col offset={2} span={20}>*/}
              {/*<Button onClick={this.showColorPicker} style = {{width:'100%'}}>Pick Color</Button>*/}
              {/*<Modal*/}
              {/*width = "260"*/}
              {/*title = "Color Picker"*/}
              {/*visible = {this.state.displayColorPicker}*/}
              {/*footer = {null}*/}
              {/*closable = {false}*/}
              {/*onCancel = {this.closeColorPicker}*/}
              {/*>*/}
              {/*<ColorPicker onChange={this.changeColor}*/}
              {/*ref="colorPicker"*/}
              {/*color = {this.state.drawColor}*/}
              {/*defaultColor='#F14E4E'*/}
              {/*type="sketch"*/}
              {/*/>*/}
              {/*</Modal>*/}
              {/*</Col>*/}
              {/*</Row>*/}


              <Row style={{ paddingTop: 10 }}>
                <RadioGroup onChange={this.changeDrawType} defaultValue="line">
                  <RadioButton value="line">画笔</RadioButton>
                  <RadioButton value="rect">长方形</RadioButton>
                  <RadioButton value="arc">圆形</RadioButton>
                </RadioGroup>
              </Row>
              <Row style={{ paddingTop: 10 }}>
                <RadioGroup onChange={this.changeFill} defaultValue="true">
                  <RadioButton value="true">实心</RadioButton>
                  <RadioButton value="false">空心</RadioButton>
                </RadioGroup>
              </Row>

              <Row style={{ paddingTop: 10 }}>
                <Col offset={3} span={6}>
                  <label>颜色:</label>
                </Col>
                <Col offset={1} span={12}>
                  <div>
                    <div style={styles.swatch}>
                      <div style={styles.color} onClick={this.handleClickColor}>
                      </div>
                    </div>
                    {
                      this.state.colorVisible ?
                        <div style={styles.popover}>
                          <div style={styles.cover} onClick={this.handleCloseColor} />
                          <ColorPicker onChange={this.handleChangeColor}
                                       ref="colorPicker"
                                       color={this.state.drawColor}
                                       defaultColor='#F14E4E'
                                       type="sketch"
                          />
                        </div>
                        : null
                    }
                  </div>
                </Col>
              </Row>

            </Sider>
            <Content>
              <canvas ref="myCanvas" height="700" width={this.state.canvasWidth} style={{ backgroundColor: 'white' }}
                      onMouseDown={this.canvasMouseDown}
                      onMouseMove={this.canvasMouseMove}
                      onMouseUp={this.canvasMouseUp}
                      onMouseOut={this.canvasMouseOut}
              >
                Your browser does not support the canvas element.
              </canvas>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}


export default MyCanvas;