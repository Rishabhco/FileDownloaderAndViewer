import {View,Text,TouchableOpacity, TextInput,PermissionsAndroid, Platform,Dimensions} from 'react-native';
import React from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import PDF from 'react-native-pdf';


const App = () => {
  const [pastedUrl,setPastedUrl] = React.useState('');
  const source = { uri: 'bundle-assets://EXC_1070.pdf' };
  const [view,setView] = React.useState(false);
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Downloader App Storage Permission',
          message:
            'Downloader App needs access to your storage ' +
            'so you can downlaod file.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        downloadFile();
        console.log('You can use the storage');
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const downloadFile=()=>{
    const { config, fs } = RNFetchBlob;
    const date=new Date();
    const fileDirectory=fs.dirs.DownloadDir;
    config({
      // add this option that makes response data to be stored as a file,
      // this is much more performant.
      fileCache : true,
      addAndroidDownloads : {
        useDownloadManager : true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
        notification : true,
        path:fileDirectory +"/download_"+ Math.floor(date.getDate()+date.getSeconds()/2)+".pdf", // this is the path where your downloaded file will live in
        description : 'Downloading file.'
      }
    })
    .fetch('GET',pastedUrl, {
    //some headers ..
    })
    .then((res) => {
      // the temp file path
      console.log('The file saved to ', res.path())
      alert("File Downloaded Successfully");
    })
  }
  

  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <TextInput style={{width:"90%",height:50,borderWidth:0.5,alignSelf:'center',paddingLeft:20,marginTop:30,justifyContent:'center',alignItems:'center',borderRadius:20}} placeholder="Paste Url Here" onChangeText={(text)=>setPastedUrl(text)} value={pastedUrl}/>
      <TouchableOpacity style={{width:"90%",height:50,borderWidth:0.5,alignSelf:'center',backgroundColor:'purple',paddingLeft:20,marginTop:30,justifyContent:'center',alignItems:'center',borderRadius:20}} onPress={()=>{
        if(pastedUrl!==''){
          if(Platform.OS === 'android'){
            requestStoragePermission();
          }
          if(Platform.OS === 'ios'){
            downloadFile();
          }
        }else{
          alert('Please paste url first');
        }
      }}>
        <Text style={{color:'white',fontSize:20}}>Download File</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{width:"90%",height:50,borderWidth:0.5,alignSelf:'center',backgroundColor:'purple',paddingLeft:20,marginTop:30,justifyContent:'center',alignItems:'center',borderRadius:20}} onPress={()=>{setView(true)}}>
        <Text style={{color:'white',fontSize:20}}>View File</Text>
      </TouchableOpacity>
      {view && 
        <PDF source={source} enablePaging={true} horizontal={true} style={{
          flex: 1,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }} />
      }
    </View>
  );
}

export default App;