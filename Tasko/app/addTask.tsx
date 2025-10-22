import React, {useContext, useEffect, useState} from "react";
import {
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Link, useRouter } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import StateContext from "@/app/StateContext";
import MemberPicker from "@/components/MemberPicker";

type Member = {
  id: string;
  username: string;
};

export default function AddTaskScreen() {
  const theme = useTheme();
  const fontBody = theme.fonts.bodyMedium.fontFamily;
  const fontButton = theme.fonts.labelMedium.fontFamily;
  const fontTitle = theme.fonts.titleMedium.fontFamily;

  const [taskName, setTaskName] = useState("");
  const [taskDifficulty, setTaskDifficulty] = useState("easy");
  const [taskCategory, setTaskCategory] = useState("Cleaning");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const { foyerId, setFoyerId } = useContext(StateContext);
  const { userDocId } = useContext(StateContext);
  const [members, setMembers] = useState<Member[]>([]);

  const router = useRouter();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const handleAddTask = async () => {
    if (!taskName.trim() || !taskCategory.trim()) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    try {
      const data = {
        taskName: taskName.trim(),
        taskCategory: taskCategory.trim(),
        taskDifficulty: taskDifficulty.trim(),
        taskDate: date.toISOString(),
        taskStatus: "todo",
        taskMember: selectedMember ? selectedMember.id : null,
        taskCreator: userDocId
      };
      const response = await fetch(`${apiUrl}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      if (response.ok) router.back();
      else alert("Échec de l'ajout de la tâche.");
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue.");
    }
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (event.type === "set") {
        setDate(currentDate);
        if (pickerMode === "date") {
          setPickerMode("time");
          setShowPicker(true);
        }
      }
    } else {
      setDate(currentDate);
    }
  };

  const showDatepicker = () => {
    setPickerMode("date");
    setShowPicker(true);
  };

  useEffect(() => {
    const fetchFoyerMembers = async () => {
      if (foyerId) {
        try {
          const response = await fetch(
              `${apiUrl}/api/foyers/${foyerId}?populate=members`
          );
          const responseData = await response.json();

          if (responseData.data) {
            const fetchedFoyer = responseData.data;
            if (fetchedFoyer.members) {
              const members: Member[] = fetchedFoyer.members.map(
                  (item: any) => ({
                    id: item.documentId,
                    username: item.memberUsername
                  })
              );
              setMembers(members);
              setSelectedMember(members[0]);
            } else {
              setMembers([]);
            }
          }
        } catch (error) {
          console.error("Failed to fetch or create foyer:", error);
        }
      }
    };
    fetchFoyerMembers();
  }, [foyerId]);


  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Link href="/tasks" asChild>
          <Pressable>
            <Ionicons
              name="arrow-back-outline"
              size={28}
              color={theme.colors.onBackground}
            />
          </Pressable>
        </Link>

        <Text
          style={[
            styles.title,
            {
              color: theme.colors.onBackground,
              fontFamily: fontTitle,
            },
          ]}
        >
          Ajouter une tâche
        </Text>

        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingTop: 20 }}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              color: theme.colors.onSurface,
              fontFamily: fontBody,
            },
          ]}
          placeholder="Nom de la tâche"
          placeholderTextColor="#888"
          value={taskName}
          onChangeText={setTaskName}
        />

        <Pressable
          onPress={showDatepicker}
          style={[styles.input, { justifyContent: "center" }]}
        >
          <Text style={{ color: theme.colors.onSurface, fontFamily: fontBody }}>
            {date.toLocaleString("fr-FR", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </Text>
        </Pressable>

        {showPicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={pickerMode}
            display="default"
            onChange={onDateChange}
            is24Hour={true}
            minimumDate={new Date()}
          />
        )}

        <View
          style={[styles.pickerWrap, { backgroundColor: theme.colors.surface }]}
        >
          <MemberPicker members={members} style={[
            styles.picker,
            { color: theme.colors.onSurface, fontFamily: fontBody },
          ]} setSelectedMember={setSelectedMember} selectedMember={selectedMember}/>
        </View>

        <View
          style={[styles.pickerWrap, { backgroundColor: theme.colors.surface }]}
        >
          <Picker
            selectedValue={taskDifficulty}
            onValueChange={(value) => setTaskDifficulty(value)}
            style={[
              styles.picker,
              { color: theme.colors.onSurface, fontFamily: fontBody },
            ]}
            itemStyle={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.onSurface,
              fontFamily: fontBody,
            }}
          >
            <Picker.Item label="Facile" value="easy" />
            <Picker.Item label="Moyen" value="medium" />
            <Picker.Item label="Difficile" value="complex" />
          </Picker>
        </View>

        <View
          style={[styles.pickerWrap, { backgroundColor: theme.colors.surface }]}
        >
          <Picker
            selectedValue={taskCategory}
            onValueChange={(value) => setTaskCategory(value)}
            style={[
              styles.picker,
              { color: theme.colors.onSurface, fontFamily: fontBody },
            ]}
            itemStyle={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.onSurface,
              fontFamily: fontBody,
            }}
          >
            <Picker.Item label="Nettoyage" value="Cleaning" />
            <Picker.Item label="Rangement" value="Tidying" />
            <Picker.Item label="Lessive" value="Laundry" />
            <Picker.Item label="Cuisine" value="Cooking" />
            <Picker.Item label="Courses" value="Shopping" />
            <Picker.Item label="Entretien de la maison" value="Housekeeping" />
            <Picker.Item label="Jardinage" value="Gardening" />
          </Picker>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.bottomButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddTask}
      >
        <Text
          style={{
            color: theme.colors.onBackground,
            fontFamily: fontButton,
            fontSize: 14,
          }}
        >
          Ajouter
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
  },
  input: {
    height: 50,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  pickerWrap: {
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 16,
  },
  picker: {
    height: Platform.OS === "ios" ? 150 : 60,
    width: "100%",
  },
  bottomButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    width: "100%",
    padding: 10,
    borderRadius: 5,
  },
});
