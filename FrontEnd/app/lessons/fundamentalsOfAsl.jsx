import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Video } from 'expo-av'; // assumes you're using Expo
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

// Quiz component separated
function DeafCultureQuiz({ quizzes, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [hadMistake, setHadMistake] = useState(false);

  const { question, options } = quizzes[currentIndex];
  const correctIdx = options.findIndex(o => o.isCorrect);

  const handleAnswerPress = idx => {
    if (submitted) return;
    setSelectedOption(idx);
  };

  const submitAnswer = () => {
    if (selectedOption === null) return;
    if (selectedOption !== correctIdx) setHadMistake(true);
    setSubmitted(true);
  };

  const nextStep = () => {
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex(idx => idx + 1);
      setSelectedOption(null);
      setSubmitted(false);
    } else {
      onFinish(!hadMistake);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Quiz {currentIndex + 1} of {quizzes.length}</Text>
      <Text style={styles.description}>{question}</Text>

      {options.map((opt, idx) => (
        <Pressable
          key={idx}
          style={[
            styles.option,
            selectedOption === idx && styles.optionSelected,
            submitted && idx === correctIdx && styles.optionCorrect,
            submitted && selectedOption === idx && selectedOption !== correctIdx && styles.optionWrong,
          ]}
          onPress={() => handleAnswerPress(idx)}
        >
          <Text style={styles.optionText}>{opt.text}</Text>
        </Pressable>
      ))}

      {!submitted ? (
        <Pressable style={styles.completeBtn} onPress={submitAnswer}>
          <Ionicons name="checkmark-circle" size={20} color="#FFF" />
          <Text style={styles.completeText}>Submit Answer</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.completeBtn} onPress={nextStep}>
          <Ionicons
            name={currentIndex < quizzes.length - 1 ? "arrow-forward-circle" : (hadMistake ? "refresh" : "checkmark-circle")} 
            size={20} color="#FFF" 
          />
          <Text style={styles.completeText}>
            {currentIndex < quizzes.length - 1
              ? 'Next Question'
              : hadMistake
                ? 'Retry Quiz'
                : 'Finish Quiz'}
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

export default function DeafCultureLesson({ onComplete, onBack }) {
  const [showQuiz, setShowQuiz] = useState(false);

  // Prepare 3 quiz items with rotated options
  const quizzes = [
    {
      question: 'What is a key aspect of Deaf culture?',
      options: ['Avoiding eye contact', 'Using sign language and visual communication', 'Written communication only', 'Wearing hearing aids'],
      correctAnswerIndex: 1,
    },
    {
      question: 'Why is eye contact important in Deaf culture?',
      options: ['It is considered rude', 'It helps with understanding facial cues', 'It shows disrespect', 'It is irrelevant'],
      correctAnswerIndex: 1,
    },
    {
      question: 'What is the primary mode of communication in Deaf culture?',
      options: ['Spoken language', 'Sign language', 'Written text', 'Gestures only'],
      correctAnswerIndex: 1,
    },
  ].map(item => {
    const opts = item.options.map((text, i) => ({ text, isCorrect: i === item.correctAnswerIndex }));
    const idx = opts.findIndex(o => o.isCorrect);
    const rotated = [...opts.slice(idx), ...opts.slice(0, idx)];
    return { question: item.question, options: rotated };
  });

  const handleQuizFinish = allCorrect => {
    if (allCorrect) {
      onComplete();
    }
    setShowQuiz(false);
  };

  if (showQuiz) {
    return <DeafCultureQuiz quizzes={quizzes} onFinish={handleQuizFinish} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lesson 1: Deaf Culture Basics</Text>

      {/* Video Section */}
      <View style={styles.videoWrapper}>
        <Video
          source={{ uri: 'https://www.example.com/video.mp4' }}
          rate={1.0}
          volume={1.0}
          resizeMode="cover"
          useNativeControls
          style={styles.video}
        />
      </View>

      {/* Description */}
      <Text style={styles.description}>
        Deaf culture refers to the social beliefs, behaviors, art, literary traditions,
        and values of communities that are influenced by deafness and use sign language
        as the primary means of communication.
      </Text>

      {/* Key Points */}
      <View style={styles.bulletBox}>
        <Text style={styles.bullet}>• Deafness is a cultural identity, not just a medical condition.</Text>
        <Text style={styles.bullet}>• The Deaf community values sign language and visual communication.</Text>
        <Text style={styles.bullet}>• Eye contact and visual attention are important cultural norms.</Text>
        <Text style={styles.bullet}>• Many Deaf individuals attend special schools and events centered around Deaf culture.</Text>
      </View>

      {/* Take Quiz Button */}
      <Pressable style={styles.completeBtn} onPress={() => setShowQuiz(true)}>
        <Ionicons name="play" size={20} color="#FFF" />
        <Text style={styles.completeText}>Take Quiz</Text>
      </Pressable>

   
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#FFFBEB' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#92400E' },
  videoWrapper: { height: 200, backgroundColor: '#FDE68A', marginBottom: 20, borderRadius: 12, overflow: 'hidden' },
  video: { width: '100%', height: '100%' },
  description: { fontSize: 16, marginBottom: 16, lineHeight: 22, color: '#654321' },
  bulletBox: { marginVertical: 16 },
  bullet: { fontSize: 14, marginBottom: 8, color: '#6B7280' },
  option: { padding: 14, backgroundColor: '#FDE68A', borderRadius: 8, marginVertical: 8 },
  optionSelected: { backgroundColor: '#FCD34D' },
  optionCorrect: { backgroundColor: '#4ADE80' },
  optionWrong: { backgroundColor: '#F87171' },
  optionText: { fontSize: 15, color: '#4B5563' },
  completeBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#EA580C', padding: 12, borderRadius: 12, justifyContent: 'center', marginTop: 16 },
  completeText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20 },
  backText: { color: '#92400E', fontWeight: '600', fontSize: 16 },
});
