import React, { useMemo, useState } from 'react';
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList,
  ScrollView, StatusBar, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const C = {
  ink:'#292333', muted:'#8B8493', pink:'#E98CCB', purple:'#8B72D9',
  pale:'#FFF2FA', bg:'#FFFAFD', white:'#FFFFFF', line:'#F0E7EF',
  green:'#43B581', dark:'#47365C'
};

const initialChats = [
  {id:'1', name:'Sofia', avatar:'S', color:'#F4C7E5', preview:'Hey! How are you?', time:'14:32', online:true, kind:'person', unread:2},
  {id:'2', name:'Liam', avatar:'L', color:'#C9D9F7', preview:'That sounds great!', time:'13:10', online:true, kind:'person', unread:0},
  {id:'3', name:'Mia', avatar:'M', color:'#F6D5C8', preview:'Tell me about your day ✨', time:'12:45', online:false, kind:'person', unread:0},
];
const characters = [
  {id:'ai1',name:'Luna',gender:'Female',desc:'A friendly, creative companion',avatar:'L',color:'#EAD9FF',tag:'Friendly'},
  {id:'ai2',name:'Alex',gender:'Male',desc:'Talk about music, games and life',avatar:'A',color:'#D8E8FF',tag:'Chill'},
  {id:'ai3',name:'Aria',gender:'Female',desc:'Positive energy and thoughtful chats',avatar:'A',color:'#FFE0EB',tag:'Cheerful'},
  {id:'ai4',name:'Noah',gender:'Male',desc:'Curious, funny and easygoing',avatar:'N',color:'#D8F1E8',tag:'Funny'},
];

function Avatar({letter,color,size=48,online=false}) {
  return <View style={{width:size,height:size,borderRadius:size/2,backgroundColor:color,alignItems:'center',justifyContent:'center'}}>
    <Text style={{fontSize:size*.42,fontWeight:'800',color:C.dark}}>{letter}</Text>
    {online && <View style={{position:'absolute',right:1,bottom:1,width:12,height:12,borderRadius:6,backgroundColor:C.green,borderWidth:2,borderColor:C.white}}/>}
  </View>;
}
function Pill({children,active,onPress}) {
  return <TouchableOpacity onPress={onPress} style={{paddingHorizontal:16,paddingVertical:9,borderRadius:22,backgroundColor:active?C.dark:C.white,borderWidth:1,borderColor:active?C.dark:C.line,marginRight:8}}>
    <Text style={{color:active?C.white:C.muted,fontWeight:'700'}}>{children}</Text>
  </TouchableOpacity>;
}
function Header({title,subtitle,right}) {
  return <View style={{paddingHorizontal:22,paddingTop:14,paddingBottom:18,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
    <View><Text style={{fontSize:29,fontWeight:'900',color:C.ink,letterSpacing:-1}}>{title}</Text>{subtitle?<Text style={{color:C.muted,marginTop:3}}>{subtitle}</Text>:null}</View>
    {right}
  </View>;
}
export default function App() {
  const [tab,setTab]=useState('Chats');
  const [chats,setChats]=useState(initialChats);
  const [active,setActive]=useState(null);
  const [messages,setMessages]=useState({});
  const [draft,setDraft]=useState('');
  const [search,setSearch]=useState('');
  const [filter,setFilter]=useState('All');
  const [profileName,setProfileName]=useState('Your name');

  const openChat=(item)=>{setActive(item);setDraft('');};
  const sendMessage=()=>{
    if(!draft.trim()||!active)return;
    const msg={id:String(Date.now()),text:draft.trim(),mine:true,time:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})};
    setMessages(p=>({...p,[active.id]:[...(p[active.id]||[]),msg]}));
    setChats(p=>[{id:active.id,name:active.name,avatar:active.avatar,color:active.color,preview:msg.text,time:'Now',online:active.online,kind:active.kind,unread:0},...p.filter(x=>x.id!==active.id)]);
    setDraft('');
  };
  const startRandom=()=>{
    const choices=[{id:'random1',name:'Emma',avatar:'E',color:'#F8D8E8',online:true,kind:'person'},{id:'random2',name:'Oliver',avatar:'O',color:'#D9E6FA',online:true,kind:'person'}];
    openChat(choices[Math.floor(Math.random()*choices.length)]);
    Alert.alert('Demo mode','This is a preview profile. Connect the backend to meet real people.');
  };
  const startAI=(ch)=>openChat({...ch,kind:'ai',online:true});
  const sendAI=()=>{
    const id=active.id;
    const replies=[
      'That’s interesting! Tell me a little more.',
      'I’m glad you shared that with me. What happened next?',
      'Nice! What do you enjoy most about it?',
      'I see what you mean. Let’s talk more about that.'
    ];
    setTimeout(()=>setMessages(p=>({...p,[id]:[...(p[id]||[]),{id:String(Date.now()+1),text:replies[Math.floor(Math.random()*replies.length)],mine:false,time:'Now'}]})),450);
  };
  const onSend=()=>{if(!draft.trim())return;sendMessage();if(active?.kind==='ai')sendAI();};

  const renderChat=()=>{
    const list=messages[active.id]||[];
    return <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <View style={{height:62,paddingHorizontal:16,flexDirection:'row',alignItems:'center',borderBottomWidth:1,borderColor:C.line,backgroundColor:C.white}}>
        <TouchableOpacity onPress={()=>setActive(null)} style={{padding:8}}><Ionicons name="chevron-back" size={26} color={C.ink}/></TouchableOpacity>
        <Avatar letter={active.avatar} color={active.color} size={38} online={active.online}/>
        <View style={{marginLeft:10,flex:1}}><Text style={{fontWeight:'800',fontSize:16,color:C.ink}}>{active.name}</Text><Text style={{fontSize:12,color:active.kind==='ai'?C.purple:C.green}}>{active.kind==='ai'?'AI companion':active.online?'Online':'Offline'}</Text></View>
        <TouchableOpacity onPress={()=>Alert.alert('Safety','Block and report tools will be available with the connected backend.')}><Ionicons name="ellipsis-horizontal" size={23} color={C.ink}/></TouchableOpacity>
      </View>
      <View style={{flex:1,padding:16}}>
        {list.length===0?<View style={{alignItems:'center',marginTop:55}}>
          <Avatar letter={active.avatar} color={active.color} size={72}/>
          <Text style={{fontSize:20,fontWeight:'800',color:C.ink,marginTop:14}}>Say hello to {active.name}</Text>
          <Text style={{color:C.muted,marginTop:6,textAlign:'center'}}>Start a conversation. Be kind and respectful.</Text>
        </View>:null}
        <FlatList data={list} keyExtractor={x=>x.id} contentContainerStyle={{paddingVertical:12}} renderItem={({item})=><View style={{alignSelf:item.mine?'flex-end':'flex-start',maxWidth:'82%',backgroundColor:item.mine?C.purple:C.white,padding:13,borderRadius:18,marginVertical:5,borderBottomRightRadius:item.mine?5:18,borderBottomLeftRadius:item.mine?18:5}}>
          <Text style={{color:item.mine?C.white:C.ink,fontSize:15,lineHeight:21}}>{item.text}</Text><Text style={{fontSize:10,color:item.mine?'#EEE5FF':C.muted,alignSelf:'flex-end',marginTop:5}}>{item.time}</Text>
        </View>}/>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':undefined}>
        <View style={{flexDirection:'row',alignItems:'center',padding:12,backgroundColor:C.white,borderTopWidth:1,borderColor:C.line}}>
          <TextInput value={draft} onChangeText={setDraft} placeholder="Write a message..." placeholderTextColor={C.muted} style={{flex:1,backgroundColor:C.bg,borderRadius:24,paddingHorizontal:17,paddingVertical:11,color:C.ink,maxHeight:100}} multiline/>
          <TouchableOpacity onPress={onSend} style={{marginLeft:9,width:44,height:44,borderRadius:22,backgroundColor:C.purple,alignItems:'center',justifyContent:'center'}}><Ionicons name="send" size={19} color="white"/></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>;
  };

  const renderChats=()=> <ScrollView style={{flex:1}} contentContainerStyle={{paddingBottom:30}}>
    <Header title="MIA" subtitle="Your conversations, your world." right={<View style={{backgroundColor:C.pale,padding:11,borderRadius:16}}><Ionicons name="chatbubbles" size={22} color={C.purple}/></View>}/>
    <View style={{paddingHorizontal:20,marginBottom:18}}>
      <View style={{flexDirection:'row',alignItems:'center',backgroundColor:C.white,borderWidth:1,borderColor:C.line,borderRadius:15,paddingHorizontal:13}}>
        <Ionicons name="search" color={C.muted} size={19}/><TextInput value={search} onChangeText={setSearch} placeholder="Search conversations" placeholderTextColor={C.muted} style={{padding:12,flex:1,color:C.ink}}/>
      </View>
    </View>
    <View style={{paddingHorizontal:22,marginBottom:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><Text style={{fontSize:18,fontWeight:'800',color:C.ink}}>Messages</Text><Text style={{color:C.purple,fontWeight:'700'}}>{chats.length} chats</Text></View>
    {chats.filter(x=>x.name.toLowerCase().includes(search.toLowerCase())).map(item=><TouchableOpacity key={item.id} onPress={()=>openChat(item)} style={{flexDirection:'row',alignItems:'center',paddingHorizontal:22,paddingVertical:13}}>
      <Avatar letter={item.avatar} color={item.color} online={item.online}/>
      <View style={{flex:1,marginLeft:13,borderBottomWidth:1,borderColor:C.line,paddingBottom:13}}>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}><Text style={{fontSize:16,fontWeight:'800',color:C.ink}}>{item.name}</Text><Text style={{fontSize:11,color:C.muted}}>{item.time}</Text></View>
        <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:5}}><Text numberOfLines={1} style={{color:C.muted,flex:1,marginRight:8}}>{item.preview}</Text>{item.unread>0?<View style={{backgroundColor:C.pink,borderRadius:10,minWidth:20,alignItems:'center',paddingHorizontal:5}}><Text style={{color:C.white,fontSize:11,fontWeight:'800'}}>{item.unread}</Text></View>:null}</View>
      </View>
    </TouchableOpacity>)}
    <View style={{paddingHorizontal:20,marginTop:12}}>
      <TouchableOpacity onPress={startRandom} style={{backgroundColor:C.dark,padding:17,borderRadius:18,flexDirection:'row',alignItems:'center'}}>
        <View style={{backgroundColor:'#67557D',padding:11,borderRadius:14}}><Ionicons name="shuffle" size={23} color="white"/></View>
        <View style={{flex:1,marginLeft:12}}><Text style={{color:'white',fontWeight:'800',fontSize:16}}>Meet someone new</Text><Text style={{color:'#D8CFE4',fontSize:12,marginTop:3}}>Start a random conversation</Text></View><Ionicons name="chevron-forward" color="white" size={20}/>
      </TouchableOpacity>
    </View>
  </ScrollView>;

  const renderDiscover=()=> <ScrollView contentContainerStyle={{paddingBottom:30}}>
    <Header title="Discover" subtitle="Find your next conversation."/>
    <View style={{paddingHorizontal:20,flexDirection:'row',marginBottom:18}}>
      {['All','Female','Male'].map(f=><Pill key={f} active={filter===f} onPress={()=>setFilter(f)}>{f}</Pill>)}
    </View>
    <View style={{paddingHorizontal:20,marginBottom:18}}>
      <TouchableOpacity onPress={startRandom} style={{backgroundColor:'#F2EAFE',borderRadius:20,padding:18,flexDirection:'row',alignItems:'center'}}>
        <View style={{width:48,height:48,borderRadius:16,backgroundColor:C.white,alignItems:'center',justifyContent:'center'}}><Ionicons name="people" size={24} color={C.purple}/></View>
        <View style={{flex:1,marginLeft:12}}><Text style={{fontWeight:'800',fontSize:16,color:C.ink}}>Random chat</Text><Text style={{color:C.muted,fontSize:12,marginTop:3}}>Meet someone outside your circle</Text></View><Ionicons name="arrow-forward" size={20} color={C.purple}/>
      </TouchableOpacity>
    </View>
    <Text style={{fontSize:18,fontWeight:'800',color:C.ink,marginHorizontal:22,marginBottom:12}}>People to meet</Text>
    {['Emma','Oliver','Ava','Leo'].filter((_,i)=>filter==='All'||(filter==='Female'&&i%2===0)||(filter==='Male'&&i%2===1)).map((name,i)=>{
      const colors=['#F6D8E8','#D9E6FA','#F9E5C8','#D9F0E8'];const item={id:'person'+i,name,avatar:name[0],color:colors[i],online:true,kind:'person'};
      return <View key={name} style={{marginHorizontal:20,marginBottom:10,padding:13,backgroundColor:C.white,borderRadius:17,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:C.line}}>
        <Avatar letter={item.avatar} color={item.color} online size={45}/>
        <View style={{flex:1,marginLeft:12}}><Text style={{fontWeight:'800',color:C.ink,fontSize:15}}>{name}</Text><Text style={{fontSize:12,color:C.green,marginTop:3}}>Online now · Demo profile</Text></View>
        <TouchableOpacity onPress={()=>openChat(item)} style={{backgroundColor:C.pale,paddingHorizontal:14,paddingVertical:9,borderRadius:18}}><Text style={{color:C.purple,fontWeight:'800'}}>Chat</Text></TouchableOpacity>
      </View>;
    })}
    <Text style={{fontSize:18,fontWeight:'800',color:C.ink,marginHorizontal:22,marginTop:18,marginBottom:12}}>AI companions</Text>
    {characters.filter(x=>filter==='All'||x.gender===filter).map(ch=><View key={ch.id} style={{marginHorizontal:20,marginBottom:10,padding:13,backgroundColor:C.white,borderRadius:17,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:C.line}}>
      <Avatar letter={ch.avatar} color={ch.color} size={45}/>
      <View style={{flex:1,marginLeft:12}}><Text style={{fontWeight:'800',color:C.ink,fontSize:15}}>{ch.name} <Text style={{fontWeight:'500',color:C.muted,fontSize:12}}>· {ch.gender}</Text></Text><Text style={{fontSize:12,color:C.muted,marginTop:3}}>{ch.desc}</Text></View>
      <TouchableOpacity onPress={()=>startAI(ch)} style={{backgroundColor:C.purple,paddingHorizontal:14,paddingVertical:9,borderRadius:18}}><Text style={{color:C.white,fontWeight:'800'}}>Chat</Text></TouchableOpacity>
    </View>)}
  </ScrollView>;

  const renderProfile=()=> <ScrollView contentContainerStyle={{paddingBottom:40}}>
    <Header title="Profile" subtitle="Make MIA feel like you."/>
    <View style={{alignItems:'center',paddingVertical:20}}>
      <Avatar letter={(profileName[0]||'Y').toUpperCase()} color="#F2DDF0" size={88}/>
      <TextInput value={profileName} onChangeText={setProfileName} style={{fontSize:20,fontWeight:'800',color:C.ink,textAlign:'center',marginTop:12,borderBottomWidth:1,borderColor:C.line,minWidth:150,padding:8}}/>
      <Text style={{color:C.muted,marginTop:5}}>Your MIA profile · Preview</Text>
    </View>
    {[
      ['person-outline','Edit profile'],
      ['language-outline','Language · English / Türkçe'],
      ['shield-checkmark-outline','Privacy & safety'],
      ['notifications-outline','Notifications'],
      ['help-circle-outline','Help & support']
    ].map(([icon,label])=><TouchableOpacity key={label} onPress={()=>Alert.alert(label,'This setting will be connected in the next development stage.')} style={{marginHorizontal:20,marginTop:8,padding:17,backgroundColor:C.white,borderRadius:15,flexDirection:'row',alignItems:'center'}}><Ionicons name={icon} size={21} color={C.purple}/><Text style={{marginLeft:12,color:C.ink,fontWeight:'700',flex:1}}>{label}</Text><Ionicons name="chevron-forward" size={18} color={C.muted}/></TouchableOpacity>)}
    <Text style={{textAlign:'center',color:C.muted,fontSize:11,marginTop:28}}>MIA · Version 1.0.0 · Preview build</Text>
  </ScrollView>;

  if(active)return renderChat();
  return <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
    <StatusBar barStyle="dark-content" backgroundColor={C.bg}/>
    <View style={{flex:1}}>{tab==='Chats'?renderChats():tab==='Discover'?renderDiscover():renderProfile()}</View>
    <View style={{height:68,backgroundColor:C.white,borderTopWidth:1,borderColor:C.line,flexDirection:'row',justifyContent:'space-around',alignItems:'center',paddingBottom:5}}>
      {[['Chats','chatbubble-ellipses'],['Discover','compass'],['Profile','person-circle']].map(([t,ic])=><TouchableOpacity key={t} onPress={()=>setTab(t)} style={{alignItems:'center',justifyContent:'center',width:85}}>
        <Ionicons name={ic+(tab===t?'-sharp':'-outline')} size={23} color={tab===t?C.purple:C.muted}/>
        <Text style={{fontSize:11,marginTop:3,fontWeight:tab===t?'800':'600',color:tab===t?C.purple:C.muted}}>{t}</Text>
      </TouchableOpacity>)}
    </View>
  </SafeAreaView>;
}
