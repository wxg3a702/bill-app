'use strict';

var React = require('react-native');
var Space = require('../../comp/utils/space')
var Item = require('../../comp/utils/item')
var NavBarView = require('../../framework/system/navBarView')
var KeyPoint = require('./keyPoint')
var Instruction = require('./instruction')
var HelpCenter = React.createClass({
    toOther(name){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                comp: name,
            })
        }
    },
    render(){
        return (
            <NavBarView navigator={this.props.navigator} title="帮助中心">
                <Space top={false}/>
                <Item func={()=>this.toOther(Instruction)} desc="使用手册" img={false}/>
                <Item func={()=>this.toOther(KeyPoint)} desc="热点问题" img={false}/>
            </NavBarView>
        )
    }
})
module.exports = HelpCenter