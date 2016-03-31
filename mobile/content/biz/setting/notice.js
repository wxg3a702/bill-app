'use strict'
var React = require('react-native')
var {
    View,
    Text,
    Switch,
    StyleSheet
}=React
var AppStore = require('../../framework/store/appStore');
var NavBarView = require('../../framework/system/navBarView')
var Space = require('../../comp/utilsUi/space')
var CommonAction = require('../../framework/action/commonAction');
var Notice = React.createClass({
    getStateFromStores(){
        return {
            revBillMessage: AppStore.getRevBillMessage(),
            newsMessage: AppStore.getNewsMessage()
        }
    },
    componentDidMount() {
        AppStore.addChangeListener(this._onChange);
    },
    _onChange: function () {
        this.setState(this.getStateFromStores());
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    setNewsValue(text, type){
        CommonAction.changeSwitch({
                value: text,
                type: type
            },
            ()=> {}
        )
        // alert(text + 'ss' + type)
    },
    render(){
        return (
            <NavBarView navigator={this.props.navigator} title="系统通知设置">
                <Space top={false}/>
                <View style={styles.layout}>
                    <View>
                        <Text style={{fontSize:18}}>收到的票据</Text>
                        <Text style={{fontSize:15,color:'#cccccc',marginTop:8}}>收到的票据相关业务通知</Text>
                    </View>
                    <Switch value={this.state.revBillMessage}
                            onValueChange={(text)=>this.setNewsValue(text,'revBillMessage')}/>
                </View>
                <View style={styles.layout}>
                    <View>
                        <Text style={{fontSize:18}}>行业动态</Text>
                        <Text style={{fontSize:15,color:'#cccccc',marginTop:8}}>为您精选的行业动态和通知</Text>
                    </View>
                    <Switch value={this.state.newsMessage}
                            onValueChange={(text)=>this.setNewsValue(text,'newsMessage')}/>
                </View>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    layout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        height: 60,
        backgroundColor: 'white',
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1
    }
})
module.exports = Notice