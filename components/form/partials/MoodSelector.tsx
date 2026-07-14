import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';

export default function MoodSelector({ mood, setMood }: { mood: number; setMood: (value: number) => void }) {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 24 }}>
            {[1, 2, 3, 4, 5, 6].map((level) => (
                <TouchableOpacity
                    key={level}
                    onPress={() => setMood(level)}
                    style={{
                        marginHorizontal: 8,
                        padding: 10,
                        borderRadius: 20,
                        backgroundColor: mood === level ? '#3498db' : '#e0e0e0',
                    }}
                >
                    <Text style={{ fontSize: 28, color: mood === level ? '#fff' : '#333' }}>{level}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}