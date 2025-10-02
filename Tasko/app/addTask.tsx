import React, { useState, useContext, useEffect } from "react";
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
import { StateContext } from "./StateContext";

type Member = {
  id: string;
  attributes: {
    user: {
      data: {
        id: string;
        attributes: {
          username: string;
        };
      };
    };
  };
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
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [creatorMemberId, setCreatorMemberId] = useState<string | null>(null);

  const { foyerId, userId } = useContext(StateContext);
  const router = useRouter();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    if (foyerId) {
      fetch(`${apiUrl}/api/members?filters[memberFoyer][id][$eq]=${foyerId}&populate=user`)
        .then((response) => response.json())
        .then((data) => {
          setMembers(data.data);
          if (data.data.length > 0) {
            setSelectedMember(data.data[0].id);
            const creator = data.data.find((member: any) => member.attributes.user.data.id === userId);
            if (creator) {
              setCreatorMemberId(creator.id);
            }
          }
        })
        .catch((error) => console.error(error));
    }
  }, [foyerId, userId]);

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
        taskMember: selectedMember,
        taskCreator: creatorMemberId,
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

  if (!foyerId) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.background, justifyContent: "center" },
        ]}
      >
        <View style={styles.noFoyerContainer}>
          <Text style={[styles.title, { color: theme.colors.onBackground, fontFamily: fontTitle }]}>
            Rejoignez ou créez un foyer pour ajouter une tâche
          </Text>
          <TouchableOpacity
            style={[styles.bottomButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.push("/(tabs)/foyer")}
          >
            <Text
              style={{
                color: theme.colors.onBackground,
                fontFamily: fontButton,
                fontSize: 14,
              }}
            >
              Aller à la page Foyer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
          />
        )}

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

        <View
          style={[styles.pickerWrap, { backgroundColor: theme.colors.surface }]}
        >
          <Picker
            selectedValue={selectedMember}
            onValueChange={(value) => setSelectedMember(value)}
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
            {members.map((member) => (
              <Picker.Item
                key={member.id}
                label={member.attributes.user.data.attributes.username}
                value={member.id}
              />
            ))}
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
  noFoyerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    width: "100%",
    padding: 20,
  },
});
