'use strict';

var React = require('react-native');
var {
    ListView,
    } = React;
var Item = require('../../comp/utils/item')
var Space = require('../../comp/utilsUi/space')
var UserStore = require('../../framework/store/userStore');
var NavBarView = require('../../framework/system/navBarView')
var PointDetail = require('./pointDetail')
var KeyPoint = React.createClass({
    getInitialState: function () {
        var ds = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        var result = UserStore.getKeyPoint();
        return {
            dataSource: ds.cloneWithRows(result),
        }
    },
    detail(item){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                comp: PointDetail,
                param: {
                    title: item.title,
                    content: item.content
                }
            })
        }
    },

    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="热点问题">
                <Space top={false}/>
                <ListView dataSource={this.state.dataSource} renderRow={this.renderList}/>
            </NavBarView>

        );
    },

    renderList: function (item) {
        return (
            <Item func={()=>this.detail(item)}
                  desc={item.title}
                  img={false}
                  detailEnable={false}
            />
        )
    },
});
module.exports = KeyPoint;