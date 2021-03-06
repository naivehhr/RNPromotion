
import React, {
    Component,
} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Alert,
    ScrollView,
    ListView,
    Image,
    ActivityIndicator,
    ProgressBarAndroid,
    ActivityIndicatorIOS,
    Platform,
    Animated,
    Easing,
    LayoutAnimation
} from 'react-native'

import TimerEnhance from 'react-native-smart-timer-enhance'
import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview'



class PullToRefreshListViewDemo extends Component {

    // 构造
      constructor(props) {
        super(props);

        this.state = {
            dataSource: [],
            rotation: new Animated.Value(0),
            rotationNomal: new Animated.Value(0),
        }
        this.key = false
    }

    componentDidMount () {
      this.initAnimated()
      this._pullToRefreshListView.beginRefresh()
    }

    componentWillUpdate() {
      // 以后这样写
      // this.setState((state) => ({views: [...state.views, {}]}));
      // LayoutAnimation.easeInEaseOut();
      // LayoutAnimation.configureNext(customerAnimation);
    }

    initAnimated() {
      this._an = Animated.timing(this.state.rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
      }).start((r) => {
        this.state.rotation.setValue(0)
        this.initAnimated()
      })
    }

    //Using ScrollView
    render() {
        return (
            <PullToRefreshListView
                ref={ (component) => this._pullToRefreshListView = component }
                contentContainerStyle={{backgroundColor: 'transparent', }}
                style={{backgroundColor: 'white' ,marginTop: Platform.OS == 'ios' ? 64 : 56, }}
                renderHeader={this._renderHeader}
                renderFooter={this._renderFooter}
                onRefresh={this._onRefresh}
                onLoadMore={this._onLoadMore}
                //pullUpDistance={35}
                //pullUpStayDistance={50}
                //pullDownDistance={35}
                //pullDownStayDistance={50}
            >
                {
                    this.state.dataSource.map( (item, index) => {
                        return (
                            <View key={`item-${index}`} style={{overflow: 'hidden', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ccc', justifyContent: 'center',}}>
                                <Text style={{padding: 30}}>{item.text}</Text>
                            </View>
                        )
                    } )
                }
            </PullToRefreshListView>
        )
    }


    _renderHeader = (viewState) => {
        let {pullState, pullDistancePercent} = viewState // pullDistancePercent 百分比
        let {refresh_none, refresh_idle, will_refresh, refreshing,} = PullToRefreshListView.constants.viewState
        pullDistancePercent = Math.round(pullDistancePercent * 100)
        switch(pullState) {
            case refresh_none:
              Animated.timing(this.state.rotationNomal, {
                toValue: 0,
                duration: 300,
                easing: Easing.linear,
              }).start()
                return (
                  <Animated.View style={{top: -15,height: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink',}}>
                      <Text>pull down to refresh</Text>
                  </Animated.View>
                )
            case refresh_idle:
              this.key = false
              // this.state.rotationNomal.setValue(0)
              if(!this.key && this.state.rotationNomal._value == 1) {
                Animated.timing(this.state.rotationNomal, {
                  toValue: 0,
                  duration: 300,
                  easing: Easing.linear,
                }).start()
              }
                return (
                  <Animated.View style={{ flexDirection: 'row',height: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink',}}>
                    <Animated.Image
                      style={{width: 30, height: 30,
                        transform: [{
                          rotateZ: this.state.rotationNomal.interpolate({
                            inputRange: [0,1],
                            outputRange: ['0deg', '180deg']
                          })
                        }]
                      }}
                      source={require('./img/load-down.png')}
                    />
                    <Text>下拉刷新喽</Text>
                  </Animated.View>
                )
            case will_refresh:
              if(!this.key){
                this.key = true
                Animated.timing(this.state.rotationNomal, {
                  toValue: 1,
                  duration: 300,
                  easing: Easing.linear,
                }).start()
              }
                return (
                  <Animated.View style={{flexDirection: 'row', height: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink',}}>
                    <Animated.Image
                      style={{width: 30, height: 30,
                        transform: [{
                          rotateZ: this.state.rotationNomal.interpolate({
                            inputRange: [0,1],
                            outputRange: ['0deg', '180deg']
                          })
                        }]
                      }}
                      source={require('./img/load-down.png')}
                    />
                  <Text>放手刷新喽</Text>
                  </Animated.View>
                )
            case refreshing:
                return (
                  <Animated.View style={{top: 20,flexDirection: 'row', height: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink',}}>
                      <Animated.Image
                        style={{width: 20, height: 20,
                          transform: [{
                            rotateZ: this.state.rotation.interpolate({
                              inputRange: [0,1],
                              outputRange: ['0deg', '360deg']
                            })
                          }]
                        }}
                        source={require('./img/loading.png')}
                      />
                    <Text>refreshing</Text>
                  </Animated.View>
              )
            default:

        }
    }

    _renderFooter = (viewState) => {
        let {pullState, pullDistancePercent} = viewState
        let {load_more_none, load_more_idle, will_load_more, loading_more, loaded_all, } = PullToRefreshListView.constants.viewState
        pullDistancePercent = Math.round(pullDistancePercent * 100)
        switch(pullState) {
            case load_more_none:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text>pull up to load more</Text>
                    </View>
                )
            case load_more_idle:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text>pull up to load more {pullDistancePercent}%</Text>
                    </View>
                )
            case will_load_more:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text>release to load more {pullDistancePercent > 100 ? 100 : pullDistancePercent}%</Text>
                    </View>
                )
            case loading_more:
                return (
                    <View style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        {this._renderActivityIndicator()}<Text>loading</Text>
                    </View>
                )
            case loaded_all:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text>no more data</Text>
                    </View>
                )
        }
    }

    _onRefresh = () => {
        //console.log('outside _onRefresh start...')

        //simulate request data
        this.setTimeout( () => {

            //console.log('outside _onRefresh end...')
            let addNum = 20
            let refreshedDataSource = []
            for(let i = 0; i < addNum; i++) {
                refreshedDataSource.push({
                    text: `item-${i}`
                })
            }

            this.setState({
                dataSource: refreshedDataSource,
            })
            this._pullToRefreshListView.endRefresh()

        }, 300)
    }

    _onLoadMore = () => {
        //console.log('outside _onLoadMore start...')

        this.setTimeout( () => {

            //console.log('outside _onLoadMore end...')

            let length = this.state.dataSource.length
            let addNum = 20
            let addedDataSource = []
            if(length >= 100) {
                addNum = 3
            }
            for(let i = length; i < length + addNum; i++) {
                addedDataSource.push({
                    text: `item-${i}`
                })
            }
            this.setState({
                dataSource: this.state.dataSource.concat(addedDataSource),
            })

            let loadedAll
            if(length >= 100) {
                loadedAll = true
                this._pullToRefreshListView.endLoadMore(loadedAll)
            }
            else {
                loadedAll = false
                this._pullToRefreshListView.endLoadMore(loadedAll)
            }

        }, 300)
    }

    _renderActivityIndicator() {
        return ActivityIndicator ? (
            <ActivityIndicator
                style={{marginRight: 10,}}
                animating={true}
                color={'#ff0000'}
                size={'small'}/>
        ) : Platform.OS == 'android' ?
            (
                <ProgressBarAndroid
                    style={{marginRight: 10,}}
                    color={'#ff0000'}
                    styleAttr={'Small'}/>

            ) :  (
            <ActivityIndicatorIOS
                style={{marginRight: 10,}}
                animating={true}
                color={'#ff0000'}
                size={'small'}/>
        )
    }

}



const styles = StyleSheet.create({
    itemHeader: {
        height: 35,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        backgroundColor: 'blue',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        height: 60,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },

    contentContainer: {
        paddingTop: 20 + 44,
    },

    separator: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },

    thumbnail: {
        padding: 6,
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        overflow: 'hidden',
    },

    textContainer: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default TimerEnhance(PullToRefreshListViewDemo)
