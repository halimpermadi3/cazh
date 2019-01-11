/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Linking, TextInput,ActivityIndicator, Platform, StyleSheet, Text, View, FlatList,} from 'react-native';
import { Button } from 'native-base';



export default class App extends Component {

  constructor(props){
    super(props);
    this.state ={
        isLoading: true,
        sort : 'newest',
        isDisabledN:false,
        isDisabledO:false,
        search:''
    }
    
    
  }


  componentDidMount(){
    this._refreshData();
  }

  _refreshData = () => {
    return fetch('https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=e265c8a272da45d788fc0675850f98c8&sort='+this.state.sort+'&q='+this.state.search)
    .then((response) => response.json())
    .then((responseJson) => {

      this.setState({
        isLoading: false,
        dataSource: responseJson.response.docs,
      });

    })
    .catch((error) =>{
      console.error(error);
    });
  }
  


  render(){

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }
  }
  
  onPressLink =(url)=>{
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
  }
  
  render() {
    return (
      <View style={{flex: 1, paddingTop:20}}>
        <Text>Search</Text>
        <TextInput
            style={{borderWidth:1}} 
            onChangeText={(search) => this.setState({search})}
            value={this.state.search}
            onEndEditing={()=>this._refreshData()}
            />
            <View style={{flexDirection:'row', marginTop:20, marginBottom:10}}>
        <Button primary disabled={this.state.isDisabledN} onPress={()=>{
          this.setState({
              sort:"newest",
              isDisabledN:true,
              isDisabledO:false
            },() => {
              this._refreshData()
              }
            )}}><Text>Newest</Text></Button>
            <View style={{width:20}}></View>
        <Button  primary disabled={this.state.isDisabledO} onPress={()=>{
          this.setState({
              sort:"oldest",
              isDisabledO:true,
              isDisabledN:false
              },()=> {this._refreshData()
              }
            )}}><Text>Oldest</Text></Button>
            </View>
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) =>
            <View>
                  <Text style={{fontSize:20}}>{item.source}</Text>
                  <Text>{item.snippet}</Text>
                <View style={{flex:1, alignItems:'flex-end'}}>
                    <Button transparent primary onPress={()=>this.onPressLink(item.web_url)}>
                      <Text>Detail</Text>
                    </Button>
                </View>    
            </View>
          }
          keyExtractor={({id}, index) => id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
