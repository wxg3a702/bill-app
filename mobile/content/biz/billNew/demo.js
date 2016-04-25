'use strict'
var React = require('react-native');
var {
    Dimensions,
    Image,
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Platform,
} = React;

var {height, width} = Dimensions.get('window');
var ViewPager = require('react-native-viewpager');
var BillAction = require('../../framework/action/billAction');

var PAGES = [
    {img: require('../../image/bill/teach1.png'), text: '跳过'},
    {img: require('../../image/bill/teach2.png'), text: '跳过'},
    {img: require('../../image/bill/teach3.png'), text: '跳过'},
    {img: require('../../image/bill/demo4.png'), text: '跳过'},
    {img: require('../../image/bill/demo5.png'), text: '跳过'},
    {img: require('../../image/bill/teach4.png'), text: '跳过'},
    {img: require('../../image/bill/teach5.png'), text: '跳过'},
    {img: require('../../image/bill/teach6.png'), text: '结束'},
];

var dataSource = new ViewPager.DataSource({
    pageHasChanged: (p1, p2) => p1 !== p2,
});

var Demo = React.createClass({
    getInitialState(){
        return {
            dataSource: dataSource.cloneWithPages(PAGES),
        }
    },

    componentDidMount() {
        BillAction.setDemoFlag();
    },

    _renderPage: function (data:Object) {
        return (
            <Image style={styles.page} resizeMode="stretch" source={data.img}>
                <View style={{justifyContent:'flex-end',flexDirection:'row',marginTop:28}}>
                    <TouchableOpacity onPress={()=>this.props.navigator.pop()}>
                        <Text style={styles.layout}>{data.text}</Text>
                    </TouchableOpacity>
                </View>
            </Image>
        );
    },

    render(){
        return (
            <ViewPager
                style={this.props.style}
                dataSource={this.state.dataSource}
                renderPage={this._renderPage}
                onChangePage={this._onChangePage}
                isLoop={false}
                //locked={true}
                autoPlay={false}/>
        );
    }
});
var styles = StyleSheet.create({
    layout: {
        color: '#ff5b58',
        marginRight: 10,
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        fontSize: 16,
        borderWidth: 2,
        borderColor: '#ff5b58'
    },
    page: {
        width: width,
        height: Platform.OS === 'ios' ? height : height-25,
    },
})

module.exports = Demo;
