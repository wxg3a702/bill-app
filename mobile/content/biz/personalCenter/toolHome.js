'use strict';

var React = require('react-native');
var Space = require('../../comp/utils/space')
var Item = require('../../comp/utils/item')
var NoRisk = require('./noRisk')
var NavBarView = require('../../framework/system/navBarView')
var Calculator = require('./calculator')
var ToolHome = React.createClass({
    toOther(name){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                comp: name,
                param: {
                    desc: '风险票据查询'
                }
            })
        }
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="工具" contentBackgroundColor='#f0f0f0'>
                <Space top={false}/>
                <Item func={()=>this.toOther(Calculator)} desc="贴现利率计算器"
                      imgPath={require('../../image/user/calculator.png')}/>

                <Item func={()=>this.toOther(NoRisk)} desc="风险票据查询"
                      imgPath={require('../../image/user/riskNotesSearch.png')}/>

            </NavBarView>
        )
    }
})
module.exports = ToolHome;