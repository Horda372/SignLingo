import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, FlatList } from 'react-native';
import { Video } from 'expo-av'; // Expo Video
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

// Quiz component for History of ASL (unchanged)
function HistoryQuiz({ quizzes, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [hadMistake, setHadMistake] = useState(false);

  const { question, options } = quizzes[currentIndex];
  const correctIdx = options.findIndex(o => o.isCorrect);

  const handleAnswerPress = idx => { if (submitted) return; setSelectedOption(idx); };
  const submitAnswer = () => { if (selectedOption === null) return; if (selectedOption !== correctIdx) setHadMistake(true); setSubmitted(true); };
  const nextStep = () => {
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setSubmitted(false);
    } else {
      onFinish(!hadMistake);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.quizTitle}>Quiz {currentIndex + 1} of {quizzes.length}</Text>
      <Text style={styles.quizQuestion}>{question}</Text>
      {options.map((opt, idx) => (
        <Pressable key={idx}
          style={[styles.option, selectedOption===idx&&styles.optionSelected, submitted&&idx===correctIdx&&styles.optionCorrect, submitted&&selectedOption===idx&&selectedOption!==correctIdx&&styles.optionWrong]}
          onPress={() => handleAnswerPress(idx)}>
          <Text style={styles.optionText}>{opt.text}</Text>
        </Pressable>
      ))}
      {!submitted ? (
        <Pressable style={styles.completeBtn} onPress={submitAnswer}><Ionicons name="checkmark-circle" size={20} color="#FFF"/><Text style={styles.completeText}>Submit Answer</Text></Pressable>
      ) : (
        <Pressable style={styles.completeBtn} onPress={nextStep}><Ionicons name={currentIndex<quizzes.length-1?"arrow-forward-circle":(hadMistake?"refresh":"checkmark-circle")} size={20} color="#FFF"/><Text style={styles.completeText}>{currentIndex<quizzes.length-1?'Next Question':hadMistake?'Retry Quiz':'Finish Quiz'}</Text></Pressable>
      )}
    </ScrollView>
  );
}

export default function HistoryOfAsl({ onComplete, onBack }) {
  const [showQuiz, setShowQuiz] = useState(false);

  // Prepare quiz items
  const quizzes = [
    {question:'Who co-founded the first Deaf school in the U.S.?',options:['Thomas Hopkins Gallaudet','Martha’s Vineyard Signers','William Stokoe','Laurent Clerc'],correctAnswerIndex:0},
    {question:'What year was the American School for the Deaf founded?',options:['1817','1776','1900','1859'],correctAnswerIndex:0},
    {question:'Which linguist codified ASL structure scientifically?',options:['Laurent Clerc','William Stokoe','Alexander Graham Bell','Thomas Edison'],correctAnswerIndex:1}
  ].map(item=>{
    const opts=item.options.map((text,i)=>({text,isCorrect:i===item.correctAnswerIndex}));
    const idx=opts.findIndex(o=>o.isCorrect);
    return {question:item.question,options:[...opts.slice(idx),...opts.slice(0,idx)]};
  });

  const timeline = [
    {year:'1817',event:'ASD founded by Gallaudet & Clerc',image:'https://example.com/asd.jpg'},
    {year:'1864',event:'Gallaudet University chartered',image:'https://example.com/gallaudet.jpg'},
    {year:'1960s',event:'Stokoe publishes ASL research',image:'https://example.com/stokoe.jpg'}
  ];

  const handleFinish = allCorrect=>{ if(allCorrect) onComplete(); setShowQuiz(false); };
  if(showQuiz) return <HistoryQuiz quizzes={quizzes} onFinish={handleFinish}/>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📜 History of American Sign Language</Text>
      {/* Video */}
      <View style={styles.videoWrapper}><Video source={{uri:'https://www.example.com/history_of_asl.mp4'}} rate={1.0} volume={1.0} resizeMode="cover" useNativeControls style={styles.video}/></View>

      {/* Overview */}
      <Text style={styles.paragraph}>
        ASL emerged from French Sign Language, local home signs, and regional dialects
        to become a distinct, fully developed language in the early 19th century.
      </Text>

      {/* Timeline */}
      <Text style={styles.subheader}>🕰️ Key Milestones</Text>
      <FlatList horizontal data={timeline} keyExtractor={item=>item.year} showsHorizontalScrollIndicator={false}
        renderItem={({item})=> (
          <View style={styles.card}>
            <Image source={{uri:item.image}} style={styles.cardImage}/>
            <Text style={styles.cardYear}>{item.year}</Text>
            <Text style={styles.cardEvent}>{item.event}</Text>
          </View>
        )} style={styles.timeline}
      />

      {/* Notable Quote */}
      <View style={styles.quoteBox}>
        <Text style={styles.quoteText}>
          “Along with millions of others, I came to believe that ASL is a truly native,
          richly complex, and grammatically finite language.”
        </Text>
        <Text style={styles.quoteAuthor}>— William Stokoe</Text>
      </View>

      {/* Take Quiz */}
      <Pressable style={styles.completeBtn} onPress={()=>setShowQuiz(true)}><Ionicons name="play" size={20} color="#FFF"/><Text style={styles.completeText}>Take Quiz</Text></Pressable>
      {/* Back */}
    </ScrollView>
  );
}

const styles=StyleSheet.create({
  container:{padding:20,backgroundColor:'#FFFBEB'},
  header:{fontSize:24,fontWeight:'bold',marginBottom:12,color:'#92400E'},
  subheader:{fontSize:20,fontWeight:'600',marginVertical:12,color:'#C2410C'},
  videoWrapper:{height:180,backgroundColor:'#FDE68A',borderRadius:12,overflow:'hidden',marginBottom:16},
  video:{width:'100%',height:'100%'},
  paragraph:{fontSize:16,lineHeight:22,color:'#654321',marginBottom:16},
  timeline:{marginVertical:12},
  card:{width:140,marginRight:12,borderRadius:8,backgroundColor:'#FFF',shadowColor:'#000',shadowOffset:{width:0,height:1},shadowOpacity:0.2,shadowRadius:2,padding:8},
  cardImage:{width:'100%',height:80,borderRadius:4,marginBottom:8},
  cardYear:{fontSize:16,fontWeight:'bold',color:'#92400E'},
  cardEvent:{fontSize:14,color:'#333'},
  quoteBox:{backgroundColor:'#FEF3C7',padding:12,borderLeftWidth:4,borderLeftColor:'#EA580C',marginVertical:16},
  quoteText:{fontStyle:'italic',fontSize:16,color:'#6B7280',marginBottom:8},
  quoteAuthor:{fontSize:14,fontWeight:'600',color:'#92400E',textAlign:'right'},
  option:{padding:12,backgroundColor:'#FDE68A',borderRadius:6,marginVertical:6},
  optionSelected:{backgroundColor:'#FCD34D'},
  optionCorrect:{backgroundColor:'#4ADE80'},
  optionWrong:{backgroundColor:'#F87171'},
  optionText:{fontSize:15,color:'#4B5563'},
  completeBtn:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:'#EA580C',padding:12,borderRadius:12,justifyContent:'center',marginTop:16},
  completeText:{color:'#FFF',fontWeight:'600',fontSize:16},
  backBtn:{flexDirection:'row',alignItems:'center',gap:8,marginTop:20},
  backText:{color:'#92400E',fontWeight:'600',fontSize:16},
  quizTitle:{fontSize:22,fontWeight:'bold',marginBottom:12,color:'#92400E'},
  quizQuestion:{fontSize:18,color:'#333',marginBottom:12}
});
