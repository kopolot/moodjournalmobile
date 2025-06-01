import React from "react";
import { View, Text, StyleSheet, TextInput, Alert, ActivityIndicator, ScrollView, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
// import { forms, layout} from "@/constants/Styles";
import { useThemeColor } from '@/hooks/useThemeColor';
import useStyles from "@/hooks/useStyles";

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
  disabled?: boolean;
}

export default function Checkbox({ checked, onToggle, label, disabled = false }: CheckboxProps){
    // Pobierz kolor tekstu z systemu tematycznego
    const textColor = useThemeColor({}, 'text');
    const { forms, layout } = useStyles();
    
    return (
        <TouchableWithoutFeedback
          onPress={onToggle}
          disabled={disabled}
        >
          <View style={{...layout.row, marginBottom: 15}}>
            <View style={{
                ...forms.checkbox,
                ...(checked && forms.checkboxChecked),
            }}>
              {checked && (
                <Text style={{ color: '#fff', fontSize: 14 }}>✓</Text>
              )}
            </View>
            <Text style={{...forms.label, marginLeft: 10, color: textColor}}>
              {label}
            </Text>
          </View>
        </TouchableWithoutFeedback>
    );
}