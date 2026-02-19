import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { words } from "../../data/words";

export default function HomeScreen() {
  const [remainingWords, setRemainingWords] = useState(words); // kalan kelimeler
const [index, setIndex] = useState(0);
const [options, setOptions] = useState<string[]>([]);
const [score, setScore] = useState(0);
const [selectedOption, setSelectedOption] = useState<string | null>(null);
const [isCorrect, setIsCorrect] = useState<boolean | null>(null);


  // 🔁 yeni soru üret
  const generateQuestion = () => {
    if (remainingWords.length === 0) return; // tüm kelimeler doğru bilindi
  
    // rastgele bir kelime seç
    const randomIndex = Math.floor(Math.random() * remainingWords.length);
    setIndex(randomIndex);
  
    const correct = remainingWords[randomIndex].tr;
  
    // yanlış seçenek seç (tüm kelimelerden olabilir)
    let wrong;
    do {
      wrong = words[Math.floor(Math.random() * words.length)].tr;
    } while (wrong === correct);
  
    // seçenekleri karıştır
    const shuffled = Math.random() > 0.5 ? [correct, wrong] : [wrong, correct];
    setOptions(shuffled);
  };
  

  // ▶️ ilk açılışta
  useEffect(() => {
    generateQuestion();
  }, []);

  // ✅ cevap seçilince
  const handleAnswer = (selected: string) => {
    if (selectedOption) return;
  
    const correctAnswer = remainingWords[index].tr;
    const correct = selected === correctAnswer;
  
    setSelectedOption(selected);
    setIsCorrect(correct);
  
    if (correct) {
      setScore((prev) => prev + 1);
  
      // doğru bilinen kelimeyi remainingWords listesinden çıkar
      setRemainingWords((prev) =>
        prev.filter((_, i) => i !== index)
      );
    }
  
    setTimeout(() => {
      setSelectedOption(null);
      setIsCorrect(null);
      generateQuestion();
    }, 1000);
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {score}</Text>

      <Text style={styles.word}>{words[index].es}</Text>

      {options.map((option, i) => {
        let backgroundColor = "#4f46e5"; // default

        if (selectedOption === option) {
          backgroundColor = isCorrect ? "green" : "red";
        }

        return (
          <TouchableOpacity
            key={i}
            style={[styles.button, { backgroundColor }]}
            onPress={() => handleAnswer(option)}
            disabled={!!selectedOption}
          >
            <Text style={styles.buttonText}>{option}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  score: {
    fontSize: 20,
    marginBottom: 20,
  },
  word: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    width: 220,
    marginVertical: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
});
