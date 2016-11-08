'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  Text,
  Dimensions,
  View,
  ListView,
  Image
  } = React;
var Adjust = require('../../comp/utils/adjust')
var CompCertifyCopies = require('./compCertifyCopies');
var {height, width} = Dimensions.get('window');
var Space = require('../../comp/utilsUi/space')
var BottomButton = require('../../comp/utilsUi/bottomButton')
var VIcon = require('../../comp/icon/vIcon')
var AppStore = require('../../framework/store/appStore');
var CompStore = require('../../framework/store/compStore');
var CompAction = require("../../framework/action/compAction")
var NavBarView = require('../../framework/system/navBarView')
var certificateState = require('../../constants/certificateState');
var _ = require('lodash')
var Swipeout = require('react-native-swipeout')
var Alert = require('../../comp/utils/alert');

var GiftedListView = require('../../comp/listView/GiftedListView');

var CompCertification = React.createClass({
  getStateFromStores(){
    let i = 0;
    var orgBean = CompStore.getCertifiedOrgBean();
    let certifiedCon = [];
    let auditingCon = [];
    let rejectedCon = [];
    orgBean.map((item, index)=> {
      if (item.status == 'CERTIFIED') {
        certifiedCon.push(item);
      } else if (item.status == 'AUDITING') {
        auditingCon.push(item);
      } else {
        rejectedCon.push(item);
      }
    });
    let bean = certifiedCon.concat(auditingCon).concat(rejectedCon);
    return bean;
  },

  getInitialState: function () {
    return {
      dataSource: this.getStateFromStores()
    };
  },

  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    // this.setState(this.getStateFromStores());
    if (this.refs.certGiftedListView) {
      // this.refs.certGiftedListView._refresh();
      this.refs.certGiftedListView._refreshWithoutSpinner();
    }
  },
  toOther(item){
    this.props.navigator.push({
      comp: CompCertifyCopies,
      param: {
        item: item,
      }
    })
  },

  returnRow(data){
    var swipeoutBtns = [
      {
        text: '删除',
        backgroundColor: 'red',
        onPress(){
          if (data.status == 'AUDITING') {
            Alert('认证中的企业不能删除')
          } else {
            Alert('您正在试图删除一条企业信息，确认操作后，您将无法继续查看该企业所有的业务信息，确认删除吗？',
              ()=> {
                CompAction.deleteOrg(
                  {orgId: data.id},
                  ()=>Alert("删除成功!"),
                  ()=> {
                  }
                )
              },
              function () {
              }
            )
          }
        }
      }
    ];
    console.log(data.status);

    const certificateStateObj = certificateState[data.status];
    if (!certificateStateObj) {
      return (<View />);
    }
    return (
      <Swipeout right={swipeoutBtns} autoClose={true}>
        <TouchableHighlight onPress={()=>this.toOther(data)}>
          <View style={styles.item} removeClippedSubviews={true}>
            <View style={{width:width,flexDirection:'row',alignItems:'center'}}>
              <Text style={{width:width-Adjust.width(90)}}>
                {data.status == 'CERTIFIED' ? data.stdOrgBean.orgName : data.orgName}
              </Text>
              <Text style={{width:Adjust.width(50),color:certificateStateObj.color}}>
                {certificateStateObj.desc}
              </Text>
              <VIcon/>
            </View>
          </View>
        </TouchableHighlight>
      </Swipeout>
    )
  },

  /**
   * Will be called when refreshing
   * Should be replaced by your own logic
   * @param {number} page Requested page to fetch
   * @param {function} callback Should pass the rows
   * @param {object} options Inform if first load
   */
  _onFetch(page = 1, callback, options) {
    let bean = this.getStateFromStores()

    setTimeout(() => {
      callback(bean, {
        allLoaded: true, // the end of the list is reached
      });
    }, 1000); // simulating network fetching

    this.setState({
      dataSource: bean
    });
  },

  returnList(){
    if (this.state.dataSource.length == 0) {
      return (
        <View style={{flex:1,alignItems:'center'}}>
          <Image style={{marginTop:100}} source={require("../../image/company/no_company.png")}/>
          <Text style={{marginTop:20,color:"#CCCCCC"}}>点击下方按钮进行"企业认证"哦</Text>
        </View>
      )
    } else {
      return (
        <GiftedListView
          ref="certGiftedListView"

          rowView={this.returnRow}
          onFetch={this._onFetch}
          firstLoader={true} // display a loader for the first fetching
          pagination={true} // enable infinite scrolling using touch to load more
          refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
          withSections={false} // enable sections

          style={{flex: 1}}
        />
      )
    }
  },
  returnTitle(){
    if (!_.isEmpty(this.state.dataSource)) {
      return <Space backgroundColor="#f0f0f0" top={false}/>
    }
  },
  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} title="企业认证">
        {this.returnTitle()}
        {this.returnList()}
        <BottomButton func={()=>this.toOther('')} content="新增企业信息"/>
      </NavBarView>
    )
  }
})
var styles = StyleSheet.create({
  bottom: {
    padding: 7, backgroundColor: '#f7f7f7', borderTopWidth: 1, borderTopColor: '#cccccc', opacity: 0.9
  },
  borderBottom: {
    borderBottomWidth: 1, borderColor: '#c8c7cc'
  },
  radius: {
    borderRadius: 6
  },
  button: {
    backgroundColor: '#44bcbc',
    height: 47,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    height: 50,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#c8c7cc',
    width: width,
  }
})
module.exports = CompCertification;