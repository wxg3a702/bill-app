'use strict';

var React = require('react-native');
var {
    StyleSheet,
    TextInput,
    } = React;
var NavBarView = require('../../framework/system/navBarView')
var RightTopButton = require('../../comp/utilsUi/rightTopButton')
var UserAction = require("../../framework/action/userAction")
var Alert = require('../../comp/utils/alert');
var Advice = React.createClass({
    getInitialState(){
        return {
            opinion: '',
            rightTopButtonColor: '#cccccc',
        }
    },
    submit(){
        //文本筛选
        //var reg = /^[^/~^*-=+*:;☆()]+$/g;

        //this.setState({
        //    opinion:this.utf16toEntities(this.state.opinion)
        //});

        var reg = /^[\w\u4e00-\u9fa5\u0000-\u00FF\uFF00-\uFFFF]+$/g;

        if (this.state.opinion.length == 0) {

        } else if (this.state.opinion.length > 300) {
            Alert('请输入300字以内意见')
        } else if (!reg.test(this.state.opinion)) {
            Alert('请输入正确的中英文文本')
        } else {
            const { navigator } = this.props;
            UserAction.feedbackOpinion(
                {
                    opinion: this.state.opinion
                },
                function () {
                    Alert("意见提交成功", ()=> {
                        navigator.popToTop()
                    })
                }.bind(this)
            )
        }

    },

    button()
    {
        return (
            <RightTopButton func={this.submit} content="提交" color={this.state.rightTopButtonColor}/>
        )
    }
    ,

    textChange: function (text) {
        if (text.length == 0) {
            this.setState({
                rightTopButtonColor: '#cccccc',
                opinion: text,
            });

        } else if (text.length > 300) {
            this.setState({
                rightTopButtonColor: 'red',
                opinion: text,
            });
        } else {
            this.setState({
                rightTopButtonColor: '#44bcbc',
                opinion: text,
            });
        }
    }
    ,

    render: function () {
        return (
            <NavBarView navigator={this.props.navigator}
                        title="意见反馈"
                        contentBackgroundColor='#f0f0f0'
                        actionButton={this.button()}>
                <TextInput placeholder="尊敬的用户，您遇到什么问题，想要什么功能，都可以在这里向我们反馈，我们需要你们的帮助" autoCapitalize="none"
                           style={{borderRadius:5,marginTop:10,fontSize: 14,paddingHorizontal:10,paddingTop:5,marginHorizontal:10,height:160,borderColor:'#cccccc',backgroundColor:'white'}}
                           multiline={true}
                           maxLength={300}
                           onChangeText={(text) => this.textChange(text)}/>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({})
module.exports = Advice;