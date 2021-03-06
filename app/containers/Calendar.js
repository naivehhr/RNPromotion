import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  PanResponder,
  UIManager,
  LayoutAnimation,
  Platform,
  Animated,
  Easing,
  TouchableOpacity,
  Alert,
  InteractionManager
} from 'react-native';
const moment = require('moment');
const o = Dimensions.get("window")
const W = o.width
const H = o.height
const weekList = ['日','一','二','三','四','五','六']
const weekListNum = [0, 1, 2, 3, 4, 5, 6] // 星期日 到 星期一
// const eventDay = {1: [1,2,3,4], 13: [3,4] }//模拟某天的事件
// const eventDay = [{1: [1,2,3,4]}, {13: [3,4]} ]//模拟某天的事件
import { connect } from 'react-redux'
const customerAnimation = {
  duration: 100,
    create: {
      type: LayoutAnimation.Types.linear,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.spring,
      springDamping: 0.4,
    },
    delete: {
      type: LayoutAnimation.Types.linear,
      property: LayoutAnimation.Properties.opacity,
    },
}
class Calendar extends Component {
  constructor() {
    super()
    this.state = {
      currentyMoment: moment(),
      toDay: '', // 今天的日期 YYYY-MM-DD
      day: '', //当天的日期
      week: 1, //当前是周几
      totalDays: 0, //当月天数
      firstDayWeek: 0,
      dateList: [], //日期数组
      compareList: [], //存储日期和其选中状态
      selectDay: 1,
      left: 0,
      events: []
    }

    // console.log(moment('2004').month(1).startOf('month').format('YYYY-MM-DD'))
    // console.log(moment('2004').month(1).endOf('month').format('YYYY-MM-DD'))
  }

  componentWillMount() {
    //为啥构造函数中拿不到props
    if(this.props.route){
      this.props.route.leftBtn = '返回首页'
      this.props.route.title = '日历';
    }
    this._panResponder = PanResponder.create({
     onStartShouldSetPanResponder: () => true,
     onMoveShouldSetPanResponder: ()=> true,
     onPanResponderGrant: ()=>{
       this._left = this.state.left
     },
     // NOTE: 那这个Scrollview也可以的
     onPanResponderMove: (evt,gs)=>{
      //  console.log(gs.dx)
       this.setState({
         left: this._left + gs.dx
       })
     },
     onPanResponderRelease: (evt,gs)=>{
      //  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
       LayoutAnimation.easeInEaseOut();
       const dx = gs.dx
       if(dx < -50) {
         console.log('应该到下一页了');
         this._changeMonth('previous')
       } else if(dx > 50) {
         console.log('回到上一页');
         this._changeMonth('next')
       } else {
         console.log('恢复原状');
       }
     }
   })
   this.getDate(moment())
   this.setState({
     events: this.makeEventArr()
   })
  }

  /**
   * 获得当前月份的的很多数据
   */
  getDate(_moment) {
    // let now = _moment.format('YYYY-MM-DD');
    // console.log(now);
    let now = _moment.format('YYYY-MM-DD'); //当前日期
    let week = _moment.format('d') //当前是周几
    let days = _moment.daysInMonth() //当前月天数
    let day = _moment.format('D') //当前月当天的日期
    let firstDayWeek = _moment.subtract(6, 'days').format('d') // 当月第一天是星期几
    _moment.add(6, 'days')
    this.setState({
      toDay: now, // 今天的日期
      day: day, //今天的日
      selectDay: day, // 这里会影响偏移两个月的默认选中日期
      totalDays: days,
      week: week, // 星期几
      currentyMoment: _moment
    })
    this.setState({
      dateList: this.calculate(firstDayWeek,days),
      compareList: this.makeData()
    })
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      let days = moment().daysInMonth() //当前月天数
      let firstDayWeek = moment().subtract(6, 'days').format('d') // 当月第一天是星期几
      // this.makeData()
      this.setState({
        dateList: this.calculate(firstDayWeek,days),
        compareList: this.makeData(),
        events: this.makeEventArr()
      })
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    })
  }

  componentWillUpdate() {
    // 以后这样写
    // this.setState((state) => ({views: [...state.views, {}]}));
    // LayoutAnimation.easeInEaseOut();
    LayoutAnimation.configureNext(customerAnimation);
  }


  //设置选中日
  makeData(selectDay = this.state.selectDay) {
    const {totalDays, events} = this.state
    let map = new Map()
    for(let i = 1; i <= totalDays; i++){
      let key = {}
      key.isSelect = false
      //添加当天事件
      for(let [k, v] of events) {
        if(k == i) {
          key.event = v
        }
      }

      //添加当天选中状态
      if(selectDay == i) {
        key.isSelect = true
      }
      // console.log(key);
      map.set(i, key)
    }
    return map
  }

  makeEventArr() {
    // let c = [1,2].map((d, i)=>{
    // })
    let map = new Map()
    map.set(1,[1,2,3,4])
    map.set(12,[3,4])
    return map
  }
  /**
   * 计算日期数组
   * @param  {[type]} firstDayWeek 本月第一天是星期几
   * @param  {[type]} totalDays    本月多少天
   * @return {[type]}              [description]
   */
  calculate(firstDayWeek = 3, totalDays = 30){
    let currentDay = 1 //一号
    let resultList = []
    let autokey = -100
    //前面追加空白
    for(let i = 0; i < firstDayWeek; i++) {
      let map = new Map()
      map.set(autokey, '填空')
      resultList.push(map)
      autokey -= 1
    }
    while (currentDay <= totalDays) {
      let tList = weekListNum.slice(firstDayWeek, 7)
      tList.map((item, index) => {
        let map = new Map()
        //后面追加空白
        if(currentDay > totalDays) {
          map.set(-item, '填空')
        } else {
          map.set(item, currentDay)
        }
        currentDay++
        resultList.push(map)
      })
      firstDayWeek = 0 //计算用，重置为星期日
    }
    let splitArr = []
    for(let i=0,len=resultList.length;i<len;i+=7){
       splitArr.push(resultList.slice(i,i+7));
    }
    return splitArr
  }

  _itemOnPress(date) {
    // LayoutAnimation.linear();
    this.setState({
      selectDay: date,
      compareList: this.makeData(date)
    })
  }

  _changeMonth(type) {
    // LayoutAnimation.linear();
    let _moment= this.state.currentyMoment
    switch (type) {
      case 'previous':
        _moment.subtract(1, 'months');
        break;
      case 'next':
        _moment.add(1, 'months');
        break;
      default:
        console.log('哪里来的月份');
    }
    this.getDate(_moment)
  }


  renderRow() {
    const {
      dateList,
      compareList
    } = this.state
    let dataList = dateList
    let _lenght = dataList.length
    let keyNum = 0 //仅为view key
    if(_lenght <= 0) true
    let tempView = []
    for(let i = 0; i < _lenght; i++){
      let _view = []
      dataList[i].forEach((item, index) => {
        let key = 'row' + index.toString()
        item.forEach((v, k) => {
          // console.log('v===',v);
          // console.log('选中状态==', compareList.get(v));
          t = (
            <View  key={key} style={{flex: 1,alignItems: 'center'}}>
               <Item status={compareList.get(v)} onPress={this._itemOnPress.bind(this)} date={v} isNull={parseInt(k) < 0 ? true : false}/>
            </View>
          )
         _view.push(t)
        })
      })
      let c = (
        <View key={'row' + keyNum} style={{flexDirection:'row', flex: 1,height: 40}}>
          {_view}
        </View>
      )
      tempView.push(c)
      keyNum++
    }
    let p = tempView.length
    return (
      <View style={{
        width: W,
        height: 40 * p,
        backgroundColor: 'white',
      }}
      {...this._panResponder.panHandlers}
      >
        {tempView}
      </View>
    )
  }

  render() {
    const {
      toDay,
      dataList,
      events,
      selectDay
    } = this.state
    // console.log('dataList==',dataList);

    let weekView = weekList.map((item, index) => {
      let key = 'week' + index.toString()
      return (
        <View key={key} style={{flex: 1, alignItems: 'center'}}>
          <Text>{item}</Text>
        </View>
      )
    })

    let eventView = []
    for(let [k, v] of events) {
      if(k == selectDay) {
        eventView = v.map((item, i) => {
          let _color = '#FFB5C5'
          switch (item) {
            case 1:
              _color = '#FFEC8B'
            break;
            case 2:
              _color = '#FF7F24'
              break;
            case 3:
              _color = '#FFB5C5'
              break;
            case 4:
              _color = '#121212'
              break;
            default:

          }
          return (
            <View key={selectDay + _color} style={{
              width: 5,
              height: 5,
              backgroundColor: _color,
              borderRadius: 2.5,
              margin: 0.5,
              marginTop: 10
            }} />
          )
        })
      }
    }
    return (
      <ScrollView style={styles.container}>
        <View style={{
              height: 40,
              backgroundColor: 'white',
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: "black",
              shadowOpacity: 0.8,
              shadowRadius: 2,
              shadowOffset: {
                height: -1,
                width: 0
              }
            }}
          >
          <TouchableOpacity style={{flex: 1, alignItems: 'flex-start', marginLeft: 10}} onPress={this._changeMonth.bind(this, 'previous')}>
            <Text>上一月</Text>
          </TouchableOpacity>
          <View style={{flex: 3, alignItems: 'center'}}>
            <Text>{toDay}</Text>
          </View>
          <TouchableOpacity style={{flex: 1, alignItems: 'flex-end', marginRight: 10}} onPress={this._changeMonth.bind(this, 'next')}>
            <Text>下一月</Text>
          </TouchableOpacity>
        </View>
        <View>
          <View style={{
                width: W,
                height: 30,
                marginTop:2,
                backgroundColor: 'white',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
            {weekView}
          </View>
          {this.renderRow()}
        </View>
        <View style={{margin: 10}}>
          <Text>事件类型：</Text>
          {eventView}
        </View>
      </ScrollView>
    )
  }
}

class Item extends Component {
  constructor() {
    super()
    this.state = {
      isSelect: false
    }
  }

  componentDidMount() {
    // UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  _onPress(date) {
    // Alert.alert(this.props.date + '')
    // this.setState({isSelect: !this.state.isSelect})
    // LayoutAnimation.spring();
    if(date == '填空') return
    this.props.onPress(date)
    // console.log(this.props);
  }

  componentWillUpdate() {
    // LayoutAnimation.linear();
  }
  // TODO:
  // 添加点击回调 是否可以点击 点击的效果
  // 传入具体时间 YYYY-MM-DD 这个可以父组件传递过来
  //
  render() {
    const {isNull, date, onPress, status} = this.props
    // const {isSelect} = this.state
    // let c = [...date]

    let _style = styles.itemDefault
    let hasEvent = false
    let eventView
    if(status && status.isSelect) _style = styles.itemSelect
    if(status && status.event && status.event.length > 0) {
      hasEvent = true
      eventView = status.event.map((item, i) => {
        let _color = '#FFB5C5'
        switch (item) {
          case 1:
            _color = '#FFEC8B'
          break;
          case 2:
            _color = '#FF7F24'
            break;
          case 3:
            _color = '#FFB5C5'
            break;
          case 4:
            _color = '#121212'
            break;
          default:

        }
        return (
          <View key={_color} style={{
              width: 5,
              height: 5,
              backgroundColor: _color,
              borderRadius: 2.5,
              margin: 0.5
            }} />
        )
      })
    }
    return (
      <TouchableOpacity
        style={_style}
        onPress={this._onPress.bind(this,date)}
        activeOpacity={0.9}
      >
      {
        isNull ? null :
        <View style={{alignItems: 'center'}}>
          <Text >{date}</Text>
          {
            !hasEvent? null :
            <View style={{flexDirection: 'row'}}>
              {eventView}
            </View>
          }
        </View>
      }

      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:W,
    marginTop: 20,
    backgroundColor: '#F5FCFF',
    marginTop: 64
  },
  itemDefault: {
    borderRadius: 15,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemSelect: {
    borderRadius: 15,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    shadowColor: "black",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  }
});

const mapStateToProps = state => {
  // console.log(state);
  return {
    tabbar : state.tabbar,
    nav: state.nav
  }
}
module.exports = connect()(Calendar)
// Calendar.Header = Header
// exports.title = 'Layout Animation';
// module.exports = Item

// export let Item = Item
