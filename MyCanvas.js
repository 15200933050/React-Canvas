import React, { Component } from 'react';
import {Button, Col, Layout, Row, Select} from 'antd';
import './canvas.css';
import ColorPicker from 'react-color';
const { Header, Footer, Sider, Content } = Layout;

class MyCanvas extends Component{

    constructor(props) {
        super(props);
        this.state = {
            penSize: 2,
            strokeColor: '#2f46f7',
            shadowColor: '#2f46f7',
            flag: false,
            c: null,
            cxt: null,
        };
    }

    componentDidMount() {

        this.setState({
            c: this.refs.myCanvas,
            cxt: this.refs.myCanvas.getContext("2d"),
        });

    }

    selectChange = (value) => {
        this.setState({
            penSize: value,
        })
    }

    changeColor = (colors) =>{
        this.setState({
            strokeColor: colors.hex,
            shadowBlur: colors.hex,
        });
        console.log(colors.hex);
        console.log(colors);
    }

    closeColor = (colors) => {
        console.log(colors);
    }

    canvasMouseMove = (e) => {
        const cxt = this.state.cxt;
        const canvas = this.state.c;
        const rect = canvas.getBoundingClientRect();
        if(this.state.flag){
            let x = e.clientX - rect.left * (canvas.width / rect.width);
            let y = e.clientY - rect.top * (canvas.height / rect.height);
            console.log(x + ' , ' + y);
            cxt.lineTo(x,y);
            cxt.stroke();
        }
    }

    canvasMouseDown = () => {
        this.state.cxt.beginPath();
        const cxt = this.state.cxt;
        cxt.lineWidth = this.state.penSize;
        cxt.shadowBlur = 2;
        cxt.shadowColor = this.state.shadowColor;
        cxt.strokeStyle = this.state.strokeColor;
        this.setState({
            flag:true,
        })
    }

    canvasMouseUp = () => {
        this.setState({
            flag : false,
        })
    }

    canvasMouseOut = () => {
        this.setState({
            flag: false,
        })
    }

    clearCxt = () => {
        const c = this.state.c;
        this.state.cxt.clearRect(0,0,c.width,c.height);
    }

    addImage = () => {
        const img= new Image();
        img.src = "./image/58.png";
        this.state.cxt.drawImage(img,10,10);
        console.log("填充图片")
    }

    render(){
        return(
            <div>
                <Layout>
                    <Header>
                        <h1 >Canvas Demo</h1>
                        <hr />
                    </Header>
                    <Layout>
                        <Sider style = {{backgroundColor:'white'}}>

                            <Row  style={{ paddingTop: 10 }}>
                                <Col offset={2} span={9}>
                                    <Button onClick = {this.clearCxt}>清空画布</Button>
                                </Col>
                                <Col offset={2} span={9}>
                                    <Button onClick = {this.addImage}>填充图片</Button>
                                </Col>
                            </Row>
                            <Row style={{ paddingTop: 10 }}>
                                <Col offset={2} span={6}>
                                    <label>penSize:</label>
                                </Col>
                                <Col offset={1} span={13}>
                                    <Select
                                        showSearch
                                        style={{ width: "100%" }}
                                        placeholder="Select a penSize"
                                        optionFilterProp="children"
                                        onChange={this.selectChange}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        <Option value="2">2</Option>
                                        <Option value="4">4</Option>
                                        <Option value="6">6</Option>
                                        <Option value="8">8</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row style={{ paddingTop: 10 ,width:200  }}>
                                <ColorPicker onChange={this.changeColor}
                                             onClose={this.closeColor}
                                             type="sketch"
                                />
                            </Row>

                        </Sider>
                        <Content>
                            <canvas ref="myCanvas" height="700px" width="1200px"
                                    onMouseDown={this.canvasMouseDown}
                                    onMouseMove={this.canvasMouseMove}
                                    onMouseUp={this.canvasMouseUp}
                                    onMouseOut={this.canvasMouseOut}
                            >
                                Your browser does not support the canvas element.
                            </canvas>
                        </Content>
                    </Layout>
                    <Footer>
                        <hr />
                    </Footer>
                </Layout>
            </div>
        )
    }
}


export default MyCanvas;