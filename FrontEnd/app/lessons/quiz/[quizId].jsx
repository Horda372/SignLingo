// app/lesson/[id]/quiz.jsx
import React, { useState } from 'react'
import { SafeAreaView, ScrollView, Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { questions } from '../../Lessons'

export default function QuizScreen() {
  const { quizId } = useLocalSearchParams()
  const router = useRouter()
  const lessonIndex = Number(quizId)
  const quiz = questions.find(q => q.id === lessonIndex)?.Questions || []

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState({})
  const [showResults, setShowResults] = useState(false)

  const question = quiz[current]
  const total = quiz.length

  const handleSelect = idx => {
    if (showResults) return
    setSelected(s => ({ ...s, [current]: idx }))
  }

  const calcScore = () =>
    quiz.reduce((acc, q, i) => (q.Answers[selected[i]]?.isCorrect ? acc + 1 : acc), 0)

  const next = () => setCurrent(c => Math.min(c + 1, total - 1))
  const prev = () => setCurrent(c => Math.max(c - 1, 0))

  // NEW: on submit
  const handleSubmit = async () => {
    setShowResults(true)
    const score = calcScore()
    if (score === total) {
      // load existing map
      const json = await AsyncStorage.getItem('userEngagement') || '{}'
      const engagement = JSON.parse(json)

      // mark this lesson complete
      engagement[lessonIndex] = true

      // unlock next lesson
      const nextLesson = lessonIndex + 1
      

      // persist
      await AsyncStorage.setItem('userEngagement', JSON.stringify(engagement))

      // navigate to next lesson
      router.replace({
        pathname: `/lessons/${nextLesson}`,
        params: { onComplete: JSON.stringify({ globalIndex: nextLesson }) }
      })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {showResults && (
          <View style={styles.scoreSection}>
            <Text style={styles.scoreText}>
              Score: {calcScore()}/{total} ({Math.round((calcScore() / total) * 100)}%)
            </Text>
            <TouchableOpacity onPress={() => { setSelected({}); setShowResults(false); setCurrent(0) }}>
              <Text style={styles.resetButtonText}>Restart Quiz</Text>
            </TouchableOpacity>
          </View>
        )}

        {!showResults && (
          <Text style={styles.progressText}>Question {current + 1} of {total}</Text>
        )}

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{question.Text}</Text>
          {question.Answers.map((a, ai) => {
            const isSel = selected[current] === ai
            const isCorr = showResults && a.isCorrect
            const isWrong = showResults && isSel && !a.isCorrect
            return (
              <TouchableOpacity
                key={ai}
                onPress={() => handleSelect(ai)}
                disabled={showResults}
                style={[
                  styles.answerOption,
                  isSel && !showResults && styles.selectedAnswer,
                  isCorr && styles.correctAnswer,
                  isWrong && styles.incorrectAnswer,
                ]}
              >
                <View style={[
                  styles.answerIndicator,
                  isSel && !showResults && styles.selectedIndicator,
                  isCorr && styles.correctIndicator,
                  isWrong && styles.incorrectIndicator,
                ]}/>
                <Text style={[
                  styles.answerText,
                  isSel && !showResults && styles.selectedAnswerText,
                  isCorr && styles.correctAnswerText,
                  isWrong && styles.incorrectAnswerText,
                ]}>
                  {a.option}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {!showResults && (
          <View style={styles.navButtons}>
            <TouchableOpacity onPress={prev} disabled={current === 0}>
              <Text style={[styles.navText, current === 0 && styles.disabledNav]}>◀ Prev</Text>
            </TouchableOpacity>
            {current === total - 1
              ? <TouchableOpacity onPress={handleSubmit}>
                  <Text style={styles.navText}>Submit ▶</Text>
                </TouchableOpacity>
              : <TouchableOpacity onPress={next}>
                  <Text style={styles.navText}>Next ▶</Text>
                </TouchableOpacity>
            }
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#FFFBEB'},
  content:{padding:20,paddingBottom:40},
  progressText:{fontSize:14,color:'#92400E',marginBottom:8},
  questionCard:{backgroundColor:'#FFFBEB',padding:16,borderRadius:12,marginBottom:16,borderWidth:1,borderColor:'#FDE68A'},
  questionText:{fontSize:16,fontWeight:'600',color:'#92400E',marginBottom:12},
  answerOption:{flexDirection:'row',alignItems:'center',padding:12,borderRadius:8,borderWidth:1,borderColor:'#FDE68A',backgroundColor:'#FFFBEB',marginBottom:8},
  answerIndicator:{width:16,height:16,borderRadius:8,borderWidth:2,borderColor:'#D1D5DB',marginRight:12},
  selectedAnswer:{backgroundColor:'#FDE68A',borderColor:'#F59E0B'},
  selectedIndicator:{backgroundColor:'#F59E0B',borderColor:'#F59E0B'},
  selectedAnswerText:{color:'#92400E',fontWeight:'500'},
  correctAnswer:{backgroundColor:'#D1FAE5',borderColor:'#10B981'},
  correctIndicator:{backgroundColor:'#10B981',borderColor:'#10B981'},
  correctAnswerText:{color:'#047857',fontWeight:'500'},
  incorrectAnswer:{backgroundColor:'#FEE2E2',borderColor:'#EF4444'},
  incorrectIndicator:{backgroundColor:'#EF4444',borderColor:'#EF4444'},
  incorrectAnswerText:{color:'#DC2626',fontWeight:'500'},
  navButtons:{flexDirection:'row',justifyContent:'space-between',marginTop:16},
  navText:{fontSize:16,fontWeight:'600',color:'#F59E0B'},
  disabledNav:{color:'#ccc'},
  scoreSection:{alignItems:'center',marginBottom:20},
  scoreText:{fontSize:18,fontWeight:'700',color:'#92400E',marginBottom:12},
  resetButtonText:{fontSize:16,color:'#F59E0B',fontWeight:'600'},
})
