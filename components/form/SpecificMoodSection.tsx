import { View } from "react-native";
import MoodSelector from "@/components/form/partials/MoodSelector";
//  to tez
export default function SpecificMoodSection({ mood, setMood }) {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 24 }}>
            <MoodSelector mood={mood} setMood={setMood} />
        </View>
    );
}
