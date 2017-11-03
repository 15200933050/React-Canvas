import React, { Component } from 'react';
import {Button, Col, Layout, Row, Select, Modal, InputNumber, Radio} from 'antd';
import '../css/canvas.css';
import ColorPicker from 'react-color';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Header, Footer, Sider, Content } = Layout;
const Option = Select.Option;

class MyCanvas extends Component{

    constructor(props) {
        super(props);
        this.state = {
            displayColorPicker: false,    // 是否显示颜色选择器
            strokeColor: '#F14E4E',      // 画笔颜色
            img: new Image(),           // 填充的图片
            drawType: 'line',          // 画笔类型
            shadowBlur: 1,            // 画笔阴影大小
            preDrawAry:[],           // 画布之前的状态
            isFill: true,           //图形内部是否填充
            flag: false,           // 是否开始作画
            penSize: 2,           // 画笔大小
            cxt: null,           // 画布实例
            c: null,            // 画布节点
            preX: 0,           // 起始点x坐标
            preY: 0,          // 起始点y坐标
        };
    };

    componentDidMount() {
        this.setState({
            c: this.refs.myCanvas,
            cxt: this.refs.myCanvas.getContext("2d"), //获得渲染上下文和它的绘画功能 参数表示2D绘图
        });
        this.state.img.src = "src/image/58.png";
    };


    penSizeChange = (value) => {
        this.setState({
            penSize: value,
        })
    };

    shadowBlurChange = (value) => {
        this.setState({
            shadowBlur: value,
        })
    };

    //通过这里修改strokeColor,以及控件中color绑定strokeColor，使得颜色选择器失去了焦点之后会不变回默认颜色
    changeColor = (colors) =>{
        this.setState({
            strokeColor: colors,
        })
    };

    closeColor = (colors) => {
        console.log(colors);
    };

    showColorPicker = () => {
        this.setState({
            displayColorPicker: true,
        })
    };
    closeColorPicker = () => {
        this.setState({
            displayColorPicker: false,
        })
    };

    changeDrawType = (e) => {
        this.setState({
            drawType: e.target.value,
        });
        console.log(e.target.value);
    };

    //移动鼠标开始绘图
    canvasMouseMove = (e) => {

        if(this.state.flag){
            const cxt = this.state.cxt;
            const canvas = this.state.c;
            const rect = canvas.getBoundingClientRect();
            let x = e.clientX - rect.left * (canvas.width / rect.width);
            let y = e.clientY - rect.top * (canvas.height / rect.height);

            //根据drawType决定作画的类型
            if(this.state.drawType === 'line'){
                cxt.lineTo(x,y);
                cxt.stroke();
            }else if(this.state.drawType === 'rect'){
                //绘图之前清除掉上次移动鼠标绘制出的长方形，重新绘制
                let popData = this.state.preDrawAry[this.state.preDrawAry.length - 1];
                this.state.cxt.putImageData(popData,0,0);
                let x1 = this.state.preX;
                let y1 = this.state.preY;
                cxt.fillRect(x1, y1, x-x1, y-y1);
            }
        }
    };

    //鼠标在画布按下时，根据state修改画笔属性，并启动绘画
    canvasMouseDown = (e) => {
        this.state.cxt.beginPath();
        const canvas = this.state.c;
        const cxt = this.state.cxt;
        const rect = canvas.getBoundingClientRect();
        this.setState({
            preX: e.clientX - rect.left * (canvas.width / rect.width),
            preY: e.clientY - rect.top * (canvas.height / rect.height),
        })
        cxt.shadowBlur = this.state.shadowBlur;
        if(this.state.strokeColor.hex){
            cxt.shadowColor = this.state.strokeColor.hex;
            cxt.strokeStyle = this.state.strokeColor.hex;
            cxt.fillStyle = this.state.strokeColor.hex;
        }else {
            cxt.shadowColor = this.state.strokeColor;
            cxt.strokeStyle = this.state.strokeColor;
            cxt.fillStyle = this.state.strokeColor;
        }

        cxt.lineWidth = this.state.penSize;

        this.setState({
            flag:true,
        });
        let preData = this.state.cxt.getImageData(0,0,1200,700);
        this.state.preDrawAry.push(preData);
    };

    canvasMouseUp = () => {
        this.setState({
            flag : false,
        });
        let preData = this.state.cxt.getImageData(0,0,1200,700);
        this.state.preDrawAry.push(preData);
    };



    canvasMouseOut = () => {
        this.setState({
            flag: false,
        })
    };

    clearCxt = () => {
        const c = this.state.c;
        this.state.cxt.clearRect(0,0,c.width,c.height);
    };

    addImage = () => {
        this.state.cxt.drawImage(this.state.img,0,0);
        console.log("填充图片")
    };

    render(){
        return(
            <div className="myDiv">
                <Layout style = {{backgroundColor:'rgba(255,255,255,0)'}}>
                    <Layout >
                        <Header style = {{backgroundColor:'rgba(255,255,255,0)'}}>
                            <h1>HTML5 canvas 画板</h1>
                        </Header>
                    </Layout>


                    <Layout style = {{backgroundColor:'rgba(255,255,255,0)'}}>
                        <Sider style = {{backgroundColor:'white'}}>

                            <Row  style={{ paddingTop: 10 ,paddingBottom: 10}}>
                                <Col offset={2} span={9}>
                                    <Button onClick = {this.clearCxt}>清空画布</Button>
                                </Col>
                                <Col offset={2} span={9}>
                                    <Button onClick = {this.addImage}>填充图片</Button>
                                </Col>
                            </Row>
                            <hr/>
                            <Row style={{ paddingTop: 10 }}>
                                <Col offset={3} span={8}>
                                    <label >Pen  Size :</label>
                                </Col>
                                <Col offset={1} span={12}>
                                    <InputNumber min={1} max={20} defaultValue={1} onChange={this.penSizeChange} />
                                </Col>
                            </Row>

                            <Row style={{ paddingTop: 10 }}>
                                <Col offset={3} span={8}>
                                    <label >ShadowBlur:</label>
                                </Col>
                                <Col offset={1} span={12}>
                                    <InputNumber min={0} max={10} defaultValue={0} onChange={this.shadowBlurChange} />
                                </Col>
                            </Row>

                            <Row style={{ paddingTop: 10 }}>
                                <Col offset={2} span={20}>
                                    <Button onClick={this.showColorPicker} style = {{width:'100%'}}>Pick Color</Button>
                                    <Modal
                                        width = "260"
                                        title = "Color Picker"
                                        visible = {this.state.displayColorPicker}
                                        footer = {null}
                                        closable = {false}
                                        onCancel = {this.closeColorPicker}
                                    >
                                        <ColorPicker onChange={this.changeColor}
                                                     ref="colorPicker"
                                                     color = {this.state.strokeColor}
                                                     onClose={this.closeColor}
                                                     defaultColor='#F14E4E'
                                                     type="sketch"
                                        />
                                    </Modal>
                                </Col>
                            </Row>
                            <Row style={{ paddingTop: 10 }}>
                                <RadioGroup onChange={this.changeDrawType} defaultValue="line">
                                    <RadioButton value="line">画笔</RadioButton>
                                    <RadioButton value="rect">长方形</RadioButton>
                                    <RadioButton value="c" disabled>圆形</RadioButton>
                                </RadioGroup>
                            </Row>
                            <Row style={{ paddingTop: 10 }}>

                            </Row>

                        </Sider>
                        <Content>
                            <canvas ref="myCanvas" height="700px" width="1200px"  style = {{backgroundColor:'white'}}
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
        )
    }
}


export default MyCanvas;