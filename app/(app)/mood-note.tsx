import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { appScreensStyles } from '@/styles/appScreensStyles';
import { useI18n } from '@/contexts/I18nContext';
import { StatusBar } from 'expo-status-bar';
import MoodSelector from '@/components/form/partials/MoodSelector';
import { APP_LOGIC_CONFIG } from '@/config/appConfig';
import SpecificMoodSection from '@/components/form/SpecificMoodSection';

export default function MultiStepFormScreen() {
    const moods = APP_LOGIC_CONFIG.specificMoods;
    const { t } = useI18n();
    const [step, setStep] = useState(1);
    const [overallMood, setOverallMood] = useState(0);
    const [specificMoods, setSpecificMoods] = useState<Record<string, number>>(() => {
        const result: Record<string, number> = {};
        moods.forEach(mood => {
            result[mood] = 0;
        });
        return result;
    });

    console.log('specificMoods', specificMoods);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    // const renderMoodSelector = (property: number, setter: (value: number) => void) => {
    //     return (
    //         <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 24 }}>
    //             {[1, 2, 3, 4, 5, 6].map((level) => (
    //                 <TouchableOpacity
    //                     key={level}
    //                     onPress={() => setter(level)}
    //                     style={{
    //                         marginHorizontal: 8,
    //                         padding: 10,
    //                         borderRadius: 20,
    //                         backgroundColor: property === level ? '#3498db' : '#e0e0e0',
    //                     }}
    //                 >
    //                     <Text style={{ fontSize: 28, color: property === level ? '#fff' : '#333' }}>{level}</Text>
    //                 </TouchableOpacity>
    //             ))}
    //         </View>
    //     );
    // }

    //  to ogarnac
    const renderSpecificMoods = () => {
        return (
            <View>
                {step > 1 && step <= moods.length && <SpecificMoodSection mood={specificMoods[moods[step - 2]]} setMood={(value) => setSpecificMoods({ ...specificMoods, [moods[step - 2]]: value })} />}
            </View>
        )
        return null;
    }

    const renderStep = () => {
        const step1 = (
            <View>
                <Text style={appScreensStyles.title}>{t('mood-note.overall.title')}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 24 }}>
                    <MoodSelector mood={overallMood} setMood={setOverallMood} />
                </View>
                <Button title={t('mood-note.next')} onPress={nextStep} disabled={overallMood === 0} />
            </View>
        );
        return (

            <View>
                {step === 1 && step1}
                {renderSpecificMoods()}
            </View>
        )

    }

    return (
        <View style={appScreensStyles.container}>
            <StatusBar style="auto" />
            <View style={appScreensStyles.header}>
                <Text style={appScreensStyles.headerTitle}>{t('mood-note.title')}</Text>
            </View>
            <View style={appScreensStyles.content}>
                {renderStep()}
            </View>
        </View>
    );
}
