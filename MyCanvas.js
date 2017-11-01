import React, { Component } from 'react';
import {Button, Col, Layout, Row, Select, Modal, InputNumber} from 'antd';
import './canvas.css';
import ColorPicker from 'react-color';
const { Header, Footer, Sider, Content } = Layout;
const Option = Select.Option;

class MyCanvas extends Component{

    constructor(props) {
        super(props);
        this.state = {
            penSize: 2,
            strokeColor: '#000000',
            flag: false,
            shadowBlur: 1,
            c: null,
            cxt: null,
            img: new Image(),
            displayColorPicker: false
        };
    };

    componentDidMount() {

        this.setState({
            c: this.refs.myCanvas,
            cxt: this.refs.myCanvas.getContext("2d"),
        });
        this.state.img.src = "./image/58.png";
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

    showColorPicker= () => {
        this.setState({
            displayColorPicker: true,
        })
    };
    closeColorPicker= () => {
        this.setState({
            displayColorPicker: false,
        })
    };

    canvasMouseMove = (e) => {
        const cxt = this.state.cxt;
        const canvas = this.state.c;
        const rect = canvas.getBoundingClientRect();
        if(this.state.flag){
            let x = e.clientX - rect.left * (canvas.width / rect.width);
            let y = e.clientY - rect.top * (canvas.height / rect.height);
            cxt.lineTo(x,y);
            cxt.stroke();
        }
    };

    //鼠标在画布按下时，根据state修改画笔属性，并启动绘画
    canvasMouseDown = () => {
        this.state.cxt.beginPath();
        const cxt = this.state.cxt;
        cxt.shadowColor = this.state.strokeColor.hex;
        cxt.strokeStyle = this.state.strokeColor.hex;
        cxt.lineWidth = this.state.penSize;
        cxt.shadowBlur = this.state.shadowBlur;

        this.setState({
            flag:true,
        })
    };

    canvasMouseUp = () => {
        this.setState({
            flag : false,
        })
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
        this.state.cxt.drawImage(this.state.img,10,10);
        console.log("填充图片")
    };

    render(){
        return(
            <div>
                <Layout style = {{backgroundColor:'rgba(255,255,255,0)'}}>
                    <Layout style = {{backgroundColor:'rgba(255,255,255,0)'}}>
                        <Header >
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
                                    <InputNumber min={1} max={10} defaultValue={1} onChange={this.shadowBlurChange} />
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
                                                     color = {this.state.strokeColor}
                                                     onClose={this.closeColor}
                                                     type="sketch"
                                        />
                                    </Modal>
                                </Col>


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
                    {/*<Footer>*/}
                    {/*</Footer>*/}
                </Layout>
            </div>
        )
    }
}


export default MyCanvas;