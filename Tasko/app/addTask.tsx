import React, { useState } from 'react';
import {ScrollView, TextInput, StyleSheet, Pressable, Platform, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function AddTaskScreen() {
    const [taskName, setTaskName] = useState('');
    const [taskDifficulty, setTaskDifficulty] = useState('easy');
    const [taskCategory, setTaskCategory] = useState('Cleaning');
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleAddTask = async () => {
        if (!taskName.trim() || !taskCategory.trim()) {
            alert('Veuillez remplir tous les champs.');
            return;
        }

        try {
            let data = {
                taskName: taskName.trim(),
                taskCategory: taskCategory.trim(),
                taskDifficulty: taskDifficulty.trim(),
                taskDate: date.toISOString(),
                taskStatus: 'todo',
            };
            console.log(data)
            const response = await fetch('http://10.112.132.249:1337/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: data,
                }),
            });

            if (response.ok) {
                router.back();
            } else {
                const errorData = await response.json();
                console.error('Failed to add task:', errorData);
                alert("Échec de l'ajout de la tâche.");
            }
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Une erreur est survenue.');
        }
    };

    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        if (Platform.OS === 'android') {
            setShowPicker(false);
            if (event.type === 'set') {
                setDate(currentDate);
                if (pickerMode === 'date') {
                    setPickerMode('time');
                    setShowPicker(true); // Re-open for time
                }
            }
        } else { // For iOS
            setDate(currentDate);
        }
    };

    const showDatepicker = () => {
        setPickerMode('date'); // Always start with date picker
        setShowPicker(true);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }]}>
            <ScrollView>
                <ThemedText type="title" style={styles.title}>Nouvelle Tâche</ThemedText>
                <TextInput
                    style={styles.input}
                    placeholder="Nom de la tâche"
                    placeholderTextColor="#888"
                    value={taskName}
                    onChangeText={setTaskName}
                />
                <Pressable onPress={showDatepicker} style={styles.input}>
                    <ThemedText style={{ color: 'white' }}>
                        {date.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
                    </ThemedText>
                </Pressable>

                {showPicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={pickerMode}
                        display="default"
                        onChange={onDateChange}
                        is24Hour={true}
                    />
                )}

                <Picker
                    selectedValue={taskCategory}
                    style={{ width: '100%', backgroundColor: '#3d2d1d', color: 'white', marginBottom: 16, borderRadius: 8 }}
                    onValueChange={(itemValue) => setTaskDifficulty(itemValue)}
                    placeholder={"Sélectionner la difficulté..."}
                >
                    <Picker.Item label="Facile" value="easy" />
                    <Picker.Item label="Moyen" value="medium" />
                    <Picker.Item label="Difficile" value="complex" />
                </Picker>

                <Picker
                    selectedValue={taskCategory}
                    style={{ width: '100%', backgroundColor: '#3d2d1d', color: 'white', marginBottom: 16, borderRadius: 8 }}
                    onValueChange={(itemValue) => setTaskCategory(itemValue)}
                    placeholder={"Sélectionner la difficulté..."}
                >
                    <Picker.Item label="Nettoyage" value="Cleaning" />
                    <Picker.Item label="Rangement" value="Tidying" />
                    <Picker.Item label="Lessive" value="Laundry" />
                    <Picker.Item label="Cuisine" value="Cooking" />
                    <Picker.Item label="Courses" value="Shopping" />
                    <Picker.Item label="Entretien de la maison" value="Housekeeping" />
                    <Picker.Item label="Jardinage" value="Gardening" />
                </Picker>
            </ScrollView>
            <Pressable style={styles.button} onPress={handleAddTask}>
                <ThemedText style={styles.buttonText}>Ajouter</ThemedText>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1B1611',
        paddingHorizontal: 16,
    },
    title: {
        marginBottom: 32,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#3d2d1d',
        color: 'white',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 16,
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#ed8c37',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: '#1B1611',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
