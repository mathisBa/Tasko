import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { StateContext } from "./StateContext";
import { Ionicons } from "@expo/vector-icons";
import * as Crypto from "expo-crypto";

export default function CreateFoyerScreen() {
  const theme = useTheme();
  const fontBody = theme.fonts.bodyMedium.fontFamily;
  const fontButton = theme.fonts.labelMedium.fontFamily;
  const fontTitle = theme.fonts.titleMedium.fontFamily;

  const [foyerName, setFoyerName] = useState("");
  const { userId, setFoyerId } = useContext(StateContext);
  const router = useRouter();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const handleCreateFoyer = async () => {
    if (!foyerName.trim()) {
      alert("Veuillez nommer votre foyer.");
      return;
    }

    try {
      // Find member id for the current user
      const memberResponse = await fetch(
        `${apiUrl}/api/members?filters[userId][$eq]=${userId}`
      );
      const memberData = await memberResponse.json();
      if (!memberData.data || memberData.data.length === 0) {
        alert("Erreur: Membre non trouvé.");
        return;
      }
      const memberId = memberData.data[0].documentId;
      console.log(userId);
      console.log(memberData.data);
      // Create the foyer
      const foyerResponse = await fetch(`${apiUrl}/api/foyers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            foyerId: Crypto.randomUUID(),
            foyerName: foyerName.trim(),
            foyerOwner: memberId,
            members: [memberId],
          },
        }),
      });

      if (!foyerResponse.ok) {
        throw new Error("Échec de la création du foyer.");
      }

      const foyerData = await foyerResponse.json();
      const newFoyerId = foyerData.data.id;

      // Update member with the new foyerId
      const updateMemberResponse = await fetch(
        `${apiUrl}/api/members/${memberId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { memberFoyer: 11 } }),
        }
      );

      if (updateMemberResponse.ok) {
        setFoyerId(newFoyerId);
        router.replace("/(tabs)/foyer");
      } else {
        alert("Échec de la mise à jour du membre.");
      }
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons
            name="arrow-back-outline"
            size={28}
            color={theme.colors.onBackground}
          />
        </Pressable>
        <Text
          style={[
            styles.title,
            { color: theme.colors.onBackground, fontFamily: fontTitle },
          ]}
        >
          Créer un foyer
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              color: theme.colors.onSurface,
              fontFamily: fontBody,
            },
          ]}
          placeholder="Nom du foyer"
          placeholderTextColor="#888"
          value={foyerName}
          onChangeText={setFoyerName}
        />
        <TouchableOpacity
          style={[
            styles.bottomButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={handleCreateFoyer}
        >
          <Text
            style={{
              color: theme.colors.onBackground,
              fontFamily: fontButton,
              fontSize: 14,
            }}
          >
            Créer
          </Text>
        </TouchableOpacity>
      </View>
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
  formContainer: {
    flex: 1,
    alignItems: "stretch",
    gap: 10,
    paddingTop: 25,
  },
  input: {
    height: 50,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
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
